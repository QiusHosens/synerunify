use std::collections::HashSet;

use sea_orm::prelude::Expr;
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, DatabaseTransaction, EntityTrait, PaginatorTrait, QueryFilter, QueryOrder};
use crate::model::system_user_post::{Model as SystemUserPostModel, ActiveModel as SystemUserPostActiveModel, Entity as SystemUserPostEntity, Column};
use system_model::request::system_user_post::{CreateSystemUserPostRequest, UpdateSystemUserPostRequest, PaginatedKeywordRequest};
use system_model::response::system_user_post::SystemUserPostResponse;
use crate::convert::system_user_post::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use sea_orm::ActiveValue::Set;
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateSystemUserPostRequest) -> Result<i64> {
    let mut system_user_post = create_request_to_model(&request);
    system_user_post.creator = Set(Some(login_user.id));
    system_user_post.updater = Set(Some(login_user.id));
    system_user_post.tenant_id = Set(login_user.tenant_id);
    let system_user_post = system_user_post.insert(db).await?;
    Ok(system_user_post.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateSystemUserPostRequest) -> Result<()> {
    let system_user_post = SystemUserPostEntity::find_by_id(request.id)
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut system_user_post = update_request_to_model(&request, system_user_post);
    system_user_post.updater = Set(Some(login_user.id));
    system_user_post.update(db).await?;
    Ok(())
}

pub async fn save(db: &DatabaseConnection, txn: &DatabaseTransaction, login_user: LoginUserContext, user_id: i64, post_ids: Vec<i64>) -> Result<()> {
    // 先查询用户岗位列表,比较与
    // Query existing user-post relationships
    let existing_posts = SystemUserPostEntity::find()
        .filter(Column::UserId.eq(user_id))
        .all(db)
        .await?;

    // Convert existing posts to HashSet for efficient lookup
    let existing_post_ids: HashSet<i64> = existing_posts.iter().map(|m| m.post_id).collect();
    let request_post_ids: HashSet<i64> = post_ids.into_iter().collect();

    // Find posts to add (in request but not in database)
    let to_add: Vec<i64> = request_post_ids
        .difference(&existing_post_ids)
        .copied()
        .collect();

    // Find posts to mark as deleted (in database but not in request)
    let to_mark_deleted: Vec<i64> = existing_post_ids
        .difference(&request_post_ids)
        .copied()
        .collect();

    // Find posts to restore/update (in both database and request)
    let to_update: Vec<i64> = request_post_ids
        .intersection(&existing_post_ids)
        .copied()
        .collect();

    // Batch insert new role-post relationships (deleted = 0 for active)
    if !to_add.is_empty() {
        let new_role_posts: Vec<_> = to_add.into_iter().map(|post_id| {
            SystemUserPostActiveModel {
                user_id: Set(user_id),
                post_id: Set(post_id),
                creator: Set(Some(login_user.id)),
                updater: Set(Some(login_user.id)),
                tenant_id: Set(login_user.tenant_id),
                ..Default::default()
            }
        }).collect();
        
        SystemUserPostEntity::insert_many(new_role_posts).exec(txn).await?;
    }

    // Batch mark removed role-post relationships as deleted (set deleted = 1)
    if !to_mark_deleted.is_empty() {
        SystemUserPostEntity::update_many()
            .col_expr(Column::Deleted, Expr::value(1)) // Mark as deleted
            .col_expr(Column::Updater, Expr::value(Some(login_user.id)))
            .filter(Column::UserId.eq(user_id))
            .filter(Column::PostId.is_in(to_mark_deleted))
            .exec(txn)
            .await?;
    }

    // Batch restore/update existing relationships (set deleted = 0 for active)
    if !to_update.is_empty() {
        SystemUserPostEntity::update_many()
            .col_expr(Column::Deleted, Expr::value(0)) // Ensure active
            .col_expr(Column::Updater, Expr::value(Some(login_user.id)))
            .filter(Column::UserId.eq(user_id))
            .filter(Column::PostId.is_in(to_update))
            .exec(txn)
            .await?;
    }

    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let system_user_post = SystemUserPostActiveModel {
        id: Set(id),
        tenant_id: Set(login_user.tenant_id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    system_user_post.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<SystemUserPostResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let system_user_post = SystemUserPostEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(system_user_post.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<SystemUserPostResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let paginator = SystemUserPostEntity::find_active_with_condition(condition)
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<SystemUserPostResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = SystemUserPostEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}