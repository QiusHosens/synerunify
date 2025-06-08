use sea_orm::{DatabaseConnection, EntityTrait, ColumnTrait, ActiveModelTrait, PaginatorTrait, QueryOrder, QueryFilter, Condition};
use crate::model::erp_sales_returns::{Model as ErpSalesReturnsModel, ActiveModel as ErpSalesReturnsActiveModel, Entity as ErpSalesReturnsEntity, Column};
use erp_model::request::erp_sales_returns::{CreateErpSalesReturnsRequest, UpdateErpSalesReturnsRequest, PaginatedKeywordRequest};
use erp_model::response::erp_sales_returns::ErpSalesReturnsResponse;
use crate::convert::erp_sales_returns::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use sea_orm::ActiveValue::Set;
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateErpSalesReturnsRequest) -> Result<i64> {
    let mut erp_sales_returns = create_request_to_model(&request);
    erp_sales_returns.creator = Set(Some(login_user.id));
    erp_sales_returns.updater = Set(Some(login_user.id));
    erp_sales_returns.tenant_id = Set(login_user.tenant_id);
    let erp_sales_returns = erp_sales_returns.insert(db).await?;
    Ok(erp_sales_returns.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateErpSalesReturnsRequest) -> Result<()> {
    let erp_sales_returns = ErpSalesReturnsEntity::find_by_id(request.id)
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut erp_sales_returns = update_request_to_model(&request, erp_sales_returns);
    erp_sales_returns.updater = Set(Some(login_user.id));
    erp_sales_returns.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_sales_returns = ErpSalesReturnsActiveModel {
        id: Set(id),
        tenant_id: Set(login_user.tenant_id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    erp_sales_returns.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpSalesReturnsResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_sales_returns = ErpSalesReturnsEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(erp_sales_returns.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpSalesReturnsResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let paginator = ErpSalesReturnsEntity::find_active_with_condition(condition)
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<ErpSalesReturnsResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = ErpSalesReturnsEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}