use std::collections::HashMap;

use common::interceptor::orm::simple_support::SimpleSupport;
use common::utils::snowflake_generator::SnowflakeGenerator;
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, EntityTrait, JoinType, Order, PaginatorTrait, QueryFilter, QueryOrder, QuerySelect, RelationTrait, TransactionTrait};
use crate::model::erp_outbound_order::{Model as ErpOutboundOrderModel, ActiveModel as ErpOutboundOrderActiveModel, Entity as ErpOutboundOrderEntity, Column, Relation};
use crate::model::erp_sales_order::{Model as ErpSalesOrderModel, ActiveModel as ErpSalesOrderActiveModel, Entity as ErpSalesOrderEntity};
use crate::model::erp_customer::{Model as ErpCustomerModel, ActiveModel as ErpCustomerActiveModel, Entity as ErpCustomerEntity};
use crate::model::erp_settlement_account::{Model as ErpSettlementAccountModel, ActiveModel as ErpSettlementAccountActiveModel, Entity as ErpSettlementAccountEntity};
use crate::service::{erp_outbound_order_attachment, erp_outbound_order_detail, erp_sales_order, erp_settlement_account};
use erp_model::request::erp_outbound_order::{CreateErpOutboundOrderOtherRequest, CreateErpOutboundOrderRequest, CreateErpOutboundOrderSaleRequest, PaginatedKeywordRequest, UpdateErpOutboundOrderOtherRequest, UpdateErpOutboundOrderRequest, UpdateErpOutboundOrderSaleRequest};
use erp_model::response::erp_outbound_order::{ErpOutboundOrderBaseOtherResponse, ErpOutboundOrderBaseSalesResponse, ErpOutboundOrderInfoSalesResponse, ErpOutboundOrderPageOtherResponse, ErpOutboundOrderPageSalesResponse, ErpOutboundOrderResponse};
use crate::convert::erp_outbound_order::{create_other_request_to_model, create_request_to_model, create_sale_request_to_model, model_to_base_other_response, model_to_base_sales_response, model_to_info_sales_response, model_to_page_other_response, model_to_page_sales_response, model_to_response, update_other_request_to_model, update_request_to_model, update_sale_request_to_model};
use anyhow::{anyhow, Context, Result};
use sea_orm::ActiveValue::Set;
use common::constants::enum_constants::{STATUS_DISABLE, STATUS_ENABLE};
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create_sale(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateErpOutboundOrderSaleRequest) -> Result<i64> {
    let mut erp_outbound_order = create_sale_request_to_model(&request);
    // 查询采购订单
    let sale_order = erp_sales_order::find_by_id(&db, login_user.clone(), request.sale_id.clone()).await?;
    // 生成订单编号
    let generator = SnowflakeGenerator::new();
    match generator.generate() {
        Ok(id) => erp_outbound_order.order_number = Set(id),
        Err(e) => return Err(anyhow!("订单编号生成失败")),
    }
    
    erp_outbound_order.customer_id = Set(sale_order.customer_id);
    erp_outbound_order.user_id = Set(login_user.id.clone());
    erp_outbound_order.department_id = Set(login_user.department_id.clone());
    erp_outbound_order.department_code = Set(login_user.department_code.clone());
    erp_outbound_order.creator = Set(Some(login_user.id.clone()));
    erp_outbound_order.updater = Set(Some(login_user.id.clone()));
    erp_outbound_order.tenant_id = Set(login_user.tenant_id.clone());

    // 开启事务
    let txn = db.begin().await?;
    // 创建订单
    let erp_outbound_order = erp_outbound_order.insert(&txn).await?;
    // 创建订单详情
    erp_outbound_order_detail::create_batch_sale(&db, &txn, login_user.clone(), erp_outbound_order.clone(), request.details).await?;
    // 创建订单文件
    erp_outbound_order_attachment::create_batch(&db, &txn, login_user.clone(), erp_outbound_order.id, request.attachments).await?;
    // 修改采购订单状态到完成
    erp_sales_order::awaiting_signature(&db, &txn, login_user.clone(), request.sale_id);
    // 提交事务
    txn.commit().await.with_context(|| "Failed to commit transaction")?;
    Ok(erp_outbound_order.id)
}

pub async fn create_other(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateErpOutboundOrderOtherRequest) -> Result<i64> {
    let mut erp_outbound_order = create_other_request_to_model(&request);
    // 生成订单编号
    let generator = SnowflakeGenerator::new();
    match generator.generate() {
        Ok(id) => erp_outbound_order.order_number = Set(id),
        Err(e) => return Err(anyhow!("订单编号生成失败")),
    }
    
    erp_outbound_order.user_id = Set(login_user.id.clone());
    erp_outbound_order.department_id = Set(login_user.department_id.clone());
    erp_outbound_order.department_code = Set(login_user.department_code.clone());
    erp_outbound_order.creator = Set(Some(login_user.id.clone()));
    erp_outbound_order.updater = Set(Some(login_user.id.clone()));
    erp_outbound_order.tenant_id = Set(login_user.tenant_id.clone());

    // 开启事务
    let txn = db.begin().await?;
    // 创建订单
    let erp_outbound_order = erp_outbound_order.insert(&txn).await?;
    // 创建订单详情
    erp_outbound_order_detail::create_batch_other(&db, &txn, login_user.clone(), erp_outbound_order.clone(), request.details).await?;
    // 创建订单文件
    erp_outbound_order_attachment::create_batch(&db, &txn, login_user.clone(), erp_outbound_order.id, request.attachments).await?;
    // 提交事务
    txn.commit().await.with_context(|| "Failed to commit transaction")?;
    Ok(erp_outbound_order.id)
}

pub async fn update_sale(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateErpOutboundOrderSaleRequest) -> Result<()> {
    let erp_outbound_order = ErpOutboundOrderEntity::find_active_by_id(request.id)
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let outbound_order = erp_outbound_order.clone();

    let mut erp_outbound_order = update_sale_request_to_model(&request, erp_outbound_order);
    erp_outbound_order.updater = Set(Some(login_user.id));
    // 开启事务
    let txn = db.begin().await?;
    // 修改订单
    erp_outbound_order.update(&txn).await?;
    // 更新订单文件
    erp_outbound_order_attachment::update_batch(&db, &txn, login_user.clone(), outbound_order, request.attachments).await?;
    // 提交事务
    txn.commit().await.with_context(|| "Failed to commit transaction")?;
    Ok(())
}

pub async fn update_other(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateErpOutboundOrderOtherRequest) -> Result<()> {
    let erp_outbound_order = ErpOutboundOrderEntity::find_active_by_id(request.id)
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let outbound_order = erp_outbound_order.clone();

    let mut erp_outbound_order = update_other_request_to_model(&request, erp_outbound_order);
    erp_outbound_order.updater = Set(Some(login_user.id));
    // 开启事务
    let txn = db.begin().await?;
    // 修改订单
    erp_outbound_order.update(&txn).await?;
    // 更新订单文件
    erp_outbound_order_attachment::update_batch(&db, &txn, login_user.clone(), outbound_order, request.attachments).await?;
    // 提交事务
    txn.commit().await.with_context(|| "Failed to commit transaction")?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_outbound_order = ErpOutboundOrderActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    erp_outbound_order.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpOutboundOrderResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_outbound_order = ErpOutboundOrderEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(erp_outbound_order.map(model_to_response))
}

pub async fn get_base_sales_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpOutboundOrderBaseSalesResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_outbound_order = ErpOutboundOrderEntity::find_active_with_data_permission(login_user.clone())
        .filter(condition)
        .one(db).await?;
    
    if erp_outbound_order.is_none() {
        return Ok(None);
    }
    let erp_outbound_order = erp_outbound_order.unwrap();
    let details = erp_outbound_order_detail::list_sales_by_outbound_id(&db, login_user.clone(), id).await?;
    let attachments = erp_outbound_order_attachment::list_by_outbound_id(&db, login_user, id).await?;
    Ok(Some(model_to_base_sales_response(erp_outbound_order, details, attachments)))
}

pub async fn get_base_other_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpOutboundOrderBaseOtherResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_outbound_order = ErpOutboundOrderEntity::find_active_with_data_permission(login_user.clone())
        .filter(condition)
        .one(db).await?;
    
    if erp_outbound_order.is_none() {
        return Ok(None);
    }
    let erp_outbound_order = erp_outbound_order.unwrap();
    let details = erp_outbound_order_detail::list_other_by_outbound_id(&db, login_user.clone(), id).await?;
    let attachments = erp_outbound_order_attachment::list_by_outbound_id(&db, login_user, id).await?;
    Ok(Some(model_to_base_other_response(erp_outbound_order, details, attachments)))
}

pub async fn get_info_sales_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpOutboundOrderInfoSalesResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_outbound_order = ErpOutboundOrderEntity::find_active_with_data_permission(login_user.clone())
        .filter(condition)
        .select_also(ErpSettlementAccountEntity)
        .join(JoinType::LeftJoin, Relation::OutboundSettlementAccount.def())
        .one(db).await?;
    
    if erp_outbound_order.is_none() {
        return Ok(None);
    }
    let (outbound_order, settlement_account) = erp_outbound_order.unwrap();
    let details = erp_outbound_order_detail::list_sales_by_outbound_id(&db, login_user.clone(), id).await?;
    let attachments = erp_outbound_order_attachment::list_by_outbound_id(&db, login_user, id).await?;
    Ok(Some(model_to_info_sales_response(outbound_order, settlement_account, details, attachments)))
}

pub async fn get_paginated_sales(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpOutboundOrderPageSalesResponse>> {
    let paginator = ErpOutboundOrderEntity::find_active_with_data_permission(login_user.clone())
        .select_also(ErpSalesOrderEntity)
        .select_also(ErpCustomerEntity)
        // .select_also(ErpSettlementAccountEntity)
        .join(JoinType::LeftJoin, Relation::OutboundSale.def())
        .join(JoinType::LeftJoin, Relation::OutboundCustomer.def())
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
            model_to_page_sales_response(ret, order, customer, settlement)
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

pub async fn get_paginated_other(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpOutboundOrderPageOtherResponse>> {
    let paginator = ErpOutboundOrderEntity::find_active_with_data_permission(login_user.clone())
        .select_also(ErpCustomerEntity)
        .select_also(ErpSettlementAccountEntity)
        .join(JoinType::LeftJoin, Relation::OutboundCustomer.def())
        .join(JoinType::LeftJoin, Relation::OutboundSettlementAccount.def())
        .support_filter(params.base.filter_field, params.base.filter_operator, params.base.filter_value)
        .support_order(params.base.sort_field, params.base.sort, Some(vec![(Column::Id, Order::Asc)]))
        .paginate(db, params.base.size);

    let total = paginator.num_items().await?;
    let total_pages = (total + params.base.size - 1) / params.base.size; // 向上取整
    let list = paginator
        .fetch_page(params.base.page - 1) // SeaORM 页码从 0 开始，所以减 1
        .await?
        .into_iter()
        .map(|(data, customer_data, settlement_account_data)|model_to_page_other_response(data, customer_data, settlement_account_data))
        .collect();

    Ok(PaginatedResponse {
        list,
        total_pages,
        page: params.base.page,
        size: params.base.size,
        total,
    })
}

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<ErpOutboundOrderResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = ErpOutboundOrderEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}
