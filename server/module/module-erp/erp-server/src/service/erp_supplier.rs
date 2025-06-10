use common::interceptor::orm::simple_support::SimpleSupport;
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, EntityTrait, Order, PaginatorTrait, QueryFilter, QueryOrder};
use crate::model::erp_supplier::{Model as ErpSupplierModel, ActiveModel as ErpSupplierActiveModel, Entity as ErpSupplierEntity, Column};
use erp_model::request::erp_supplier::{CreateErpSupplierRequest, UpdateErpSupplierRequest, PaginatedKeywordRequest};
use erp_model::response::erp_supplier::ErpSupplierResponse;
use crate::convert::erp_supplier::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use sea_orm::ActiveValue::Set;
use common::constants::enum_constants::{STATUS_DISABLE, STATUS_ENABLE};
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateErpSupplierRequest) -> Result<i64> {
    let mut erp_supplier = create_request_to_model(&request);
    erp_supplier.creator = Set(Some(login_user.id));
    erp_supplier.updater = Set(Some(login_user.id));
    erp_supplier.tenant_id = Set(login_user.tenant_id);
    let erp_supplier = erp_supplier.insert(db).await?;
    Ok(erp_supplier.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateErpSupplierRequest) -> Result<()> {
    let erp_supplier = ErpSupplierEntity::find_by_id(request.id)
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut erp_supplier = update_request_to_model(&request, erp_supplier);
    erp_supplier.updater = Set(Some(login_user.id));
    erp_supplier.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_supplier = ErpSupplierActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    erp_supplier.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpSupplierResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_supplier = ErpSupplierEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(erp_supplier.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpSupplierResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let paginator = ErpSupplierEntity::find_active_with_condition(condition)
        .support_filter(params.base.filter_field, params.base.filter_operator, params.base.filter_value)
        .support_order(params.base.sort_field, params.base.sort, Some(vec![(Column::Sort, Order::Asc)]))
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<ErpSupplierResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = ErpSupplierEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

pub async fn enable(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_supplier = ErpSupplierActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        status: Set(STATUS_ENABLE),
        ..Default::default()
    };
    erp_supplier.update(db).await?;
    Ok(())
}

pub async fn disable(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_supplier = ErpSupplierActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        status: Set(STATUS_DISABLE),
        ..Default::default()
    };
    erp_supplier.update(db).await?;
    Ok(())
}