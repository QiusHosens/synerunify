use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, DatabaseTransaction, EntityTrait, PaginatorTrait, QueryFilter, QueryOrder};
use crate::model::system_user_role::{Model as SystemUserRoleModel, ActiveModel as SystemUserRoleActiveModel, Entity as SystemUserRoleEntity, Column};
use system_model::request::system_user_role::{CreateSystemUserRoleRequest, UpdateSystemUserRoleRequest, PaginatedKeywordRequest};
use system_model::response::system_user_role::SystemUserRoleResponse;
use crate::convert::system_user_role::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use sea_orm::ActiveValue::Set;
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

use super::system_auth;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateSystemUserRoleRequest) -> Result<i64> {
    let mut system_user_role = create_request_to_model(&request);
    system_user_role.creator = Set(Some(login_user.id));
    system_user_role.updater = Set(Some(login_user.id));
    system_user_role.tenant_id = Set(login_user.tenant_id);
    let system_user_role = system_user_role.insert(db).await?;
    Ok(system_user_role.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateSystemUserRoleRequest) -> Result<()> {
    let system_user_role = SystemUserRoleEntity::find_by_id(request.id)
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut system_user_role = update_request_to_model(&request, system_user_role);
    system_user_role.updater = Set(Some(login_user.id));
    system_user_role.update(db).await?;
    Ok(())
}

pub async fn save(db: &DatabaseConnection, txn: &DatabaseTransaction, login_user: LoginUserContext, user_id: i64, role_id: i64) -> Result<i64> {
    // 先查询用户角色,不存在则新增,存在且角色id不一致则修改
    let system_user_role = SystemUserRoleEntity::find_active()
        .filter(Column::UserId.eq(user_id))
        .one(db)
        .await?;

    match system_user_role {
        None => {
            // No existing record, create a new one
            let mut system_user_role = SystemUserRoleActiveModel {
                user_id: Set(user_id),
                role_id: Set(role_id),
                creator: Set(Some(login_user.id)),
                updater: Set(Some(login_user.id)),
                tenant_id: Set(login_user.tenant_id),
                ..Default::default()
            };
            let inserted = system_user_role.insert(txn).await?;
            Ok(inserted.id)
        }
        Some(existing) => {
            // Record exists, check if role_id differs
            if existing.role_id != role_id {
                // Update the role_id if it has changed
                let mut system_user_role: SystemUserRoleActiveModel = existing.into();
                system_user_role.role_id = Set(role_id);
                system_user_role.updater = Set(Some(login_user.id));
                let updated = system_user_role.update(txn).await?;
                // 修改角色需退出账号,使用户重新登录
                system_auth::offline_user(&db, user_id).await?;
                Ok(updated.id)
            } else {
                // No change needed, return existing ID
                Ok(existing.id)
            }
        }
    }
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let system_user_role = SystemUserRoleActiveModel {
        id: Set(id),
        tenant_id: Set(login_user.tenant_id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    system_user_role.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<SystemUserRoleResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let system_user_role = SystemUserRoleEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(system_user_role.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<SystemUserRoleResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let paginator = SystemUserRoleEntity::find_active_with_condition(condition)
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<SystemUserRoleResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = SystemUserRoleEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

pub async fn get_role_id_by_user_id(db: &DatabaseConnection, user_id: i64) -> Result<i64> {
    let system_user_role = SystemUserRoleEntity::find_active()
        .filter(Column::UserId.eq(user_id))
        .one(db).await?;
    Ok(system_user_role.map_or_else(|| 0, | user_role | user_role.role_id))
}