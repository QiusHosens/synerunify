use std::collections::{HashMap, HashSet};
use common::interceptor::orm::simple_support::SimpleSupport;
use sea_orm::{DatabaseConnection, EntityTrait, Order, ColumnTrait, ActiveModelTrait, PaginatorTrait, QueryOrder, QueryFilter, Condition, DatabaseTransaction};
use crate::model::mall_trade_delivery_express_template_charge::{Model as MallTradeDeliveryExpressTemplateChargeModel, ActiveModel as MallTradeDeliveryExpressTemplateChargeActiveModel, Entity as MallTradeDeliveryExpressTemplateChargeEntity, Column};
use crate::model::mall_trade_delivery_express_template::{Model as MallTradeDeliveryExpressTemplateModel, ActiveModel as MallTradeDeliveryExpressTemplateActiveModel};
use mall_model::request::mall_trade_delivery_express_template_charge::{CreateMallTradeDeliveryExpressTemplateChargeRequest, UpdateMallTradeDeliveryExpressTemplateChargeRequest, PaginatedKeywordRequest};
use mall_model::response::mall_trade_delivery_express_template_charge::MallTradeDeliveryExpressTemplateChargeResponse;
use crate::convert::mall_trade_delivery_express_template_charge::{create_request_to_model, update_request_to_model, model_to_response, update_add_request_to_model};
use anyhow::{Result, anyhow, Context};
use sea_orm::ActiveValue::Set;
use sea_orm::prelude::Expr;
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateMallTradeDeliveryExpressTemplateChargeRequest) -> Result<i64> {
    let mut mall_trade_delivery_express_template_charge = create_request_to_model(&request);
    mall_trade_delivery_express_template_charge.creator = Set(Some(login_user.id));
    mall_trade_delivery_express_template_charge.updater = Set(Some(login_user.id));
    mall_trade_delivery_express_template_charge.tenant_id = Set(login_user.tenant_id);
    let mall_trade_delivery_express_template_charge = mall_trade_delivery_express_template_charge.insert(db).await?;
    Ok(mall_trade_delivery_express_template_charge.id)
}

pub async fn create_batch(db: &DatabaseConnection, txn: &DatabaseTransaction, login_user: LoginUserContext, template_id: i64, requests: Vec<CreateMallTradeDeliveryExpressTemplateChargeRequest>) -> Result<()> {
    let models: Vec<MallTradeDeliveryExpressTemplateChargeActiveModel> = requests
        .into_iter()
        .map(|request| {
            let mut model: MallTradeDeliveryExpressTemplateChargeActiveModel = create_request_to_model(&request);
            model.template_id = Set(template_id);
            model.creator = Set(Some(login_user.id));
            model.updater = Set(Some(login_user.id));
            model.tenant_id = Set(login_user.tenant_id);
            model
        })
        .collect();

    if !models.is_empty() {
        MallTradeDeliveryExpressTemplateChargeEntity::insert_many(models)
            .exec(txn)
            .await
            .with_context(|| "Failed to save charges")?;
    }
    Ok(())
}

pub async fn update_batch(db: &DatabaseConnection, txn: &DatabaseTransaction, login_user: LoginUserContext, template: MallTradeDeliveryExpressTemplateModel, requests: Vec<UpdateMallTradeDeliveryExpressTemplateChargeRequest>) -> Result<()> {
    // 查询已存在运费详情
    let existing_details = MallTradeDeliveryExpressTemplateChargeEntity::find()
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .filter(Column::TemplateId.eq(template.id))
        .all(db)
        .await?;

    // 构造 HashMap 加速查询
    let existing_map: HashMap<i64, MallTradeDeliveryExpressTemplateChargeModel> =
        existing_details.iter().map(|d| (d.id, d.clone())).collect();

    // 拆分请求为新增 / 更新两类
    let (to_add, to_update): (Vec<_>, Vec<_>) = requests.into_iter().partition(|r| r.id.is_none());

    // 所有 id
    let request_detail_ids: HashSet<i64> = to_update.iter().filter_map(|d| d.id).collect();
    let existing_detail_ids: HashSet<i64> = existing_map.keys().copied().collect();

    // 删除的 detail id = 旧的 - 新的
    let to_mark_deleted: Vec<i64> = existing_detail_ids
        .difference(&request_detail_ids)
        .copied()
        .collect();

    // 批量新增
    if !to_add.is_empty() {
        let models: Vec<MallTradeDeliveryExpressTemplateChargeActiveModel> = to_add
            .into_iter()
            .map(|request| {
                let mut model = update_add_request_to_model(&request);
                model.template_id = Set(template.id);
                model.creator = Set(Some(login_user.id));
                model.updater = Set(Some(login_user.id));
                model.tenant_id = Set(template.tenant_id);
                model
            })
            .collect();

        MallTradeDeliveryExpressTemplateChargeEntity::insert_many(models)
            .exec(txn)
            .await
            .with_context(|| "Failed to insert details")?;
    }

    // 批量逻辑删除
    if !to_mark_deleted.is_empty() {
        MallTradeDeliveryExpressTemplateChargeEntity::update_many()
            .col_expr(Column::Deleted, Expr::value(1))
            .col_expr(Column::Updater, Expr::value(login_user.id))
            .filter(Column::TemplateId.eq(template.id))
            .filter(Column::Id.is_in(to_mark_deleted))
            .exec(txn)
            .await?;
    }

    // 批量更新（逐条更新，因内容不一致）
    if !to_update.is_empty() {
        for request in to_update {
            if let Some(id) = request.id {
                if let Some(existing) = existing_map.get(&id) {
                    let mut model = update_request_to_model(&request, existing.clone());
                    model.updater = Set(Some(login_user.id));
                    model.update(txn).await?;
                }
            }
        }
    }

    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let mall_trade_delivery_express_template_charge = MallTradeDeliveryExpressTemplateChargeActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    mall_trade_delivery_express_template_charge.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<MallTradeDeliveryExpressTemplateChargeResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let mall_trade_delivery_express_template_charge = MallTradeDeliveryExpressTemplateChargeEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(mall_trade_delivery_express_template_charge.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<MallTradeDeliveryExpressTemplateChargeResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let paginator = MallTradeDeliveryExpressTemplateChargeEntity::find_active_with_condition(condition)
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<MallTradeDeliveryExpressTemplateChargeResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = MallTradeDeliveryExpressTemplateChargeEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}
