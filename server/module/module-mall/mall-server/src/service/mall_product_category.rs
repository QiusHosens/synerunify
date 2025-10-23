use common::interceptor::orm::simple_support::SimpleSupport;
use sea_orm::{DatabaseConnection, EntityTrait, Order, ColumnTrait, ActiveModelTrait, PaginatorTrait, QueryOrder, QueryFilter, Condition, Statement, FromQueryResult, DatabaseBackend};
use crate::model::mall_product_category::{Model as MallProductCategoryModel, ActiveModel as MallProductCategoryActiveModel, Entity as MallProductCategoryEntity, Column};
use mall_model::request::mall_product_category::{CreateMallProductCategoryRequest, UpdateMallProductCategoryRequest, PaginatedKeywordRequest};
use mall_model::response::mall_product_category::MallProductCategoryResponse;
use crate::convert::mall_product_category::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use sea_orm::ActiveValue::Set;
use common::constants::enum_constants::{ROOT_TENANT_ID, STATUS_DISABLE, STATUS_ENABLE};
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateMallProductCategoryRequest) -> Result<i64> {
    let mut mall_product_category = create_request_to_model(&request);
    mall_product_category.creator = Set(Some(login_user.id));
    mall_product_category.updater = Set(Some(login_user.id));
    mall_product_category.tenant_id = Set(login_user.tenant_id);
    let mall_product_category = mall_product_category.insert(db).await?;
    Ok(mall_product_category.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateMallProductCategoryRequest) -> Result<()> {
    let mall_product_category = MallProductCategoryEntity::find_by_id(request.id)
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut mall_product_category = update_request_to_model(&request, mall_product_category);
    mall_product_category.updater = Set(Some(login_user.id));
    mall_product_category.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let mall_product_category = MallProductCategoryActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    mall_product_category.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<MallProductCategoryResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let mall_product_category = MallProductCategoryEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(mall_product_category.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<MallProductCategoryResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));
    let paginator = MallProductCategoryEntity::find_active_with_condition(condition)
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<MallProductCategoryResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = MallProductCategoryEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

pub async fn list_root_by_parent_id(db: &DatabaseConnection, parent_id: i64) -> Result<Vec<MallProductCategoryResponse>> {
    let list = MallProductCategoryEntity::find_active()
        .filter(Column::TenantId.eq(ROOT_TENANT_ID))
        .filter(Column::ParentId.eq(parent_id))
        .support_order(None, None, Some(vec![(Column::Sort, Order::Asc)]))
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

pub async fn list_root_all_by_parent_id(db: &DatabaseConnection, parent_id: i64) -> Result<Vec<MallProductCategoryResponse>> {
    let stmt = Statement::from_sql_and_values(
        DatabaseBackend::MySql,
        r#"
            WITH RECURSIVE category_tree AS (
                SELECT * FROM mall_product_category WHERE parent_id = ? AND tenant_id = ? AND deleted = false AND status = ?
                UNION ALL
                SELECT c.* FROM mall_product_category c
                INNER JOIN category_tree ct ON c.parent_id = ct.id
                WHERE c.deleted = false AND c.status = ?
            )
            SELECT * FROM category_tree ORDER BY sort ASC
        "#,
        [parent_id.into(), ROOT_TENANT_ID.into(), STATUS_ENABLE.into(), STATUS_ENABLE.into()],
    );
    
    let list = MallProductCategoryModel::find_by_statement(stmt)
        .all(db)
        .await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

pub async fn enable(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let mall_product_category = MallProductCategoryActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        status: Set(STATUS_ENABLE),
        ..Default::default()
    };
    mall_product_category.update(db).await?;
    Ok(())
}

pub async fn disable(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let mall_product_category = MallProductCategoryActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        status: Set(STATUS_DISABLE),
        ..Default::default()
    };
    mall_product_category.update(db).await?;
    Ok(())
}