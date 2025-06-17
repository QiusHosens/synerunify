use common::interceptor::orm::simple_support::SimpleSupport;
use sea_orm::{DatabaseConnection, EntityTrait, Order, ColumnTrait, ActiveModelTrait, PaginatorTrait, QueryOrder, QueryFilter, Condition};
use crate::model::erp_product_inventory::{Model as ErpProductInventoryModel, ActiveModel as ErpProductInventoryActiveModel, Entity as ErpProductInventoryEntity, Column};
use erp_model::request::erp_product_inventory::{CreateErpProductInventoryRequest, UpdateErpProductInventoryRequest, PaginatedKeywordRequest};
use erp_model::response::erp_product_inventory::ErpProductInventoryResponse;
use crate::convert::erp_product_inventory::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use sea_orm::ActiveValue::Set;
use common::constants::enum_constants::{STATUS_DISABLE, STATUS_ENABLE};
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateErpProductInventoryRequest) -> Result<i64> {
    let mut erp_product_inventory = create_request_to_model(&request);
    erp_product_inventory.creator = Set(Some(login_user.id));
    erp_product_inventory.updater = Set(Some(login_user.id));
    erp_product_inventory.tenant_id = Set(login_user.tenant_id);
    let erp_product_inventory = erp_product_inventory.insert(db).await?;
    Ok(erp_product_inventory.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateErpProductInventoryRequest) -> Result<()> {
    let erp_product_inventory = ErpProductInventoryEntity::find_by_id(request.id)
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut erp_product_inventory = update_request_to_model(&request, erp_product_inventory);
    erp_product_inventory.updater = Set(Some(login_user.id));
    erp_product_inventory.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_product_inventory = ErpProductInventoryActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    erp_product_inventory.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpProductInventoryResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_product_inventory = ErpProductInventoryEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(erp_product_inventory.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpProductInventoryResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let paginator = ErpProductInventoryEntity::find_active_with_condition(condition)
        .support_filter(params.base.filter_field, params.base.filter_operator, params.base.filter_value)
        .support_order(params.base.sort_field, params.base.sort, Some(vec![(Column::Id, Order::Asc)]))
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<ErpProductInventoryResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = ErpProductInventoryEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}
