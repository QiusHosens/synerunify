use common::constants::enum_constants::STATUS_ENABLE;
use sea_orm::{DatabaseConnection, EntityTrait, ColumnTrait, ActiveModelTrait, PaginatorTrait, QueryOrder, QueryFilter, Condition};
use crate::model::system_dict_type::{Model as SystemDictTypeModel, ActiveModel as SystemDictTypeActiveModel, Entity as SystemDictTypeEntity, Column};
use system_model::request::system_dict_type::{CreateSystemDictTypeRequest, UpdateSystemDictTypeRequest, PaginatedKeywordRequest};
use system_model::response::system_dict_type::SystemDictTypeResponse;
use crate::convert::system_dict_type::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use sea_orm::ActiveValue::Set;
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateSystemDictTypeRequest) -> Result<i64> {
    let mut system_dict_type = create_request_to_model(&request);
    system_dict_type.status = Set(STATUS_ENABLE);
    system_dict_type.creator = Set(Some(login_user.id));
    system_dict_type.updater = Set(Some(login_user.id));
    
    let system_dict_type = system_dict_type.insert(db).await?;
    Ok(system_dict_type.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateSystemDictTypeRequest) -> Result<()> {
    let system_dict_type = SystemDictTypeEntity::find_active_by_id(request.id)
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
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    system_dict_type.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<SystemDictTypeResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id));
    let system_dict_type = SystemDictTypeEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(system_dict_type.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<SystemDictTypeResponse>> {
    let paginator = SystemDictTypeEntity::find_active()
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
    let list = SystemDictTypeEntity::find_active()
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}