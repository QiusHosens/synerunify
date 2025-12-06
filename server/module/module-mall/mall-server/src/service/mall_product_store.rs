use std::collections::HashSet;
use common::interceptor::orm::simple_support::SimpleSupport;
use sea_orm::{DatabaseConnection, EntityTrait, Order, ColumnTrait, ActiveModelTrait, PaginatorTrait, QueryOrder, QueryFilter, Condition, DatabaseTransaction};
use crate::model::mall_product_store::{Model as MallProductStoreModel, ActiveModel as MallProductStoreActiveModel, Entity as MallProductStoreEntity, Column};
use mall_model::request::mall_product_store::{CreateMallProductStoreRequest, UpdateMallProductStoreRequest, PaginatedKeywordRequest};
use mall_model::response::mall_product_store::MallProductStoreResponse;
use crate::convert::mall_product_store::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use sea_orm::ActiveValue::Set;
use sea_orm::sea_query::Expr;
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

pub async fn create_batch(db: &DatabaseConnection, login_user: LoginUserContext, product_id: i64, mut store_ids: Vec<i64>) -> Result<()> {
    // 查询已绑定
    let list = list_by_product(db, login_user.clone(), product_id.clone()).await?;
    let exist_store_ids: HashSet<i64> = list.iter().map(|m| m.store_id).collect();
    store_ids.retain(|id| !exist_store_ids.contains(id));
    let models: Vec<MallProductStoreActiveModel> = store_ids.into_iter().map(|store_id| {
        let mut model = MallProductStoreActiveModel {
            product_id: Set(product_id),
            store_id: Set(store_id),
            ..Default::default()
        };
        model.creator = Set(Some(login_user.id));
        model.updater = Set(Some(login_user.id));
        model.tenant_id = Set(login_user.tenant_id);
        model
    }).collect();

    if !models.is_empty() {
        MallProductStoreEntity::insert_many(models)
            .exec(db)
            .await?;
    }
    Ok(())
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

pub async fn delete_batch(db: &DatabaseConnection, login_user: LoginUserContext, product_id: i64, store_ids: Vec<i64>) -> Result<()> {
    if !store_ids.is_empty() {
        MallProductStoreEntity::update_many()
            .col_expr(Column::Deleted, Expr::value(1))
            .col_expr(Column::Updater, Expr::value(login_user.id))
            .filter(Column::ProductId.eq(product_id))
            .filter(Column::StoreId.is_in(store_ids))
            .exec(db)
            .await?;
    }
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

pub async fn list_by_product(db: &DatabaseConnection, login_user: LoginUserContext, product_id: i64) -> Result<Vec<MallProductStoreModel>> {
    let condition = Condition::all()
        .add(Column::ProductId.eq(product_id))
        .add(Column::TenantId.eq(login_user.tenant_id));
    let list = MallProductStoreEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list)
}
