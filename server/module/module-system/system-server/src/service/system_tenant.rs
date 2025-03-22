use sea_orm::{DatabaseConnection, EntityTrait, ActiveModelTrait, PaginatorTrait, QueryOrder};
use crate::model::system_tenant::{Model as SystemTenantModel, Entity as SystemTenantEntity, Column};
use system_model::request::system_tenant::{CreateSystemTenantRequest, UpdateSystemTenantRequest, PaginatedKeywordRequest};
use system_model::response::system_tenant::SystemTenantResponse;
use crate::convert::system_tenant::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use common::base::page::PaginatedResponse;

pub async fn create(db: &DatabaseConnection, request: CreateSystemTenantRequest) -> Result<i64> {
    let system_tenant = create_request_to_model(&request);
    let system_tenant = system_tenant.insert(db).await?;
    Ok(system_tenant.id)
}

pub async fn update(db: &DatabaseConnection, request: UpdateSystemTenantRequest) -> Result<()> {
    let system_tenant = SystemTenantEntity::find_by_id(request.id)
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let system_tenant = update_request_to_model(&request, system_tenant);
    system_tenant.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, id: i64) -> Result<()> {
    let result = SystemTenantEntity::delete_by_id(id).exec(db).await?;
    if result.rows_affected == 0 {
        return Err(anyhow!("记录未找到"));
    }
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, id: i64) -> Result<Option<SystemTenantResponse>> {
    let system_tenant = SystemTenantEntity::find_by_id(id).one(db).await?;
    Ok(system_tenant.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<SystemTenantResponse>> {
    let paginator = SystemTenantEntity::find()
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

pub async fn list(db: &DatabaseConnection) -> Result<Vec<SystemTenantResponse>> {
    let list = SystemTenantEntity::find().all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

pub async fn list_all(db: &DatabaseConnection) -> Result<Vec<SystemTenantModel>> {
    Ok(SystemTenantEntity::find().all(db).await?)
}