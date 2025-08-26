use common::interceptor::orm::simple_support::SimpleSupport;
use sea_orm::{DatabaseConnection, EntityTrait, Order, ColumnTrait, ActiveModelTrait, PaginatorTrait, QueryOrder, QueryFilter, Condition, TransactionTrait};
use crate::model::mall_product_property::{Model as MallProductPropertyModel, ActiveModel as MallProductPropertyActiveModel, Entity as MallProductPropertyEntity, Column};
use mall_model::request::mall_product_property::{CreateMallProductPropertyRequest, UpdateMallProductPropertyRequest, PaginatedKeywordRequest};
use mall_model::response::mall_product_property::{MallProductPropertyBaseResponse, MallProductPropertyResponse};
use crate::convert::mall_product_property::{create_request_to_model, update_request_to_model, model_to_response, model_to_base_response};
use anyhow::{Result, anyhow, Context};
use sea_orm::ActiveValue::Set;
use common::constants::enum_constants::{STATUS_DISABLE, STATUS_ENABLE};
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;
use crate::service::mall_product_property_value;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateMallProductPropertyRequest) -> Result<i64> {
    let mut mall_product_property = create_request_to_model(&request);
    mall_product_property.creator = Set(Some(login_user.id));
    mall_product_property.updater = Set(Some(login_user.id));
    mall_product_property.tenant_id = Set(login_user.tenant_id);

    // 开启事务
    let txn = db.begin().await?;
    // 创建属性
    let mall_product_property = mall_product_property.insert(&txn).await?;
    // 创建属性值
    mall_product_property_value::create_batch(&db, &txn, login_user.clone(), mall_product_property.id, request.values).await?;
    // 提交事务
    txn.commit().await.with_context(|| "Failed to commit transaction")?;
    Ok(mall_product_property.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateMallProductPropertyRequest) -> Result<()> {
    let mall_product_property = MallProductPropertyEntity::find_by_id(request.id)
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let product_property = mall_product_property.clone();

    let mut mall_product_property = update_request_to_model(&request, mall_product_property);
    mall_product_property.updater = Set(Some(login_user.id));
    // 开启事务
    let txn = db.begin().await?;
    // 修改属性
    mall_product_property.update(&txn).await?;
    // 修改属性值
    mall_product_property_value::update_batch(&db, &txn, login_user.clone(), product_property, request.values).await?;
    // 提交事务
    txn.commit().await.with_context(|| "Failed to commit transaction")?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let mall_product_property = MallProductPropertyActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    mall_product_property.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<MallProductPropertyResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let mall_product_property = MallProductPropertyEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(mall_product_property.map(model_to_response))
}

pub async fn get_base_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<MallProductPropertyBaseResponse>> {
    let condition = Condition::all()
        .add(Column::Id.eq(id))
        .add(Column::TenantId.eq(login_user.tenant_id));

    let mall_product_property = MallProductPropertyEntity::find_active_with_condition(condition)
        .one(db).await?;
    if mall_product_property.is_none() {
        return Ok(None);
    }
    let mall_product_property = mall_product_property.unwrap();

    let values = mall_product_property_value::list_by_property_id(&db, login_user.clone(), id).await?;

    Ok(Some(model_to_base_response(mall_product_property, values)))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<MallProductPropertyResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let paginator = MallProductPropertyEntity::find_active_with_condition(condition)
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<MallProductPropertyResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = MallProductPropertyEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

pub async fn enable(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let mall_product_property = MallProductPropertyActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        status: Set(STATUS_ENABLE),
        ..Default::default()
    };
    mall_product_property.update(db).await?;
    Ok(())
}

pub async fn disable(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let mall_product_property = MallProductPropertyActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        status: Set(STATUS_DISABLE),
        ..Default::default()
    };
    mall_product_property.update(db).await?;
    Ok(())
}