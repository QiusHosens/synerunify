use sea_orm::{DatabaseConnection, EntityTrait, ColumnTrait, ActiveModelTrait, PaginatorTrait, QueryOrder, QueryFilter, Condition, QuerySelect};
use crate::model::system_menu::{Model as SystemMenuModel, ActiveModel as SystemMenuActiveModel, Entity as SystemMenuEntity, Column};
use system_model::request::system_menu::{CreateSystemMenuRequest, UpdateSystemMenuRequest, PaginatedKeywordRequest};
use system_model::response::system_menu::SystemMenuResponse;
use crate::convert::system_menu::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use sea_orm::ActiveValue::Set;
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateSystemMenuRequest) -> Result<i64> {
    let mut system_menu = create_request_to_model(&request);
    system_menu.creator = Set(Some(login_user.id));
    system_menu.updater = Set(Some(login_user.id));
    
    let system_menu = system_menu.insert(db).await?;
    Ok(system_menu.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateSystemMenuRequest) -> Result<()> {
    let system_menu = SystemMenuEntity::find_by_id(request.id)
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut system_menu = update_request_to_model(&request, system_menu);
    system_menu.updater = Set(Some(login_user.id));
    system_menu.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let system_menu = SystemMenuActiveModel {
        id: Set(id),
        
        deleted: Set(true),
        ..Default::default()
    };
    system_menu.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<SystemMenuResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id));
    let system_menu = SystemMenuEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(system_menu.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<SystemMenuResponse>> {
    let paginator = SystemMenuEntity::find_active()
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<SystemMenuResponse>> {
    let list = SystemMenuEntity::find_active()
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

pub async fn get_menus_permissions(db: &DatabaseConnection, ids: Vec<i64>) -> Result<Vec<String>> {
    if ids.is_empty() {
        return Ok(Vec::new())
    }
    let system_menu_list = SystemMenuEntity::find_active()
        .select_only()
        .column(Column::Permission)
        .filter(Column::Id.is_in(ids))
        .all(db).await?;
    Ok(system_menu_list.into_iter().map(|m| m.permission).collect())
}