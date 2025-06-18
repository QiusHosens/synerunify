use common::constants::enum_constants::{DEPARTMENT_ROOT_CODE, DEPARTMENT_ROOT_ID, STATUS_DISABLE, STATUS_ENABLE};
use common::utils::string_utils::get_next_code;
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, DatabaseTransaction, EntityTrait, JoinType, PaginatorTrait, QueryFilter, QueryOrder, QuerySelect, RelationTrait};
use crate::model::system_department::{Model as SystemDepartmentModel, ActiveModel as SystemDepartmentActiveModel, Entity as SystemDepartmentEntity, Column, Relation};
use crate::model::system_user::{Model as SystemUserModel, ActiveModel as SystemUserActiveModel, Entity as SystemUserEntity, Column as SystemUserColumn};
use system_model::request::system_department::{CreateSystemDepartmentRequest, UpdateSystemDepartmentRequest, PaginatedKeywordRequest};
use system_model::response::system_department::{SystemDepartmentBaseResponse, SystemDepartmentPageResponse, SystemDepartmentResponse};
use crate::convert::system_department::{create_request_to_model, model_to_base_response, model_to_page_response, model_to_response, update_request_to_model};
use anyhow::{anyhow, Context, Result};
use sea_orm::ActiveValue::Set;
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

use super::system_user;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateSystemDepartmentRequest) -> Result<i64> {
    // 查询父级编码
    let parent_department = SystemDepartmentEntity::find_active_by_id(request.parent_id.clone())
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("父级部门未找到"))?;
    // 查询code
    let max_department = SystemDepartmentEntity::find()
        .filter(Column::ParentId.eq(request.parent_id.clone()))
        .order_by_desc(Column::Id)
        .limit(1)
        .one(db)
        .await?;
    let max_code = max_department.map(|dept| dept.code);

    let code = get_next_code(parent_department.code, max_code);

    let mut system_department = create_request_to_model(&request);
    system_department.code = Set(code);
    system_department.creator = Set(Some(login_user.id));
    system_department.updater = Set(Some(login_user.id));
    system_department.tenant_id = Set(login_user.tenant_id);
    let system_department = system_department.insert(db).await?;
    Ok(system_department.id)
}

/// 创建租户根部门
pub async fn create_tenant_root(db: &DatabaseConnection, txn: &DatabaseTransaction, login_user: LoginUserContext, name: String, tenant_id: i64) -> Result<SystemDepartmentModel> {
    // 查询code
    let max_department = SystemDepartmentEntity::find_active()
        .filter(Column::ParentId.eq(DEPARTMENT_ROOT_ID))
        .order_by_desc(Column::Id)
        .limit(1)
        .one(db)
        .await?;
    let max_code = max_department.map(|dept| dept.code);

    let code = get_next_code(DEPARTMENT_ROOT_CODE.to_string(), max_code);
    let system_department = SystemDepartmentActiveModel {
        code: Set(code),
        name: Set(name),
        parent_id: Set(DEPARTMENT_ROOT_ID),
        sort: Set(0),
        status: Set(STATUS_ENABLE),
        creator: Set(Some(login_user.id)),
        updater: Set(Some(login_user.id)),
        tenant_id: Set(tenant_id),
        ..Default::default()
    };
    let system_department = system_department.insert(txn).await.with_context(|| "Failed to insert department")?;
    Ok(system_department)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateSystemDepartmentRequest) -> Result<()> {
    let system_department = SystemDepartmentEntity::find_active_by_id(request.id)
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut system_department = update_request_to_model(&request, system_department);
    system_department.updater = Set(Some(login_user.id));
    system_department.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let system_department = SystemDepartmentActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    system_department.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<SystemDepartmentResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let system_department = SystemDepartmentEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(system_department.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<SystemDepartmentResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let paginator = SystemDepartmentEntity::find_active_with_condition(condition)
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<SystemDepartmentPageResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));
    let mut query = SystemDepartmentEntity::find_active_with_condition(condition)
        .select_also(SystemUserEntity)
        .join(JoinType::LeftJoin, Relation::LeaderUser.def());

    let list = query
        .order_by_asc(Column::Sort)
        .all(db).await?;
    Ok(list.into_iter().map(|(data, user_data)|model_to_page_response(data, user_data)).collect())
}

pub async fn enable(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let system_department = SystemDepartmentActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        status: Set(STATUS_ENABLE),
        ..Default::default()
    };
    system_department.update(db).await?;
    Ok(())
}

pub async fn disable(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let system_department = SystemDepartmentActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        status: Set(STATUS_DISABLE),
        ..Default::default()
    };
    system_department.update(db).await?;
    // 下线部门用户
    system_user::offline_department_user(&db, id).await?;
    Ok(())
}

pub async fn find_by_id(db: &DatabaseConnection, id: i64) -> Result<Option<SystemDepartmentModel>> {
    let system_department = SystemDepartmentEntity::find_active_by_id(id)
        .one(db).await?;
    Ok(system_department)
}

pub async fn find_by_ids(db: &DatabaseConnection, ids: Vec<i64>) -> Result<Vec<SystemDepartmentBaseResponse>> {
    let list = SystemDepartmentEntity::find_active()
        .filter(Column::Id.is_in(ids))
        .all(db).await?;
    Ok(list.into_iter().map(model_to_base_response).collect())
}