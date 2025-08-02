use common::interceptor::orm::simple_support::SimpleSupport;
use sea_orm::{DatabaseConnection, EntityTrait, Order, ColumnTrait, ActiveModelTrait, PaginatorTrait, QueryOrder, QueryFilter, Condition};
use crate::model::mall_trade_order_item::{Model as MallTradeOrderItemModel, ActiveModel as MallTradeOrderItemActiveModel, Entity as MallTradeOrderItemEntity, Column};
use mall_model::request::mall_trade_order_item::{CreateMallTradeOrderItemRequest, UpdateMallTradeOrderItemRequest, PaginatedKeywordRequest};
use mall_model::response::mall_trade_order_item::MallTradeOrderItemResponse;
use crate::convert::mall_trade_order_item::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use sea_orm::ActiveValue::Set;
use common::constants::enum_constants::{STATUS_DISABLE, STATUS_ENABLE};
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateMallTradeOrderItemRequest) -> Result<i64> {
    let mut mall_trade_order_item = create_request_to_model(&request);
    mall_trade_order_item.creator = Set(Some(login_user.id));
    mall_trade_order_item.updater = Set(Some(login_user.id));
    mall_trade_order_item.tenant_id = Set(login_user.tenant_id);
    let mall_trade_order_item = mall_trade_order_item.insert(db).await?;
    Ok(mall_trade_order_item.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateMallTradeOrderItemRequest) -> Result<()> {
    let mall_trade_order_item = MallTradeOrderItemEntity::find_by_id(request.id)
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut mall_trade_order_item = update_request_to_model(&request, mall_trade_order_item);
    mall_trade_order_item.updater = Set(Some(login_user.id));
    mall_trade_order_item.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let mall_trade_order_item = MallTradeOrderItemActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    mall_trade_order_item.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<MallTradeOrderItemResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let mall_trade_order_item = MallTradeOrderItemEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(mall_trade_order_item.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<MallTradeOrderItemResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let paginator = MallTradeOrderItemEntity::find_active_with_condition(condition)
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<MallTradeOrderItemResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = MallTradeOrderItemEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}
