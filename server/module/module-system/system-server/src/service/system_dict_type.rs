use sea_orm::{DatabaseConnection, EntityTrait, ActiveModelTrait, PaginatorTrait, QueryOrder};
use crate::model::system_dict_type::{Model as SystemDictTypeModel, Entity as SystemDictTypeEntity, Column};
use system_model::request::system_dict_type::{CreateSystemDictTypeRequest, UpdateSystemDictTypeRequest, PaginatedKeywordRequest};
use system_model::response::system_dict_type::SystemDictTypeResponse;
use crate::convert::system_dict_type::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use common::base::page::PaginatedResponse;

pub async fn create(db: &DatabaseConnection, request: CreateSystemDictTypeRequest) -> Result<i64> {
    let system_dict_type = create_request_to_model(&request);
    let system_dict_type = system_dict_type.insert(db).await?;
    Ok(system_dict_type.id)
}

pub async fn update(db: &DatabaseConnection, request: UpdateSystemDictTypeRequest) -> Result<()> {
    let system_dict_type = SystemDictTypeEntity::find_by_id(request.id)
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let system_dict_type = update_request_to_model(&request, system_dict_type);
    system_dict_type.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, id: i64) -> Result<()> {
    let result = SystemDictTypeEntity::delete_by_id(id).exec(db).await?;
    if result.rows_affected == 0 {
        return Err(anyhow!("记录未找到"));
    }
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, id: i64) -> Result<Option<SystemDictTypeResponse>> {
    let system_dict_type = SystemDictTypeEntity::find_by_id(id).one(db).await?;
    Ok(system_dict_type.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<SystemDictTypeResponse>> {
    let paginator = SystemDictTypeEntity::find()
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

pub async fn list(db: &DatabaseConnection) -> Result<Vec<SystemDictTypeResponse>> {
    let list = SystemDictTypeEntity::find().all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}