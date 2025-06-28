use common::interceptor::orm::simple_support::SimpleSupport;
use common::utils::snowflake_generator::SnowflakeGenerator;
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, EntityTrait, JoinType, Order, PaginatorTrait, QueryFilter, QueryOrder, QuerySelect, RelationTrait, TransactionTrait};
use crate::model::erp_payment::{Model as ErpPaymentModel, ActiveModel as ErpPaymentActiveModel, Entity as ErpPaymentEntity, Column, Relation};
use crate::model::erp_supplier::{Model as ErpSupplierModel, ActiveModel as ErpSupplierActiveModel, Entity as ErpSupplierEntity};
use crate::model::erp_settlement_account::{Model as ErpSettlementAccountModel, ActiveModel as ErpSettlementAccountActiveModel, Entity as ErpSettlementAccountEntity};
use crate::service::{erp_payment_attachment, erp_payment_detail};
use erp_model::request::erp_payment::{CreateErpPaymentRequest, UpdateErpPaymentRequest, PaginatedKeywordRequest};
use erp_model::response::erp_payment::{ErpPaymentBaseResponse, ErpPaymentInfoResponse, ErpPaymentPageResponse, ErpPaymentResponse};
use crate::convert::erp_payment::{create_request_to_model, model_to_base_response, model_to_info_response, model_to_page_response, model_to_response, update_request_to_model};
use anyhow::{anyhow, Context, Result};
use sea_orm::ActiveValue::Set;
use common::constants::enum_constants::{STATUS_DISABLE, STATUS_ENABLE};
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateErpPaymentRequest) -> Result<i64> {
    let mut erp_payment = create_request_to_model(&request);
    // 生成订单编号
    let generator = SnowflakeGenerator::new();
    match generator.generate() {
        Ok(id) => erp_payment.order_number = Set(id),
        Err(e) => return Err(anyhow!("订单编号生成失败")),
    }
    erp_payment.department_id = Set(login_user.department_id.clone());
    erp_payment.department_code = Set(login_user.department_code.clone());
    erp_payment.creator = Set(Some(login_user.id.clone()));
    erp_payment.updater = Set(Some(login_user.id.clone()));
    erp_payment.tenant_id = Set(login_user.tenant_id.clone());

    // 开启事务
    let txn = db.begin().await?;
    // 创建订单
    let erp_payment = erp_payment.insert(&txn).await?;
    // 创建订单详情
    erp_payment_detail::create_batch(&db, &txn, login_user.clone(), erp_payment.id, request.details).await?;
    // 创建订单文件
    erp_payment_attachment::create_batch(&db, &txn, login_user.clone(), erp_payment.id, request.attachments).await?;
    // 提交事务
    txn.commit().await.with_context(|| "Failed to commit transaction")?;
    Ok(erp_payment.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateErpPaymentRequest) -> Result<()> {
    let erp_payment = ErpPaymentEntity::find_active_by_id(request.id)
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let payment = erp_payment.clone();

    let mut erp_payment = update_request_to_model(&request, erp_payment);
    erp_payment.updater = Set(Some(login_user.id));
    // 开启事务
    let txn = db.begin().await?;
    // 修改订单
    erp_payment.update(&txn).await?;
    // 创建订单详情
    erp_payment_detail::update_batch(&db, &txn, login_user.clone(), payment.clone(), request.details).await?;
    // 创建订单文件
    erp_payment_attachment::update_batch(&db, &txn, login_user.clone(), payment.clone(), request.attachments).await?;
    // 提交事务
    txn.commit().await.with_context(|| "Failed to commit transaction")?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_payment = ErpPaymentActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    erp_payment.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpPaymentResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_payment = ErpPaymentEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(erp_payment.map(model_to_response))
}

pub async fn get_base_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpPaymentBaseResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_payment = ErpPaymentEntity::find_active_with_data_permission(login_user.clone())
        .filter(condition)
        .one(db).await?;
    if erp_payment.is_none() {
        return Ok(None);
    }
    let erp_payment = erp_payment.unwrap();
    let details = erp_payment_detail::list_by_order_id(&db, login_user.clone(), id).await?;
    let attachments = erp_payment_attachment::list_by_order_id(&db, login_user, id).await?;
    Ok(Some(model_to_base_response(erp_payment, details, attachments)))
}

pub async fn get_info_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpPaymentInfoResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_payment = ErpPaymentEntity::find_active_with_data_permission(login_user.clone())
        .filter(condition)
        .select_also(ErpSupplierEntity)
        .select_also(ErpSettlementAccountEntity)
        .join(JoinType::LeftJoin, Relation::OrderSupplier.def())
        .join(JoinType::LeftJoin, Relation::OrderSettlementAccount.def())
        .one(db).await?;
    if erp_payment.is_none() {
        return Ok(None);
    }
    let (payment, supplier, settlement_account) = erp_payment.unwrap();
    let details = erp_payment_detail::list_by_order_id(&db, login_user.clone(), id).await?;
    let attachments = erp_payment_attachment::list_by_order_id(&db, login_user, id).await?;
    Ok(Some(model_to_info_response(payment, supplier, settlement_account, details, attachments)))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpPaymentPageResponse>> {
    let paginator = ErpPaymentEntity::find_active_with_data_permission(login_user.clone())
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .select_also(ErpSupplierEntity)
        .select_also(ErpSettlementAccountEntity)
        .join(JoinType::LeftJoin, Relation::OrderSupplier.def())
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
        .map(|(data, supplier_data, settlement_account_data)|model_to_page_response(data, supplier_data, settlement_account_data))
        .collect();

    Ok(PaginatedResponse {
        list,
        total_pages,
        page: params.base.page,
        size: params.base.size,
        total,
    })
}

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<ErpPaymentResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = ErpPaymentEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}
