use sea_orm::{DatabaseConnection, EntityTrait, ColumnTrait, ActiveModelTrait, PaginatorTrait, QueryOrder, QueryFilter};
use crate::model::system_dict_type::{Model as SystemDictTypeModel, ActiveModel as SystemDictTypeActiveModel, Entity as SystemDictTypeEntity, Column};
use system_model::request::system_dict_type::{CreateSystemDictTypeRequest, UpdateSystemDictTypeRequest, PaginatedKeywordRequest};
use system_model::response::system_dict_type::SystemDictTypeResponse;
use crate::convert::system_dict_type::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use sea_orm::ActiveValue::Set;
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateSystemDictTypeRequest) -> Result<i64> {
    let mut system_dict_type = create_request_to_model(&request);
    system_dict_type.creator = Set(Some(login_user.id));
    system_dict_type.updater = Set(Some(login_user.id));
    
    let system_dict_type = system_dict_type.insert(db).await?;
    Ok(system_dict_type.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateSystemDictTypeRequest) -> Result<()> {
    let system_dict_type = SystemDictTypeEntity::find_by_id(request.id)
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut system_dict_type = update_request_to_model(&request, system_dict_type);
    system_dict_type.updater = Set(Some(login_user.id));
    system_dict_type.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let system_dict_type = SystemDictTypeActiveModel {
        id: Set(id),
        
        deleted: Set(true),
        ..Default::default()
    };
    system_dict_type.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<SystemDictTypeResponse>> {
    let system_dict_type = SystemDictTypeEntity::find()
        .filter(Column::Id.eq(id))
        
        .one(db).await?;
    Ok(system_dict_type.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<SystemDictTypeResponse>> {
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<SystemDictTypeResponse>> {
    let list = SystemDictTypeEntity::find()
        
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}