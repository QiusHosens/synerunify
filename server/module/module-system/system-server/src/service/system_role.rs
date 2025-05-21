use std::str::FromStr;

use common::constants::enum_constants::{STATUS_DISABLE, STATUS_ENABLE};
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, EntityTrait, JoinType, PaginatorTrait, QueryFilter, QueryOrder, QuerySelect, RelationTrait};
use crate::model::system_role::{Model as SystemRoleModel, ActiveModel as SystemRoleActiveModel, Entity as SystemRoleEntity, Column, Relation};
use crate::model::system_data_scope_rule::{Model as SystemDataScopeRuleModel, ActiveModel as SystemDataScopeRuleActiveModel, Entity as SystemDataScopeRuleEntity, Column as SystemDataScopeRuleColumn};
use system_model::request::system_role::{CreateSystemRoleRequest, PaginatedKeywordRequest, UpdateSystemRoleRequest, UpdateSystemRoleRuleRequest};
use system_model::response::system_role::{SystemRoleResponse, SystemRoleRuleResponse};
use crate::convert::system_role::{create_request_to_model, model_to_response, model_to_rule_response, update_request_to_model, update_rule_request_to_model};
use anyhow::{Result, anyhow};
use sea_orm::ActiveValue::Set;
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

use super::system_user_role;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateSystemRoleRequest) -> Result<i64> {
    let mut system_role = create_request_to_model(&request);
    system_role.creator = Set(Some(login_user.id));
    system_role.updater = Set(Some(login_user.id));
    system_role.tenant_id = Set(login_user.tenant_id);
    let system_role = system_role.insert(db).await?;
    Ok(system_role.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateSystemRoleRequest) -> Result<()> {
    let system_role = SystemRoleEntity::find_by_id(request.id)
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut system_role = update_request_to_model(&request, system_role);
    system_role.updater = Set(Some(login_user.id));
    system_role.update(db).await?;
    Ok(())
}

pub async fn update_rule(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateSystemRoleRuleRequest) -> Result<()> {
    let system_role = SystemRoleEntity::find_by_id(request.id)
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut system_role = update_rule_request_to_model(&request, system_role);
    system_role.updater = Set(Some(login_user.id));
    system_role.update(db).await?;
    // 修改数据权限规则后需退出角色下所有用户，使其重新登录
    system_user_role::offline_role_user(&db, request.id).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let system_role = SystemRoleActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    system_role.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<SystemRoleResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let system_role = SystemRoleEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(system_role.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<SystemRoleRuleResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));
    let mut query = SystemRoleEntity::find_active_with_condition(condition)
        .select_also(SystemDataScopeRuleEntity)
        .join(JoinType::LeftJoin, Relation::RuleType.def());

    // Apply sort if not empty
    let mut is_default_sort = true;
    if let Some(field) = &params.base.field {
        if let Some(sort) = &params.base.sort {
            let is_asc = sort.to_lowercase() == "asc";
            // 动态应用排序，假设字段名与数据库列名一致
            match field.as_str() {
                // SystemDictDataEntity 的字段
                f if Column::from_str(f).is_ok() => {
                    let column = Column::from_str(f).unwrap();
                    is_default_sort = false;
                    query = if is_asc {
                        query.order_by_asc(column)
                    } else {
                        query.order_by_desc(column)
                    };
                }
                _ => {}
            }
        }
    }

    if is_default_sort {
        query = query
            .order_by_asc(Column::Sort);
    }

    let paginator = query
        .paginate(db, params.base.size);

    let total = paginator.num_items().await?;
    let total_pages = (total + params.base.size - 1) / params.base.size; // 向上取整
    let list = paginator
        .fetch_page(params.base.page - 1) // SeaORM 页码从 0 开始，所以减 1
        .await?
        .into_iter()
        .map(|(data, rule_data)|model_to_rule_response(data, rule_data))
        .collect();

    Ok(PaginatedResponse {
        list,
        total_pages,
        page: params.base.page,
        size: params.base.size,
        total,
    })
}

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<SystemRoleResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));
    let list = SystemRoleEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

pub async fn enable(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let system_role = SystemRoleActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        status: Set(STATUS_ENABLE),
        ..Default::default()
    };
    system_role.update(db).await?;
    Ok(())
}

pub async fn disable(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let system_role = SystemRoleActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        status: Set(STATUS_DISABLE),
        ..Default::default()
    };
    system_role.update(db).await?;
    Ok(())
}