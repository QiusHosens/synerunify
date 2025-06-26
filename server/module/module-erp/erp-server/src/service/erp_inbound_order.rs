use std::collections::HashMap;

use common::interceptor::orm::simple_support::SimpleSupport;
use common::utils::snowflake_generator::SnowflakeGenerator;
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, EntityTrait, JoinType, Order, PaginatorTrait, QueryFilter, QueryOrder, QuerySelect, RelationTrait, TransactionTrait};
use crate::model::erp_inbound_order::{Model as ErpInboundOrderModel, ActiveModel as ErpInboundOrderActiveModel, Entity as ErpInboundOrderEntity, Column, Relation};
use crate::model::erp_purchase_order::{Model as ErpPurchaseOrderModel, ActiveModel as ErpPurchaseOrderActiveModel, Entity as ErpPurchaseOrderEntity};
use crate::model::erp_supplier::{Model as ErpSupplierModel, ActiveModel as ErpSupplierActiveModel, Entity as ErpSupplierEntity};
use crate::model::erp_settlement_account::{Model as ErpSettlementAccountModel, ActiveModel as ErpSettlementAccountActiveModel, Entity as ErpSettlementAccountEntity};
use crate::service::{erp_inbound_order_attachment, erp_inbound_order_detail, erp_purchase_order, erp_settlement_account};
use erp_model::request::erp_inbound_order::{CreateErpInboundOrderOtherRequest, CreateErpInboundOrderPurchaseRequest, CreateErpInboundOrderRequest, PaginatedKeywordRequest, UpdateErpInboundOrderOtherRequest, UpdateErpInboundOrderPurchaseRequest, UpdateErpInboundOrderRequest};
use erp_model::response::erp_inbound_order::{ErpInboundOrderBaseOtherResponse, ErpInboundOrderBasePurchaseResponse, ErpInboundOrderInfoPurchaseResponse, ErpInboundOrderPageOtherResponse, ErpInboundOrderPagePurchaseResponse, ErpInboundOrderResponse};
use crate::convert::erp_inbound_order::{create_other_request_to_model, create_purchase_request_to_model, create_request_to_model, model_to_base_other_response, model_to_base_purchase_response, model_to_info_purchase_response, model_to_page_other_response, model_to_page_purchase_response, model_to_response, update_other_request_to_model, update_purchase_request_to_model, update_request_to_model};
use anyhow::{anyhow, Context, Result};
use sea_orm::ActiveValue::Set;
use common::constants::enum_constants::{STATUS_DISABLE, STATUS_ENABLE};
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

/// 采购订单入库
pub async fn create_purchase(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateErpInboundOrderPurchaseRequest) -> Result<i64> {
    let mut erp_inbound_order = create_purchase_request_to_model(&request);
    // 查询采购订单
    let purchase_order = erp_purchase_order::find_by_id(&db, login_user.clone(), request.purchase_id.clone()).await?;
    // 生成订单编号
    let generator = SnowflakeGenerator::new();
    match generator.generate() {
        Ok(id) => erp_inbound_order.order_number = Set(id),
        Err(e) => return Err(anyhow!("订单编号生成失败")),
    }
    
    erp_inbound_order.supplier_id = Set(purchase_order.supplier_id);
    erp_inbound_order.user_id = Set(login_user.id.clone());
    erp_inbound_order.department_id = Set(login_user.department_id.clone());
    erp_inbound_order.department_code = Set(login_user.department_code.clone());
    erp_inbound_order.creator = Set(Some(login_user.id.clone()));
    erp_inbound_order.updater = Set(Some(login_user.id.clone()));
    erp_inbound_order.tenant_id = Set(login_user.tenant_id.clone());

    // 开启事务
    let txn = db.begin().await?;
    // 创建订单
    let erp_inbound_order = erp_inbound_order.insert(&txn).await?;
    // 创建订单详情
    erp_inbound_order_detail::create_batch_purchase(&db, &txn, login_user.clone(), erp_inbound_order.clone(), request.details).await?;
    // 创建订单文件
    erp_inbound_order_attachment::create_batch(&db, &txn, login_user.clone(), erp_inbound_order.id, request.attachments).await?;
    // 修改采购订单状态到完成
    erp_purchase_order::completed(&db, &txn, login_user.clone(), request.purchase_id);
    // 提交事务
    txn.commit().await.with_context(|| "Failed to commit transaction")?;
    Ok(erp_inbound_order.id)
}

/// 其他入库
pub async fn create_other(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateErpInboundOrderOtherRequest) -> Result<i64> {
    let mut erp_inbound_order = create_other_request_to_model(&request);
    // 生成订单编号
    let generator = SnowflakeGenerator::new();
    match generator.generate() {
        Ok(id) => erp_inbound_order.order_number = Set(id),
        Err(e) => return Err(anyhow!("订单编号生成失败")),
    }
    
    erp_inbound_order.user_id = Set(login_user.id.clone());
    erp_inbound_order.department_id = Set(login_user.department_id.clone());
    erp_inbound_order.department_code = Set(login_user.department_code.clone());
    erp_inbound_order.creator = Set(Some(login_user.id.clone()));
    erp_inbound_order.updater = Set(Some(login_user.id.clone()));
    erp_inbound_order.tenant_id = Set(login_user.tenant_id.clone());

    // 开启事务
    let txn = db.begin().await?;
    // 创建订单
    let erp_inbound_order = erp_inbound_order.insert(&txn).await?;
    // 创建订单详情
    erp_inbound_order_detail::create_batch_other(&db, &txn, login_user.clone(), erp_inbound_order.clone(), request.details).await?;
    // 创建订单文件
    erp_inbound_order_attachment::create_batch(&db, &txn, login_user.clone(), erp_inbound_order.id, request.attachments).await?;
    // 提交事务
    txn.commit().await.with_context(|| "Failed to commit transaction")?;
    Ok(erp_inbound_order.id)
}

pub async fn update_purchase(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateErpInboundOrderPurchaseRequest) -> Result<()> {
    let erp_inbound_order = ErpInboundOrderEntity::find_active_by_id(request.id)
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let inbound_order = erp_inbound_order.clone();

    let mut erp_inbound_order = update_purchase_request_to_model(&request, erp_inbound_order);
    erp_inbound_order.updater = Set(Some(login_user.id));
    // 开启事务
    let txn = db.begin().await?;
    // 修改订单
    erp_inbound_order.update(&txn).await?;
    // 更新订单文件
    erp_inbound_order_attachment::update_batch(&db, &txn, login_user.clone(), inbound_order, request.attachments).await?;
    // 提交事务
    txn.commit().await.with_context(|| "Failed to commit transaction")?;
    Ok(())
}

pub async fn update_other(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateErpInboundOrderOtherRequest) -> Result<()> {
    let erp_inbound_order = ErpInboundOrderEntity::find_active_by_id(request.id)
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let inbound_order = erp_inbound_order.clone();

    let mut erp_inbound_order = update_other_request_to_model(&request, erp_inbound_order);
    erp_inbound_order.updater = Set(Some(login_user.id));
    // 开启事务
    let txn = db.begin().await?;
    // 修改订单
    erp_inbound_order.update(&txn).await?;
    // 更新订单文件
    erp_inbound_order_attachment::update_batch(&db, &txn, login_user.clone(), inbound_order, request.attachments).await?;
    // 提交事务
    txn.commit().await.with_context(|| "Failed to commit transaction")?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_inbound_order = ErpInboundOrderActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    erp_inbound_order.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpInboundOrderResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_inbound_order = ErpInboundOrderEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(erp_inbound_order.map(model_to_response))
}

pub async fn get_base_purchase_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpInboundOrderBasePurchaseResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_inbound_order = ErpInboundOrderEntity::find_active_with_data_permission(login_user.clone())
        .filter(condition)
        .one(db).await?;

    if erp_inbound_order.is_none() {
        return Ok(None);
    }
    let erp_inbound_order = erp_inbound_order.unwrap();
    let details = erp_inbound_order_detail::list_purchase_by_inbound_id(&db, login_user.clone(), id).await?;
    let attachments = erp_inbound_order_attachment::list_by_inbound_id(&db, login_user, id).await?;
    Ok(Some(model_to_base_purchase_response(erp_inbound_order, details, attachments)))
}

pub async fn get_info_purchase_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpInboundOrderInfoPurchaseResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_inbound_order = ErpInboundOrderEntity::find_active_with_data_permission(login_user.clone())
        .filter(condition)
        .select_also(ErpSettlementAccountEntity)
        .join(JoinType::LeftJoin, Relation::InboundSettlementAccount.def())
        .one(db).await?;

    if erp_inbound_order.is_none() {
        return Ok(None);
    }
    let (inbound_order, settlement_account) = erp_inbound_order.unwrap();
    let details = erp_inbound_order_detail::list_purchase_by_inbound_id(&db, login_user.clone(), id).await?;
    let attachments = erp_inbound_order_attachment::list_by_inbound_id(&db, login_user, id).await?;
    Ok(Some(model_to_info_purchase_response(inbound_order, settlement_account, details, attachments)))
}

pub async fn get_base_other_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpInboundOrderBaseOtherResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_inbound_order = ErpInboundOrderEntity::find_active_with_data_permission(login_user.clone())
        .filter(condition)
        .one(db).await?;

    if erp_inbound_order.is_none() {
        return Ok(None);
    }
    let erp_inbound_order = erp_inbound_order.unwrap();
    let details = erp_inbound_order_detail::list_other_by_inbound_id(&db, login_user.clone(), id).await?;
    let attachments = erp_inbound_order_attachment::list_by_inbound_id(&db, login_user, id).await?;
    Ok(Some(model_to_base_other_response(erp_inbound_order, details, attachments)))
}

pub async fn get_paginated_purchase(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpInboundOrderPagePurchaseResponse>> {
    let paginator = ErpInboundOrderEntity::find_active_with_data_permission(login_user.clone())
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .filter(Column::PurchaseId.is_not_null())
        .select_also(ErpPurchaseOrderEntity)
        .select_also(ErpSupplierEntity)
        // .select_also(ErpSettlementAccountEntity)
        .join(JoinType::LeftJoin, Relation::InboundPurchase.def())
        .join(JoinType::LeftJoin, Relation::InboundSupplier.def())
        // .join(JoinType::LeftJoin, Relation::ReturnSettlementAccount.def())
        .support_filter(params.base.filter_field, params.base.filter_operator, params.base.filter_value)
        .support_order(params.base.sort_field, params.base.sort, Some(vec![(Column::Id, Order::Asc)]))
        .paginate(db, params.base.size);

    let total = paginator.num_items().await?;
    let total_pages = (total + params.base.size - 1) / params.base.size; // 向上取整
    
    let list = paginator.fetch_page(params.base.page - 1).await?;

    let settlement_ids: Vec<i64> = list.iter().filter_map(|(ret, _, _)| ret.settlement_account_id).collect();
    let settlement_accounts: Vec<ErpSettlementAccountModel> = erp_settlement_account::list_by_ids(&db, login_user, settlement_ids).await?;
    // 转为 HashMap 便于后续快速查找
    let settlement_map: HashMap<i64, ErpSettlementAccountModel> = settlement_accounts.into_iter().map(|s| (s.id, s)).collect();

    let list = list
        .into_iter()
        .map(|(ret, order, supplier)| {
            let settlement = ret.settlement_account_id.and_then(|id| settlement_map.get(&id).cloned());
            model_to_page_purchase_response(ret, order, supplier, settlement)
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

pub async fn get_paginated_other(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpInboundOrderPageOtherResponse>> {
    let paginator = ErpInboundOrderEntity::find_active_with_data_permission(login_user.clone())
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .filter(Column::PurchaseId.is_null())
        .select_also(ErpSupplierEntity)
        .select_also(ErpSettlementAccountEntity)
        .join(JoinType::LeftJoin, Relation::InboundSupplier.def())
        .join(JoinType::LeftJoin, Relation::InboundSettlementAccount.def())
        .support_filter(params.base.filter_field, params.base.filter_operator, params.base.filter_value)
        .support_order(params.base.sort_field, params.base.sort, Some(vec![(Column::Id, Order::Asc)]))
        .paginate(db, params.base.size);

    let total = paginator.num_items().await?;
    let total_pages = (total + params.base.size - 1) / params.base.size; // 向上取整
    let list = paginator
        .fetch_page(params.base.page - 1) // SeaORM 页码从 0 开始，所以减 1
        .await?
        .into_iter()
        .map(|(data, supplier_data, settlement_account_data)|model_to_page_other_response(data, supplier_data, settlement_account_data))
        .collect();

    Ok(PaginatedResponse {
        list,
        total_pages,
        page: params.base.page,
        size: params.base.size,
        total,
    })
}

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<ErpInboundOrderResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = ErpInboundOrderEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}
