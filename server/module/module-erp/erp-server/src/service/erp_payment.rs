use sea_orm::{DatabaseConnection, EntityTrait, ColumnTrait, ActiveModelTrait, PaginatorTrait, QueryOrder, QueryFilter, Condition};
use crate::model::erp_payment::{Model as ErpPaymentModel, ActiveModel as ErpPaymentActiveModel, Entity as ErpPaymentEntity, Column};
use erp_model::request::erp_payment::{CreateErpPaymentRequest, UpdateErpPaymentRequest, PaginatedKeywordRequest};
use erp_model::response::erp_payment::ErpPaymentResponse;
use crate::convert::erp_payment::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use sea_orm::ActiveValue::Set;
use common::constants::enum_constants::{STATUS_DISABLE, STATUS_ENABLE};
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateErpPaymentRequest) -> Result<i64> {
    let mut erp_payment = create_request_to_model(&request);
    erp_payment.creator = Set(Some(login_user.id));
    erp_payment.updater = Set(Some(login_user.id));
    erp_payment.tenant_id = Set(login_user.tenant_id);
    let erp_payment = erp_payment.insert(db).await?;
    Ok(erp_payment.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateErpPaymentRequest) -> Result<()> {
    let erp_payment = ErpPaymentEntity::find_by_id(request.id)
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut erp_payment = update_request_to_model(&request, erp_payment);
    erp_payment.updater = Set(Some(login_user.id));
    erp_payment.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_payment = ErpPaymentActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    erp_payment.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpPaymentResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_payment = ErpPaymentEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(erp_payment.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpPaymentResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let paginator = ErpPaymentEntity::find_active_with_condition(condition)
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<ErpPaymentResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = ErpPaymentEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}
