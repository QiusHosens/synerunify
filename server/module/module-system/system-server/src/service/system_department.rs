use common::constants::enum_constants::{DEPARTMENT_ROOT_ID, DEPARTMENT_ROOT_CODE, STATUS_ENABLE};
use common::utils::string_utils::get_next_code;
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, DatabaseTransaction, EntityTrait, PaginatorTrait, QueryFilter, QueryOrder, QuerySelect};
use crate::model::system_department::{Model as SystemDepartmentModel, ActiveModel as SystemDepartmentActiveModel, Entity as SystemDepartmentEntity, Column};
use system_model::request::system_department::{CreateSystemDepartmentRequest, UpdateSystemDepartmentRequest, PaginatedKeywordRequest};
use system_model::response::system_department::SystemDepartmentResponse;
use crate::convert::system_department::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use sea_orm::ActiveValue::Set;
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateSystemDepartmentRequest) -> Result<i64> {
    let mut system_department = create_request_to_model(&request);
    system_department.creator = Set(Some(login_user.id));
    system_department.updater = Set(Some(login_user.id));
    system_department.tenant_id = Set(login_user.tenant_id);
    let system_department = system_department.insert(db).await?;
    Ok(system_department.id)
}

/// 创建租户根部门
pub async fn create_tenant_root(db: &DatabaseConnection, txn: &DatabaseTransaction, login_user: LoginUserContext, name: String, tenant_id: i64) -> Result<SystemDepartmentModel> {
    // 查询code
    let max_code: Option<String> = SystemDepartmentEntity::find()
        .select_only()
        .column(Column::Code)
        .filter(Column::ParentId.eq(DEPARTMENT_ROOT_ID))
        .order_by_desc(Column::Id)
        .limit(1)
        .one(db)
        .await?
        .map(|x| x.code);
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
    let system_department = system_department.insert(txn).await?;
    Ok(system_department)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateSystemDepartmentRequest) -> Result<()> {
    let system_department = SystemDepartmentEntity::find_by_id(request.id)
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
        tenant_id: Set(login_user.tenant_id),
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<SystemDepartmentResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = SystemDepartmentEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

pub async fn find_by_id(db: &DatabaseConnection, id: i64) -> Result<Option<SystemDepartmentModel>> {
    let system_department = SystemDepartmentEntity::find_active_by_id(id)
        .one(db).await?;
    Ok(system_department)
}