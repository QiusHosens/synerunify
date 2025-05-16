use common::constants::enum_constants::STATUS_ENABLE;
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, DatabaseTransaction, EntityTrait, PaginatorTrait, QueryFilter, QueryOrder};
use crate::model::system_user::{Model as SystemUserModel, ActiveModel as SystemUserActiveModel, Entity as SystemUserEntity, Column};
use system_model::request::system_user::{CreateSystemUserRequest, UpdateSystemUserRequest, PaginatedKeywordRequest};
use system_model::response::system_user::SystemUserResponse;
use crate::convert::system_user::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use chrono::Utc;
use sea_orm::ActiveValue::Set;
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateSystemUserRequest) -> Result<i64> {
    let mut system_user = create_request_to_model(&request);
    system_user.creator = Set(Some(login_user.id));
    system_user.updater = Set(Some(login_user.id));
    system_user.tenant_id = Set(login_user.tenant_id);
    let system_user = system_user.insert(db).await?;
    Ok(system_user.id)
}

// 创建租户管理员
pub async fn create_tenant_admin(txn: &DatabaseTransaction, login_user: LoginUserContext, username: String, password: String, nickname: String, mobile: Option<String>, department_code: String, department_id: i64, tenant_id: i64) -> Result<i64> {
    let system_user = SystemUserActiveModel {
        username: Set(username),
        password: Set(password),
        nickname: Set(nickname),
        mobile: Set(mobile),
        status: Set(STATUS_ENABLE),
        department_code: Set(department_code),
        department_id: Set(department_id),
        creator: Set(Some(login_user.id)),
        updater: Set(Some(login_user.id)),
        tenant_id: Set(tenant_id),
        ..Default::default()
    };
    let system_user = system_user.insert(txn).await?;
    Ok(system_user.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateSystemUserRequest) -> Result<()> {
    let system_user = SystemUserEntity::find_by_id(request.id)
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut system_user = update_request_to_model(&request, system_user);
    system_user.updater = Set(Some(login_user.id));
    system_user.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let system_user = SystemUserActiveModel {
        id: Set(id),
        tenant_id: Set(login_user.tenant_id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    system_user.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<SystemUserResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let system_user = SystemUserEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(system_user.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<SystemUserResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let paginator = SystemUserEntity::find_active_with_condition(condition)
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<SystemUserResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = SystemUserEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

pub async fn get_by_username(db: &DatabaseConnection, username: String) -> Result<Option<SystemUserModel>> {
    let system_user = SystemUserEntity::find_active()
        .filter(Column::Username.eq(username))
        .one(db).await?;
    Ok(system_user)
}

pub async fn update_by_login(db: &DatabaseConnection, id: i64, login_ip: String) -> Result<()> {
    let system_user = SystemUserActiveModel {
        id: Set(id),
        login_ip: Set(Some(login_ip)),
        login_date: Set(Some(Utc::now().naive_utc())),
        ..Default::default()
    };
    system_user.update(db).await?;
    Ok(())
}

pub async fn find_by_id(db: &DatabaseConnection, id: i64) -> Result<Option<SystemUserResponse>> {
    let system_user = SystemUserEntity::find_active_by_id(id)
        .one(db).await?;
    Ok(system_user.map(model_to_response))
}