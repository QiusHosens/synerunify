use std::collections::{HashMap, HashSet};

use file_common::service::system_file;
use sea_orm::prelude::Expr;
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, DatabaseTransaction, EntityTrait, PaginatorTrait, QueryFilter, QueryOrder};
use crate::model::erp_sales_order_attachment::{Model as ErpSalesOrderAttachmentModel, ActiveModel as ErpSalesOrderAttachmentActiveModel, Entity as ErpSalesOrderAttachmentEntity, Column};
use crate::model::erp_sales_order::{Model as ErpSalesOrderModel};
use file_common::model::system_file::{Model as SystemFileModel};
use erp_model::request::erp_sales_order_attachment::{CreateErpSalesOrderAttachmentRequest, UpdateErpSalesOrderAttachmentRequest, PaginatedKeywordRequest};
use erp_model::response::erp_sales_order_attachment::{ErpSalesOrderAttachmentBaseResponse, ErpSalesOrderAttachmentResponse};
use crate::convert::erp_sales_order_attachment::{create_request_to_model, model_to_base_response, model_to_response, update_add_request_to_model, update_request_to_model};
use anyhow::{anyhow, Context, Result};
use sea_orm::ActiveValue::Set;
use common::constants::enum_constants::{STATUS_DISABLE, STATUS_ENABLE};
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateErpSalesOrderAttachmentRequest) -> Result<i64> {
    let mut erp_sales_order_attachment = create_request_to_model(&request);
    erp_sales_order_attachment.creator = Set(Some(login_user.id));
    erp_sales_order_attachment.updater = Set(Some(login_user.id));
    erp_sales_order_attachment.tenant_id = Set(login_user.tenant_id);
    let erp_sales_order_attachment = erp_sales_order_attachment.insert(db).await?;
    Ok(erp_sales_order_attachment.id)
}

pub async fn create_batch(db: &DatabaseConnection, txn: &DatabaseTransaction, login_user: LoginUserContext, sale_id: i64, requests: Vec<CreateErpSalesOrderAttachmentRequest>) -> Result<()> {
    let file_ids: Vec<i64> = requests.iter().clone().map(|request| request.file_id).collect();

    let models: Vec<ErpSalesOrderAttachmentActiveModel> = requests
        .into_iter()
        .map(|request| {
            let mut model = create_request_to_model(&request);
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
        ErpSalesOrderAttachmentEntity::insert_many(models)
            .exec(txn)
            .await
            .with_context(|| "Failed to save attachment")?;
    }

    // 启用文件
    system_file::enable_outer(&db, &txn, login_user, file_ids).await?;
    Ok(())
}

pub async fn update_batch(db: &DatabaseConnection, txn: &DatabaseTransaction, login_user: LoginUserContext, sale_order: ErpSalesOrderModel, requests: Vec<UpdateErpSalesOrderAttachmentRequest>) -> Result<()> {
    // 查询已存在订单附件
    let existing_attachments = ErpSalesOrderAttachmentEntity::find()
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .filter(Column::OrderId.eq(sale_order.id))
        .all(db)
        .await?;

    // 构造 HashMap 加速查询
    let existing_map: HashMap<i64, ErpSalesOrderAttachmentModel> =
        existing_attachments.iter().map(|a| (a.id, a.clone())).collect();

    // 拆分请求为新增 / 更新两类
    let (to_add, to_update): (Vec<_>, Vec<_>) = requests.into_iter().partition(|r| r.id.is_none());

    // 所有 id
    let request_attachment_ids: HashSet<i64> = to_update.iter().filter_map(|a| a.id).collect();
    let existing_attachment_ids: HashSet<i64> = existing_map.keys().copied().collect();

    // 删除的 detail id = 旧的 - 新的
    let to_mark_deleted: Vec<i64> = existing_attachment_ids
        .difference(&request_attachment_ids)
        .copied()
        .collect();

    // 启用文件id列表
    let mut enable_file_ids: Vec<i64> = Vec::new();
    // 禁用文件id列表
    let mut disable_file_ids: Vec<i64> = existing_attachments.iter().filter(|a|to_mark_deleted.contains(&a.id)).map(|a|a.file_id).collect();

    // 批量新增
    if !to_add.is_empty() {
        // 所有新增的都启用
        enable_file_ids = to_add.iter().map(|a|a.file_id).collect();
        let models: Vec<ErpSalesOrderAttachmentActiveModel> = to_add
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

        ErpSalesOrderAttachmentEntity::insert_many(models)
            .exec(txn)
            .await
            .with_context(|| "Failed to insert details")?;
    }

    // 批量逻辑删除
    if !to_mark_deleted.is_empty() {
        ErpSalesOrderAttachmentEntity::update_many()
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
                    // 编辑的文件id不一致,则禁用之前的
                    if !existing.file_id.eq(&request.file_id) {
                        disable_file_ids.push(existing.file_id);
                    }
                    let mut model = update_request_to_model(&request, existing.clone());
                    model.updater = Set(Some(login_user.id));
                    model.update(txn).await?;
                    // 编辑的已存在则启用
                    enable_file_ids.push(request.file_id);
                }
            }
        }
    }

    // 启用文件
    system_file::enable_outer(&db, &txn, login_user.clone(), enable_file_ids).await?;
    // 禁用文件
    system_file::disable_outer(&db, &txn, login_user, disable_file_ids).await?;

    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let erp_sales_order_attachment = ErpSalesOrderAttachmentActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    erp_sales_order_attachment.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<ErpSalesOrderAttachmentResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let erp_sales_order_attachment = ErpSalesOrderAttachmentEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(erp_sales_order_attachment.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<ErpSalesOrderAttachmentResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let paginator = ErpSalesOrderAttachmentEntity::find_active_with_condition(condition)
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<ErpSalesOrderAttachmentResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = ErpSalesOrderAttachmentEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

pub async fn list_by_sale_id(db: &DatabaseConnection, login_user: LoginUserContext, sale_id: i64) -> Result<Vec<ErpSalesOrderAttachmentBaseResponse>> {
    let list = ErpSalesOrderAttachmentEntity::find_active()
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .filter(Column::OrderId.eq(sale_id))
        .all(db).await?;

    let file_ids: Vec<i64> = list.iter().map(|a|a.file_id).collect();
    let files = system_file::list_by_ids(&db, login_user, file_ids).await?;
    let file_map: HashMap<i64, SystemFileModel> = files.iter().map(|f|(f.id, f.clone())).collect();
    let result: Vec<ErpSalesOrderAttachmentBaseResponse> = list
        .into_iter()
        .map(|a| {
            let file_name = file_map
                .get(&a.file_id)
                .map(|f| f.file_name.clone());
            model_to_base_response(a, file_name)
        })
        .collect();
    Ok(result)
}