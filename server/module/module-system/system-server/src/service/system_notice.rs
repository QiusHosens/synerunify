use sea_orm::{DatabaseConnection, EntityTrait, ColumnTrait, ActiveModelTrait, PaginatorTrait, QueryOrder, QueryFilter};
use crate::model::system_notice::{Model as SystemNoticeModel, ActiveModel as SystemNoticeActiveModel, Entity as SystemNoticeEntity, Column};
use system_model::request::system_notice::{CreateSystemNoticeRequest, UpdateSystemNoticeRequest, PaginatedKeywordRequest};
use system_model::response::system_notice::SystemNoticeResponse;
use crate::convert::system_notice::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use sea_orm::ActiveValue::Set;
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateSystemNoticeRequest) -> Result<i64> {
    let mut system_notice = create_request_to_model(&request);
    system_notice.creator = Set(Some(login_user.id));
    system_notice.updater = Set(Some(login_user.id));
    system_notice.tenant_id = Set(login_user.tenant_id);
    let system_notice = system_notice.insert(db).await?;
    Ok(system_notice.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateSystemNoticeRequest) -> Result<()> {
    let system_notice = SystemNoticeEntity::find_by_id(request.id)
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut system_notice = update_request_to_model(&request, system_notice);
    system_notice.updater = Set(Some(login_user.id));
    system_notice.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let system_notice = SystemNoticeActiveModel {
        id: Set(id),
        tenant_id: Set(login_user.tenant_id),
        deleted: Set(true),
        ..Default::default()
    };
    system_notice.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<SystemNoticeResponse>> {
    let system_notice = SystemNoticeEntity::find()
        .filter(Column::Id.eq(id))
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .one(db).await?;
    Ok(system_notice.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<SystemNoticeResponse>> {
    let paginator = SystemNoticeEntity::find()
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<SystemNoticeResponse>> {
    let list = SystemNoticeEntity::find()
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}