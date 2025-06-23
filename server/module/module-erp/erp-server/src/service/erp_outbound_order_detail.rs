use std::collections::{HashMap, HashSet};

use common::interceptor::orm::simple_support::SimpleSupport;
use erp_model::request::erp_inventory_record::ErpInventoryRecordInRequest;
use erp_model::request::erp_product_inventory::ErpProductInventoryInOutRequest;
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, DatabaseTransaction, EntityTrait, Order, PaginatorTrait, QueryFilter, QueryOrder};
use crate::model::erp_outbound_order_detail::{Model as ErpOutboundOrderDetailModel, ActiveModel as ErpOutboundOrderDetailActiveModel, Entity as ErpOutboundOrderDetailEntity, Column};
use crate::model::erp_sales_order_detail::{Model as ErpSalesOrderDetailModel};
use crate::model::erp_outbound_order::{Model as ErpOutboundOrderModel};
use crate::service::{erp_inventory_record, erp_product_inventory, erp_sales_order_detail};
use erp_model::request::erp_outbound_order_detail::{CreateErpOutboundOrderDetailOtherRequest, CreateErpOutboundOrderDetailRequest, CreateErpOutboundOrderDetailSaleRequest, PaginatedKeywordRequest, UpdateErpOutboundOrderDetailRequest};
use erp_model::response::erp_outbound_order_detail::ErpOutboundOrderDetailResponse;
use crate::convert::erp_outbound_order_detail::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{anyhow, Context, Result};
use sea_orm::ActiveValue::{NotSet, Set};
use common::constants::enum_constants::{STATUS_DISABLE, STATUS_ENABLE};
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateErpOutboundOrderDetailRequest) -> Result<i64> {
    let mut erp_outbound_order_detail = create_request_to_model(&request);
    erp_outbound_order_detail.creator = Set(Some(login_user.id));
    erp_outbound_order_detail.updater = Set(Some(login_user.id));
    erp_outbound_order_detail.tenant_id = Set(login_user.tenant_id);
    let erp_outbound_order_detail = erp_outbound_order_detail.insert(db).await?;
    Ok(erp_outbound_order_detail.id)
}

pub async fn create_batch_sale(db: &DatabaseConnection, txn: &DatabaseTransaction, login_user: LoginUserContext, order: ErpOutboundOrderModel, requests: Vec<CreateErpOutboundOrderDetailSaleRequest>) -> Result<()> {
    let sale_id = order.sale_id.ok_or_else(|| anyhow!("订单产品不匹配"))?;
    // 查询销售订单产品详情与出库订单详情是否符合,不符合报错
    let sale_details = erp_sales_order_detail::find_by_sale_id(&db, login_user.clone(), sale_id).await?;
    let request_detail_ids: HashSet<i64> = requests.iter().map(|d|d.sale_detail_id).collect();
    let sale_detail_ids: HashSet<i64> = sale_details.iter().map(|d|d.id).collect();
    if request_detail_ids != sale_detail_ids {
        return Err(anyhow!("订单产品不匹配"));
    }
    let sale_detail_map: HashMap<i64, ErpSalesOrderDetailModel> =
        sale_details.iter().map(|d| (d.id, d.clone())).collect();
    let mut models: Vec<ErpOutboundOrderDetailActiveModel> = Vec::new();
    let mut product_inventories: Vec<ErpProductInventoryInOutRequest> = Vec::new();
    let mut inbound_inventories: Vec<ErpInventoryRecordInRequest> = Vec::new();
    for request in requests {
        if let Some(sale_detail) = sale_detail_map.get(&request.sale_detail_id) {
            let model = ErpOutboundOrderDetailActiveModel {
                order_id: Set(order.id),
                sale_detail_id: Set(Some((request.sale_detail_id))),
                warehouse_id: Set(request.warehouse_id.clone()),
                product_id: Set(sale_detail.product_id.clone()),
                quantity: Set(sale_detail.quantity.clone()),
                unit_price: Set(sale_detail.unit_price.clone()),
                subtotal: Set(sale_detail.subtotal.clone()),
                tax_rate: sale_detail.tax_rate.as_ref().map_or(NotSet, |tax_rate| Set(Some(tax_rate.clone()))),
                remarks: sale_detail.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
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
                product_id: sale_detail.product_id.clone(),
                warehouse_id: request.warehouse_id.clone(),
                quantity: sale_detail.quantity.clone(),
            };
            product_inventories.push(product_inventory);

            // 出库记录
            let inbound_inventory = ErpInventoryRecordInRequest {
                product_id: sale_detail.product_id.clone(),
                warehouse_id: request.warehouse_id.clone(),
                quantity: sale_detail.quantity.clone(),
                record_date: order.outbound_date.clone(),
                remarks: sale_detail.remarks.clone(),
            };
            inbound_inventories.push(inbound_inventory);
        }
    }

    if !models.is_empty() {
        ErpOutboundOrderDetailEntity::insert_many(models)
            .exec(txn)
            .await
            .with_context(|| "Failed to save detail")?;

        // 修改产品库存
        erp_product_inventory::outbound(&db, txn, login_user.clone(), product_inventories).await?;
        // 增加库存记录
        erp_inventory_record::outbound(&db, txn, login_user, inbound_inventories).await?;
    }
    Ok(())
}

pub async fn create_batch_other(db: &DatabaseConnection, txn: &DatabaseTransaction, login_user: LoginUserContext, order: ErpOutboundOrderModel, requests: Vec<CreateErpOutboundOrderDetailOtherRequest>) -> Result<()> {
    let sale_id = order.sale_id.ok_or_else(|| anyhow!("订单产品不匹配"))?;
    
    let mut models: Vec<ErpOutboundOrderDetailActiveModel> = Vec::new();
    let mut product_inventories: Vec<ErpProductInventoryInOutRequest> = Vec::new();
    let mut inbound_inventories: Vec<ErpInventoryRecordInRequest> = Vec::new();
    for request in requests {
        let model = ErpOutboundOrderDetailActiveModel {
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

        // 出库记录
        let inbound_inventory = ErpInventoryRecordInRequest {
            product_id: request.product_id.clone(),
            warehouse_id: request.warehouse_id.clone(),
            quantity: request.quantity.clone(),
            record_date: order.outbound_date.clone(),
            remarks: request.remarks.clone(),
        };
        inbound_inventories.push(inbound_inventory);
    }

    if !models.is_empty() {
        ErpOutboundOrderDetailEntity::insert_many(models)
            .exec(txn)
            .await
            .with_context(|| "Failed to save detail")?;

        // 修改产品库存
        erp_product_inventory::outbound(&db, txn, login_user.clone(), product_inventories).await?;
        // 增加库存记录
        erp_inventory_record::outbound(&db, txn, login_user, inbound_inventories).await?;
    }
    Ok(())
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateErpOutboundOrderDetailRequest) -> Result<()> {
    let erp_outbound_order_detail = ErpOutboundOrderDetailEntity::find_by_id(request.id)
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut erp_outbound_order_detail = update_request_to_model(&request, erp_outbound_order_detail);
    erp_outbound_order_detail.updater = Set(Some(login_user.id));
    erp_outbound_order_detail.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_outbound_order_detail = ErpOutboundOrderDetailActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    erp_outbound_order_detail.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpOutboundOrderDetailResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_outbound_order_detail = ErpOutboundOrderDetailEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(erp_outbound_order_detail.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpOutboundOrderDetailResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let paginator = ErpOutboundOrderDetailEntity::find_active_with_condition(condition)
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<ErpOutboundOrderDetailResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = ErpOutboundOrderDetailEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}
