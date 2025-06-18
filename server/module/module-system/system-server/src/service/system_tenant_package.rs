use std::str::FromStr;

use common::constants::enum_constants::{STATUS_DISABLE, STATUS_ENABLE};
use common::interceptor::orm::simple_support::SimpleSupport;
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, EntityTrait, Order, PaginatorTrait, QueryFilter, QueryOrder};
use crate::model::system_tenant_package::{Model as SystemTenantPackageModel, ActiveModel as SystemTenantPackageActiveModel, Entity as SystemTenantPackageEntity, Column};
use system_model::request::system_tenant_package::{CreateSystemTenantPackageRequest, PaginatedKeywordRequest, UpdateSystemTenantPackageMenuRequest, UpdateSystemTenantPackageRequest};
use system_model::response::system_tenant_package::SystemTenantPackageResponse;
use crate::convert::system_tenant_package::{create_request_to_model, model_to_response, update_menu_request_to_model, update_request_to_model};
use anyhow::{Result, anyhow};
use sea_orm::ActiveValue::Set;
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

use super::system_tenant;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateSystemTenantPackageRequest) -> Result<i64> {
    let mut system_tenant_package = create_request_to_model(&request);
    system_tenant_package.creator = Set(Some(login_user.id));
    system_tenant_package.updater = Set(Some(login_user.id));
    
    let system_tenant_package = system_tenant_package.insert(db).await?;
    Ok(system_tenant_package.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateSystemTenantPackageRequest) -> Result<()> {
    let system_tenant_package = SystemTenantPackageEntity::find_active_by_id(request.id)
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut system_tenant_package = update_request_to_model(&request, system_tenant_package);
    system_tenant_package.updater = Set(Some(login_user.id));
    system_tenant_package.update(db).await?;
    Ok(())
}

pub async fn update_menu(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateSystemTenantPackageMenuRequest) -> Result<()> {
    let system_tenant_package = SystemTenantPackageEntity::find_by_id(request.id)
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut system_tenant_package = update_menu_request_to_model(&request, system_tenant_package);
    system_tenant_package.updater = Set(Some(login_user.id));
    system_tenant_package.update(db).await?;
    // 修改套餐菜单后后需清除套餐下用户缓存，使其重新登录
    offline_tenant_package_user(&db, request.id);
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let system_tenant_package = SystemTenantPackageActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    system_tenant_package.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<SystemTenantPackageResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id));
    let system_tenant_package = SystemTenantPackageEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(system_tenant_package.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<SystemTenantPackageResponse>> {
    let mut query = SystemTenantPackageEntity::find_active();

    let paginator = query
        .support_filter(params.base.filter_field, params.base.filter_operator, params.base.filter_value)
        .support_order(params.base.sort_field, params.base.sort, Some(vec![(Column::Status, Order::Asc)]))
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<SystemTenantPackageResponse>> {
    let list = SystemTenantPackageEntity::find_active()
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

pub async fn enable(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let system_tenant_package = SystemTenantPackageActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        status: Set(STATUS_ENABLE),
        ..Default::default()
    };
    system_tenant_package.update(db).await?;
    Ok(())
}

pub async fn disable(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let system_tenant_package = SystemTenantPackageActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        status: Set(STATUS_DISABLE),
        ..Default::default()
    };
    system_tenant_package.update(db).await?;
    // 下线套餐用户
    offline_tenant_package_user(&db, id).await?;
    Ok(())
}

pub async fn offline_tenant_package_user(db: &DatabaseConnection, id: i64) -> Result<()> {
    system_tenant::offline_tenant_package_user(&db, id);
    Ok(())
}

pub async fn find_by_id(db: &DatabaseConnection, id: i64) -> Result<Option<SystemTenantPackageModel>> {       
    let system_tenant_package = SystemTenantPackageEntity::find_active_by_id(id)
        .one(db).await?;
    Ok(system_tenant_package)
}