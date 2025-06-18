use common::interceptor::orm::simple_support::SimpleSupport;
use common::utils::snowflake_generator::SnowflakeGenerator;
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, EntityTrait, JoinType, Order, PaginatorTrait, QueryFilter, QueryOrder, QuerySelect, RelationTrait, TransactionTrait};
use crate::model::erp_sales_order::{Model as ErpSalesOrderModel, ActiveModel as ErpSalesOrderActiveModel, Entity as ErpSalesOrderEntity, Column, Relation};
use crate::model::erp_customer::{Model as ErpCustomerModel, ActiveModel as ErpCustomerActiveModel, Entity as ErpCustomerEntity};
use crate::model::erp_settlement_account::{Model as ErpSettlementAccountModel, ActiveModel as ErpSettlementAccountActiveModel, Entity as ErpSettlementAccountEntity};
use crate::model::erp_sales_order_detail::{Model as ErpSalesOrderDetailModel, ActiveModel as ErpSalesOrderDetailActiveModel, Entity as ErpSalesOrderDetailEntity};
use crate::model::erp_sales_order_attachment::{Model as ErpSalesOrderAttachmentModel, ActiveModel as ErpSalesOrderAttachmentActiveModel, Entity as ErpSalesOrderAttachmentEntity};
use crate::service::{erp_sales_order_attachment, erp_sales_order_detail};
use erp_model::request::erp_sales_order::{CreateErpSalesOrderRequest, UpdateErpSalesOrderRequest, PaginatedKeywordRequest};
use erp_model::response::erp_sales_order::{ErpSalesOrderBaseResponse, ErpSalesOrderPageResponse, ErpSalesOrderResponse};
use crate::convert::erp_sales_order::{create_request_to_model, model_to_base_response, model_to_page_response, model_to_response, update_request_to_model};
use anyhow::{anyhow, Context, Result};
use sea_orm::ActiveValue::Set;
use common::constants::enum_constants::{SALE_ORDER_STATUS_AWAITING_SIGNATURE, SALE_ORDER_STATUS_CANCEL, SALE_ORDER_STATUS_COMPLETE, SALE_ORDER_STATUS_PLACED, SALE_ORDER_STATUS_RETURN_COMPLETE, SALE_ORDER_STATUS_RETURN_PROCESSING, SALE_ORDER_STATUS_SHIP_OUT, SALE_ORDER_STATUS_SIGNED};
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateErpSalesOrderRequest) -> Result<i64> {
    let mut erp_sales_order = create_request_to_model(&request);
    // 生成订单编号
    let generator = SnowflakeGenerator::new();
    match generator.generate() {
        Ok(id) => erp_sales_order.order_number = Set(id),
        Err(e) => return Err(anyhow!("订单编号生成失败")),
    }
    
    erp_sales_order.user_id = Set(login_user.id.clone());
    erp_sales_order.order_status = Set(SALE_ORDER_STATUS_PLACED);
    erp_sales_order.department_id = Set(login_user.department_id.clone());
    erp_sales_order.department_code = Set(login_user.department_code.clone());
    erp_sales_order.creator = Set(Some(login_user.id.clone()));
    erp_sales_order.updater = Set(Some(login_user.id.clone()));
    erp_sales_order.tenant_id = Set(login_user.tenant_id.clone());

    // 开启事务
    let txn = db.begin().await?;
    // 创建订单
    let erp_sales_order = erp_sales_order.insert(&txn).await?;
    // 创建订单商品详情
    erp_sales_order_detail::create_batch(&db, &txn, login_user.clone(), erp_sales_order.id, request.sale_products).await?;
    // 创建订单文件
    erp_sales_order_attachment::create_batch(&db, &txn, login_user, erp_sales_order.id, request.sale_attachment).await?;
    // 提交事务
    txn.commit().await.with_context(|| "Failed to commit transaction")?;
    Ok(erp_sales_order.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateErpSalesOrderRequest) -> Result<()> {
    let erp_sale_order = ErpSalesOrderEntity::find_by_id(request.id)
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    // 已完成状态订单不能修改
    if SALE_ORDER_STATUS_COMPLETE.eq(&erp_sale_order.order_status) {
        return Err(anyhow!("订单已完成,不能修改"));
    }

    let sale_order = erp_sale_order.clone();

    // 修改订单
    let mut erp_sale_order = update_request_to_model(&request, erp_sale_order);
    erp_sale_order.updater = Set(Some(login_user.id));

    // 开启事务
    let txn = db.begin().await?;
    // 修改订单
    erp_sale_order.update(&txn).await?;
    // 修改订单商品详情
    erp_sales_order_detail::update_batch(&db, &txn, login_user.clone(), sale_order.clone(), request.sale_products).await?;
    // 修改订单文件
    erp_sales_order_attachment::update_batch(&db, &txn, login_user, sale_order, request.sale_attachment).await?;
    // 提交事务
    txn.commit().await.with_context(|| "Failed to commit transaction")?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_sales_order = ErpSalesOrderActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    erp_sales_order.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpSalesOrderResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_sales_order = ErpSalesOrderEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(erp_sales_order.map(model_to_response))
}

pub async fn get_detail_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpSalesOrderBaseResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id.clone()));
            
    let erp_sales_order = ErpSalesOrderEntity::find_active_with_data_permission(login_user.clone())
        .filter(condition)
        .one(db).await?;
    if erp_sales_order.is_none() {
        return Ok(None);
    }
    let erp_sales_order = erp_sales_order.unwrap();
    let details = erp_sales_order_detail::list_by_sale_id(&db, login_user.clone(), id).await?;
    let attachments = erp_sales_order_attachment::list_by_sale_id(&db, login_user, id).await?;
    Ok(Some(model_to_base_response(erp_sales_order, details, attachments)))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpSalesOrderPageResponse>> {
    let paginator = ErpSalesOrderEntity::find_active_with_data_permission(login_user.clone())
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .select_also(ErpCustomerEntity)
        .select_also(ErpSettlementAccountEntity)
        .join(JoinType::LeftJoin, Relation::SaleOrderCustomer.def())
        .join(JoinType::LeftJoin, Relation::SaleOrderSettlementAccount.def())
        .support_filter(params.base.filter_field, params.base.filter_operator, params.base.filter_value)
        .support_order(params.base.sort_field, params.base.sort, Some(vec![(Column::Id, Order::Desc)]))
        .paginate(db, params.base.size);

    let total = paginator.num_items().await?;
    let total_pages = (total + params.base.size - 1) / params.base.size; // 向上取整
    let list = paginator
        .fetch_page(params.base.page - 1) // SeaORM 页码从 0 开始，所以减 1
        .await?
        .into_iter()
        .map(|(data, customer_data, settlement_account_data)|model_to_page_response(data, customer_data, settlement_account_data))
        .collect();

    Ok(PaginatedResponse {
        list,
        total_pages,
        page: params.base.page,
        size: params.base.size,
        total,
    })
}

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<ErpSalesOrderResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = ErpSalesOrderEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

/// 订单待出库
pub async fn ship_out(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_sales_order = ErpSalesOrderActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        order_status: Set(SALE_ORDER_STATUS_SHIP_OUT),
        ..Default::default()
    };
    erp_sales_order.update(db).await?;
    Ok(())
}

/// 订单已出库,待签收
pub async fn awaiting_signature(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_sales_order = ErpSalesOrderActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        order_status: Set(SALE_ORDER_STATUS_AWAITING_SIGNATURE),
        ..Default::default()
    };
    erp_sales_order.update(db).await?;
    Ok(())
}

/// 订单已签收
pub async fn signed(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_sales_order = ErpSalesOrderActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        order_status: Set(SALE_ORDER_STATUS_SIGNED),
        ..Default::default()
    };
    erp_sales_order.update(db).await?;
    Ok(())
}

/// 订单已完成
pub async fn completed(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_sales_order = ErpSalesOrderActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        order_status: Set(SALE_ORDER_STATUS_COMPLETE),
        ..Default::default()
    };
    erp_sales_order.update(db).await?;
    Ok(())
}

/// 订单已取消
pub async fn cancel(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_sales_order = ErpSalesOrderActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        order_status: Set(SALE_ORDER_STATUS_CANCEL),
        ..Default::default()
    };
    erp_sales_order.update(db).await?;
    Ok(())
}

/// 订单退货处理中
pub async fn return_processing(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_sales_order = ErpSalesOrderActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        order_status: Set(SALE_ORDER_STATUS_RETURN_PROCESSING),
        ..Default::default()
    };
    erp_sales_order.update(db).await?;
    Ok(())
}

/// 订单退货完成
pub async fn return_completed(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_sales_order = ErpSalesOrderActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        order_status: Set(SALE_ORDER_STATUS_RETURN_COMPLETE),
        ..Default::default()
    };
    erp_sales_order.update(db).await?;
    Ok(())
}