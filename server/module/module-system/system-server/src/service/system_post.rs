use sea_orm::{DatabaseConnection, EntityTrait, ActiveModelTrait, PaginatorTrait, QueryOrder};
use crate::model::system_post::{Model as SystemPostModel, Entity as SystemPostEntity, Column};
use system_model::request::system_post::{CreateSystemPostRequest, UpdateSystemPostRequest, PaginatedKeywordRequest};
use system_model::response::system_post::SystemPostResponse;
use crate::convert::system_post::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use common::base::page::PaginatedResponse;

pub async fn create(db: &DatabaseConnection, request: CreateSystemPostRequest) -> Result<i64> {
    let system_post = create_request_to_model(&request);
    let system_post = system_post.insert(db).await?;
    Ok(system_post.id)
}

pub async fn update(db: &DatabaseConnection, request: UpdateSystemPostRequest) -> Result<()> {
    let system_post = SystemPostEntity::find_by_id(request.id)
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let system_post = update_request_to_model(&request, system_post);
    system_post.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, id: i64) -> Result<()> {
    let result = SystemPostEntity::delete_by_id(id).exec(db).await?;
    if result.rows_affected == 0 {
        return Err(anyhow!("记录未找到"));
    }
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, id: i64) -> Result<Option<SystemPostResponse>> {
    let system_post = SystemPostEntity::find_by_id(id).one(db).await?;
    Ok(system_post.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<SystemPostResponse>> {
    let paginator = SystemPostEntity::find()
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

pub async fn list(db: &DatabaseConnection) -> Result<Vec<SystemPostResponse>> {
    let list = SystemPostEntity::find().all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}