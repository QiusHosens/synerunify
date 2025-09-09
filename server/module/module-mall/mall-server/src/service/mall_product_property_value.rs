use std::collections::{HashMap, HashSet};
use common::interceptor::orm::simple_support::SimpleSupport;
use sea_orm::{DatabaseConnection, EntityTrait, Order, ColumnTrait, ActiveModelTrait, PaginatorTrait, QueryOrder, QueryFilter, Condition, DatabaseTransaction, QuerySelect, JoinType, RelationTrait};
use crate::model::mall_product_property_value::{Model as MallProductPropertyValueModel, ActiveModel as MallProductPropertyValueActiveModel, Entity as MallProductPropertyValueEntity, Column, Relation};
use crate::model::mall_product_property::{Model as MallProductPropertyModel, Entity as MallProductPropertyEntity};
use mall_model::request::mall_product_property_value::{CreateMallProductPropertyValueRequest, UpdateMallProductPropertyValueRequest, PaginatedKeywordRequest};
use mall_model::response::mall_product_property_value::{MallProductPropertyValueBaseResponse, MallProductPropertyValueInfoResponse, MallProductPropertyValueResponse};
use crate::convert::mall_product_property_value::{create_request_to_model, update_request_to_model, model_to_response, update_add_request_to_model, model_to_base_response, model_to_info_response};
use anyhow::{Result, anyhow, Context};
use sea_orm::ActiveValue::Set;
use sea_orm::prelude::Expr;
use common::constants::enum_constants::{STATUS_DISABLE, STATUS_ENABLE};
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;
use file_common::service::system_file;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateMallProductPropertyValueRequest) -> Result<i64> {
    let mut mall_product_property_value = create_request_to_model(&request);
    mall_product_property_value.creator = Set(Some(login_user.id));
    mall_product_property_value.updater = Set(Some(login_user.id));
    mall_product_property_value.tenant_id = Set(login_user.tenant_id);
    let mall_product_property_value = mall_product_property_value.insert(db).await?;
    Ok(mall_product_property_value.id)
}

pub async fn create_batch(db: &DatabaseConnection, txn: &DatabaseTransaction, login_user: LoginUserContext, property_id: i64, requests: Vec<CreateMallProductPropertyValueRequest>) -> Result<()> {
    let models: Vec<MallProductPropertyValueActiveModel> = requests
        .into_iter()
        .map(|request| {
            let mut model = create_request_to_model(&request);
            model.property_id = Set(Some(property_id));
            model.creator = Set(Some(login_user.id));
            model.updater = Set(Some(login_user.id));
            model.tenant_id = Set(login_user.tenant_id);
            model
        }).collect();

    if !models.is_empty() {
        MallProductPropertyValueEntity::insert_many(models)
            .exec(txn)
            .await
            .with_context(|| "Failed to save values")?;
    }
    Ok(())
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateMallProductPropertyValueRequest) -> Result<()> {
    let id = match request.id {
        Some(id) => id,
        None => return Err(anyhow!("缺少属性值ID")),
    };
    let mall_product_property_value = MallProductPropertyValueEntity::find_by_id(id)
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut mall_product_property_value = update_request_to_model(&request, mall_product_property_value);
    mall_product_property_value.updater = Set(Some(login_user.id));
    mall_product_property_value.update(db).await?;
    Ok(())
}

pub async fn update_batch(db: &DatabaseConnection, txn: &DatabaseTransaction, login_user: LoginUserContext, property: MallProductPropertyModel, requests: Vec<UpdateMallProductPropertyValueRequest>) -> Result<()> {
    // 查询已存在属性值
    let existing_values = MallProductPropertyValueEntity::find()
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .filter(Column::PropertyId.eq(property.id))
        .all(db)
        .await?;

    // 构造 HashMap 加速查询
    let existing_map: HashMap<i64, MallProductPropertyValueModel> =
        existing_values.iter().map(|a| (a.id, a.clone())).collect();

    // 拆分请求为新增 / 更新两类
    let (to_add, to_update): (Vec<_>, Vec<_>) = requests.into_iter().partition(|r| r.id.is_none());

    // 所有 id
    let request_value_ids: HashSet<i64> = to_update.iter().filter_map(|a| a.id).collect();
    let existing_value_ids: HashSet<i64> = existing_map.keys().copied().collect();

    // 删除的 detail id = 旧的 - 新的
    let to_mark_deleted: Vec<i64> = existing_value_ids
        .difference(&request_value_ids)
        .copied()
        .collect();

    // 批量新增
    if !to_add.is_empty() {
        let models: Vec<MallProductPropertyValueActiveModel> = to_add
            .into_iter()
            .map(|request| {
                let mut model = update_add_request_to_model(&request);
                model.property_id = Set(Some(property.id));
                model.creator = Set(Some(login_user.id));
                model.updater = Set(Some(login_user.id));
                model.tenant_id = Set(property.tenant_id);
                model
            })
            .collect();

        MallProductPropertyValueEntity::insert_many(models)
            .exec(txn)
            .await
            .with_context(|| "Failed to insert values")?;
    }

    // 批量逻辑删除
    if !to_mark_deleted.is_empty() {
        MallProductPropertyValueEntity::update_many()
            .col_expr(Column::Deleted, Expr::value(1))
            .col_expr(Column::Updater, Expr::value(login_user.id))
            .filter(Column::PropertyId.eq(property.id))
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
    let mall_product_property_value = MallProductPropertyValueActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    mall_product_property_value.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<MallProductPropertyValueResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let mall_product_property_value = MallProductPropertyValueEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(mall_product_property_value.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<MallProductPropertyValueResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let paginator = MallProductPropertyValueEntity::find_active_with_condition(condition)
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<MallProductPropertyValueResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = MallProductPropertyValueEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

pub async fn list_by_ids(db: &DatabaseConnection, login_user: LoginUserContext, ids: Vec<i64>) -> Result<Vec<MallProductPropertyValueInfoResponse>> {
    let list = MallProductPropertyValueEntity::find_active()
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .filter(Column::Id.is_in(ids))
        .select_also(MallProductPropertyEntity)
        .join(JoinType::LeftJoin, Relation::Property.def())
        .all(db).await?;
    Ok(list.into_iter().map(|(model, model_property)|model_to_info_response(model, model_property)).collect())
}

pub async fn list_by_property_id(db: &DatabaseConnection, login_user: LoginUserContext, property_id: i64) -> Result<Vec<MallProductPropertyValueBaseResponse>> {
    let list = MallProductPropertyValueEntity::find_active()
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .filter(Column::PropertyId.eq(property_id))
        .all(db).await?;
    Ok(list.into_iter().map(model_to_base_response).collect())
}

pub async fn list_by_property_ids(db: &DatabaseConnection, login_user: LoginUserContext, property_ids: Vec<i64>) -> Result<Vec<MallProductPropertyValueBaseResponse>> {
    let list = MallProductPropertyValueEntity::find_active()
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .filter(Column::PropertyId.is_in(property_ids))
        .all(db).await?;
    Ok(list.into_iter().map(model_to_base_response).collect())
}

pub async fn enable(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let mall_product_property_value = MallProductPropertyValueActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        status: Set(STATUS_ENABLE),
        ..Default::default()
    };
    mall_product_property_value.update(db).await?;
    Ok(())
}

pub async fn disable(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let mall_product_property_value = MallProductPropertyValueActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        status: Set(STATUS_DISABLE),
        ..Default::default()
    };
    mall_product_property_value.update(db).await?;
    Ok(())
}