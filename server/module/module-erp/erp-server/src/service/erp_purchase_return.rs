use std::collections::HashMap;

use common::interceptor::orm::simple_support::SimpleSupport;
use common::utils::snowflake_generator::SnowflakeGenerator;
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, EntityTrait, JoinType, LoaderTrait, Order, PaginatorTrait, QueryFilter, QueryOrder, QuerySelect, RelationTrait, TransactionTrait};
use crate::model::erp_purchase_return::{Model as ErpPurchaseReturnModel, ActiveModel as ErpPurchaseReturnActiveModel, Entity as ErpPurchaseReturnEntity, Column, Relation};
use crate::model::erp_purchase_order::{Model as ErpPurchaseOrderModel, ActiveModel as ErpPurchaseOrderActiveModel, Entity as ErpPurchaseOrderEntity};
use crate::model::erp_supplier::{Model as ErpSupplierModel, ActiveModel as ErpSupplierActiveModel, Entity as ErpSupplierEntity};
use crate::model::erp_settlement_account::{Model as ErpSettlementAccountModel, ActiveModel as ErpSettlementAccountActiveModel, Entity as ErpSettlementAccountEntity};
use crate::service::{erp_purchase_order, erp_purchase_return_attachment, erp_purchase_return_detail, erp_settlement_account};
use erp_model::request::erp_purchase_return::{CreateErpPurchaseReturnRequest, UpdateErpPurchaseReturnRequest, PaginatedKeywordRequest};
use erp_model::response::erp_purchase_return::{ErpPurchaseReturnBaseResponse, ErpPurchaseReturnInfoResponse, ErpPurchaseReturnPageResponse, ErpPurchaseReturnResponse};
use crate::convert::erp_purchase_return::{create_request_to_model, model_to_base_response, model_to_info_response, model_to_page_response, model_to_response, update_request_to_model};
use anyhow::{anyhow, Context, Result};
use sea_orm::ActiveValue::Set;
use common::constants::enum_constants::{PURCHASE_RETURN_STATUS_COMPLETE, PURCHASE_RETURN_STATUS_PLACED, PURCHASE_RETURN_STATUS_SHIP_OUT, STATUS_DISABLE, STATUS_ENABLE};
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateErpPurchaseReturnRequest) -> Result<i64> {
    let mut erp_purchase_return = create_request_to_model(&request);
    // 查询采购订单
    let purchase_order = erp_purchase_order::find_by_id(&db, login_user.clone(), request.purchase_order_id.clone()).await?;
    // 生成订单编号
    let generator = SnowflakeGenerator::new();
    match generator.generate() {
        Ok(id) => erp_purchase_return.order_number = Set(id),
        Err(e) => return Err(anyhow!("订单编号生成失败")),
    }
    
    erp_purchase_return.supplier_id = Set(purchase_order.supplier_id);
    erp_purchase_return.order_status = Set(PURCHASE_RETURN_STATUS_PLACED);
    erp_purchase_return.department_id = Set(login_user.department_id.clone());
    erp_purchase_return.department_code = Set(login_user.department_code.clone());
    erp_purchase_return.creator = Set(Some(login_user.id.clone()));
    erp_purchase_return.updater = Set(Some(login_user.id.clone()));
    erp_purchase_return.tenant_id = Set(login_user.tenant_id.clone());

    // 开启事务
    let txn = db.begin().await?;
    // 创建订单
    let erp_purchase_return = erp_purchase_return.insert(&txn).await?;
    // 创建订单详情
    erp_purchase_return_detail::create_batch(&db, &txn, login_user.clone(), erp_purchase_return.clone(), request.details).await?;
    // 创建订单文件
    erp_purchase_return_attachment::create_batch(&db, &txn, login_user.clone(), erp_purchase_return.id, request.attachments).await?;
    // 提交事务
    txn.commit().await.with_context(|| "Failed to commit transaction")?;
    Ok(erp_purchase_return.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateErpPurchaseReturnRequest) -> Result<()> {
    let erp_purchase_return = ErpPurchaseReturnEntity::find_active_by_id(request.id)
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    // 已出库/已完成状态订单不能修改
    if PURCHASE_RETURN_STATUS_SHIP_OUT.eq(&erp_purchase_return.order_status) {
        return Err(anyhow!("订单已出库,不能修改"));
    }

    if PURCHASE_RETURN_STATUS_COMPLETE.eq(&erp_purchase_return.order_status) {
        return Err(anyhow!("订单已完成,不能修改"));
    }

    let purchase_return = erp_purchase_return.clone();

    let mut erp_purchase_return = update_request_to_model(&request, erp_purchase_return);
    erp_purchase_return.updater = Set(Some(login_user.id));

    // 开启事务
    let txn = db.begin().await?;
    // 修改订单
    erp_purchase_return.update(&txn).await?;
    // 修改订单商品详情
    erp_purchase_return_detail::update_batch(&db, &txn, login_user.clone(), purchase_return.clone(), request.details).await?;
    // 修改订单文件
    erp_purchase_return_attachment::update_batch(&db, &txn, login_user, purchase_return.clone(), request.attachments).await?;
    // 提交事务
    txn.commit().await.with_context(|| "Failed to commit transaction")?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_purchase_return = ErpPurchaseReturnActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    erp_purchase_return.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpPurchaseReturnResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_purchase_return = ErpPurchaseReturnEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(erp_purchase_return.map(model_to_response))
}

pub async fn get_base_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpPurchaseReturnBaseResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_purchase_return = ErpPurchaseReturnEntity::find_active_with_data_permission(login_user.clone())
        .filter(condition)
        .one(db).await?;
    
    if erp_purchase_return.is_none() {
        return Ok(None);
    }
    let erp_purchase_return = erp_purchase_return.unwrap();
    let details = erp_purchase_return_detail::list_by_order_id(&db, login_user.clone(), id).await?;
    let attachments = erp_purchase_return_attachment::list_by_order_id(&db, login_user, id).await?;
    Ok(Some(model_to_base_response(erp_purchase_return, details, attachments)))
}

pub async fn get_info_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpPurchaseReturnInfoResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_purchase_return = ErpPurchaseReturnEntity::find_active_with_data_permission(login_user.clone())
        .filter(condition)
        .select_also(ErpSettlementAccountEntity)
        .join(JoinType::LeftJoin, Relation::ReturnSettlementAccount.def())
        .one(db).await?;
    
    if erp_purchase_return.is_none() {
        return Ok(None);
    }
    let (purchase_return, settlement_account) = erp_purchase_return.unwrap();
    let details = erp_purchase_return_detail::list_by_order_id(&db, login_user.clone(), id).await?;
    let attachments = erp_purchase_return_attachment::list_by_order_id(&db, login_user, id).await?;
    Ok(Some(model_to_info_response(purchase_return, settlement_account, details, attachments)))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpPurchaseReturnPageResponse>> {
    let paginator = ErpPurchaseReturnEntity::find_active_with_data_permission(login_user.clone())
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .select_also(ErpPurchaseOrderEntity)
        .select_also(ErpSupplierEntity)
        // .select_also(ErpSettlementAccountEntity)
        .join(JoinType::LeftJoin, Relation::ReturnPurchase.def())
        .join(JoinType::LeftJoin, Relation::ReturnSupplier.def())
        // .join(JoinType::LeftJoin, Relation::ReturnSettlementAccount.def())
        .support_filter(params.base.filter_field, params.base.filter_operator, params.base.filter_value)
        .support_order(params.base.sort_field, params.base.sort, Some(vec![(Column::Id, Order::Asc)]))
        .paginate(db, params.base.size);

    let list = paginator.fetch_page(params.base.page - 1).await?;

    let settlement_ids: Vec<i64> = list.iter().filter_map(|(ret, _, _)| ret.settlement_account_id).collect();
    let settlement_accounts: Vec<ErpSettlementAccountModel> = erp_settlement_account::list_by_ids(&db, login_user, settlement_ids).await?;
    // 转为 HashMap 便于后续快速查找
    let settlement_map: HashMap<i64, ErpSettlementAccountModel> = settlement_accounts.into_iter().map(|s| (s.id, s)).collect();

    let total = paginator.num_items().await?;
    let total_pages = (total + params.base.size - 1) / params.base.size; // 向上取整
    
    let list = paginator
        .fetch_page(params.base.page - 1) // SeaORM 页码从 0 开始，所以减 1
        .await?
        .into_iter()
        .map(|(ret, order, supplier)| {
            let settlement = ret.settlement_account_id.and_then(|id| settlement_map.get(&id).cloned());
            model_to_page_response(ret, order, supplier, settlement)
        })
        .collect();

    Ok(PaginatedResponse {
        list,
        total_pages,
        page: params.base.page,
        size: params.base.size,
        total,
    })
}

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<ErpPurchaseReturnResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = ErpPurchaseReturnEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}
