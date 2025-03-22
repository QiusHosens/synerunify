use sea_orm::{DatabaseConnection, EntityTrait, ColumnTrait, ActiveModelTrait, PaginatorTrait, QueryOrder, QuerySelect, QueryFilter};
use crate::model::system_role_menu::{Model as SystemRoleMenuModel, ActiveModel as SystemRoleMenuActiveModel, Entity as SystemRoleMenuEntity, Column};
use system_model::request::system_role_menu::{CreateSystemRoleMenuRequest, UpdateSystemRoleMenuRequest, PaginatedKeywordRequest};
use system_model::response::system_role_menu::SystemRoleMenuResponse;
use crate::convert::system_role_menu::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use sea_orm::ActiveValue::Set;
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use crate::service;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateSystemRoleMenuRequest) -> Result<i64> {
    let mut system_role_menu = create_request_to_model(&request);
    system_role_menu.creator = Set(Some(login_user.id));
    system_role_menu.updater = Set(Some(login_user.id));
    system_role_menu.tenant_id = Set(login_user.tenant_id);
    let system_role_menu = system_role_menu.insert(db).await?;
    Ok(system_role_menu.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateSystemRoleMenuRequest) -> Result<()> {
    let system_role_menu = SystemRoleMenuEntity::find_by_id(request.id)
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut system_role_menu = update_request_to_model(&request, system_role_menu);
    system_role_menu.updater = Set(Some(login_user.id));
    system_role_menu.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let system_role_menu = SystemRoleMenuActiveModel {
        id: Set(id),
        tenant_id: Set(login_user.tenant_id),
        deleted: Set(true),
        ..Default::default()
    };
    system_role_menu.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<SystemRoleMenuResponse>> {
    let system_role_menu = SystemRoleMenuEntity::find()
        .filter(Column::Id.eq(id))
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .one(db).await?;
    Ok(system_role_menu.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<SystemRoleMenuResponse>> {
    let paginator = SystemRoleMenuEntity::find()
        .filter(Column::TenantId.eq(login_user.tenant_id))
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<SystemRoleMenuResponse>> {
    let list = SystemRoleMenuEntity::find()
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .all(db).await?;
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