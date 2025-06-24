use std::collections::HashMap;

use common::interceptor::orm::simple_support::SimpleSupport;
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, EntityTrait, JoinType, Order, PaginatorTrait, QueryFilter, QueryOrder, QuerySelect, RelationTrait};
use crate::model::erp_inventory_check::{Model as ErpInventoryCheckModel, ActiveModel as ErpInventoryCheckActiveModel, Entity as ErpInventoryCheckEntity, Column, Relation};
use crate::model::erp_product::{Model as ErpProductModel, ActiveModel as ErpProductActiveModel, Entity as ErpProductEntity};
use crate::model::erp_warehouse::{Model as ErpWarehouseModel, ActiveModel as ErpWarehouseActiveModel, Entity as ErpWarehouseEntity};
use crate::model::erp_product_unit::{Model as ErpProductUnitModel, ActiveModel as ErpProductUnitActiveModel, Entity as ErpProductUnitEntity};
use crate::service::erp_product_unit;
use erp_model::request::erp_inventory_check::{CreateErpInventoryCheckRequest, UpdateErpInventoryCheckRequest, PaginatedKeywordRequest};
use erp_model::response::erp_inventory_check::{ErpInventoryCheckPageResponse, ErpInventoryCheckResponse};
use crate::convert::erp_inventory_check::{create_request_to_model, model_to_page_response, model_to_response, update_request_to_model};
use anyhow::{Result, anyhow};
use sea_orm::ActiveValue::Set;
use common::constants::enum_constants::{STATUS_DISABLE, STATUS_ENABLE};
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateErpInventoryCheckRequest) -> Result<i64> {
    let mut erp_inventory_check = create_request_to_model(&request);
    erp_inventory_check.department_id = Set(login_user.department_id);
    erp_inventory_check.department_code = Set(login_user.department_code);
    erp_inventory_check.creator = Set(Some(login_user.id));
    erp_inventory_check.updater = Set(Some(login_user.id));
    erp_inventory_check.tenant_id = Set(login_user.tenant_id);
    let erp_inventory_check = erp_inventory_check.insert(db).await?;
    Ok(erp_inventory_check.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateErpInventoryCheckRequest) -> Result<()> {
    let erp_inventory_check = ErpInventoryCheckEntity::find_by_id(request.id)
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut erp_inventory_check = update_request_to_model(&request, erp_inventory_check);
    erp_inventory_check.updater = Set(Some(login_user.id));
    erp_inventory_check.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_inventory_check = ErpInventoryCheckActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    erp_inventory_check.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpInventoryCheckResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_inventory_check = ErpInventoryCheckEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(erp_inventory_check.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpInventoryCheckPageResponse>> {
    let paginator = ErpInventoryCheckEntity::find_active()
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .select_also(ErpProductEntity)
        .select_also(ErpWarehouseEntity)
        .join(JoinType::LeftJoin, Relation::InventoryProduct.def())
        .join(JoinType::LeftJoin, Relation::InventoryWarehouse.def())
        .support_filter(params.base.filter_field, params.base.filter_operator, params.base.filter_value)
        .support_order(params.base.sort_field, params.base.sort, Some(vec![(Column::Id, Order::Desc)]))
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<ErpInventoryCheckResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = ErpInventoryCheckEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}
