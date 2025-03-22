use sea_orm::{DatabaseConnection, EntityTrait, ColumnTrait, ActiveModelTrait, PaginatorTrait, QueryOrder, QueryFilter};
use crate::model::system_user::{Model as SystemUserModel, ActiveModel as SystemUserActiveModel, Entity as SystemUserEntity, Column};
use system_model::request::system_user::{CreateSystemUserRequest, UpdateSystemUserRequest, PaginatedKeywordRequest};
use system_model::response::system_user::SystemUserResponse;
use crate::convert::system_user::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use chrono::Utc;
use sea_orm::ActiveValue::Set;
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateSystemUserRequest) -> Result<i64> {
    let mut system_user = create_request_to_model(&request);
    system_user.creator = Set(Some(login_user.id));
    system_user.updater = Set(Some(login_user.id));
    system_user.tenant_id = Set(login_user.tenant_id);
    let system_user = system_user.insert(db).await?;
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
        deleted: Set(true),
        ..Default::default()
    };
    system_user.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<SystemUserResponse>> {
    let system_user = SystemUserEntity::find()
        .filter(Column::Id.eq(id))
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .one(db).await?;
    Ok(system_user.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<SystemUserResponse>> {
    let paginator = SystemUserEntity::find()
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<SystemUserResponse>> {
    let list = SystemUserEntity::find()
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

pub async fn get_by_username(db: &DatabaseConnection, username: String) -> Result<Option<SystemUserModel>> {
    let system_user = SystemUserEntity::find().filter(Column::Username.eq(username)).one(db).await?;
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
    let system_user = SystemUserEntity::find_by_id(id)
        .one(db).await?;
    Ok(system_user.map(model_to_response))
}