use sea_orm::{DatabaseConnection, EntityTrait, ColumnTrait, ActiveModelTrait, PaginatorTrait, QueryOrder, QueryFilter, Condition};
use crate::model::erp_product_unit::{Model as ErpProductUnitModel, ActiveModel as ErpProductUnitActiveModel, Entity as ErpProductUnitEntity, Column};
use erp_model::request::erp_product_unit::{CreateErpProductUnitRequest, UpdateErpProductUnitRequest, PaginatedKeywordRequest};
use erp_model::response::erp_product_unit::ErpProductUnitResponse;
use crate::convert::erp_product_unit::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use sea_orm::ActiveValue::Set;
use common::constants::enum_constants::{STATUS_DISABLE, STATUS_ENABLE};
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateErpProductUnitRequest) -> Result<i64> {
    let mut erp_product_unit = create_request_to_model(&request);
    erp_product_unit.creator = Set(Some(login_user.id));
    erp_product_unit.updater = Set(Some(login_user.id));
    erp_product_unit.tenant_id = Set(login_user.tenant_id);
    let erp_product_unit = erp_product_unit.insert(db).await?;
    Ok(erp_product_unit.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateErpProductUnitRequest) -> Result<()> {
    let erp_product_unit = ErpProductUnitEntity::find_by_id(request.id)
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut erp_product_unit = update_request_to_model(&request, erp_product_unit);
    erp_product_unit.updater = Set(Some(login_user.id));
    erp_product_unit.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_product_unit = ErpProductUnitActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    erp_product_unit.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpProductUnitResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_product_unit = ErpProductUnitEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(erp_product_unit.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpProductUnitResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let paginator = ErpProductUnitEntity::find_active_with_condition(condition)
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<ErpProductUnitResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = ErpProductUnitEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

pub async fn enable(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_product_unit = ErpProductUnitActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        status: Set(STATUS_ENABLE),
        ..Default::default()
    };
    erp_product_unit.update(db).await?;
    Ok(())
}

pub async fn disable(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_product_unit = ErpProductUnitActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        status: Set(STATUS_DISABLE),
        ..Default::default()
    };
    erp_product_unit.update(db).await?;
    Ok(())
}