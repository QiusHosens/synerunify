use common::interceptor::orm::simple_support::SimpleSupport;
use sea_orm::{DatabaseConnection, EntityTrait, Order, ColumnTrait, ActiveModelTrait, PaginatorTrait, QueryOrder, QueryFilter, Condition, TransactionTrait, QuerySelect, JoinType, RelationTrait};
use crate::model::mall_product_spu::{Model as MallProductSpuModel, ActiveModel as MallProductSpuActiveModel, Entity as MallProductSpuEntity, Column, Relation};
use mall_model::request::mall_product_spu::{CreateMallProductSpuRequest, UpdateMallProductSpuRequest, PaginatedKeywordRequest, PaginatedCategoryKeywordRequest};
use mall_model::response::mall_product_spu::{MallProductSpuBaseResponse, MallProductSpuInfoResponse, MallProductSpuResponse};
use crate::model::mall_product_category::{Entity as MallProductCategoryEntity};
use crate::model::mall_product_brand::{Entity as MallProductBrandEntity};
use crate::model::mall_trade_delivery_express_template::{Entity as MallTradeDeliveryExpressTemplateEntity};
use crate::convert::mall_product_spu::{create_request_to_model, update_request_to_model, model_to_response, model_to_base_response, model_to_info_response};
use anyhow::{Result, anyhow, Context};
use sea_orm::ActiveValue::Set;
use common::constants::enum_constants::{STATUS_DISABLE, STATUS_ENABLE};
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;
use crate::service::{mall_product_sku, mall_trade_delivery_express_template};

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateMallProductSpuRequest) -> Result<i64> {
    if request.skus.is_empty() {
        return Err(anyhow!("请填写规格信息"));
    }
    let mut mall_product_spu = create_request_to_model(&request, request.skus.get(0).unwrap());
    mall_product_spu.creator = Set(Some(login_user.id));
    mall_product_spu.updater = Set(Some(login_user.id));
    mall_product_spu.tenant_id = Set(login_user.tenant_id);

    // 开启事务
    let txn = db.begin().await?;
    // 创建spu
    let mall_product_spu = mall_product_spu.insert(&txn).await?;
    // 创建sku
    mall_product_sku::create_batch(&db, &txn, login_user.clone(), mall_product_spu.id, request.skus).await?;
    // 提交事务
    txn.commit().await.with_context(|| "Failed to commit transaction")?;
    Ok(mall_product_spu.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateMallProductSpuRequest) -> Result<()> {
    if request.skus.is_empty() {
        return Err(anyhow!("请填写规格信息"));
    }
    let mall_product_spu = MallProductSpuEntity::find_by_id(request.id)
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let spu = mall_product_spu.clone();

    let mut mall_product_spu = update_request_to_model(&request, request.skus.get(0).unwrap(), mall_product_spu);
    mall_product_spu.updater = Set(Some(login_user.id));

    // 开启事务
    let txn = db.begin().await?;
    // 更新spu
    mall_product_spu.update(&txn).await?;
    // 更新sku
    mall_product_sku::update_batch(&db, &txn, login_user.clone(), spu, request.skus).await?;
    // 提交事务
    txn.commit().await.with_context(|| "Failed to commit transaction")?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let mall_product_spu = MallProductSpuActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    mall_product_spu.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<MallProductSpuResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let mall_product_spu = MallProductSpuEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(mall_product_spu.map(model_to_response))
}

pub async fn get_base_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<MallProductSpuBaseResponse>> {
    let condition = Condition::all()
        .add(Column::Id.eq(id))
        .add(Column::TenantId.eq(login_user.tenant_id));

    let mall_product_spu = MallProductSpuEntity::find_active_with_condition(condition)
        .one(db).await?;

    if mall_product_spu.is_none() {
        return Ok(None);
    }
    let mall_product_spu = mall_product_spu.unwrap();
    let skus = mall_product_sku::list_base_by_spu_id(&db, login_user, id).await?;
    Ok(Some(model_to_base_response(mall_product_spu, skus)))
}

pub async fn get_info_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<MallProductSpuInfoResponse>> {
    let condition = Condition::all()
        .add(Column::Id.eq(id))
        .add(Column::TenantId.eq(login_user.tenant_id));

    let mall_product_spu = MallProductSpuEntity::find_active_with_data_permission(login_user.clone())
        .filter(condition)
        .select_also(MallProductCategoryEntity)
        .select_also(MallProductBrandEntity)
        .join(JoinType::LeftJoin, Relation::ProductCategory.def())
        .join(JoinType::LeftJoin, Relation::ProductBrand.def())
        .one(db).await?;

    if mall_product_spu.is_none() {
        return Ok(None);
    }
    let (product_spu, category, brand) = mall_product_spu.unwrap();
    let mut delivery_template = None;
    if let Some(delivery_template_id) = product_spu.delivery_template_id {
        delivery_template = mall_trade_delivery_express_template::find_by_id(&db, login_user.clone(), delivery_template_id).await?;
    }
    let skus = mall_product_sku::list_base_by_spu_id(&db, login_user, id).await?;
    Ok(Some(model_to_info_response(product_spu, category, brand, delivery_template, skus)))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<MallProductSpuResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));
    let paginator = MallProductSpuEntity::find_active_with_condition(condition)
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

pub async fn get_paginated_all(db: &DatabaseConnection, params: PaginatedCategoryKeywordRequest) -> Result<PaginatedResponse<MallProductSpuResponse>> {
    let condition = Condition::all()
        .add(Column::CategoryId.eq(params.category_id))
        .add(Column::Status.eq(STATUS_ENABLE));
        
    let paginator = MallProductSpuEntity::find_active_with_condition(condition)
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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<MallProductSpuResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = MallProductSpuEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

pub async fn enable(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let mall_product_spu = MallProductSpuActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        status: Set(STATUS_ENABLE),
        ..Default::default()
    };
    mall_product_spu.update(db).await?;
    Ok(())
}

pub async fn disable(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let mall_product_spu = MallProductSpuActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        status: Set(STATUS_DISABLE),
        ..Default::default()
    };
    mall_product_spu.update(db).await?;
    Ok(())
}