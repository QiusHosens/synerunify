use std::str::FromStr;

use chrono::Utc;
use common::constants::enum_constants::{STATUS_DISABLE, STATUS_ENABLE};
use sea_orm::prelude::Expr;
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, DbErr, EntityTrait, JoinType, PaginatorTrait, QueryFilter, QueryOrder, QuerySelect, RelationTrait, TransactionTrait};
use system_model::request::system_user::CreateSystemUserRequest;
use crate::model::system_tenant::{Model as SystemTenantModel, ActiveModel as SystemTenantActiveModel, Entity as SystemTenantEntity, Column, Relation};
use crate::model::system_tenant_package::{Model as SystemTenantPackageModel, ActiveModel as SystemTenantPackageActiveModel, Entity as SystemTenantPackageEntity, Column as SystemTenantPackageColumn};
use system_model::request::system_tenant::{CreateSystemTenantRequest, UpdateSystemTenantRequest, PaginatedKeywordRequest};
use system_model::response::system_tenant::{SystemTenantPageResponse, SystemTenantResponse};
use crate::convert::system_tenant::{create_request_to_model, model_page_to_response, model_to_response, update_request_to_model};
use anyhow::{anyhow, Context, Result};
use sea_orm::ActiveValue::Set;
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;
use tracing::{error, info};

use super::system_department::create_tenant_root;
use super::system_user::{self, create_tenant_admin};

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateSystemTenantRequest) -> Result<i64> {
    // error!("{:?}", request);
    // 获取租户id
    let max_tenant = SystemTenantEntity::find()
        .order_by_desc(Column::Id)
        .limit(1)
        .one(db)
        .await?;
    // error!("max tenant, {:?}", max_tenant);
    let max_tenant_id = max_tenant.map_or(0, |tenant| tenant.id);
    let new_tenant_id = max_tenant_id + 1;

    // 开启事务
    let txn = db.begin().await?;
    // 创建租户根部门
    info!("create department");
    let department = create_tenant_root(&db, &txn, login_user.clone(), request.name.clone(), new_tenant_id).await?;
    // 创建租户管理员用户
    info!("create user");
    let user_id = create_tenant_admin(&db, &txn, login_user.clone(), request.username.clone(), request.password.clone(), 
        request.nickname.clone(), request.contact_mobile.clone(), department.code.clone(), department.id.clone(), new_tenant_id).await?;
    // 创建租户
    info!("create tenant");
    let mut system_tenant = create_request_to_model(&request);
    system_tenant.id = Set(new_tenant_id);
    system_tenant.contact_user_id = Set(Some(user_id));
    system_tenant.creator = Set(Some(login_user.id));
    system_tenant.updater = Set(Some(login_user.id));
    
    let system_tenant = system_tenant.insert(&txn).await.with_context(|| "Failed to insert tenant")?;

    // 提交事务
    txn.commit().await.with_context(|| "Failed to commit transaction")?;
    
    Ok(system_tenant.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateSystemTenantRequest) -> Result<()> {
    let system_tenant = SystemTenantEntity::find_by_id(request.id)
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut system_tenant = update_request_to_model(&request, system_tenant);
    system_tenant.updater = Set(Some(login_user.id));
    system_tenant.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let system_tenant = SystemTenantActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    system_tenant.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<SystemTenantResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id));
    let system_tenant = SystemTenantEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(system_tenant.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<SystemTenantPageResponse>> {
    let mut query = SystemTenantEntity::find_active()
        .select_also(SystemTenantPackageEntity)
        .join(JoinType::LeftJoin, Relation::PackageType.def());

    // Apply sort if not empty
    let mut is_default_sort = true;
    if let Some(field) = &params.base.field {
        if let Some(sort) = &params.base.sort {
            let is_asc = sort.to_lowercase() == "asc";
            // 动态应用排序，假设字段名与数据库列名一致
            match field.as_str() {
                // SystemDictDataEntity 的字段
                f if Column::from_str(f).is_ok() => {
                    let column = Column::from_str(f).unwrap();
                    is_default_sort = false;
                    query = if is_asc {
                        query.order_by_asc(column)
                    } else {
                        query.order_by_desc(column)
                    };
                }
                _ => {}
            }
        }
    }

    if is_default_sort {
        query = query
            .order_by_asc(Column::Id);
    }

    let paginator = query
        .paginate(db, params.base.size);

    let total = paginator.num_items().await?;
    let total_pages = (total + params.base.size - 1) / params.base.size; // 向上取整
    let list = paginator
        .fetch_page(params.base.page - 1) // SeaORM 页码从 0 开始，所以减 1
        .await?
        .into_iter()
        .map(|(data, package_data)|model_page_to_response(data, package_data))
        .collect();

    Ok(PaginatedResponse {
        list,
        total_pages,
        page: params.base.page,
        size: params.base.size,
        total,
    })
}

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<SystemTenantResponse>> {
    let list = SystemTenantEntity::find_active()
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

pub async fn enable(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let system_tenant = SystemTenantActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        status: Set(STATUS_ENABLE),
        ..Default::default()
    };
    system_tenant.update(db).await?;
    Ok(())
}

pub async fn disable(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let system_tenant = SystemTenantActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        status: Set(STATUS_DISABLE),
        ..Default::default()
    };
    system_tenant.update(db).await?;
    // 下线租户用户
    system_user::offline_tenant_user(&db, id).await?;
    Ok(())
}

pub async fn list_all(db: &DatabaseConnection) -> Result<Vec<SystemTenantModel>> {
    Ok(SystemTenantEntity::find_active().all(db).await?)
}

pub async fn offline_tenant_package_user(db: &DatabaseConnection, tenant_package_id: i64) -> Result<()> {
    let list = SystemTenantEntity::find_active()
        .filter(Column::PackageId.eq(tenant_package_id))
        .all(db).await?;
    let tenant_ids = list.iter().map(|tenant| tenant.id).collect();
    system_user::offline_tenants_user(&db, tenant_ids).await?;
    Ok(())
}

pub async fn find_by_id(db: &DatabaseConnection, id: i64) -> Result<Option<SystemTenantModel>> {       
    let system_tenant = SystemTenantEntity::find_active_by_id(id)
        .one(db).await?;
    Ok(system_tenant)
}

/// 检查过期租户并处理
pub async fn check_expire_tenant(db: &DatabaseConnection) -> Result<Vec<i64>> {
    // 获取当前时间
    let now = Utc::now().naive_utc();

    // 更新 expire_time 小于当前时间且未删除的租户，设置 status 为 禁用
    let update_result = SystemTenantEntity::update_many()
        .col_expr(Column::Status, Expr::value(STATUS_DISABLE))
        .filter(Column::ExpireTime.lt(now))
        .filter(Column::Deleted.eq(false))
        .exec(db)
        .await?;

    // 查询过期租户 ID
    let affected_ids = SystemTenantEntity::find()
        .select_only()
        .column(Column::Id)
        .filter(Column::ExpireTime.lt(now))
        .filter(Column::Deleted.eq(false))
        .into_tuple::<i64>()
        .all(db)
        .await?;

    // 下线租户用户
    system_user::offline_tenants_user(&db, affected_ids.clone()).await?;

    Ok(affected_ids)
}