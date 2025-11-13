use common::interceptor::orm::simple_support::SimpleSupport;
use sea_orm::{DatabaseConnection, EntityTrait, Order, ColumnTrait, ActiveModelTrait, PaginatorTrait, QueryOrder, QueryFilter, Condition};
use crate::model::mall_product_store::{Model as MallProductStoreModel, ActiveModel as MallProductStoreActiveModel, Entity as MallProductStoreEntity, Column};
use mall_model::request::mall_product_store::{CreateMallProductStoreRequest, UpdateMallProductStoreRequest, PaginatedKeywordRequest};
use mall_model::response::mall_product_store::MallProductStoreResponse;
use crate::convert::mall_product_store::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use sea_orm::ActiveValue::Set;
use common::constants::enum_constants::{STATUS_DISABLE, STATUS_ENABLE};
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateMallProductStoreRequest) -> Result<i64> {
    let mut mall_product_store = create_request_to_model(&request);
    mall_product_store.creator = Set(Some(login_user.id));
    mall_product_store.updater = Set(Some(login_user.id));
    mall_product_store.tenant_id = Set(login_user.tenant_id);
    let mall_product_store = mall_product_store.insert(db).await?;
    Ok(mall_product_store.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateMallProductStoreRequest) -> Result<()> {
    let mall_product_store = MallProductStoreEntity::find_by_id(request.id)
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut mall_product_store = update_request_to_model(&request, mall_product_store);
    mall_product_store.updater = Set(Some(login_user.id));
    mall_product_store.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let mall_product_store = MallProductStoreActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    mall_product_store.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<MallProductStoreResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let mall_product_store = MallProductStoreEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(mall_product_store.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<MallProductStoreResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let paginator = MallProductStoreEntity::find_active_with_condition(condition)
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<MallProductStoreResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = MallProductStoreEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}
