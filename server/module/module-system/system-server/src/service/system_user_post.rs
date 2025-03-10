use sea_orm::{DatabaseConnection, EntityTrait, ActiveModelTrait, PaginatorTrait, QueryOrder};
use crate::model::system_user_post::{Model as SystemUserPostModel, Entity as SystemUserPostEntity, Column};
use system_model::request::system_user_post::{CreateSystemUserPostRequest, UpdateSystemUserPostRequest, PaginatedKeywordRequest};
use system_model::response::system_user_post::SystemUserPostResponse;
use crate::convert::system_user_post::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use common::base::page::PaginatedResponse;

pub async fn create(db: &DatabaseConnection, request: CreateSystemUserPostRequest) -> Result<i64> {
    let system_user_post = create_request_to_model(&request);
    let system_user_post = system_user_post.insert(db).await?;
    Ok(system_user_post.id)
}

pub async fn update(db: &DatabaseConnection, request: UpdateSystemUserPostRequest) -> Result<()> {
    let system_user_post = SystemUserPostEntity::find_by_id(request.id)
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let system_user_post = update_request_to_model(&request, system_user_post);
    system_user_post.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, id: i64) -> Result<()> {
    let result = SystemUserPostEntity::delete_by_id(id).exec(db).await?;
    if result.rows_affected == 0 {
        return Err(anyhow!("记录未找到"));
    }
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, id: i64) -> Result<Option<SystemUserPostResponse>> {
    let system_user_post = SystemUserPostEntity::find_by_id(id).one(db).await?;
    Ok(system_user_post.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<SystemUserPostResponse>> {
    let paginator = SystemUserPostEntity::find()
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

pub async fn list(db: &DatabaseConnection) -> Result<Vec<SystemUserPostResponse>> {
    let list = SystemUserPostEntity::find().all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}