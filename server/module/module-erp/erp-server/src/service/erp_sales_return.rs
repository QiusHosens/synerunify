use std::collections::HashMap;

use common::interceptor::orm::simple_support::SimpleSupport;
use common::utils::snowflake_generator::SnowflakeGenerator;
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, EntityTrait, JoinType, Order, PaginatorTrait, QueryFilter, QueryOrder, QuerySelect, RelationTrait, TransactionTrait};
use crate::model::erp_sales_return::{Model as ErpSalesReturnModel, ActiveModel as ErpSalesReturnActiveModel, Entity as ErpSalesReturnEntity, Column, Relation};
use crate::model::erp_sales_order::{Model as ErpSalesOrderModel, ActiveModel as ErpSalesOrderActiveModel, Entity as ErpSalesOrderEntity};
use crate::model::erp_customer::{Model as ErpCustomerModel, ActiveModel as ErpCustomerActiveModel, Entity as ErpCustomerEntity};
use crate::model::erp_settlement_account::{Model as ErpSettlementAccountModel, ActiveModel as ErpSettlementAccountActiveModel, Entity as ErpSettlementAccountEntity};
use crate::service::{erp_sales_order, erp_sales_return_attachment, erp_sales_return_detail, erp_settlement_account};
use erp_model::request::erp_sales_return::{CreateErpSalesReturnRequest, UpdateErpSalesReturnRequest, PaginatedKeywordRequest};
use erp_model::response::erp_sales_return::{ErpSalesReturnBaseResponse, ErpSalesReturnInfoResponse, ErpSalesReturnPageResponse, ErpSalesReturnResponse};
use crate::convert::erp_sales_return::{create_request_to_model, model_to_base_response, model_to_info_response, model_to_page_response, model_to_response, update_request_to_model};
use anyhow::{anyhow, Context, Result};
use sea_orm::ActiveValue::Set;
use common::constants::enum_constants::{SALE_RETURN_STATUS_COMPLETE, SALE_RETURN_STATUS_PLACED, SALE_RETURN_STATUS_RECEIVED, STATUS_DISABLE, STATUS_ENABLE};
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateErpSalesReturnRequest) -> Result<i64> {
    let mut erp_sales_return = create_request_to_model(&request);
    // 查询销售订单
    let sales_order = erp_sales_order::find_by_id(&db, login_user.clone(), request.sales_order_id.clone()).await?;
    // 生成订单编号
    let generator = SnowflakeGenerator::new();
    match generator.generate() {
        Ok(id) => erp_sales_return.order_number = Set(id),
        Err(e) => return Err(anyhow!("订单编号生成失败")),
    }

    erp_sales_return.customer_id = Set(sales_order.customer_id);
    erp_sales_return.order_status = Set(SALE_RETURN_STATUS_PLACED);
    erp_sales_return.department_id = Set(login_user.department_id.clone());
    erp_sales_return.department_code = Set(login_user.department_code.clone());
    erp_sales_return.creator = Set(Some(login_user.id.clone()));
    erp_sales_return.updater = Set(Some(login_user.id.clone()));
    erp_sales_return.tenant_id = Set(login_user.tenant_id.clone());

    // 开启事务
    let txn = db.begin().await?;
    // 创建订单
    let erp_sales_return = erp_sales_return.insert(db).await?;
    // 创建订单详情
    erp_sales_return_detail::create_batch(&db, &txn, login_user.clone(), erp_sales_return.clone(), request.details).await?;
    // 创建订单文件
    erp_sales_return_attachment::create_batch(&db, &txn, login_user.clone(), erp_sales_return.id, request.attachments).await?;
    // 提交事务
    txn.commit().await.with_context(|| "Failed to commit transaction")?;
    Ok(erp_sales_return.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateErpSalesReturnRequest) -> Result<()> {
    let erp_sales_return = ErpSalesReturnEntity::find_active_by_id(request.id)
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    // 已收货/已完成状态订单不能修改
    if SALE_RETURN_STATUS_RECEIVED.eq(&erp_sales_return.order_status) {
        return Err(anyhow!("订单已收货,不能修改"));
    }

    if SALE_RETURN_STATUS_COMPLETE.eq(&erp_sales_return.order_status) {
        return Err(anyhow!("订单已完成,不能修改"));
    }

    let sales_return = erp_sales_return.clone();

    let mut erp_sales_return = update_request_to_model(&request, erp_sales_return);
    erp_sales_return.updater = Set(Some(login_user.id));

    // 开启事务
    let txn = db.begin().await?;
    // 修改订单
    erp_sales_return.update(db).await?;
    // 修改订单商品详情
    erp_sales_return_detail::update_batch(&db, &txn, login_user.clone(), sales_return.clone(), request.details).await?;
    // 修改订单文件
    erp_sales_return_attachment::update_batch(&db, &txn, login_user, sales_return.clone(), request.attachments).await?;
    // 提交事务
    txn.commit().await.with_context(|| "Failed to commit transaction")?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_sales_return = ErpSalesReturnActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    erp_sales_return.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpSalesReturnResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_sales_return = ErpSalesReturnEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(erp_sales_return.map(model_to_response))
}

pub async fn get_base_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpSalesReturnBaseResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_sales_return = ErpSalesReturnEntity::find_active_with_data_permission(login_user.clone())
        .filter(condition)
        .one(db).await?;
    
    if erp_sales_return.is_none() {
        return Ok(None);
    }
    let erp_sales_return = erp_sales_return.unwrap();
    let details = erp_sales_return_detail::list_by_order_id(&db, login_user.clone(), id).await?;
    let attachments = erp_sales_return_attachment::list_by_order_id(&db, login_user, id).await?;
    Ok(Some(model_to_base_response(erp_sales_return, details, attachments)))
}

pub async fn get_info_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpSalesReturnInfoResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_sales_return = ErpSalesReturnEntity::find_active_with_data_permission(login_user.clone())
        .filter(condition)
        .select_also(ErpSettlementAccountEntity)
        .join(JoinType::LeftJoin, Relation::ReturnSettlementAccount.def())
        .one(db).await?;
    
    if erp_sales_return.is_none() {
        return Ok(None);
    }
    let (sales_return, settlement_account) = erp_sales_return.unwrap();
    let details = erp_sales_return_detail::list_by_order_id(&db, login_user.clone(), id).await?;
    let attachments = erp_sales_return_attachment::list_by_order_id(&db, login_user, id).await?;
    Ok(Some(model_to_info_response(sales_return, settlement_account, details, attachments)))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpSalesReturnPageResponse>> {
    let paginator = ErpSalesReturnEntity::find_active_with_data_permission(login_user.clone())
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .select_also(ErpSalesOrderEntity)
        .select_also(ErpCustomerEntity)
        // .select_also(ErpSettlementAccountEntity)
        .join(JoinType::LeftJoin, Relation::ReturnSale.def())
        .join(JoinType::LeftJoin, Relation::ReturnCustomer.def())
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
        .map(|(ret, order, customer)| {
            let settlement = ret.settlement_account_id.and_then(|id| settlement_map.get(&id).cloned());
            model_to_page_response(ret, order, customer, settlement)
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<ErpSalesReturnResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = ErpSalesReturnEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

pub async fn list_by_customer_id(db: &DatabaseConnection, login_user: LoginUserContext, customer_id: i64) -> Result<Vec<ErpSalesReturnResponse>> {
    let list = ErpSalesReturnEntity::find_active()
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .filter(Column::CustomerId.eq(customer_id))
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}