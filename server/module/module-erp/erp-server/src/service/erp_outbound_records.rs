use sea_orm::{DatabaseConnection, EntityTrait, ColumnTrait, ActiveModelTrait, PaginatorTrait, QueryOrder, QueryFilter, Condition};
use crate::model::erp_outbound_records::{Model as ErpOutboundRecordsModel, ActiveModel as ErpOutboundRecordsActiveModel, Entity as ErpOutboundRecordsEntity, Column};
use erp_model::request::erp_outbound_records::{CreateErpOutboundRecordsRequest, UpdateErpOutboundRecordsRequest, PaginatedKeywordRequest};
use erp_model::response::erp_outbound_records::ErpOutboundRecordsResponse;
use crate::convert::erp_outbound_records::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use sea_orm::ActiveValue::Set;
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateErpOutboundRecordsRequest) -> Result<i64> {
    let mut erp_outbound_records = create_request_to_model(&request);
    erp_outbound_records.creator = Set(Some(login_user.id));
    erp_outbound_records.updater = Set(Some(login_user.id));
    erp_outbound_records.tenant_id = Set(login_user.tenant_id);
    let erp_outbound_records = erp_outbound_records.insert(db).await?;
    Ok(erp_outbound_records.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateErpOutboundRecordsRequest) -> Result<()> {
    let erp_outbound_records = ErpOutboundRecordsEntity::find_by_id(request.id)
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut erp_outbound_records = update_request_to_model(&request, erp_outbound_records);
    erp_outbound_records.updater = Set(Some(login_user.id));
    erp_outbound_records.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_outbound_records = ErpOutboundRecordsActiveModel {
        id: Set(id),
        tenant_id: Set(login_user.tenant_id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    erp_outbound_records.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpOutboundRecordsResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_outbound_records = ErpOutboundRecordsEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(erp_outbound_records.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpOutboundRecordsResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let paginator = ErpOutboundRecordsEntity::find_active_with_condition(condition)
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<ErpOutboundRecordsResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = ErpOutboundRecordsEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}