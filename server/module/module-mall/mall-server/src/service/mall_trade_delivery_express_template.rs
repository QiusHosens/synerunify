use common::interceptor::orm::simple_support::SimpleSupport;
use sea_orm::{DatabaseConnection, EntityTrait, Order, ColumnTrait, ActiveModelTrait, PaginatorTrait, QueryOrder, QueryFilter, Condition, TransactionTrait};
use crate::model::mall_trade_delivery_express_template::{Model as MallTradeDeliveryExpressTemplateModel, ActiveModel as MallTradeDeliveryExpressTemplateActiveModel, Entity as MallTradeDeliveryExpressTemplateEntity, Column};
use mall_model::request::mall_trade_delivery_express_template::{CreateMallTradeDeliveryExpressTemplateRequest, UpdateMallTradeDeliveryExpressTemplateRequest, PaginatedKeywordRequest};
use mall_model::response::mall_trade_delivery_express_template::{MallTradeDeliveryExpressTemplateBaseResponse, MallTradeDeliveryExpressTemplateResponse};
use crate::convert::mall_trade_delivery_express_template::{create_request_to_model, update_request_to_model, model_to_response, model_to_base_response};
use anyhow::{Result, anyhow, Context};
use sea_orm::ActiveValue::Set;
use common::constants::enum_constants::{STATUS_DISABLE, STATUS_ENABLE};
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;
use crate::service::{mall_trade_delivery_express_template_charge, mall_trade_delivery_express_template_free};

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateMallTradeDeliveryExpressTemplateRequest) -> Result<i64> {
    let mut mall_trade_delivery_express_template = create_request_to_model(&request);
    mall_trade_delivery_express_template.creator = Set(Some(login_user.id));
    mall_trade_delivery_express_template.updater = Set(Some(login_user.id));
    mall_trade_delivery_express_template.tenant_id = Set(login_user.tenant_id);

    // 开启事务
    let txn = db.begin().await?;
    // 创建模板
    let mall_trade_delivery_express_template = mall_trade_delivery_express_template.insert(&txn).await?;
    // 创建运费
    mall_trade_delivery_express_template_charge::create_batch(&db, &txn, login_user.clone(), mall_trade_delivery_express_template.id, request.charges).await?;
    // 创建包邮
    mall_trade_delivery_express_template_free::create_batch(&db, &txn, login_user.clone(), mall_trade_delivery_express_template.id, request.frees).await?;
    // 提交事务
    txn.commit().await.with_context(|| "Failed to commit transaction")?;
    Ok(mall_trade_delivery_express_template.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateMallTradeDeliveryExpressTemplateRequest) -> Result<()> {
    let mall_trade_delivery_express_template = MallTradeDeliveryExpressTemplateEntity::find_by_id(request.id)
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let template = mall_trade_delivery_express_template.clone();

    let mut mall_trade_delivery_express_template = update_request_to_model(&request, mall_trade_delivery_express_template);
    mall_trade_delivery_express_template.updater = Set(Some(login_user.id));

    // 开启事务
    let txn = db.begin().await?;
    // 更新模板
    mall_trade_delivery_express_template.update(&txn).await?;
    // 更新运费
    mall_trade_delivery_express_template_charge::update_batch(&db, &txn, login_user.clone(), template.clone(), request.charges).await?;
    // 更新包邮
    mall_trade_delivery_express_template_free::update_batch(&db, &txn, login_user.clone(), template, request.frees).await?;
    // 提交事务
    txn.commit().await.with_context(|| "Failed to commit transaction")?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let mall_trade_delivery_express_template = MallTradeDeliveryExpressTemplateActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    mall_trade_delivery_express_template.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<MallTradeDeliveryExpressTemplateResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let mall_trade_delivery_express_template = MallTradeDeliveryExpressTemplateEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(mall_trade_delivery_express_template.map(model_to_response))
}

pub async fn get_base_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<MallTradeDeliveryExpressTemplateBaseResponse>> {
    let condition = Condition::all()
        .add(Column::Id.eq(id))
        .add(Column::TenantId.eq(login_user.tenant_id));

    let mall_trade_delivery_express_template = MallTradeDeliveryExpressTemplateEntity::find_active_with_condition(condition)
        .one(db).await?;
    if mall_trade_delivery_express_template.is_none() {
        return Ok(None);
    }
    let mall_trade_delivery_express_template = mall_trade_delivery_express_template.unwrap();
    let charges = mall_trade_delivery_express_template_charge::list_base_by_template_id(&db, login_user.clone(), id).await?;
    let frees = mall_trade_delivery_express_template_free::list_base_by_template_id(&db, login_user.clone(), id).await?;
    Ok(Some(model_to_base_response(mall_trade_delivery_express_template, charges, frees)))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<MallTradeDeliveryExpressTemplateResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let paginator = MallTradeDeliveryExpressTemplateEntity::find_active_with_condition(condition)
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<MallTradeDeliveryExpressTemplateResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = MallTradeDeliveryExpressTemplateEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

pub async fn enable(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let mall_trade_delivery_express_template = MallTradeDeliveryExpressTemplateActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        status: Set(STATUS_ENABLE),
        ..Default::default()
    };
    mall_trade_delivery_express_template.update(db).await?;
    Ok(())
}

pub async fn disable(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let mall_trade_delivery_express_template = MallTradeDeliveryExpressTemplateActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        status: Set(STATUS_DISABLE),
        ..Default::default()
    };
    mall_trade_delivery_express_template.update(db).await?;
    Ok(())
}

pub async fn find_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<MallTradeDeliveryExpressTemplateModel>> {
    let condition = Condition::all()
        .add(Column::Id.eq(id))
        .add(Column::TenantId.eq(login_user.tenant_id));

    let mall_trade_delivery_express_template = MallTradeDeliveryExpressTemplateEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(mall_trade_delivery_express_template)
}

pub async fn find_by_id_without_user(db: &DatabaseConnection, id: i64) -> Result<Option<MallTradeDeliveryExpressTemplateModel>> {
    let condition = Condition::all()
        .add(Column::Id.eq(id));

    let mall_trade_delivery_express_template = MallTradeDeliveryExpressTemplateEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(mall_trade_delivery_express_template)
}