use sea_orm::{DatabaseConnection, EntityTrait, ColumnTrait, ActiveModelTrait, PaginatorTrait, QueryOrder, QueryFilter, Condition};
use crate::model::erp_inventory_records::{Model as ErpInventoryRecordsModel, ActiveModel as ErpInventoryRecordsActiveModel, Entity as ErpInventoryRecordsEntity, Column};
use erp_model::request::erp_inventory_records::{CreateErpInventoryRecordsRequest, UpdateErpInventoryRecordsRequest, PaginatedKeywordRequest};
use erp_model::response::erp_inventory_records::ErpInventoryRecordsResponse;
use crate::convert::erp_inventory_records::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use sea_orm::ActiveValue::Set;
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateErpInventoryRecordsRequest) -> Result<i64> {
    let mut erp_inventory_records = create_request_to_model(&request);
    erp_inventory_records.creator = Set(Some(login_user.id));
    erp_inventory_records.updater = Set(Some(login_user.id));
    erp_inventory_records.tenant_id = Set(login_user.tenant_id);
    let erp_inventory_records = erp_inventory_records.insert(db).await?;
    Ok(erp_inventory_records.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateErpInventoryRecordsRequest) -> Result<()> {
    let erp_inventory_records = ErpInventoryRecordsEntity::find_by_id(request.id)
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut erp_inventory_records = update_request_to_model(&request, erp_inventory_records);
    erp_inventory_records.updater = Set(Some(login_user.id));
    erp_inventory_records.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_inventory_records = ErpInventoryRecordsActiveModel {
        id: Set(id),
        tenant_id: Set(login_user.tenant_id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    erp_inventory_records.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpInventoryRecordsResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_inventory_records = ErpInventoryRecordsEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(erp_inventory_records.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpInventoryRecordsResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let paginator = ErpInventoryRecordsEntity::find_active_with_condition(condition)
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<ErpInventoryRecordsResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = ErpInventoryRecordsEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}