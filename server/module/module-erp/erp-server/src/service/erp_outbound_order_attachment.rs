use common::interceptor::orm::simple_support::SimpleSupport;
use file_common::service::system_file;
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, DatabaseTransaction, EntityTrait, Order, PaginatorTrait, QueryFilter, QueryOrder};
use crate::model::erp_outbound_order_attachment::{Model as ErpOutboundOrderAttachmentModel, ActiveModel as ErpOutboundOrderAttachmentActiveModel, Entity as ErpOutboundOrderAttachmentEntity, Column};
use erp_model::request::erp_outbound_order_attachment::{CreateErpOutboundOrderAttachmentRequest, UpdateErpOutboundOrderAttachmentRequest, PaginatedKeywordRequest};
use erp_model::response::erp_outbound_order_attachment::ErpOutboundOrderAttachmentResponse;
use crate::convert::erp_outbound_order_attachment::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{anyhow, Context, Result};
use sea_orm::ActiveValue::Set;
use common::constants::enum_constants::{STATUS_DISABLE, STATUS_ENABLE};
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateErpOutboundOrderAttachmentRequest) -> Result<i64> {
    let mut erp_outbound_order_attachment = create_request_to_model(&request);
    erp_outbound_order_attachment.creator = Set(Some(login_user.id));
    erp_outbound_order_attachment.updater = Set(Some(login_user.id));
    erp_outbound_order_attachment.tenant_id = Set(login_user.tenant_id);
    let erp_outbound_order_attachment = erp_outbound_order_attachment.insert(db).await?;
    Ok(erp_outbound_order_attachment.id)
}

pub async fn create_batch(db: &DatabaseConnection, txn: &DatabaseTransaction, login_user: LoginUserContext, order_id: i64, requests: Vec<CreateErpOutboundOrderAttachmentRequest>) -> Result<()> {
    let file_ids: Vec<i64> = requests.iter().clone().map(|request| request.file_id).collect();

    let models: Vec<ErpOutboundOrderAttachmentActiveModel> = requests
        .into_iter()
        .map(|request| {
            let mut model = create_request_to_model(&request);
            model.order_id = Set(order_id);
            model.department_id = Set(login_user.department_id);
            model.department_code = Set(login_user.department_code.clone());
            model.creator = Set(Some(login_user.id));
            model.updater = Set(Some(login_user.id));
            model.tenant_id = Set(login_user.tenant_id);
            model
        })
        .collect();

    if !models.is_empty() {
        ErpOutboundOrderAttachmentEntity::insert_many(models)
            .exec(txn)
            .await
            .with_context(|| "Failed to save attachment")?;
    }

    // 启用文件
    system_file::enable_outer(&db, &txn, login_user, file_ids).await?;
    Ok(())
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateErpOutboundOrderAttachmentRequest) -> Result<()> {
    let erp_outbound_order_attachment = ErpOutboundOrderAttachmentEntity::find_by_id(request.id)
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut erp_outbound_order_attachment = update_request_to_model(&request, erp_outbound_order_attachment);
    erp_outbound_order_attachment.updater = Set(Some(login_user.id));
    erp_outbound_order_attachment.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_outbound_order_attachment = ErpOutboundOrderAttachmentActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    erp_outbound_order_attachment.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpOutboundOrderAttachmentResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_outbound_order_attachment = ErpOutboundOrderAttachmentEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(erp_outbound_order_attachment.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpOutboundOrderAttachmentResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let paginator = ErpOutboundOrderAttachmentEntity::find_active_with_condition(condition)
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<ErpOutboundOrderAttachmentResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = ErpOutboundOrderAttachmentEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}
