use sea_orm::{DatabaseConnection, EntityTrait, ColumnTrait, ActiveModelTrait, PaginatorTrait, QueryOrder, QueryFilter, Condition};
use crate::model::system_data_scope_rule::{Model as SystemDataScopeRuleModel, ActiveModel as SystemDataScopeRuleActiveModel, Entity as SystemDataScopeRuleEntity, Column};
use system_model::request::system_data_scope_rule::{CreateSystemDataScopeRuleRequest, UpdateSystemDataScopeRuleRequest, PaginatedKeywordRequest};
use system_model::response::system_data_scope_rule::SystemDataScopeRuleResponse;
use crate::convert::system_data_scope_rule::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use sea_orm::ActiveValue::Set;
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateSystemDataScopeRuleRequest) -> Result<i64> {
    let mut system_data_scope_rule = create_request_to_model(&request);
    system_data_scope_rule.creator = Set(Some(login_user.id));
    system_data_scope_rule.updater = Set(Some(login_user.id));
    system_data_scope_rule.tenant_id = Set(login_user.tenant_id);
    let system_data_scope_rule = system_data_scope_rule.insert(db).await?;
    Ok(system_data_scope_rule.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateSystemDataScopeRuleRequest) -> Result<()> {
    let system_data_scope_rule = SystemDataScopeRuleEntity::find_by_id(request.id)
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut system_data_scope_rule = update_request_to_model(&request, system_data_scope_rule);
    system_data_scope_rule.updater = Set(Some(login_user.id));
    system_data_scope_rule.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let system_data_scope_rule = SystemDataScopeRuleActiveModel {
        id: Set(id),
        tenant_id: Set(login_user.tenant_id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    system_data_scope_rule.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<SystemDataScopeRuleResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let system_data_scope_rule = SystemDataScopeRuleEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(system_data_scope_rule.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<SystemDataScopeRuleResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let paginator = SystemDataScopeRuleEntity::find_active_with_condition(condition)
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<SystemDataScopeRuleResponse>> {
    let condition = Condition::any()
        .add(Column::TenantId.eq(login_user.tenant_id))
        .add(Column::Type.eq(0));
    let list = SystemDataScopeRuleEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

pub async fn find_by_id(db: &DatabaseConnection, id: i64) -> Result<Option<SystemDataScopeRuleModel>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id));
            
    let system_data_scope_rule = SystemDataScopeRuleEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(system_data_scope_rule)
}