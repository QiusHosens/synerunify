use common::interceptor::orm::simple_support::SimpleSupport;
use sea_orm::{DatabaseConnection, EntityTrait, Order, ColumnTrait, ActiveModelTrait, PaginatorTrait, QueryOrder, QueryFilter, Condition};
use crate::model::mall_store::{Model as MallStoreModel, ActiveModel as MallStoreActiveModel, Entity as MallStoreEntity, Column};
use mall_model::request::mall_store::{CreateMallStoreRequest, UpdateMallStoreRequest, PaginatedKeywordRequest, RejectMallStoreRequest};
use mall_model::response::mall_store::MallStoreResponse;
use crate::convert::mall_store::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use chrono::Utc;
use sea_orm::ActiveValue::Set;
use common::constants::enum_constants::{STATUS_DISABLE, STATUS_ENABLE, STORE_STATUS_OPENING, STORE_STATUS_PAUSE, STORE_STATUS_REVIEW_ACCEPT, STORE_STATUS_REVIEW_PENDING, STORE_STATUS_REVIEW_REJECTED};
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;
use common::utils::snowflake_generator::SnowflakeGenerator;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateMallStoreRequest) -> Result<i64> {
    let mut mall_store = create_request_to_model(&request);

    // 生成店铺编号
    let generator = SnowflakeGenerator::new();
    match generator.generate() {
        Ok(id) => mall_store.number = Set(format!("S{}", id)),
        Err(e) => return Err(anyhow!("店铺编号生成失败")),
    }

    mall_store.status = Set(STORE_STATUS_REVIEW_PENDING);
    mall_store.score_desc = Set(Some(0));
    mall_store.score_service = Set(Some(0));
    mall_store.score_delivery = Set(Some(0));
    mall_store.total_sales_amount = Set(Some(0));
    mall_store.total_order_count = Set(Some(0));
    mall_store.total_goods_count = Set(Some(0));
    mall_store.total_fans_count = Set(Some(0));

    mall_store.creator = Set(Some(login_user.id));
    mall_store.updater = Set(Some(login_user.id));
    mall_store.tenant_id = Set(login_user.tenant_id);
    let mall_store = mall_store.insert(db).await?;
    Ok(mall_store.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateMallStoreRequest) -> Result<()> {
    let mall_store = MallStoreEntity::find_by_id(request.id)
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut mall_store = update_request_to_model(&request, mall_store);
    mall_store.status = Set(STORE_STATUS_REVIEW_PENDING);
    mall_store.updater = Set(Some(login_user.id));
    mall_store.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let mall_store = MallStoreActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    mall_store.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<MallStoreResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let mall_store = MallStoreEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(mall_store.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<MallStoreResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let paginator = MallStoreEntity::find_active_with_condition(condition)
        .support_filter(params.base.filter_field, params.base.filter_operator, params.base.filter_value)
        .support_order(params.base.sort_field, params.base.sort, Some(vec![(Column::Id, Order::Asc)]))
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<MallStoreResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = MallStoreEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

pub async fn enable(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let mall_store = MallStoreActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        status: Set(STORE_STATUS_OPENING),
        ..Default::default()
    };
    mall_store.update(db).await?;
    Ok(())
}

pub async fn disable(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let mall_store = MallStoreActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        status: Set(STORE_STATUS_PAUSE),
        ..Default::default()
    };
    mall_store.update(db).await?;
    Ok(())
}

pub async fn accept(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let mall_store = MallStoreActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        status: Set(STORE_STATUS_REVIEW_ACCEPT),
        audit_time: Set(Some(Utc::now().naive_utc())),
        ..Default::default()
    };
    mall_store.update(db).await?;
    Ok(())
}

pub async fn reject(db: &DatabaseConnection, login_user: LoginUserContext, request: RejectMallStoreRequest) -> Result<()> {
    let mall_store = MallStoreEntity::find_by_id(request.id)
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut active_model: MallStoreActiveModel = mall_store.into();
    active_model.status = Set(STORE_STATUS_REVIEW_REJECTED);
    if let Some(audit_remark) = request.audit_remark {
        active_model.audit_remark = Set(Some(audit_remark));
    }
    active_model.updater = Set(Some(login_user.id));
    active_model.update(db).await?;
    Ok(())
}