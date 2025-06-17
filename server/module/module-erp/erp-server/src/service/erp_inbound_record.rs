use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, EntityTrait, PaginatorTrait, QueryFilter, QueryOrder, TransactionTrait};
use crate::model::erp_inbound_record::{Model as ErpInboundRecordModel, ActiveModel as ErpInboundRecordActiveModel, Entity as ErpInboundRecordEntity, Column};
use crate::service::{erp_purchase_order, erp_purchase_order_detail};
use erp_model::request::erp_inbound_record::{CreateErpInboundPurchaseRequest, CreateErpInboundRecordRequest, PaginatedKeywordRequest, UpdateErpInboundRecordRequest};
use erp_model::response::erp_inbound_record::ErpInboundRecordResponse;
use crate::convert::erp_inbound_record::{create_purchase_request_to_model, create_request_to_model, model_to_response, update_request_to_model};
use anyhow::{anyhow, Context, Result};
use sea_orm::ActiveValue::{NotSet, Set};
use common::constants::enum_constants::{PURCHASE_ORDER_STATUS_COMPLETE, STATUS_DISABLE, STATUS_ENABLE};
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateErpInboundRecordRequest) -> Result<i64> {
    let mut erp_inbound_record = create_request_to_model(&request);
    erp_inbound_record.creator = Set(Some(login_user.id));
    erp_inbound_record.updater = Set(Some(login_user.id));
    erp_inbound_record.tenant_id = Set(login_user.tenant_id);
    let erp_inbound_record = erp_inbound_record.insert(db).await?;
    Ok(erp_inbound_record.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateErpInboundRecordRequest) -> Result<()> {
    let erp_inbound_record = ErpInboundRecordEntity::find_by_id(request.id)
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut erp_inbound_record = update_request_to_model(&request, erp_inbound_record);
    erp_inbound_record.updater = Set(Some(login_user.id));
    erp_inbound_record.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_inbound_record = ErpInboundRecordActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    erp_inbound_record.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpInboundRecordResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_inbound_record = ErpInboundRecordEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(erp_inbound_record.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpInboundRecordResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let paginator = ErpInboundRecordEntity::find_active_with_condition(condition)
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<ErpInboundRecordResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = ErpInboundRecordEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

/// 采购订单入库
pub async fn inbound_purchase_order(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateErpInboundPurchaseRequest) -> Result<()> {
    // 查询采购订单
    let purchase_order = erp_purchase_order::find_by_id(&db, login_user.clone(), request.purchase_id).await?;
    // 判断订单状态,
    if PURCHASE_ORDER_STATUS_COMPLETE.eq(&purchase_order.order_status) {
        return Err(anyhow!("订单已完成"));
    }
    // 查询采购订单商品列表
    let details = erp_purchase_order_detail::list_by_purchase_id(&db, login_user.clone(), purchase_order.id).await?;

    let models: Vec<ErpInboundRecordActiveModel> = details
        .into_iter()
        .map(|detail| {
            let mut model: ErpInboundRecordActiveModel = create_purchase_request_to_model(&request);
            model.product_id = Set(detail.product_id);
            model.quantity = Set(detail.quantity);
            model.department_id = Set(login_user.department_id);
            model.department_code = Set(login_user.department_code.clone());
            model.creator = Set(Some(login_user.id));
            model.updater = Set(Some(login_user.id));
            model.tenant_id = Set(login_user.tenant_id);
            model
        })
        .collect();

    // 开启事务
    let txn = db.begin().await?;
    // 保存出入库记录
    if !models.is_empty() {
        ErpInboundRecordEntity::insert_many(models)
            .exec(&txn)
            .await
            .with_context(|| "Failed to save")?;
    }
    // 更新产品表,更新产品数量

    // 保存仓库库存
    // 提交事务
    txn.commit().await.with_context(|| "Failed to commit transaction")?;
    Ok(())
}