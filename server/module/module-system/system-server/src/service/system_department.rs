use sea_orm::{DatabaseConnection, EntityTrait, ColumnTrait, ActiveModelTrait, PaginatorTrait, QueryOrder, QueryFilter};
use crate::model::system_department::{Model as SystemDepartmentModel, ActiveModel as SystemDepartmentActiveModel, Entity as SystemDepartmentEntity, Column};
use system_model::request::system_department::{CreateSystemDepartmentRequest, UpdateSystemDepartmentRequest, PaginatedKeywordRequest};
use system_model::response::system_department::SystemDepartmentResponse;
use crate::convert::system_department::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use sea_orm::ActiveValue::Set;
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateSystemDepartmentRequest) -> Result<i64> {
    let mut system_department = create_request_to_model(&request);
    system_department.creator = Set(Some(login_user.id));
    system_department.updater = Set(Some(login_user.id));
    system_department.tenant_id = Set(login_user.tenant_id);
    let system_department = system_department.insert(db).await?;
    Ok(system_department.id)
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
        deleted: Set(true),
        ..Default::default()
    };
    system_department.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<SystemDepartmentResponse>> {
    let system_department = SystemDepartmentEntity::find()
        .filter(Column::Id.eq(id))
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .one(db).await?;
    Ok(system_department.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<SystemDepartmentResponse>> {
    let paginator = SystemDepartmentEntity::find()
        .filter(Column::TenantId.eq(login_user.tenant_id))
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
    let list = SystemDepartmentEntity::find()
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

pub async fn find_by_id(db: &DatabaseConnection, id: i64) -> Result<Option<SystemDepartmentModel>> {
    let system_department = SystemDepartmentEntity::find_by_id(id).one(db).await?;
    Ok(system_department)
}