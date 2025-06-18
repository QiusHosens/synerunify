use common::interceptor::orm::simple_support::SimpleSupport;
use common::utils::snowflake_generator::SnowflakeGenerator;
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, EntityTrait, Order, PaginatorTrait, QueryFilter, QueryOrder, TransactionTrait};
use crate::model::erp_inbound_order::{Model as ErpInboundOrderModel, ActiveModel as ErpInboundOrderActiveModel, Entity as ErpInboundOrderEntity, Column};
use crate::service::{erp_inbound_order_attachment, erp_inbound_order_detail, erp_purchase_order};
use erp_model::request::erp_inbound_order::{CreateErpInboundOrderOtherRequest, CreateErpInboundOrderPurchaseRequest, CreateErpInboundOrderRequest, PaginatedKeywordRequest, UpdateErpInboundOrderPurchaseRequest, UpdateErpInboundOrderRequest};
use erp_model::response::erp_inbound_order::ErpInboundOrderResponse;
use crate::convert::erp_inbound_order::{create_other_request_to_model, create_purchase_request_to_model, create_request_to_model, model_to_response, update_request_to_model};
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

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateErpInboundOrderRequest) -> Result<()> {
    let erp_inbound_order = ErpInboundOrderEntity::find_by_id(request.id)
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut erp_inbound_order = update_request_to_model(&request, erp_inbound_order);
    erp_inbound_order.updater = Set(Some(login_user.id));
    erp_inbound_order.update(db).await?;
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

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpInboundOrderResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let paginator = ErpInboundOrderEntity::find_active_with_condition(condition)
        .support_filter(params.base.filter_field, params.base.filter_operator, params.base.filter_value)
        .support_order(params.base.sort_field, params.base.sort, Some(vec![(Column::Id, Order::Asc)]))
        .paginate(db, params.base.size);

    let total = paginator.num_items().await?;
    let total_pages = (total + params.base.size - 1) / params.base.size; // 向上取整
    let list = paginator
        .fetch_page(params.base.page - 1) // SeaORM 页码从 0 开始，所以减 1
        .await?
        .into_iter()
        .map(model_to_response)
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
