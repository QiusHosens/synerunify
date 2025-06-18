use std::collections::{HashMap, HashSet};

use axum::http::request;
use common::interceptor::orm::simple_support::SimpleSupport;
use erp_model::request::erp_inventory_record::ErpInventoryRecordInRequest;
use erp_model::request::erp_product_inventory::{CreateErpProductInventoryRequest, ErpProductInventoryInOutRequest};
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, DatabaseTransaction, EntityTrait, Order, PaginatorTrait, QueryFilter, QueryOrder};
use crate::model::erp_inbound_order_detail::{Model as ErpInboundOrderDetailModel, ActiveModel as ErpInboundOrderDetailActiveModel, Entity as ErpInboundOrderDetailEntity, Column};
use crate::model::erp_inbound_order::{Model as ErpInboundOrderModel};
use crate::model::erp_purchase_order_detail::{Model as ErpPurchaseOrderDetailModel};
use crate::service::{erp_inventory_record, erp_product_inventory, erp_purchase_order_detail};
use erp_model::request::erp_inbound_order_detail::{CreateErpInboundOrderDetailOtherRequest, CreateErpInboundOrderDetailPurchaseRequest, CreateErpInboundOrderDetailRequest, PaginatedKeywordRequest, UpdateErpInboundOrderDetailPurchaseRequest, UpdateErpInboundOrderDetailRequest};
use erp_model::response::erp_inbound_order_detail::ErpInboundOrderDetailResponse;
use crate::convert::erp_inbound_order_detail::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{anyhow, Context, Result};
use sea_orm::ActiveValue::{NotSet, Set};
use common::constants::enum_constants::{STATUS_DISABLE, STATUS_ENABLE};
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateErpInboundOrderDetailRequest) -> Result<i64> {
    let mut erp_inbound_order_detail = create_request_to_model(&request);
    erp_inbound_order_detail.creator = Set(Some(login_user.id));
    erp_inbound_order_detail.updater = Set(Some(login_user.id));
    erp_inbound_order_detail.tenant_id = Set(login_user.tenant_id);
    let erp_inbound_order_detail = erp_inbound_order_detail.insert(db).await?;
    Ok(erp_inbound_order_detail.id)
}

pub async fn create_batch_purchase(db: &DatabaseConnection, txn: &DatabaseTransaction, login_user: LoginUserContext, order: ErpInboundOrderModel, requests: Vec<CreateErpInboundOrderDetailPurchaseRequest>) -> Result<()> {
    let purchase_id = order.purchase_id.ok_or_else(|| anyhow!("订单产品不匹配"))?;
    // 查询采购订单产品详情与入库订单详情是否符合,不符合报错
    let purchase_details = erp_purchase_order_detail::find_by_purchase_id(&db, login_user.clone(), purchase_id).await?;
    let request_detail_ids: HashSet<i64> = requests.iter().map(|d|d.purchase_detail_id).collect();
    let purchase_detail_ids: HashSet<i64> = purchase_details.iter().map(|d|d.id).collect();
    if request_detail_ids != purchase_detail_ids {
        return Err(anyhow!("订单产品不匹配"));
    }
    let purchase_detail_map: HashMap<i64, ErpPurchaseOrderDetailModel> =
        purchase_details.iter().map(|d| (d.id, d.clone())).collect();
    let mut models: Vec<ErpInboundOrderDetailActiveModel> = Vec::new();
    let mut product_inventories: Vec<ErpProductInventoryInOutRequest> = Vec::new();
    let mut inbound_inventories: Vec<ErpInventoryRecordInRequest> = Vec::new();
    for request in requests {
        if let Some(purchase_detail) = purchase_detail_map.get(&request.purchase_detail_id) {
            let model = ErpInboundOrderDetailActiveModel {
                order_id: Set(order.id),
                purchase_detail_id: Set(Some((request.purchase_detail_id))),
                warehouse_id: Set(request.warehouse_id.clone()),
                product_id: Set(purchase_detail.product_id.clone()),
                quantity: Set(purchase_detail.quantity.clone()),
                unit_price: Set(purchase_detail.unit_price.clone()),
                subtotal: Set(purchase_detail.subtotal.clone()),
                tax_rate: purchase_detail.tax_rate.as_ref().map_or(NotSet, |tax_rate| Set(Some(tax_rate.clone()))),
                remarks: purchase_detail.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
                department_id: Set(login_user.department_id.clone()),
                department_code: Set(login_user.department_code.clone()),
                creator: Set(Some(login_user.id)),
                updater: Set(Some(login_user.id)),
                tenant_id: Set(login_user.tenant_id),
                ..Default::default()
            };
            models.push(model);

            // 产品库存
            let product_inventory = ErpProductInventoryInOutRequest {
                product_id: purchase_detail.product_id.clone(),
                warehouse_id: request.warehouse_id.clone(),
                quantity: purchase_detail.quantity.clone(),
            };
            product_inventories.push(product_inventory);

            // 入库记录
            let inbound_inventory = ErpInventoryRecordInRequest {
                product_id: purchase_detail.product_id.clone(),
                warehouse_id: request.warehouse_id.clone(),
                quantity: purchase_detail.quantity.clone(),
                record_date: order.inbound_date.clone(),
                remarks: purchase_detail.remarks.clone(),
            };
            inbound_inventories.push(inbound_inventory);
        }
    }

    if !models.is_empty() {
        ErpInboundOrderDetailEntity::insert_many(models)
            .exec(txn)
            .await
            .with_context(|| "Failed to save detail")?;

        // 修改产品库存
        erp_product_inventory::inbound(&db, txn, login_user.clone(), product_inventories).await?;
        // 增加库存记录
        erp_inventory_record::inbound(&db, txn, login_user, inbound_inventories).await?;
    }
    Ok(())
}

pub async fn create_batch_other(db: &DatabaseConnection, txn: &DatabaseTransaction, login_user: LoginUserContext, order: ErpInboundOrderModel, requests: Vec<CreateErpInboundOrderDetailOtherRequest>) -> Result<()> {
    let purchase_id = order.purchase_id.ok_or_else(|| anyhow!("订单产品不匹配"))?;

    let mut models: Vec<ErpInboundOrderDetailActiveModel> = Vec::new();
    let mut product_inventories: Vec<ErpProductInventoryInOutRequest> = Vec::new();
    let mut inbound_inventories: Vec<ErpInventoryRecordInRequest> = Vec::new();
    for request in requests {
        let model = ErpInboundOrderDetailActiveModel {
            order_id: Set(order.id),
            warehouse_id: Set(request.warehouse_id.clone()),
            product_id: Set(request.product_id.clone()),
            quantity: Set(request.quantity.clone()),
            unit_price: Set(request.unit_price.clone()),
            subtotal: Set(request.subtotal.clone()),
            tax_rate: request.tax_rate.as_ref().map_or(NotSet, |tax_rate| Set(Some(tax_rate.clone()))),
            remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
            department_id: Set(login_user.department_id.clone()),
            department_code: Set(login_user.department_code.clone()),
            creator: Set(Some(login_user.id)),
            updater: Set(Some(login_user.id)),
            tenant_id: Set(login_user.tenant_id),
            ..Default::default()
        };
        models.push(model);

        // 产品库存
        let product_inventory = ErpProductInventoryInOutRequest {
            product_id: request.product_id.clone(),
            warehouse_id: request.warehouse_id.clone(),
            quantity: request.quantity.clone(),
        };
        product_inventories.push(product_inventory);

        // 入库记录
        let inbound_inventory = ErpInventoryRecordInRequest {
            product_id: request.product_id.clone(),
            warehouse_id: request.warehouse_id.clone(),
            quantity: request.quantity.clone(),
            record_date: order.inbound_date.clone(),
            remarks: request.remarks.clone(),
        };
        inbound_inventories.push(inbound_inventory);
    }

    if !models.is_empty() {
        ErpInboundOrderDetailEntity::insert_many(models)
            .exec(txn)
            .await
            .with_context(|| "Failed to save detail")?;

        // 修改产品库存
        erp_product_inventory::inbound(&db, txn, login_user.clone(), product_inventories).await?;
        // 增加库存记录
        erp_inventory_record::inbound(&db, txn, login_user, inbound_inventories).await?;
    }
    Ok(())
}

pub async fn update_batch_purchase(db: &DatabaseConnection, txn: &DatabaseTransaction, login_user: LoginUserContext, order: ErpInboundOrderModel, requests: Vec<UpdateErpInboundOrderDetailPurchaseRequest>) -> Result<()> {
    let purchase_id = order.purchase_id.ok_or_else(|| anyhow!("订单产品不匹配"))?;
    // 查询采购订单产品详情与入库订单详情是否符合,不符合报错
    let purchase_details = erp_purchase_order_detail::find_by_purchase_id(&db, login_user.clone(), purchase_id).await?;
    
    let request_map: HashMap<i64, &UpdateErpInboundOrderDetailPurchaseRequest> = requests.iter().map(|d| (d.purchase_detail_id, d)).collect();
    let purchase_detail_map: HashMap<i64, &ErpPurchaseOrderDetailModel> = purchase_details.iter().map(|d| (d.id, d)).collect();

    if request_map.keys().collect::<HashSet<_>>() != purchase_detail_map.keys().collect::<HashSet<_>>() {
        return Err(anyhow!("订单产品不匹配"));
    }

    // 查询已存在订单详情
    let existing_details = ErpInboundOrderDetailEntity::find()
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .filter(Column::OrderId.eq(order.id))
        .all(db)
        .await?;

    // 更新
    for existing_detail in existing_details {
        if let Some(purchase_detail_id) = existing_detail.purchase_detail_id {
            let mut active_model: ErpInboundOrderDetailActiveModel = existing_detail.into();
            if let Some(request) = request_map.get(&purchase_detail_id) {
                active_model.purchase_detail_id = Set(Some((request.purchase_detail_id)));
                active_model.warehouse_id = Set(request.warehouse_id.clone())
            }
            if let Some(purchase_detail) = purchase_detail_map.get(&purchase_detail_id) {
                active_model.product_id = Set(purchase_detail.product_id.clone());
                active_model.quantity = Set(purchase_detail.quantity.clone());
                active_model.unit_price = Set(purchase_detail.unit_price.clone());
                active_model.subtotal = Set(purchase_detail.subtotal.clone());
                if let Some(tax_rate) = &purchase_detail.tax_rate { 
                    active_model.tax_rate = Set(Some(tax_rate.clone()));
                }
                if let Some(remarks) = &purchase_detail.remarks { 
                    active_model.remarks = Set(Some(remarks.clone()));
                }
            }

            active_model.department_id = Set(order.department_id.clone());
            active_model.department_code = Set(order.department_code.clone());
            active_model.updater = Set(Some(login_user.id));
            active_model.tenant_id = Set(order.tenant_id);
            active_model.update(txn).await?;
        }
    }

    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_inbound_order_detail = ErpInboundOrderDetailActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    erp_inbound_order_detail.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpInboundOrderDetailResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_inbound_order_detail = ErpInboundOrderDetailEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(erp_inbound_order_detail.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpInboundOrderDetailResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let paginator = ErpInboundOrderDetailEntity::find_active_with_condition(condition)
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<ErpInboundOrderDetailResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = ErpInboundOrderDetailEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}
