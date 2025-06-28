use std::collections::{HashMap, HashSet};

use common::interceptor::orm::simple_support::SimpleSupport;
use sea_orm::prelude::Expr;
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, DatabaseTransaction, EntityTrait, Order, PaginatorTrait, QueryFilter, QueryOrder};
use crate::model::erp_receipt_detail::{Model as ErpReceiptDetailModel, ActiveModel as ErpReceiptDetailActiveModel, Entity as ErpReceiptDetailEntity, Column};
use crate::model::erp_receipt::{Model as ErpReceiptModel};
use erp_model::request::erp_receipt_detail::{CreateErpReceiptDetailRequest, UpdateErpReceiptDetailRequest, PaginatedKeywordRequest};
use erp_model::response::erp_receipt_detail::{ErpReceiptDetailBaseResponse, ErpReceiptDetailResponse};
use crate::convert::erp_receipt_detail::{create_request_to_model, model_to_base_response, model_to_response, update_add_request_to_model, update_request_to_model};
use anyhow::{anyhow, Context, Result};
use sea_orm::ActiveValue::Set;
use common::constants::enum_constants::{STATUS_DISABLE, STATUS_ENABLE};
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateErpReceiptDetailRequest) -> Result<i64> {
    let mut erp_receipt_detail = create_request_to_model(&request);
    erp_receipt_detail.creator = Set(Some(login_user.id));
    erp_receipt_detail.updater = Set(Some(login_user.id));
    erp_receipt_detail.tenant_id = Set(login_user.tenant_id);
    let erp_receipt_detail = erp_receipt_detail.insert(db).await?;
    Ok(erp_receipt_detail.id)
}

pub async fn create_batch(db: &DatabaseConnection, txn: &DatabaseTransaction, login_user: LoginUserContext, order_id: i64, requests: Vec<CreateErpReceiptDetailRequest>) -> Result<()> {
    let models: Vec<ErpReceiptDetailActiveModel> = requests
        .into_iter()
        .map(|request| {
            let mut model: ErpReceiptDetailActiveModel = create_request_to_model(&request);
            model.receipt_id = Set(order_id);
            model.department_id = Set(login_user.department_id);
            model.department_code = Set(login_user.department_code.clone());
            model.creator = Set(Some(login_user.id));
            model.updater = Set(Some(login_user.id));
            model.tenant_id = Set(login_user.tenant_id);
            model
        })
        .collect();

    if !models.is_empty() {
        ErpReceiptDetailEntity::insert_many(models)
            .exec(txn)
            .await
            .with_context(|| "Failed to save detail")?;
    }
    Ok(())
}

pub async fn update_batch(db: &DatabaseConnection, txn: &DatabaseTransaction, login_user: LoginUserContext, order: ErpReceiptModel, requests: Vec<UpdateErpReceiptDetailRequest>) -> Result<()> {
    // 查询已存在订单详情
    let existing_details = ErpReceiptDetailEntity::find()
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .filter(Column::ReceiptId.eq(order.id))
        .all(db)
        .await?;

    // 构造 HashMap 加速查询
    let existing_map: HashMap<i64, ErpReceiptDetailModel> =
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
        let models: Vec<ErpReceiptDetailActiveModel> = to_add
            .into_iter()
            .map(|request| {
                let mut model = update_add_request_to_model(&request);
                model.receipt_id = Set(order.id);
                model.department_id = Set(order.department_id);
                model.department_code = Set(order.department_code.clone());
                model.creator = Set(Some(login_user.id));
                model.updater = Set(Some(login_user.id));
                model.tenant_id = Set(order.tenant_id);
                model
            })
            .collect();

        ErpReceiptDetailEntity::insert_many(models)
            .exec(txn)
            .await
            .with_context(|| "Failed to insert details")?;
    }

    // 批量逻辑删除
    if !to_mark_deleted.is_empty() {
        ErpReceiptDetailEntity::update_many()
            .col_expr(Column::Deleted, Expr::value(1))
            .col_expr(Column::Updater, Expr::value(login_user.id))
            .filter(Column::ReceiptId.eq(order.id))
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
    let erp_receipt_detail = ErpReceiptDetailActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    erp_receipt_detail.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpReceiptDetailResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_receipt_detail = ErpReceiptDetailEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(erp_receipt_detail.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpReceiptDetailResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let paginator = ErpReceiptDetailEntity::find_active_with_condition(condition)
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<ErpReceiptDetailResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = ErpReceiptDetailEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

pub async fn list_by_order_id(db: &DatabaseConnection, login_user: LoginUserContext, order_id: i64) -> Result<Vec<ErpReceiptDetailBaseResponse>> {
    let list = ErpReceiptDetailEntity::find_active()
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .filter(Column::ReceiptId.eq(order_id))
        .all(db).await?;
    Ok(list.into_iter().map(model_to_base_response).collect())
}