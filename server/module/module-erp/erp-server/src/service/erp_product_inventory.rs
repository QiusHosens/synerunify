use std::collections::HashMap;

use common::interceptor::orm::simple_support::SimpleSupport;
use sea_orm::prelude::Expr;
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, DatabaseTransaction, EntityTrait, JoinType, Order, PaginatorTrait, QueryFilter, QueryOrder, QuerySelect, RelationTrait};
use crate::model::erp_product_inventory::{Model as ErpProductInventoryModel, ActiveModel as ErpProductInventoryActiveModel, Entity as ErpProductInventoryEntity, Column, Relation};
use crate::model::erp_product::{Model as ErpProductModel, ActiveModel as ErpProductActiveModel, Entity as ErpProductEntity};
use crate::model::erp_warehouse::{Model as ErpWarehouseModel, ActiveModel as ErpWarehouseActiveModel, Entity as ErpWarehouseEntity};
use crate::model::erp_product_unit::{Model as ErpProductUnitModel, ActiveModel as ErpProductUnitActiveModel, Entity as ErpProductUnitEntity};
use crate::service::erp_product_unit;
use erp_model::request::erp_product_inventory::{CreateErpProductInventoryRequest, ErpProductInventoryInOutRequest, PaginatedKeywordRequest, UpdateErpProductInventoryRequest};
use erp_model::response::erp_product_inventory::{ErpProductInventoryPageResponse, ErpProductInventoryResponse};
use crate::convert::erp_product_inventory::{create_request_to_model, model_to_page_response, model_to_response, update_request_to_model};
use anyhow::{Result, anyhow};
use sea_orm::ActiveValue::Set;
use common::constants::enum_constants::{STATUS_DISABLE, STATUS_ENABLE};
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateErpProductInventoryRequest) -> Result<i64> {
    let mut erp_product_inventory = create_request_to_model(&request);
    erp_product_inventory.creator = Set(Some(login_user.id));
    erp_product_inventory.updater = Set(Some(login_user.id));
    erp_product_inventory.tenant_id = Set(login_user.tenant_id);
    let erp_product_inventory = erp_product_inventory.insert(db).await?;
    Ok(erp_product_inventory.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateErpProductInventoryRequest) -> Result<()> {
    let erp_product_inventory = ErpProductInventoryEntity::find_by_id(request.id)
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut erp_product_inventory = update_request_to_model(&request, erp_product_inventory);
    erp_product_inventory.updater = Set(Some(login_user.id));
    erp_product_inventory.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_product_inventory = ErpProductInventoryActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    erp_product_inventory.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpProductInventoryResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_product_inventory = ErpProductInventoryEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(erp_product_inventory.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpProductInventoryPageResponse>> {
    let paginator = ErpProductInventoryEntity::find_active()
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .select_also(ErpProductEntity)
        .select_also(ErpWarehouseEntity)
        .join(JoinType::LeftJoin, Relation::InventoryProduct.def())
        .join(JoinType::LeftJoin, Relation::InventoryWarehouse.def())
        .support_filter(params.base.filter_field, params.base.filter_operator, params.base.filter_value)
        .support_order(params.base.sort_field, params.base.sort, Some(vec![(Column::Id, Order::Asc)]))
        .paginate(db, params.base.size);

    let total = paginator.num_items().await?;
    let total_pages = (total + params.base.size - 1) / params.base.size; // 向上取整

    let list = paginator.fetch_page(params.base.page - 1).await?;

    let unit_ids: Vec<i64> = list.iter().filter_map(|(_, product, _)| product.as_ref().and_then(|p| p.unit_id)).collect();
    let units: Vec<ErpProductUnitModel> = erp_product_unit::list_by_ids(&db, login_user, unit_ids).await?;
    // 转为 HashMap 便于后续快速查找
    let unit_map: HashMap<i64, ErpProductUnitModel> = units.into_iter().map(|s| (s.id, s)).collect();

    let list = list
        .into_iter()
        .map(|(ret, product, warehouse)| {
            let unit = product.as_ref().and_then(|p| p.unit_id).and_then(|id| unit_map.get(&id).cloned());
            model_to_page_response(ret, product, warehouse, unit)
        })
        .collect();

    Ok(PaginatedResponse {
        list,
        total_pages,
        page: params.base.page,
        size: params.base.size,
        total,
    })
}

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<ErpProductInventoryResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = ErpProductInventoryEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

/// 入库加库存
pub async fn inbound(db: &DatabaseConnection, txn: &DatabaseTransaction, login_user: LoginUserContext, requests: Vec<ErpProductInventoryInOutRequest>) -> Result<()> {
    if requests.is_empty() {
        return Ok(());
    }

    for request in requests {
        // 查询是否存在匹配的库存记录
        let existing_inventory = ErpProductInventoryEntity::find()
            .filter(Column::ProductId.eq(request.product_id))
            .filter(Column::WarehouseId.eq(request.warehouse_id))
            .filter(Column::TenantId.eq(login_user.tenant_id))
            .one(txn)
            .await?;

        match existing_inventory {
            Some(inventory) => {
                // 记录存在，更新库存数量
                let mut active_model: ErpProductInventoryActiveModel = inventory.clone().into();
                active_model.stock_quantity = Set(inventory.stock_quantity + request.quantity);
                active_model.updater = Set(Some(login_user.id));
                active_model.update(txn).await?;
            }
            None => {
                // 记录不存在，插入新记录
                let new_inventory = ErpProductInventoryActiveModel {
                    product_id: Set(request.product_id),
                    warehouse_id: Set(request.warehouse_id),
                    tenant_id: Set(login_user.tenant_id),
                    stock_quantity: Set(request.quantity),
                    creator: Set(Some(login_user.id)),
                    updater: Set(Some(login_user.id)),
                    ..Default::default()
                };
                new_inventory.insert(txn).await?;
            }
        }
    }

    Ok(())
}

/// 出库减库存
pub async fn outbound(db: &DatabaseConnection, txn: &DatabaseTransaction, login_user: LoginUserContext, requests: Vec<ErpProductInventoryInOutRequest>) -> Result<()> {
    if requests.is_empty() {
        return Ok(());
    }

    for request in requests {
        // 查询是否存在匹配的库存记录
        let existing_inventory = ErpProductInventoryEntity::find()
            .filter(Column::ProductId.eq(request.product_id))
            .filter(Column::WarehouseId.eq(request.warehouse_id))
            .filter(Column::TenantId.eq(login_user.tenant_id))
            .one(txn)
            .await?;

        match existing_inventory {
            Some(inventory) => {
                // 先判断库存是否足够
                if (inventory.stock_quantity < request.quantity) {
                    return Err(anyhow!("产品库存不足,出库失败"));
                }
                // 记录存在,更新库存数量
                let mut active_model: ErpProductInventoryActiveModel = inventory.clone().into();
                active_model.stock_quantity = Set(inventory.stock_quantity - request.quantity);
                active_model.updater = Set(Some(login_user.id));
                active_model.update(txn).await?;
            }
            None => {
                // 记录不存在,报错
                return Err(anyhow!("产品无库存,出库失败"))
            }
        }
    }

    Ok(())
}