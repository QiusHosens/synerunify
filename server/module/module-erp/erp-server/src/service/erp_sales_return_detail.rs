use std::collections::{HashMap, HashSet};

use common::interceptor::orm::simple_support::SimpleSupport;
use sea_orm::prelude::Expr;
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, DatabaseTransaction, EntityTrait, Order, PaginatorTrait, QueryFilter, QueryOrder};
use crate::model::erp_sales_return_detail::{Model as ErpSalesReturnDetailModel, ActiveModel as ErpSalesReturnDetailActiveModel, Entity as ErpSalesReturnDetailEntity, Column};
use crate::model::erp_sales_return::{Model as ErpSalesReturnModel};
use crate::model::erp_sales_order_detail::{Model as ErpSalesOrderDetailModel};
use crate::service::erp_sales_order_detail;
use erp_model::request::erp_sales_return_detail::{CreateErpSalesReturnDetailRequest, UpdateErpSalesReturnDetailRequest, PaginatedKeywordRequest};
use erp_model::response::erp_sales_return_detail::{ErpSalesReturnDetailBaseResponse, ErpSalesReturnDetailResponse};
use crate::convert::erp_sales_return_detail::{create_request_to_model, model_to_base_response, model_to_response, update_request_to_model};
use anyhow::{anyhow, Context, Result};
use sea_orm::ActiveValue::{NotSet, Set};
use common::constants::enum_constants::{STATUS_DISABLE, STATUS_ENABLE};
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateErpSalesReturnDetailRequest) -> Result<i64> {
    let mut erp_sales_return_detail = create_request_to_model(&request);
    erp_sales_return_detail.creator = Set(Some(login_user.id));
    erp_sales_return_detail.updater = Set(Some(login_user.id));
    erp_sales_return_detail.tenant_id = Set(login_user.tenant_id);
    let erp_sales_return_detail = erp_sales_return_detail.insert(db).await?;
    Ok(erp_sales_return_detail.id)
}

pub async fn create_batch(db: &DatabaseConnection, txn: &DatabaseTransaction, login_user: LoginUserContext, order: ErpSalesReturnModel, requests: Vec<CreateErpSalesReturnDetailRequest>) -> Result<()> {
    let sale_id = order.sales_order_id;
    // 查询销售订单产品详情
    let sale_details = erp_sales_order_detail::find_by_sale_id(&db, login_user.clone(), sale_id).await?;
    let sale_detail_map: HashMap<i64, ErpSalesOrderDetailModel> = sale_details.iter().map(|d| (d.id, d.clone())).collect();
    
    let mut models: Vec<ErpSalesReturnDetailActiveModel> = Vec::new();
    for request in requests {
        if let Some(sale_detail) = sale_detail_map.get(&request.sale_detail_id) {
            let model = ErpSalesReturnDetailActiveModel {
                order_id: Set(order.id),
                sale_detail_id: Set(request.sale_detail_id),
                warehouse_id: Set(request.warehouse_id.clone()),
                product_id: Set(sale_detail.product_id.clone()),
                quantity: Set(request.quantity.clone()),
                unit_price: Set(sale_detail.unit_price.clone()),
                subtotal: Set(sale_detail.subtotal.clone()),
                tax_rate: sale_detail.tax_rate.as_ref().map_or(NotSet, |tax_rate| Set(Some(tax_rate.clone()))),
                remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
                department_id: Set(login_user.department_id.clone()),
                department_code: Set(login_user.department_code.clone()),
                creator: Set(Some(login_user.id)),
                updater: Set(Some(login_user.id)),
                tenant_id: Set(login_user.tenant_id),
                ..Default::default()
            };
            models.push(model);
        }
    }

    if !models.is_empty() {
        ErpSalesReturnDetailEntity::insert_many(models)
            .exec(txn)
            .await
            .with_context(|| "Failed to save detail")?;
    }
    Ok(())
}

pub async fn update_batch(db: &DatabaseConnection, txn: &DatabaseTransaction, login_user: LoginUserContext, order: ErpSalesReturnModel, requests: Vec<UpdateErpSalesReturnDetailRequest>) -> Result<()> {
    // 查询已存在订单详情
    let existing_details = ErpSalesReturnDetailEntity::find()
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .filter(Column::OrderId.eq(order.id))
        .all(db)
        .await?;

    // 构造 HashMap 加速查询
    let existing_map: HashMap<i64, ErpSalesReturnDetailModel> =
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
        let sale_id = order.sales_order_id;
        // 查询销售订单产品详情
        let sale_details = erp_sales_order_detail::find_by_sale_id(&db, login_user.clone(), sale_id).await?;
        let sale_detail_map: HashMap<i64, ErpSalesOrderDetailModel> = sale_details.iter().map(|d| (d.id, d.clone())).collect();

        let mut models: Vec<ErpSalesReturnDetailActiveModel> = Vec::new();
        for request in to_add {
            if let Some(sale_detail) = sale_detail_map.get(&request.sale_detail_id) {
                let model = ErpSalesReturnDetailActiveModel {
                    order_id: Set(order.id),
                    sale_detail_id: Set(request.sale_detail_id),
                    warehouse_id: Set(request.warehouse_id.clone()),
                    product_id: Set(sale_detail.product_id.clone()),
                    quantity: Set(request.quantity.clone()),
                    unit_price: Set(sale_detail.unit_price.clone()),
                    subtotal: Set(sale_detail.subtotal.clone()),
                    tax_rate: sale_detail.tax_rate.as_ref().map_or(NotSet, |tax_rate| Set(Some(tax_rate.clone()))),
                    remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
                    department_id: Set(login_user.department_id.clone()),
                    department_code: Set(login_user.department_code.clone()),
                    creator: Set(Some(login_user.id)),
                    updater: Set(Some(login_user.id)),
                    tenant_id: Set(login_user.tenant_id),
                    ..Default::default()
                };
                models.push(model);
            }
        }

        ErpSalesReturnDetailEntity::insert_many(models)
            .exec(txn)
            .await
            .with_context(|| "Failed to insert details")?;
    }

    // 批量逻辑删除
    if !to_mark_deleted.is_empty() {
        ErpSalesReturnDetailEntity::update_many()
            .col_expr(Column::Deleted, Expr::value(1))
            .col_expr(Column::Updater, Expr::value(login_user.id))
            .filter(Column::OrderId.eq(order.id))
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
    let erp_sales_return_detail = ErpSalesReturnDetailActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    erp_sales_return_detail.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpSalesReturnDetailResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_sales_return_detail = ErpSalesReturnDetailEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(erp_sales_return_detail.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpSalesReturnDetailResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let paginator = ErpSalesReturnDetailEntity::find_active_with_condition(condition)
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<ErpSalesReturnDetailResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = ErpSalesReturnDetailEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

pub async fn list_by_order_id(db: &DatabaseConnection, login_user: LoginUserContext, order_id: i64) -> Result<Vec<ErpSalesReturnDetailBaseResponse>> {
    let list = ErpSalesReturnDetailEntity::find_active()
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .filter(Column::OrderId.eq(order_id))
        .all(db).await?;
    Ok(list.into_iter().map(model_to_base_response).collect())
}