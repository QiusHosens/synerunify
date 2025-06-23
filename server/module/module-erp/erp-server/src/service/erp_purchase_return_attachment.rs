use common::interceptor::orm::simple_support::SimpleSupport;
use sea_orm::{DatabaseConnection, EntityTrait, Order, ColumnTrait, ActiveModelTrait, PaginatorTrait, QueryOrder, QueryFilter, Condition};
use crate::model::erp_purchase_return_attachment::{Model as ErpPurchaseReturnAttachmentModel, ActiveModel as ErpPurchaseReturnAttachmentActiveModel, Entity as ErpPurchaseReturnAttachmentEntity, Column};
use erp_model::request::erp_purchase_return_attachment::{CreateErpPurchaseReturnAttachmentRequest, UpdateErpPurchaseReturnAttachmentRequest, PaginatedKeywordRequest};
use erp_model::response::erp_purchase_return_attachment::ErpPurchaseReturnAttachmentResponse;
use crate::convert::erp_purchase_return_attachment::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use sea_orm::ActiveValue::Set;
use common::constants::enum_constants::{STATUS_DISABLE, STATUS_ENABLE};
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateErpPurchaseReturnAttachmentRequest) -> Result<i64> {
    let mut erp_purchase_return_attachment = create_request_to_model(&request);
    erp_purchase_return_attachment.creator = Set(Some(login_user.id));
    erp_purchase_return_attachment.updater = Set(Some(login_user.id));
    erp_purchase_return_attachment.tenant_id = Set(login_user.tenant_id);
    let erp_purchase_return_attachment = erp_purchase_return_attachment.insert(db).await?;
    Ok(erp_purchase_return_attachment.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateErpPurchaseReturnAttachmentRequest) -> Result<()> {
    let erp_purchase_return_attachment = ErpPurchaseReturnAttachmentEntity::find_by_id(request.id)
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut erp_purchase_return_attachment = update_request_to_model(&request, erp_purchase_return_attachment);
    erp_purchase_return_attachment.updater = Set(Some(login_user.id));
    erp_purchase_return_attachment.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_purchase_return_attachment = ErpPurchaseReturnAttachmentActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    erp_purchase_return_attachment.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpPurchaseReturnAttachmentResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_purchase_return_attachment = ErpPurchaseReturnAttachmentEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(erp_purchase_return_attachment.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpPurchaseReturnAttachmentResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let paginator = ErpPurchaseReturnAttachmentEntity::find_active_with_condition(condition)
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<ErpPurchaseReturnAttachmentResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = ErpPurchaseReturnAttachmentEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}
