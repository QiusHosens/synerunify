use sea_orm::{DatabaseConnection, EntityTrait, ActiveModelTrait, PaginatorTrait, QueryOrder, QueryFilter, ColumnTrait};
use crate::model::system_user_role::{Model as SystemUserRoleModel, Entity as SystemUserRoleEntity, Column, Model};
use system_model::request::system_user_role::{CreateSystemUserRoleRequest, UpdateSystemUserRoleRequest, PaginatedKeywordRequest};
use system_model::response::system_user_role::SystemUserRoleResponse;
use crate::convert::system_user_role::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use common::base::page::PaginatedResponse;

pub async fn create(db: &DatabaseConnection, request: CreateSystemUserRoleRequest) -> Result<i64> {
    let system_user_role = create_request_to_model(&request);
    let system_user_role = system_user_role.insert(db).await?;
    Ok(system_user_role.id)
}

pub async fn update(db: &DatabaseConnection, request: UpdateSystemUserRoleRequest) -> Result<()> {
    let system_user_role = SystemUserRoleEntity::find_by_id(request.id)
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let system_user_role = update_request_to_model(&request, system_user_role);
    system_user_role.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, id: i64) -> Result<()> {
    let result = SystemUserRoleEntity::delete_by_id(id).exec(db).await?;
    if result.rows_affected == 0 {
        return Err(anyhow!("记录未找到"));
    }
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, id: i64) -> Result<Option<SystemUserRoleResponse>> {
    let system_user_role = SystemUserRoleEntity::find_by_id(id).one(db).await?;
    Ok(system_user_role.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<SystemUserRoleResponse>> {
    let paginator = SystemUserRoleEntity::find()
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

pub async fn list(db: &DatabaseConnection) -> Result<Vec<SystemUserRoleResponse>> {
    let list = SystemUserRoleEntity::find().all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

pub async fn get_role_id_by_user_id(db: &DatabaseConnection, user_id: i64) -> Result<i64> {
    let system_user_role = SystemUserRoleEntity::find().filter(Column::UserId.eq(user_id)).one(db).await?;
    match system_user_role {
        None => Ok(0),
        Some(user_role) => Ok(user_role.role_id)
    }
}