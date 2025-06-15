use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, DatabaseTransaction, EntityTrait, PaginatorTrait, QueryFilter, QueryOrder};
use tracing::info;
use crate::model::erp_purchase_order_detail::{Model as ErpPurchaseOrderDetailModel, ActiveModel as ErpPurchaseOrderDetailActiveModel, Entity as ErpPurchaseOrderDetailEntity, Column};
use erp_model::request::erp_purchase_order_detail::{CreateErpPurchaseOrderDetailRequest, UpdateErpPurchaseOrderDetailRequest, PaginatedKeywordRequest};
use erp_model::response::erp_purchase_order_detail::{ErpPurchaseOrderDetailBaseResponse, ErpPurchaseOrderDetailResponse};
use crate::convert::erp_purchase_order_detail::{create_request_to_model, model_to_base_response, model_to_response, update_request_to_model};
use anyhow::{anyhow, Context, Ok, Result};
use sea_orm::ActiveValue::Set;
use common::constants::enum_constants::{STATUS_DISABLE, STATUS_ENABLE};
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateErpPurchaseOrderDetailRequest) -> Result<i64> {
    let mut erp_purchase_order_detail = create_request_to_model(&request);
    erp_purchase_order_detail.creator = Set(Some(login_user.id));
    erp_purchase_order_detail.updater = Set(Some(login_user.id));
    erp_purchase_order_detail.tenant_id = Set(login_user.tenant_id);
    let erp_purchase_order_detail = erp_purchase_order_detail.insert(db).await?;
    Ok(erp_purchase_order_detail.id)
}

pub async fn create_batch(db: &DatabaseConnection, txn: &DatabaseTransaction, login_user: LoginUserContext, purchase_id: i64, requests: Vec<CreateErpPurchaseOrderDetailRequest>) -> Result<()> {
    let models: Vec<ErpPurchaseOrderDetailActiveModel> = requests
        .into_iter()
        .map(|request| {
            let mut model: ErpPurchaseOrderDetailActiveModel = create_request_to_model(&request);
            model.purchase_id = Set(purchase_id);
            model.department_id = Set(login_user.department_id);
            model.department_code = Set(login_user.department_code.clone());
            model.creator = Set(Some(login_user.id));
            model.updater = Set(Some(login_user.id));
            model.tenant_id = Set(login_user.tenant_id);
            model
        })
        .collect();

    if !models.is_empty() {
        ErpPurchaseOrderDetailEntity::insert_many(models)
            .exec(txn)
            .await
            .with_context(|| "Failed to save detail")?;
    }
    Ok(())
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateErpPurchaseOrderDetailRequest) -> Result<()> {
    let erp_purchase_order_detail = ErpPurchaseOrderDetailEntity::find_by_id(request.id)
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut erp_purchase_order_detail = update_request_to_model(&request, erp_purchase_order_detail);
    erp_purchase_order_detail.updater = Set(Some(login_user.id));
    erp_purchase_order_detail.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_purchase_order_detail = ErpPurchaseOrderDetailActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    erp_purchase_order_detail.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpPurchaseOrderDetailResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_purchase_order_detail = ErpPurchaseOrderDetailEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(erp_purchase_order_detail.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpPurchaseOrderDetailResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let paginator = ErpPurchaseOrderDetailEntity::find_active_with_condition(condition)
        .order_by_desc(Column::UpdateTime)
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<ErpPurchaseOrderDetailResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = ErpPurchaseOrderDetailEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

pub async fn list_by_purchase_id(db: &DatabaseConnection, login_user: LoginUserContext, purchase_id: i64) -> Result<Vec<ErpPurchaseOrderDetailBaseResponse>> {
    let list = ErpPurchaseOrderDetailEntity::find_active_with_data_permission(login_user.clone())
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .filter(Column::PurchaseId.eq(purchase_id))
        .all(db).await?;
    Ok(list.into_iter().map(model_to_base_response).collect())
}
