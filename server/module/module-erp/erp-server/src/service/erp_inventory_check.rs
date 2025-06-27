use common::interceptor::orm::simple_support::SimpleSupport;
use common::utils::snowflake_generator::SnowflakeGenerator;
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, EntityTrait, Order, PaginatorTrait, QueryFilter, QueryOrder, TransactionTrait};
use crate::model::erp_inventory_check::{Model as ErpInventoryCheckModel, ActiveModel as ErpInventoryCheckActiveModel, Entity as ErpInventoryCheckEntity, Column};
use crate::service::{erp_inventory_check_attachment, erp_inventory_check_detail};
use erp_model::request::erp_inventory_check::{CreateErpInventoryCheckRequest, UpdateErpInventoryCheckRequest, PaginatedKeywordRequest};
use erp_model::response::erp_inventory_check::{ErpInventoryCheckBaseResponse, ErpInventoryCheckResponse};
use crate::convert::erp_inventory_check::{create_request_to_model, model_to_base_response, model_to_response, update_request_to_model};
use anyhow::{anyhow, Context, Result};
use sea_orm::ActiveValue::Set;
use common::constants::enum_constants::{STATUS_DISABLE, STATUS_ENABLE};
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateErpInventoryCheckRequest) -> Result<i64> {
    let mut erp_inventory_check = create_request_to_model(&request);
    // 生成订单编号
    let generator = SnowflakeGenerator::new();
    match generator.generate() {
        Ok(id) => erp_inventory_check.order_number = Set(id),
        Err(e) => return Err(anyhow!("订单编号生成失败")),
    }

    erp_inventory_check.department_id = Set(login_user.department_id.clone());
    erp_inventory_check.department_code = Set(login_user.department_code.clone());
    erp_inventory_check.creator = Set(Some(login_user.id.clone()));
    erp_inventory_check.updater = Set(Some(login_user.id.clone()));
    erp_inventory_check.tenant_id = Set(login_user.tenant_id.clone());
    // 开启事务
    let txn = db.begin().await?;
    // 创建订单
    let erp_inventory_check = erp_inventory_check.insert(&txn).await?;
    // 创建订单详情
    erp_inventory_check_detail::create_batch(&db, &txn, login_user.clone(), erp_inventory_check.id, request.details).await?;
    // 创建订单文件
    erp_inventory_check_attachment::create_batch(&db, &txn, login_user.clone(), erp_inventory_check.id, request.attachments).await?;
    // 提交事务
    txn.commit().await.with_context(|| "Failed to commit transaction")?;
    Ok(erp_inventory_check.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateErpInventoryCheckRequest) -> Result<()> {
    let erp_inventory_check = ErpInventoryCheckEntity::find_by_id(request.id)
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let inventory_check = erp_inventory_check.clone();

    let mut erp_inventory_check = update_request_to_model(&request, erp_inventory_check);
    erp_inventory_check.updater = Set(Some(login_user.id));
    // 开启事务
    let txn = db.begin().await?;
    // 修改订单
    erp_inventory_check.update(&txn).await?;
    // 更新订单详情
    erp_inventory_check_detail::update_batch(&db, &txn, login_user.clone(), inventory_check.clone(), request.details).await?;
    // 更新订单文件
    erp_inventory_check_attachment::update_batch(&db, &txn, login_user.clone(), inventory_check, request.attachments).await?;
    // 提交事务
    txn.commit().await.with_context(|| "Failed to commit transaction")?;
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

pub async fn get_base_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpInventoryCheckBaseResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_inventory_check = ErpInventoryCheckEntity::find_active_with_data_permission(login_user.clone())
        .filter(condition)
        .one(db).await?;
    if erp_inventory_check.is_none() {
        return Ok(None);
    }
    let erp_inventory_check = erp_inventory_check.unwrap();
    let details = erp_inventory_check_detail::list_by_order_id(&db, login_user.clone(), id).await?;
    let attachments = erp_inventory_check_attachment::list_by_order_id(&db, login_user, id).await?;
    Ok(Some(model_to_base_response(erp_inventory_check, details, attachments)))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpInventoryCheckResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let paginator = ErpInventoryCheckEntity::find_active_with_condition(condition)
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<ErpInventoryCheckResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = ErpInventoryCheckEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}
