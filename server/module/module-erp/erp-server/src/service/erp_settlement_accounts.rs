use sea_orm::{DatabaseConnection, EntityTrait, ColumnTrait, ActiveModelTrait, PaginatorTrait, QueryOrder, QueryFilter, Condition};
use crate::model::erp_settlement_accounts::{Model as ErpSettlementAccountsModel, ActiveModel as ErpSettlementAccountsActiveModel, Entity as ErpSettlementAccountsEntity, Column};
use erp_model::request::erp_settlement_accounts::{CreateErpSettlementAccountsRequest, UpdateErpSettlementAccountsRequest, PaginatedKeywordRequest};
use erp_model::response::erp_settlement_accounts::ErpSettlementAccountsResponse;
use crate::convert::erp_settlement_accounts::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use sea_orm::ActiveValue::Set;
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateErpSettlementAccountsRequest) -> Result<i64> {
    let mut erp_settlement_accounts = create_request_to_model(&request);
    erp_settlement_accounts.creator = Set(Some(login_user.id));
    erp_settlement_accounts.updater = Set(Some(login_user.id));
    erp_settlement_accounts.tenant_id = Set(login_user.tenant_id);
    let erp_settlement_accounts = erp_settlement_accounts.insert(db).await?;
    Ok(erp_settlement_accounts.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateErpSettlementAccountsRequest) -> Result<()> {
    let erp_settlement_accounts = ErpSettlementAccountsEntity::find_by_id(request.id)
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut erp_settlement_accounts = update_request_to_model(&request, erp_settlement_accounts);
    erp_settlement_accounts.updater = Set(Some(login_user.id));
    erp_settlement_accounts.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_settlement_accounts = ErpSettlementAccountsActiveModel {
        id: Set(id),
        tenant_id: Set(login_user.tenant_id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    erp_settlement_accounts.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpSettlementAccountsResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_settlement_accounts = ErpSettlementAccountsEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(erp_settlement_accounts.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpSettlementAccountsResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let paginator = ErpSettlementAccountsEntity::find_active_with_condition(condition)
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<ErpSettlementAccountsResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = ErpSettlementAccountsEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}