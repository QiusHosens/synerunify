use common::interceptor::orm::simple_support::SimpleSupport;
use common::utils::snowflake_generator::SnowflakeGenerator;
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, DatabaseTransaction, EntityTrait, JoinType, Order, PaginatorTrait, QueryFilter, QueryOrder, QuerySelect, RelationTrait, TransactionTrait};
use tracing::info;
use crate::model::erp_purchase_order::{Model as ErpPurchaseOrderModel, ActiveModel as ErpPurchaseOrderActiveModel, Entity as ErpPurchaseOrderEntity, Column, Relation};
use crate::model::erp_supplier::{Model as ErpSupplierModel, ActiveModel as ErpSupplierActiveModel, Entity as ErpSupplierEntity};
use crate::model::erp_settlement_account::{Model as ErpSettlementAccountModel, ActiveModel as ErpSettlementAccountActiveModel, Entity as ErpSettlementAccountEntity};
use crate::service::{erp_purchase_order_attachment, erp_purchase_order_detail};
use erp_model::request::erp_purchase_order::{CreateErpPurchaseOrderRequest, UpdateErpPurchaseOrderRequest, PaginatedKeywordRequest};
use erp_model::response::erp_purchase_order::{ErpPurchaseOrderBaseResponse, ErpPurchaseOrderInfoResponse, ErpPurchaseOrderPageResponse, ErpPurchaseOrderResponse};
use crate::convert::erp_purchase_order::{create_request_to_model, model_to_base_response, model_to_info_response, model_to_page_response, model_to_response, update_request_to_model};
use anyhow::{anyhow, Context, Result};
use sea_orm::ActiveValue::Set;
use common::constants::enum_constants::{PURCHASE_ORDER_STATUS_CANCEL, PURCHASE_ORDER_STATUS_COMPLETE, PURCHASE_ORDER_STATUS_PLACED, PURCHASE_ORDER_STATUS_RECEIVED, STATUS_DISABLE, STATUS_ENABLE};
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateErpPurchaseOrderRequest) -> Result<i64> {
    let mut erp_purchase_order = create_request_to_model(&request);
    // 生成订单编号
    let generator = SnowflakeGenerator::new();
    match generator.generate() {
        Ok(id) => erp_purchase_order.order_number = Set(id),
        Err(e) => return Err(anyhow!("订单编号生成失败")),
    }
    
    erp_purchase_order.user_id = Set(login_user.id.clone());
    erp_purchase_order.order_status = Set(PURCHASE_ORDER_STATUS_PLACED);
    erp_purchase_order.department_id = Set(login_user.department_id.clone());
    erp_purchase_order.department_code = Set(login_user.department_code.clone());
    erp_purchase_order.creator = Set(Some(login_user.id.clone()));
    erp_purchase_order.updater = Set(Some(login_user.id.clone()));
    erp_purchase_order.tenant_id = Set(login_user.tenant_id.clone());

    // 开启事务
    let txn = db.begin().await?;
    // 创建订单
    let erp_purchase_order = erp_purchase_order.insert(&txn).await?;
    // 创建订单商品详情
    erp_purchase_order_detail::create_batch(&db, &txn, login_user.clone(), erp_purchase_order.id, request.purchase_products).await?;
    // 创建订单文件
    erp_purchase_order_attachment::create_batch(&db, &txn, login_user, erp_purchase_order.id, request.purchase_attachment).await?;
    // 提交事务
    txn.commit().await.with_context(|| "Failed to commit transaction")?;
    Ok(erp_purchase_order.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateErpPurchaseOrderRequest) -> Result<()> {
    let erp_purchase_order = ErpPurchaseOrderEntity::find_active_by_id(request.id)
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    // 已收货/已完成状态订单不能修改
    if PURCHASE_ORDER_STATUS_RECEIVED.eq(&erp_purchase_order.order_status) {
        return Err(anyhow!("订单已收货,不能修改"));
    }

    if PURCHASE_ORDER_STATUS_COMPLETE.eq(&erp_purchase_order.order_status) {
        return Err(anyhow!("订单已完成,不能修改"));
    }

    let purchase_order = erp_purchase_order.clone();

    // 修改订单
    let mut erp_purchase_order = update_request_to_model(&request, erp_purchase_order);
    erp_purchase_order.updater = Set(Some(login_user.id));

    // 开启事务
    let txn = db.begin().await?;
    // 修改订单
    erp_purchase_order.update(&txn).await?;
    // 修改订单商品详情
    erp_purchase_order_detail::update_batch(&db, &txn, login_user.clone(), purchase_order.clone(), request.purchase_products).await?;
    // 修改订单文件
    erp_purchase_order_attachment::update_batch(&db, &txn, login_user, purchase_order, request.purchase_attachment).await?;
    // 提交事务
    txn.commit().await.with_context(|| "Failed to commit transaction")?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_purchase_order = ErpPurchaseOrderActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    erp_purchase_order.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpPurchaseOrderResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_purchase_order = ErpPurchaseOrderEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(erp_purchase_order.map(model_to_response))
}

pub async fn get_detail_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpPurchaseOrderBaseResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id.clone()));
            
    let erp_purchase_order = ErpPurchaseOrderEntity::find_active_with_data_permission(login_user.clone())
        .filter(condition)
        .one(db).await?;
    if erp_purchase_order.is_none() {
        return Ok(None);
    }
    let erp_purchase_order = erp_purchase_order.unwrap();
    let details = erp_purchase_order_detail::list_by_purchase_id(&db, login_user.clone(), id).await?;
    let attachments = erp_purchase_order_attachment::list_by_purchase_id(&db, login_user, id).await?;
    Ok(Some(model_to_base_response(erp_purchase_order, details, attachments)))
}

pub async fn get_info_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpPurchaseOrderInfoResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id.clone()));
            
    let erp_purchase_order = ErpPurchaseOrderEntity::find_active_with_data_permission(login_user.clone())
        .filter(condition)
        .select_also(ErpSupplierEntity)
        .select_also(ErpSettlementAccountEntity)
        .join(JoinType::LeftJoin, Relation::PurchaseOrderSupplier.def())
        .join(JoinType::LeftJoin, Relation::PurchaseOrderSettlementAccount.def())
        .one(db).await?;
    if erp_purchase_order.is_none() {
        return Ok(None);
    }
    let (purchase_order, supplier, settlement_account) = erp_purchase_order.unwrap();
    let details = erp_purchase_order_detail::list_info_by_purchase_id(&db, login_user.clone(), id).await?;
    let attachments = erp_purchase_order_attachment::list_info_by_purchase_id(&db, login_user, id).await?;
    Ok(Some(model_to_info_response(purchase_order, supplier, settlement_account, details, attachments)))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpPurchaseOrderPageResponse>> {
    let paginator = ErpPurchaseOrderEntity::find_active_with_data_permission(login_user.clone())
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .select_also(ErpSupplierEntity)
        .select_also(ErpSettlementAccountEntity)
        .join(JoinType::LeftJoin, Relation::PurchaseOrderSupplier.def())
        .join(JoinType::LeftJoin, Relation::PurchaseOrderSettlementAccount.def())
        .support_filter(params.base.filter_field, params.base.filter_operator, params.base.filter_value)
        .support_order(params.base.sort_field, params.base.sort, Some(vec![(Column::Id, Order::Desc)]))
        .paginate(db, params.base.size);

    let total = paginator.num_items().await?;
    let total_pages = (total + params.base.size - 1) / params.base.size; // 向上取整
    let list = paginator
        .fetch_page(params.base.page - 1) // SeaORM 页码从 0 开始，所以减 1
        .await?
        .into_iter()
        .map(|(data, supplier_data, settlement_account_data)|model_to_page_response(data, supplier_data, settlement_account_data))
        .collect();

    Ok(PaginatedResponse {
        list,
        total_pages,
        page: params.base.page,
        size: params.base.size,
        total,
    })
}

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<ErpPurchaseOrderResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = ErpPurchaseOrderEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

/// 查询待入库订单
pub async fn get_received_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpPurchaseOrderPageResponse>> {
    let paginator = ErpPurchaseOrderEntity::find_active_with_data_permission(login_user.clone())
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .filter(Column::OrderStatus.eq(PURCHASE_ORDER_STATUS_RECEIVED))
        .select_also(ErpSupplierEntity)
        .select_also(ErpSettlementAccountEntity)
        .join(JoinType::LeftJoin, Relation::PurchaseOrderSupplier.def())
        .join(JoinType::LeftJoin, Relation::PurchaseOrderSettlementAccount.def())
        .support_filter(params.base.filter_field, params.base.filter_operator, params.base.filter_value)
        .support_order(params.base.sort_field, params.base.sort, Some(vec![(Column::Id, Order::Desc)]))
        .paginate(db, params.base.size);

    let total = paginator.num_items().await?;
    let total_pages = (total + params.base.size - 1) / params.base.size; // 向上取整
    let list = paginator
        .fetch_page(params.base.page - 1) // SeaORM 页码从 0 开始，所以减 1
        .await?
        .into_iter()
        .map(|(data, supplier_data, settlement_account_data)|model_to_page_response(data, supplier_data, settlement_account_data))
        .collect();

    Ok(PaginatedResponse {
        list,
        total_pages,
        page: params.base.page,
        size: params.base.size,
        total,
    })
}

/// 订单已收货
pub async fn received(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_purchase_order = ErpPurchaseOrderActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        order_status: Set(PURCHASE_ORDER_STATUS_RECEIVED),
        ..Default::default()
    };
    erp_purchase_order.update(db).await?;
    Ok(())
}

/// 取消订单
pub async fn cancel(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_purchase_order = ErpPurchaseOrderActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        order_status: Set(PURCHASE_ORDER_STATUS_CANCEL),
        ..Default::default()
    };
    erp_purchase_order.update(db).await?;
    Ok(())
}

/// 完成订单
pub async fn completed(db: &DatabaseConnection, txn: &DatabaseTransaction, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_purchase_order = ErpPurchaseOrderActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        order_status: Set(PURCHASE_ORDER_STATUS_COMPLETE),
        ..Default::default()
    };
    erp_purchase_order.update(txn).await?;
    Ok(())
}

pub async fn find_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<ErpPurchaseOrderModel> {
    let erp_purchase_order = ErpPurchaseOrderEntity::find_active_by_id(id)
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    Ok(erp_purchase_order)
}