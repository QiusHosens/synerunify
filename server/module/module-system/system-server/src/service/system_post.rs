use std::str::FromStr;

use common::constants::enum_constants::{STATUS_DISABLE, STATUS_ENABLE};
use common::interceptor::orm::support_order::SupportOrder;
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, EntityTrait, Order, PaginatorTrait, QueryFilter, QueryOrder};
use crate::model::system_post::{Model as SystemPostModel, ActiveModel as SystemPostActiveModel, Entity as SystemPostEntity, Column};
use system_model::request::system_post::{CreateSystemPostRequest, UpdateSystemPostRequest, PaginatedKeywordRequest};
use system_model::response::system_post::SystemPostResponse;
use crate::convert::system_post::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use sea_orm::ActiveValue::Set;
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateSystemPostRequest) -> Result<i64> {
    let mut system_post = create_request_to_model(&request);
    system_post.creator = Set(Some(login_user.id));
    system_post.updater = Set(Some(login_user.id));
    system_post.tenant_id = Set(login_user.tenant_id);
    let system_post = system_post.insert(db).await?;
    Ok(system_post.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateSystemPostRequest) -> Result<()> {
    let system_post = SystemPostEntity::find_by_id(request.id)
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut system_post = update_request_to_model(&request, system_post);
    system_post.updater = Set(Some(login_user.id));
    system_post.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let system_post = SystemPostActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    system_post.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<SystemPostResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let system_post = SystemPostEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(system_post.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<SystemPostResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));
    let mut query = SystemPostEntity::find_active_with_condition(condition);

    let paginator = query
        .support_order(params.base.sort_field, params.base.sort, Some(vec![(Column::Id, Order::Asc)]))
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<SystemPostResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = SystemPostEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

pub async fn enable(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let system_post = SystemPostActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        status: Set(STATUS_ENABLE),
        ..Default::default()
    };
    system_post.update(db).await?;
    Ok(())
}

pub async fn disable(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let system_post = SystemPostActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        status: Set(STATUS_DISABLE),
        ..Default::default()
    };
    system_post.update(db).await?;
    Ok(())
}