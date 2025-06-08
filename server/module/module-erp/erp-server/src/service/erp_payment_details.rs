use sea_orm::{DatabaseConnection, EntityTrait, ColumnTrait, ActiveModelTrait, PaginatorTrait, QueryOrder, QueryFilter, Condition};
use crate::model::erp_payment_details::{Model as ErpPaymentDetailsModel, ActiveModel as ErpPaymentDetailsActiveModel, Entity as ErpPaymentDetailsEntity, Column};
use erp_model::request::erp_payment_details::{CreateErpPaymentDetailsRequest, UpdateErpPaymentDetailsRequest, PaginatedKeywordRequest};
use erp_model::response::erp_payment_details::ErpPaymentDetailsResponse;
use crate::convert::erp_payment_details::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use sea_orm::ActiveValue::Set;
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateErpPaymentDetailsRequest) -> Result<i64> {
    let mut erp_payment_details = create_request_to_model(&request);
    erp_payment_details.creator = Set(Some(login_user.id));
    erp_payment_details.updater = Set(Some(login_user.id));
    erp_payment_details.tenant_id = Set(login_user.tenant_id);
    let erp_payment_details = erp_payment_details.insert(db).await?;
    Ok(erp_payment_details.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateErpPaymentDetailsRequest) -> Result<()> {
    let erp_payment_details = ErpPaymentDetailsEntity::find_by_id(request.id)
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut erp_payment_details = update_request_to_model(&request, erp_payment_details);
    erp_payment_details.updater = Set(Some(login_user.id));
    erp_payment_details.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_payment_details = ErpPaymentDetailsActiveModel {
        id: Set(id),
        tenant_id: Set(login_user.tenant_id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    erp_payment_details.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpPaymentDetailsResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_payment_details = ErpPaymentDetailsEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(erp_payment_details.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpPaymentDetailsResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let paginator = ErpPaymentDetailsEntity::find_active_with_condition(condition)
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<ErpPaymentDetailsResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = ErpPaymentDetailsEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}