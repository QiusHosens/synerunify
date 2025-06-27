use std::collections::{HashMap, HashSet};

use common::interceptor::orm::simple_support::SimpleSupport;
use erp_model::request::erp_inventory_record::ErpInventoryRecordInRequest;
use erp_model::request::erp_product_inventory::ErpProductInventoryInOutRequest;
use sea_orm::prelude::Expr;
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, DatabaseTransaction, EntityTrait, Order, PaginatorTrait, QueryFilter, QueryOrder};
use crate::model::erp_inventory_transfer_detail::{Model as ErpInventoryTransferDetailModel, ActiveModel as ErpInventoryTransferDetailActiveModel, Entity as ErpInventoryTransferDetailEntity, Column};
use crate::model::erp_inventory_transfer::{Model as ErpInventoryTransferModel};
use crate::service::{erp_inventory_record, erp_product_inventory};
use erp_model::request::erp_inventory_transfer_detail::{CreateErpInventoryTransferDetailRequest, UpdateErpInventoryTransferDetailRequest, PaginatedKeywordRequest};
use erp_model::response::erp_inventory_transfer_detail::{ErpInventoryTransferDetailBaseResponse, ErpInventoryTransferDetailResponse};
use crate::convert::erp_inventory_transfer_detail::{create_request_to_model, model_to_base_response, model_to_response, update_add_request_to_model, update_request_to_model};
use anyhow::{anyhow, Context, Result};
use sea_orm::ActiveValue::Set;
use common::constants::enum_constants::{RECORD_TYPE_INBOUND_TRANSFER, RECORD_TYPE_OUTBOUND_TRANSFER, STATUS_DISABLE, STATUS_ENABLE};
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateErpInventoryTransferDetailRequest) -> Result<i64> {
    let mut erp_inventory_transfer_detail = create_request_to_model(&request);
    erp_inventory_transfer_detail.creator = Set(Some(login_user.id));
    erp_inventory_transfer_detail.updater = Set(Some(login_user.id));
    erp_inventory_transfer_detail.tenant_id = Set(login_user.tenant_id);
    let erp_inventory_transfer_detail = erp_inventory_transfer_detail.insert(db).await?;
    Ok(erp_inventory_transfer_detail.id)
}

pub async fn create_batch(db: &DatabaseConnection, txn: &DatabaseTransaction, login_user: LoginUserContext, order: ErpInventoryTransferModel, requests: Vec<CreateErpInventoryTransferDetailRequest>) -> Result<()> {
    let mut models: Vec<ErpInventoryTransferDetailActiveModel> = Vec::new();
    let mut product_inventories_inbound: Vec<ErpProductInventoryInOutRequest> = Vec::new();
    let mut product_inventories_outbound: Vec<ErpProductInventoryInOutRequest> = Vec::new();

    let mut inbound_inventories: Vec<ErpInventoryRecordInRequest> = Vec::new();
    let mut outbound_inventories: Vec<ErpInventoryRecordInRequest> = Vec::new();

    for request in requests {
        let mut model: ErpInventoryTransferDetailActiveModel = create_request_to_model(&request);
        model.order_id = Set(order.id);
        model.department_id = Set(login_user.department_id);
        model.department_code = Set(login_user.department_code.clone());
        model.creator = Set(Some(login_user.id));
        model.updater = Set(Some(login_user.id));
        model.tenant_id = Set(login_user.tenant_id);
        models.push(model);

        // 产品库存-入库
        let product_inventory = ErpProductInventoryInOutRequest {
            product_id: request.product_id.clone(),
            warehouse_id: request.to_warehouse_id.clone(),
            quantity: request.quantity.clone(),
        };
        product_inventories_inbound.push(product_inventory);

        // 产品库存-出库
        let product_inventory = ErpProductInventoryInOutRequest {
            product_id: request.product_id.clone(),
            warehouse_id: request.from_warehouse_id.clone(),
            quantity: request.quantity.clone(),
        };
        product_inventories_outbound.push(product_inventory);

        // 入库记录
        let inbound_inventory = ErpInventoryRecordInRequest {
            product_id: request.product_id.clone(),
            warehouse_id: request.to_warehouse_id.clone(),
            quantity: request.quantity.clone(),
            record_date: order.transfer_date.clone(),
            remarks: request.remarks.clone(),
        };
        inbound_inventories.push(inbound_inventory);

        // 出库记录
        let outbound_inventory = ErpInventoryRecordInRequest {
            product_id: request.product_id.clone(),
            warehouse_id: request.from_warehouse_id.clone(),
            quantity: request.quantity.clone(),
            record_date: order.transfer_date.clone(),
            remarks: request.remarks.clone(),
        };
        outbound_inventories.push(outbound_inventory);
    }

    if !models.is_empty() {
        ErpInventoryTransferDetailEntity::insert_many(models)
            .exec(txn)
            .await
            .with_context(|| "Failed to save detail")?;

        // 入库
        // 修改产品库存
        erp_product_inventory::inbound(&db, txn, login_user.clone(), product_inventories_inbound).await?;
        // 增加库存记录
        erp_inventory_record::inbound(&db, txn, login_user.clone(), inbound_inventories, RECORD_TYPE_INBOUND_TRANSFER).await?;
        // 出库
        // 修改产品库存
        erp_product_inventory::outbound(&db, txn, login_user.clone(), product_inventories_outbound).await?;
        // 修改库存记录
        erp_inventory_record::outbound(&db, txn, login_user.clone(), outbound_inventories, RECORD_TYPE_OUTBOUND_TRANSFER).await?;
    }
    Ok(())
}

pub async fn update_batch(db: &DatabaseConnection, txn: &DatabaseTransaction, login_user: LoginUserContext, order: ErpInventoryTransferModel, requests: Vec<UpdateErpInventoryTransferDetailRequest>) -> Result<()> {
    // 查询已存在订单详情
    let existing_details = ErpInventoryTransferDetailEntity::find()
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .filter(Column::OrderId.eq(order.id))
        .all(db)
        .await?;

    // 构造 HashMap 加速查询
    let existing_map: HashMap<i64, ErpInventoryTransferDetailModel> =
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

    let mut product_inventories_inbound: Vec<ErpProductInventoryInOutRequest> = Vec::new();
    let mut product_inventories_outbound: Vec<ErpProductInventoryInOutRequest> = Vec::new();

    let mut inbound_inventories: Vec<ErpInventoryRecordInRequest> = Vec::new();
    let mut outbound_inventories: Vec<ErpInventoryRecordInRequest> = Vec::new();
    // 批量新增
    if !to_add.is_empty() {
        let mut models: Vec<ErpInventoryTransferDetailActiveModel> = Vec::new();
        for request in to_add {
            let mut model: ErpInventoryTransferDetailActiveModel = update_add_request_to_model(&request);
            model.order_id = Set(order.id);
            model.department_id = Set(login_user.department_id);
            model.department_code = Set(login_user.department_code.clone());
            model.creator = Set(Some(login_user.id));
            model.updater = Set(Some(login_user.id));
            model.tenant_id = Set(login_user.tenant_id);
            models.push(model);

            // 产品库存-入库
            let product_inventory = ErpProductInventoryInOutRequest {
                product_id: request.product_id.clone(),
                warehouse_id: request.to_warehouse_id.clone(),
                quantity: request.quantity.clone(),
            };
            product_inventories_inbound.push(product_inventory);

            // 产品库存-出库
            let product_inventory = ErpProductInventoryInOutRequest {
                product_id: request.product_id.clone(),
                warehouse_id: request.from_warehouse_id.clone(),
                quantity: request.quantity.clone(),
            };
            product_inventories_outbound.push(product_inventory);

            // 入库记录
            let inbound_inventory = ErpInventoryRecordInRequest {
                product_id: request.product_id.clone(),
                warehouse_id: request.to_warehouse_id.clone(),
                quantity: request.quantity.clone(),
                record_date: order.transfer_date.clone(),
                remarks: request.remarks.clone(),
            };
            inbound_inventories.push(inbound_inventory);

            // 出库记录
            let outbound_inventory = ErpInventoryRecordInRequest {
                product_id: request.product_id.clone(),
                warehouse_id: request.from_warehouse_id.clone(),
                quantity: request.quantity.clone(),
                record_date: order.transfer_date.clone(),
                remarks: request.remarks.clone(),
            };
            outbound_inventories.push(outbound_inventory);
        }

        if !models.is_empty() {
            ErpInventoryTransferDetailEntity::insert_many(models)
                .exec(txn)
                .await
                .with_context(|| "Failed to save detail")?;
        }
    }

    // 批量逻辑删除
    if !to_mark_deleted.is_empty() {
        // 反向调拨回来
        for id in to_mark_deleted.clone() {
            if let Some(existing) = existing_map.get(&id) {
                // 产品库存-入库
                let product_inventory = ErpProductInventoryInOutRequest {
                    product_id: existing.product_id.clone(),
                    warehouse_id: existing.from_warehouse_id.clone(),
                    quantity: existing.quantity.clone(),
                };
                product_inventories_inbound.push(product_inventory);

                // 产品库存-出库
                let product_inventory = ErpProductInventoryInOutRequest {
                    product_id: existing.product_id.clone(),
                    warehouse_id: existing.to_warehouse_id.clone(),
                    quantity: existing.quantity.clone(),
                };
                product_inventories_outbound.push(product_inventory);

                // 入库记录
                let inbound_inventory = ErpInventoryRecordInRequest {
                    product_id: existing.product_id.clone(),
                    warehouse_id: existing.from_warehouse_id.clone(),
                    quantity: existing.quantity.clone(),
                    record_date: order.transfer_date.clone(),
                    remarks: existing.remarks.clone(),
                };
                inbound_inventories.push(inbound_inventory);

                // 出库记录
                let outbound_inventory = ErpInventoryRecordInRequest {
                    product_id: existing.product_id.clone(),
                    warehouse_id: existing.to_warehouse_id.clone(),
                    quantity: existing.quantity.clone(),
                    record_date: order.transfer_date.clone(),
                    remarks: existing.remarks.clone(),
                };
                outbound_inventories.push(outbound_inventory);
            }
        }
        ErpInventoryTransferDetailEntity::update_many()
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

                    // 本次调拨数量
                    let quantity = request.quantity.clone() - existing.quantity.clone();

                    // 如果调拨数量为0,不增加调拨记录
                    if quantity == 0 {
                        continue;
                    }
                    // 如果调拨数量大于0,按新增时的出入库;否则就反向出入库
                    if quantity > 0 {
                        // 产品库存-入库
                        let product_inventory = ErpProductInventoryInOutRequest {
                            product_id: request.product_id.clone(),
                            warehouse_id: request.to_warehouse_id.clone(),
                            quantity: quantity,
                        };
                        product_inventories_inbound.push(product_inventory);

                        // 产品库存-出库
                        let product_inventory = ErpProductInventoryInOutRequest {
                            product_id: request.product_id.clone(),
                            warehouse_id: request.from_warehouse_id.clone(),
                            quantity: quantity,
                        };
                        product_inventories_outbound.push(product_inventory);

                        // 入库记录
                        let inbound_inventory = ErpInventoryRecordInRequest {
                            product_id: request.product_id.clone(),
                            warehouse_id: request.to_warehouse_id.clone(),
                            quantity: quantity,
                            record_date: order.transfer_date.clone(),
                            remarks: request.remarks.clone(),
                        };
                        inbound_inventories.push(inbound_inventory);

                        // 出库记录
                        let outbound_inventory = ErpInventoryRecordInRequest {
                            product_id: request.product_id.clone(),
                            warehouse_id: request.from_warehouse_id.clone(),
                            quantity: quantity,
                            record_date: order.transfer_date.clone(),
                            remarks: request.remarks.clone(),
                        };
                        outbound_inventories.push(outbound_inventory);
                    } else {
                        let quantity = - quantity;
                        // 产品库存-入库
                        let product_inventory = ErpProductInventoryInOutRequest {
                            product_id: request.product_id.clone(),
                            warehouse_id: request.from_warehouse_id.clone(),
                            quantity: quantity,
                        };
                        product_inventories_inbound.push(product_inventory);

                        // 产品库存-出库
                        let product_inventory = ErpProductInventoryInOutRequest {
                            product_id: request.product_id.clone(),
                            warehouse_id: request.to_warehouse_id.clone(),
                            quantity: quantity,
                        };
                        product_inventories_outbound.push(product_inventory);

                        // 入库记录
                        let inbound_inventory = ErpInventoryRecordInRequest {
                            product_id: request.product_id.clone(),
                            warehouse_id: request.from_warehouse_id.clone(),
                            quantity: quantity,
                            record_date: order.transfer_date.clone(),
                            remarks: request.remarks.clone(),
                        };
                        inbound_inventories.push(inbound_inventory);

                        // 出库记录
                        let outbound_inventory = ErpInventoryRecordInRequest {
                            product_id: request.product_id.clone(),
                            warehouse_id: request.to_warehouse_id.clone(),
                            quantity: quantity,
                            record_date: order.transfer_date.clone(),
                            remarks: request.remarks.clone(),
                        };
                        outbound_inventories.push(outbound_inventory);
                    }
                }
            }
        }
    }

    // 入库
    // 修改产品库存
    erp_product_inventory::inbound(&db, txn, login_user.clone(), product_inventories_inbound).await?;
    // 增加库存记录
    erp_inventory_record::inbound(&db, txn, login_user.clone(), inbound_inventories, RECORD_TYPE_INBOUND_TRANSFER).await?;
    // 出库
    // 修改产品库存
    erp_product_inventory::outbound(&db, txn, login_user.clone(), product_inventories_outbound).await?;
    // 修改库存记录
    erp_inventory_record::outbound(&db, txn, login_user.clone(), outbound_inventories, RECORD_TYPE_OUTBOUND_TRANSFER).await?;

    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_inventory_transfer_detail = ErpInventoryTransferDetailActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    erp_inventory_transfer_detail.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpInventoryTransferDetailResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_inventory_transfer_detail = ErpInventoryTransferDetailEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(erp_inventory_transfer_detail.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpInventoryTransferDetailResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let paginator = ErpInventoryTransferDetailEntity::find_active_with_condition(condition)
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<ErpInventoryTransferDetailResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = ErpInventoryTransferDetailEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

pub async fn list_by_order_id(db: &DatabaseConnection, login_user: LoginUserContext, order_id: i64) -> Result<Vec<ErpInventoryTransferDetailBaseResponse>> {
    let list = ErpInventoryTransferDetailEntity::find_active()
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .filter(Column::OrderId.eq(order_id))
        .all(db).await?;
    Ok(list.into_iter().map(model_to_base_response).collect())
}