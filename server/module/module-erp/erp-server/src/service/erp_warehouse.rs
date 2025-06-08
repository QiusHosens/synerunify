use sea_orm::{DatabaseConnection, EntityTrait, ColumnTrait, ActiveModelTrait, PaginatorTrait, QueryOrder, QueryFilter, Condition};
use crate::model::erp_warehouse::{Model as ErpWarehouseModel, ActiveModel as ErpWarehouseActiveModel, Entity as ErpWarehouseEntity, Column};
use erp_model::request::erp_warehouse::{CreateErpWarehouseRequest, UpdateErpWarehouseRequest, PaginatedKeywordRequest};
use erp_model::response::erp_warehouse::ErpWarehouseResponse;
use crate::convert::erp_warehouse::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use sea_orm::ActiveValue::Set;
use common::constants::enum_constants::{STATUS_DISABLE, STATUS_ENABLE};
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateErpWarehouseRequest) -> Result<i64> {
    let mut erp_warehouse = create_request_to_model(&request);
    erp_warehouse.creator = Set(Some(login_user.id));
    erp_warehouse.updater = Set(Some(login_user.id));
    erp_warehouse.tenant_id = Set(login_user.tenant_id);
    let erp_warehouse = erp_warehouse.insert(db).await?;
    Ok(erp_warehouse.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateErpWarehouseRequest) -> Result<()> {
    let erp_warehouse = ErpWarehouseEntity::find_by_id(request.id)
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut erp_warehouse = update_request_to_model(&request, erp_warehouse);
    erp_warehouse.updater = Set(Some(login_user.id));
    erp_warehouse.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_warehouse = ErpWarehouseActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    erp_warehouse.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpWarehouseResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_warehouse = ErpWarehouseEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(erp_warehouse.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpWarehouseResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let paginator = ErpWarehouseEntity::find_active_with_condition(condition)
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<ErpWarehouseResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = ErpWarehouseEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

pub async fn enable(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_warehouse = ErpWarehouseActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        status: Set(STATUS_ENABLE),
        ..Default::default()
    };
    erp_warehouse.update(db).await?;
    Ok(())
}

pub async fn disable(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_warehouse = ErpWarehouseActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        status: Set(STATUS_DISABLE),
        ..Default::default()
    };
    erp_warehouse.update(db).await?;
    Ok(())
}