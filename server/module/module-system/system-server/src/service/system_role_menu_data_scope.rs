use sea_orm::{DatabaseConnection, EntityTrait, ColumnTrait, ActiveModelTrait, PaginatorTrait, QueryOrder, QueryFilter, Condition};
use crate::model::system_role_menu_data_scope::{Model as SystemRoleMenuDataScopeModel, ActiveModel as SystemRoleMenuDataScopeActiveModel, Entity as SystemRoleMenuDataScopeEntity, Column};
use system_model::request::system_role_menu_data_scope::{CreateSystemRoleMenuDataScopeRequest, UpdateSystemRoleMenuDataScopeRequest, PaginatedKeywordRequest};
use system_model::response::system_role_menu_data_scope::SystemRoleMenuDataScopeResponse;
use crate::convert::system_role_menu_data_scope::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use sea_orm::ActiveValue::Set;
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateSystemRoleMenuDataScopeRequest) -> Result<i64> {
    let mut system_role_menu_data_scope = create_request_to_model(&request);
    system_role_menu_data_scope.creator = Set(Some(login_user.id));
    system_role_menu_data_scope.updater = Set(Some(login_user.id));
    system_role_menu_data_scope.tenant_id = Set(login_user.tenant_id);
    let system_role_menu_data_scope = system_role_menu_data_scope.insert(db).await?;
    Ok(system_role_menu_data_scope.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateSystemRoleMenuDataScopeRequest) -> Result<()> {
    let system_role_menu_data_scope = SystemRoleMenuDataScopeEntity::find_by_id(request.id)
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut system_role_menu_data_scope = update_request_to_model(&request, system_role_menu_data_scope);
    system_role_menu_data_scope.updater = Set(Some(login_user.id));
    system_role_menu_data_scope.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let system_role_menu_data_scope = SystemRoleMenuDataScopeActiveModel {
        id: Set(id),
        tenant_id: Set(login_user.tenant_id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    system_role_menu_data_scope.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<SystemRoleMenuDataScopeResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let system_role_menu_data_scope = SystemRoleMenuDataScopeEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(system_role_menu_data_scope.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<SystemRoleMenuDataScopeResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let paginator = SystemRoleMenuDataScopeEntity::find_active_with_condition(condition)
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<SystemRoleMenuDataScopeResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = SystemRoleMenuDataScopeEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}