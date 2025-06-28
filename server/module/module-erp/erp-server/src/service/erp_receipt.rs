use common::interceptor::orm::simple_support::SimpleSupport;
use common::utils::snowflake_generator::SnowflakeGenerator;
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, EntityTrait, JoinType, Order, PaginatorTrait, QueryFilter, QueryOrder, QuerySelect, RelationTrait, TransactionTrait};
use crate::model::erp_receipt::{Model as ErpReceiptModel, ActiveModel as ErpReceiptActiveModel, Entity as ErpReceiptEntity, Column, Relation};
use crate::model::erp_customer::{Model as ErpCustomerModel, ActiveModel as ErpCustomerActiveModel, Entity as ErpCustomerEntity};
use crate::model::erp_settlement_account::{Model as ErpSettlementAccountModel, ActiveModel as ErpSettlementAccountActiveModel, Entity as ErpSettlementAccountEntity};
use crate::service::{erp_receipt_attachment, erp_receipt_detail};
use erp_model::request::erp_receipt::{CreateErpReceiptRequest, UpdateErpReceiptRequest, PaginatedKeywordRequest};
use erp_model::response::erp_receipt::{ErpReceiptBaseResponse, ErpReceiptInfoResponse, ErpReceiptPageResponse, ErpReceiptResponse};
use crate::convert::erp_receipt::{create_request_to_model, model_to_base_response, model_to_info_response, model_to_page_response, model_to_response, update_request_to_model};
use anyhow::{anyhow, Context, Result};
use sea_orm::ActiveValue::Set;
use common::constants::enum_constants::{STATUS_DISABLE, STATUS_ENABLE};
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateErpReceiptRequest) -> Result<i64> {
    let mut erp_receipt = create_request_to_model(&request);
    // 生成订单编号
    let generator = SnowflakeGenerator::new();
    match generator.generate() {
        Ok(id) => erp_receipt.order_number = Set(id),
        Err(e) => return Err(anyhow!("订单编号生成失败")),
    }
    erp_receipt.user_id = Set(login_user.id.clone());
    erp_receipt.department_id = Set(login_user.department_id.clone());
    erp_receipt.department_code = Set(login_user.department_code.clone());
    erp_receipt.creator = Set(Some(login_user.id.clone()));
    erp_receipt.updater = Set(Some(login_user.id.clone()));
    erp_receipt.tenant_id = Set(login_user.tenant_id.clone());

    // 开启事务
    let txn = db.begin().await?;
    // 创建订单
    let erp_receipt = erp_receipt.insert(&txn).await?;
    // 创建订单详情
    erp_receipt_detail::create_batch(&db, &txn, login_user.clone(), erp_receipt.id, request.details).await?;
    // 创建订单文件
    erp_receipt_attachment::create_batch(&db, &txn, login_user.clone(), erp_receipt.id, request.attachments).await?;
    // 提交事务
    txn.commit().await.with_context(|| "Failed to commit transaction")?;
    Ok(erp_receipt.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateErpReceiptRequest) -> Result<()> {
    let erp_receipt = ErpReceiptEntity::find_active_by_id(request.id)
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let receipt = erp_receipt.clone();

    let mut erp_receipt = update_request_to_model(&request, erp_receipt);
    erp_receipt.updater = Set(Some(login_user.id));
    // 开启事务
    let txn = db.begin().await?;
    // 修改订单
    erp_receipt.update(&txn).await?;
    // 创建订单详情
    erp_receipt_detail::update_batch(&db, &txn, login_user.clone(), receipt.clone(), request.details).await?;
    // 创建订单文件
    erp_receipt_attachment::update_batch(&db, &txn, login_user.clone(), receipt.clone(), request.attachments).await?;
    // 提交事务
    txn.commit().await.with_context(|| "Failed to commit transaction")?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_receipt = ErpReceiptActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    erp_receipt.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpReceiptResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_receipt = ErpReceiptEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(erp_receipt.map(model_to_response))
}

pub async fn get_base_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpReceiptBaseResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_receipt = ErpReceiptEntity::find_active_with_data_permission(login_user.clone())
        .filter(condition)
        .one(db).await?;
    if erp_receipt.is_none() {
        return Ok(None);
    }
    let erp_receipt = erp_receipt.unwrap();
    let details = erp_receipt_detail::list_by_order_id(&db, login_user.clone(), id).await?;
    let attachments = erp_receipt_attachment::list_by_order_id(&db, login_user, id).await?;
    Ok(Some(model_to_base_response(erp_receipt, details, attachments)))
}

pub async fn get_info_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpReceiptInfoResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_receipt = ErpReceiptEntity::find_active_with_data_permission(login_user.clone())
        .filter(condition)
        .select_also(ErpCustomerEntity)
        .select_also(ErpSettlementAccountEntity)
        .join(JoinType::LeftJoin, Relation::OrderCustomer.def())
        .join(JoinType::LeftJoin, Relation::OrderSettlementAccount.def())
        .one(db).await?;
    if erp_receipt.is_none() {
        return Ok(None);
    }
    let (receipt, customer, settlement_account) = erp_receipt.unwrap();
    let details = erp_receipt_detail::list_by_order_id(&db, login_user.clone(), id).await?;
    let attachments = erp_receipt_attachment::list_by_order_id(&db, login_user, id).await?;
    Ok(Some(model_to_info_response(receipt, customer, settlement_account, details, attachments)))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpReceiptPageResponse>> {
    let paginator = ErpReceiptEntity::find_active_with_data_permission(login_user.clone())
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .select_also(ErpCustomerEntity)
        .select_also(ErpSettlementAccountEntity)
        .join(JoinType::LeftJoin, Relation::OrderCustomer.def())
        .join(JoinType::LeftJoin, Relation::OrderSettlementAccount.def())
        .support_filter(params.base.filter_field, params.base.filter_operator, params.base.filter_value)
        .support_order(params.base.sort_field, params.base.sort, Some(vec![(Column::Id, Order::Asc)]))
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<ErpReceiptResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = ErpReceiptEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}
