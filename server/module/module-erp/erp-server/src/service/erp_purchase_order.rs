use common::interceptor::orm::simple_support::SimpleSupport;
use common::utils::snowflake_generator::SnowflakeGenerator;
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, EntityTrait, JoinType, Order, PaginatorTrait, QueryFilter, QueryOrder, QuerySelect, RelationTrait, TransactionTrait};
use tracing::info;
use crate::model::erp_purchase_order::{Model as ErpPurchaseOrderModel, ActiveModel as ErpPurchaseOrderActiveModel, Entity as ErpPurchaseOrderEntity, Column, Relation};
use crate::model::erp_supplier::{Model as ErpSupplierModel, ActiveModel as ErpSupplierActiveModel, Entity as ErpSupplierEntity};
use crate::model::erp_settlement_account::{Model as ErpSettlementAccountModel, ActiveModel as ErpSettlementAccountActiveModel, Entity as ErpSettlementAccountEntity};
use crate::service::{erp_purchase_order_attachment, erp_purchase_order_detail};
use erp_model::request::erp_purchase_order::{CreateErpPurchaseOrderRequest, UpdateErpPurchaseOrderRequest, PaginatedKeywordRequest};
use erp_model::response::erp_purchase_order::{ErpPurchaseOrderPageResponse, ErpPurchaseOrderResponse};
use crate::convert::erp_purchase_order::{create_request_to_model, model_to_page_response, model_to_response, update_request_to_model};
use anyhow::{anyhow, Context, Result};
use sea_orm::ActiveValue::Set;
use common::constants::enum_constants::{STATUS_DISABLE, STATUS_ENABLE};
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
    erp_purchase_order.order_status = Set(0);
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
    let erp_purchase_order = ErpPurchaseOrderEntity::find_by_id(request.id)
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

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

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpPurchaseOrderPageResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));
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
