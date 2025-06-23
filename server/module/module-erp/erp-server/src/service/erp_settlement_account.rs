use common::interceptor::orm::simple_support::SimpleSupport;
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, EntityTrait, Order, PaginatorTrait, QueryFilter, QueryOrder};
use crate::model::erp_settlement_account::{Model as ErpSettlementAccountModel, ActiveModel as ErpSettlementAccountActiveModel, Entity as ErpSettlementAccountEntity, Column};
use erp_model::request::erp_settlement_account::{CreateErpSettlementAccountRequest, UpdateErpSettlementAccountRequest, PaginatedKeywordRequest};
use erp_model::response::erp_settlement_account::ErpSettlementAccountResponse;
use crate::convert::erp_settlement_account::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use sea_orm::ActiveValue::Set;
use common::constants::enum_constants::{STATUS_DISABLE, STATUS_ENABLE};
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateErpSettlementAccountRequest) -> Result<i64> {
    let mut erp_settlement_account = create_request_to_model(&request);
    erp_settlement_account.creator = Set(Some(login_user.id));
    erp_settlement_account.updater = Set(Some(login_user.id));
    erp_settlement_account.tenant_id = Set(login_user.tenant_id);
    let erp_settlement_account = erp_settlement_account.insert(db).await?;
    Ok(erp_settlement_account.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateErpSettlementAccountRequest) -> Result<()> {
    let erp_settlement_account = ErpSettlementAccountEntity::find_by_id(request.id)
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut erp_settlement_account = update_request_to_model(&request, erp_settlement_account);
    erp_settlement_account.updater = Set(Some(login_user.id));
    erp_settlement_account.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_settlement_account = ErpSettlementAccountActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    erp_settlement_account.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpSettlementAccountResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_settlement_account = ErpSettlementAccountEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(erp_settlement_account.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpSettlementAccountResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));
    let paginator = ErpSettlementAccountEntity::find_active_with_condition(condition)
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<ErpSettlementAccountResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = ErpSettlementAccountEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

pub async fn enable(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_settlement_account = ErpSettlementAccountActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        status: Set(STATUS_ENABLE),
        ..Default::default()
    };
    erp_settlement_account.update(db).await?;
    Ok(())
}

pub async fn disable(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_settlement_account = ErpSettlementAccountActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        status: Set(STATUS_DISABLE),
        ..Default::default()
    };
    erp_settlement_account.update(db).await?;
    Ok(())
}

pub async fn list_by_ids(db: &DatabaseConnection, login_user: LoginUserContext, ids: Vec<i64>) -> Result<Vec<ErpSettlementAccountModel>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));
    let list = ErpSettlementAccountEntity::find_active_with_condition(condition)
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .filter(Column::Id.is_in(ids))
        .all(db).await?;
    Ok(list)
}