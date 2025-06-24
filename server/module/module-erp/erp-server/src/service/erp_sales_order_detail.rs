use std::collections::{HashMap, HashSet};

use sea_orm::prelude::Expr;
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, DatabaseTransaction, EntityTrait, JoinType, PaginatorTrait, QueryFilter, QueryOrder, QuerySelect, RelationTrait};
use crate::model::erp_sales_order_detail::{Model as ErpSalesOrderDetailModel, ActiveModel as ErpSalesOrderDetailActiveModel, Entity as ErpSalesOrderDetailEntity, Column, Relation};
use crate::model::erp_sales_order::{Model as ErpSalesOrderModel};
use crate::model::erp_product::{Model as ErpProductModel, Entity as ErpProductEntity, Relation as ErpProductRelation};
use crate::model::erp_product_unit::{Model as ErpProductUnitModel, ActiveModel as ErpProductUnitActiveModel, Entity as ErpProductUnitEntity};
use erp_model::request::erp_sales_order_detail::{CreateErpSalesOrderDetailRequest, UpdateErpSalesOrderDetailRequest, PaginatedKeywordRequest};
use erp_model::response::erp_sales_order_detail::{ErpSalesOrderDetailBaseResponse, ErpSalesOrderDetailInfoResponse, ErpSalesOrderDetailResponse};
use crate::convert::erp_sales_order_detail::{create_request_to_model, model_to_base_response, model_to_info_response, model_to_response, update_add_request_to_model, update_request_to_model};
use anyhow::{anyhow, Context, Result};
use sea_orm::ActiveValue::Set;
use common::constants::enum_constants::{STATUS_DISABLE, STATUS_ENABLE};
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateErpSalesOrderDetailRequest) -> Result<i64> {
    let mut erp_sales_order_detail = create_request_to_model(&request);
    erp_sales_order_detail.creator = Set(Some(login_user.id));
    erp_sales_order_detail.updater = Set(Some(login_user.id));
    erp_sales_order_detail.tenant_id = Set(login_user.tenant_id);
    let erp_sales_order_detail = erp_sales_order_detail.insert(db).await?;
    Ok(erp_sales_order_detail.id)
}

pub async fn create_batch(db: &DatabaseConnection, txn: &DatabaseTransaction, login_user: LoginUserContext, sale_id: i64, requests: Vec<CreateErpSalesOrderDetailRequest>) -> Result<()> {
    let models: Vec<ErpSalesOrderDetailActiveModel> = requests
        .into_iter()
        .map(|request| {
            let mut model: ErpSalesOrderDetailActiveModel = create_request_to_model(&request);
            model.order_id = Set(sale_id);
            model.department_id = Set(login_user.department_id);
            model.department_code = Set(login_user.department_code.clone());
            model.creator = Set(Some(login_user.id));
            model.updater = Set(Some(login_user.id));
            model.tenant_id = Set(login_user.tenant_id);
            model
        })
        .collect();

    if !models.is_empty() {
        ErpSalesOrderDetailEntity::insert_many(models)
            .exec(txn)
            .await
            .with_context(|| "Failed to save detail")?;
    }
    Ok(())
}

pub async fn update_batch(db: &DatabaseConnection, txn: &DatabaseTransaction, login_user: LoginUserContext, sale_order: ErpSalesOrderModel, requests: Vec<UpdateErpSalesOrderDetailRequest>) -> Result<()> {
    // 查询已存在订单详情
    let existing_details = ErpSalesOrderDetailEntity::find()
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .filter(Column::OrderId.eq(sale_order.id))
        .all(db)
        .await?;

    // 构造 HashMap 加速查询
    let existing_map: HashMap<i64, ErpSalesOrderDetailModel> =
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
        let models: Vec<ErpSalesOrderDetailActiveModel> = to_add
            .into_iter()
            .map(|request| {
                let mut model = update_add_request_to_model(&request);
                model.order_id = Set(sale_order.id);
                model.department_id = Set(sale_order.department_id);
                model.department_code = Set(sale_order.department_code.clone());
                model.creator = Set(Some(login_user.id));
                model.updater = Set(Some(login_user.id));
                model.tenant_id = Set(sale_order.tenant_id);
                model
            })
            .collect();

        ErpSalesOrderDetailEntity::insert_many(models)
            .exec(txn)
            .await
            .with_context(|| "Failed to insert details")?;
    }

    // 批量逻辑删除
    if !to_mark_deleted.is_empty() {
        ErpSalesOrderDetailEntity::update_many()
            .col_expr(Column::Deleted, Expr::value(1))
            .col_expr(Column::Updater, Expr::value(login_user.id))
            .filter(Column::OrderId.eq(sale_order.id))
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
    let erp_sales_order_detail = ErpSalesOrderDetailActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    erp_sales_order_detail.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpSalesOrderDetailResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_sales_order_detail = ErpSalesOrderDetailEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(erp_sales_order_detail.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpSalesOrderDetailResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let paginator = ErpSalesOrderDetailEntity::find_active_with_condition(condition)
        .order_by_desc(Column::UpdateTime)
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<ErpSalesOrderDetailResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = ErpSalesOrderDetailEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

pub async fn list_by_sale_id(db: &DatabaseConnection, login_user: LoginUserContext, sale_id: i64) -> Result<Vec<ErpSalesOrderDetailBaseResponse>> {
    let list = ErpSalesOrderDetailEntity::find_active()
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .filter(Column::OrderId.eq(sale_id))
        .all(db).await?;
    Ok(list.into_iter().map(model_to_base_response).collect())
}

pub async fn list_info_by_sale_id(db: &DatabaseConnection, login_user: LoginUserContext, sale_id: i64) -> Result<Vec<ErpSalesOrderDetailInfoResponse>> {
    let list = ErpSalesOrderDetailEntity::find_active()
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .filter(Column::OrderId.eq(sale_id))
        .select_also(ErpProductEntity)
        .select_also(ErpProductUnitEntity)
        .join(JoinType::LeftJoin, Relation::DetailProduct.def())
        .join(JoinType::LeftJoin, ErpProductRelation::ProductUnit.def())
        .all(db).await?;
    Ok(list.into_iter().map(|(data, product_data, unit_data)|model_to_info_response(data, product_data, unit_data)).collect())
}

pub async fn find_by_sale_id(db: &DatabaseConnection, login_user: LoginUserContext, sale_id: i64) -> Result<Vec<ErpSalesOrderDetailModel>> {
    let list = ErpSalesOrderDetailEntity::find_active()
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .filter(Column::OrderId.eq(sale_id))
        .all(db).await?;
    Ok(list)
}