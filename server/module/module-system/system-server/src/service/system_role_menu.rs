use sea_orm::{DatabaseConnection, EntityTrait, ActiveModelTrait, PaginatorTrait, QueryOrder, QueryFilter, ColumnTrait, QuerySelect};
use crate::model::system_role_menu::{Model as SystemRoleMenuModel, Entity as SystemRoleMenuEntity, Column};
use system_model::request::system_role_menu::{CreateSystemRoleMenuRequest, UpdateSystemRoleMenuRequest, PaginatedKeywordRequest};
use system_model::response::system_role_menu::SystemRoleMenuResponse;
use crate::convert::system_role_menu::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use common::base::page::PaginatedResponse;
use crate::service;

pub async fn create(db: &DatabaseConnection, request: CreateSystemRoleMenuRequest) -> Result<i64> {
    let system_role_menu = create_request_to_model(&request);
    let system_role_menu = system_role_menu.insert(db).await?;
    Ok(system_role_menu.id)
}

pub async fn update(db: &DatabaseConnection, request: UpdateSystemRoleMenuRequest) -> Result<()> {
    let system_role_menu = SystemRoleMenuEntity::find_by_id(request.id)
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let system_role_menu = update_request_to_model(&request, system_role_menu);
    system_role_menu.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, id: i64) -> Result<()> {
    let result = SystemRoleMenuEntity::delete_by_id(id).exec(db).await?;
    if result.rows_affected == 0 {
        return Err(anyhow!("记录未找到"));
    }
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, id: i64) -> Result<Option<SystemRoleMenuResponse>> {
    let system_role_menu = SystemRoleMenuEntity::find_by_id(id).one(db).await?;
    Ok(system_role_menu.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<SystemRoleMenuResponse>> {
    let paginator = SystemRoleMenuEntity::find()
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

pub async fn list(db: &DatabaseConnection) -> Result<Vec<SystemRoleMenuResponse>> {
    let list = SystemRoleMenuEntity::find().all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

pub async fn get_role_menu_permissions(db: &DatabaseConnection, role_id: i64) -> Result<Vec<String>> {
    let list = SystemRoleMenuEntity::find()
        .select_only()
        .column(Column::MenuId)
        .filter(Column::RoleId.eq(role_id))
        .all(db).await?;
    let permissions = service::system_menu::get_menus_permissions(db, list.into_iter().map(|m| m.menu_id).collect()).await?;
    Ok(permissions)
}