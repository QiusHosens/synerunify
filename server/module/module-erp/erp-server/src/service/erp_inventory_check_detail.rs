use std::collections::{HashMap, HashSet};

use common::interceptor::orm::simple_support::SimpleSupport;
use erp_model::request::erp_product_inventory::ErpProductInventoryInOutRequest;
use sea_orm::prelude::Expr;
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, DatabaseTransaction, EntityTrait, Order, PaginatorTrait, QueryFilter, QueryOrder};
use crate::model::erp_inventory_check_detail::{Model as ErpInventoryCheckDetailModel, ActiveModel as ErpInventoryCheckDetailActiveModel, Entity as ErpInventoryCheckDetailEntity, Column};
use crate::model::erp_inventory_check::{Model as ErpInventoryCheckModel};
use crate::service::erp_product_inventory;
use erp_model::request::erp_inventory_check_detail::{CreateErpInventoryCheckDetailRequest, UpdateErpInventoryCheckDetailRequest, PaginatedKeywordRequest};
use erp_model::response::erp_inventory_check_detail::{ErpInventoryCheckDetailBaseResponse, ErpInventoryCheckDetailResponse};
use crate::convert::erp_inventory_check_detail::{create_request_to_model, model_to_base_response, model_to_response, update_add_request_to_model, update_request_to_model};
use anyhow::{anyhow, Context, Result};
use sea_orm::ActiveValue::Set;
use common::constants::enum_constants::{STATUS_DISABLE, STATUS_ENABLE};
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateErpInventoryCheckDetailRequest) -> Result<i64> {
    let mut erp_inventory_check_detail = create_request_to_model(&request);
    erp_inventory_check_detail.creator = Set(Some(login_user.id));
    erp_inventory_check_detail.updater = Set(Some(login_user.id));
    erp_inventory_check_detail.tenant_id = Set(login_user.tenant_id);
    let erp_inventory_check_detail = erp_inventory_check_detail.insert(db).await?;
    Ok(erp_inventory_check_detail.id)
}

pub async fn create_batch(db: &DatabaseConnection, txn: &DatabaseTransaction, login_user: LoginUserContext, order_id: i64, requests: Vec<CreateErpInventoryCheckDetailRequest>) -> Result<()> {
    let mut models: Vec<ErpInventoryCheckDetailActiveModel> = Vec::new();
    let mut product_inventories: Vec<ErpProductInventoryInOutRequest> = Vec::new();

    for request in requests {
        let mut model: ErpInventoryCheckDetailActiveModel = create_request_to_model(&request);
        model.order_id = Set(order_id);
        model.department_id = Set(login_user.department_id);
        model.department_code = Set(login_user.department_code.clone());
        model.creator = Set(Some(login_user.id));
        model.updater = Set(Some(login_user.id));
        model.tenant_id = Set(login_user.tenant_id);
        models.push(model);

        // 产品库存
        let product_inventory = ErpProductInventoryInOutRequest {
            product_id: request.product_id.clone(),
            warehouse_id: request.warehouse_id.clone(),
            quantity: request.checked_quantity.clone(),
        };
        product_inventories.push(product_inventory);
    }

    if !models.is_empty() {
        ErpInventoryCheckDetailEntity::insert_many(models)
            .exec(txn)
            .await
            .with_context(|| "Failed to save detail")?;

        // 设置产品库存
        erp_product_inventory::set(&db, txn, login_user.clone(), product_inventories).await?;
    }
    Ok(())
}

pub async fn update_batch(db: &DatabaseConnection, txn: &DatabaseTransaction, login_user: LoginUserContext, order: ErpInventoryCheckModel, requests: Vec<UpdateErpInventoryCheckDetailRequest>) -> Result<()> {
    // 查询已存在订单详情
    let existing_details = ErpInventoryCheckDetailEntity::find()
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .filter(Column::OrderId.eq(order.id))
        .all(db)
        .await?;

    // 构造 HashMap 加速查询
    let existing_map: HashMap<i64, ErpInventoryCheckDetailModel> =
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

    if !to_mark_deleted.is_empty() {
        return Err(anyhow!("不能删除盘点"));
    }

    let mut product_inventories: Vec<ErpProductInventoryInOutRequest> = Vec::new();
    // 批量新增
    if !to_add.is_empty() {
        let mut models: Vec<ErpInventoryCheckDetailActiveModel> = Vec::new();
        for request in to_add {
            let mut model: ErpInventoryCheckDetailActiveModel = update_add_request_to_model(&request);
            model.order_id = Set(order.id);
            model.department_id = Set(login_user.department_id);
            model.department_code = Set(login_user.department_code.clone());
            model.creator = Set(Some(login_user.id));
            model.updater = Set(Some(login_user.id));
            model.tenant_id = Set(login_user.tenant_id);
            models.push(model);

            // 产品库存
            let product_inventory = ErpProductInventoryInOutRequest {
                product_id: request.product_id.clone(),
                warehouse_id: request.warehouse_id.clone(),
                quantity: request.checked_quantity.clone(),
            };
            product_inventories.push(product_inventory);
        }

        if !models.is_empty() {
            ErpInventoryCheckDetailEntity::insert_many(models)
                .exec(txn)
                .await
                .with_context(|| "Failed to save detail")?;
        }
    }

    // 批量更新（逐条更新，因内容不一致）
    if !to_update.is_empty() {
        for request in to_update {
            if let Some(id) = request.id {
                if let Some(existing) = existing_map.get(&id) {
                    let mut model = update_request_to_model(&request, existing.clone());
                    model.updater = Set(Some(login_user.id));
                    model.update(txn).await?;

                    // 产品库存
                    let product_inventory = ErpProductInventoryInOutRequest {
                        product_id: request.product_id.clone(),
                        warehouse_id: request.warehouse_id.clone(),
                        quantity: request.checked_quantity.clone(),
                    };
                    product_inventories.push(product_inventory);
                }
            }
        }
    }

    // 设置产品库存
    erp_product_inventory::set(&db, txn, login_user.clone(), product_inventories).await?;

    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_inventory_check_detail = ErpInventoryCheckDetailActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    erp_inventory_check_detail.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpInventoryCheckDetailResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_inventory_check_detail = ErpInventoryCheckDetailEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(erp_inventory_check_detail.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpInventoryCheckDetailResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let paginator = ErpInventoryCheckDetailEntity::find_active_with_condition(condition)
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<ErpInventoryCheckDetailResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = ErpInventoryCheckDetailEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

pub async fn list_by_order_id(db: &DatabaseConnection, login_user: LoginUserContext, order_id: i64) -> Result<Vec<ErpInventoryCheckDetailBaseResponse>> {
    let list = ErpInventoryCheckDetailEntity::find_active()
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .filter(Column::OrderId.eq(order_id))
        .all(db).await?;
    Ok(list.into_iter().map(model_to_base_response).collect())
}