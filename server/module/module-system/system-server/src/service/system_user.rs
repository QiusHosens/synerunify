use std::str::FromStr;

use common::constants::enum_constants::{STATUS_DISABLE, STATUS_ENABLE};
use common::utils::crypt_utils::{encrypt_password, verify_password};
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, DatabaseTransaction, EntityTrait, JoinType, PaginatorTrait, QueryFilter, QueryOrder, QuerySelect, RelationTrait, TransactionTrait};
use tokio::io::join;
use crate::model::system_user::{Model as SystemUserModel, ActiveModel as SystemUserActiveModel, Entity as SystemUserEntity, Column, Relation};
use crate::model::system_user_role::{Model as SystemUserRoleModel, ActiveModel as SystemUserRoleActiveModel, Entity as SystemUserRoleEntity, Column as SystemUserRoleColumn, Relation as SystemUserRoleRelation};
use crate::model::system_department::{Model as SystemDepartmentModel, ActiveModel as SystemDepartmentActiveModel, Entity as SystemDepartmentEntity};
use crate::model::system_role::{Model as SystemRoleModel, ActiveModel as SystemRoleActiveModel, Entity as SystemRoleEntity};
use system_model::request::system_user::{CreateSystemUserRequest, EditPasswordSystemUserRequest, PaginatedKeywordRequest, ResetPasswordSystemUserRequest, UpdateSystemUserRequest};
use system_model::response::system_user::{SystemUserBaseResponse, SystemUserPageResponse, SystemUserResponse};
use crate::convert::system_user::{create_request_to_model, model_to_base_response, model_to_page_response, model_to_response, update_request_to_model};
use anyhow::{anyhow, Context, Result};
use chrono::Utc;
use sea_orm::ActiveValue::Set;
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

use super::{system_auth, system_department, system_user_post, system_user_role};

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateSystemUserRequest) -> Result<i64> {
    // 查询账号是否存在
    let exists = exist_username(&db, request.username.clone())
        .await;
    if exists {
        return Err(anyhow!("账号已存在"));
    }
    let crypt_password = encrypt_password(request.password.clone()).with_context(|| "加密失败")?;
    // 查询部门编码
    let department = system_department::find_by_id(&db, request.department_id).await?.ok_or_else(|| anyhow!("部门未找到"))?;
    // 开启事务
    let txn = db.begin().await?;
    // 保存用户
    let mut system_user = create_request_to_model(&request);
    system_user.password = Set(crypt_password);
    system_user.department_code = Set(department.code);
    system_user.creator = Set(Some(login_user.id));
    system_user.updater = Set(Some(login_user.id));
    system_user.tenant_id = Set(login_user.tenant_id);
    let system_user = system_user.insert(&txn).await?;
    // 保存用户角色对应关系
    system_user_role::save(&db, &txn, login_user.clone(), system_user.id, request.role_id).await?;
    // 保存用户岗位对应关系
    system_user_post::save(db, &txn, login_user, system_user.id, request.post_ids).await?;
    // 提交事务
    txn.commit().await.with_context(|| "Failed to commit transaction")?;
    Ok(system_user.id)
}

// 创建租户管理员
pub async fn create_tenant_admin(db: &DatabaseConnection, txn: &DatabaseTransaction, login_user: LoginUserContext, username: String, password: String, nickname: String, mobile: Option<String>, department_code: String, department_id: i64, tenant_id: i64) -> Result<i64> {
    // 检查账号是否存在
    let exists = exist_username(&db, username.clone())
        .await;
    if exists {
        return Err(anyhow!("账号已存在"));
    }

    let crypt_password = encrypt_password(password).with_context(|| "Failed to encrypt password")?;
    let system_user = SystemUserActiveModel {
        username: Set(username),
        password: Set(crypt_password),
        nickname: Set(nickname),
        mobile: Set(mobile),
        status: Set(STATUS_ENABLE),
        department_code: Set(department_code),
        department_id: Set(department_id),
        creator: Set(Some(login_user.id)),
        updater: Set(Some(login_user.id)),
        tenant_id: Set(tenant_id),
        ..Default::default()
    };
    let system_user = system_user.insert(txn).await.with_context(|| "Failed to insert user")?;
    Ok(system_user.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateSystemUserRequest) -> Result<()> {
    let system_user = SystemUserEntity::find_by_id(request.id)
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let department_code = match request.department_id {
        Some(department_id) => {
            // 查询部门编码
            let department = system_department::find_by_id(&db, department_id).await?.ok_or_else(|| anyhow!("部门未找到"))?;
            Some(department.code)
        },
        None => None
    };

    // 开启事务
    let txn = db.begin().await?;
    // 保存用户角色对应关系
    system_user_role::save(&db, &txn, login_user.clone(), system_user.id, request.role_id);
    // 保存用户岗位对应关系
    system_user_post::save(db, &txn, login_user.clone(), system_user.id, request.post_ids.clone());
    // 更新用户
    let mut system_user = update_request_to_model(&request, system_user);
    if let Some(department_code) = department_code { 
        system_user.department_code = Set(department_code.clone());
    }
    system_user.updater = Set(Some(login_user.id));
    system_user.update(&txn).await?;

    // 提交事务
    txn.commit().await.with_context(|| "Failed to commit transaction")?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let system_user = SystemUserActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    system_user.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<SystemUserResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let system_user = SystemUserEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(system_user.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<SystemUserPageResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));

    let mut query = SystemUserEntity::find_active_with_condition(condition)
        .select_also(SystemRoleEntity)
        .select_also(SystemDepartmentEntity)
        .join(JoinType::LeftJoin, Relation::UserRole.def())
        .join(JoinType::LeftJoin, SystemUserRoleRelation::Role.def())
        .join(JoinType::LeftJoin, Relation::UserDepartment.def());

    // Apply department code filter if not empty
    if let Some(department_code) = &params.department_code {
        if !department_code.is_empty() {
            query = query.filter(
                Condition::any()
                    .add(Column::DepartmentCode.like(format!("%{}", department_code))),
            );
        }
    }

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
        .map(|(data, role_data, department_data)|model_to_page_response(data, role_data, department_data))
        .collect();

    Ok(PaginatedResponse {
        list,
        total_pages,
        page: params.base.page,
        size: params.base.size,
        total,
    })
}

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<SystemUserResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = SystemUserEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

pub async fn enable(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let system_user = SystemUserActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        status: Set(STATUS_ENABLE),
        ..Default::default()
    };
    system_user.update(db).await?;
    Ok(())
}

pub async fn disable(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let system_user = SystemUserActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        status: Set(STATUS_DISABLE),
        ..Default::default()
    };
    system_user.update(db).await?;
    Ok(())
}

pub async fn reset_password(db: &DatabaseConnection, login_user: LoginUserContext, request: ResetPasswordSystemUserRequest) -> Result<()> {
    let crypt_password = encrypt_password(request.password).with_context(|| "加密失败")?;
    let system_user = SystemUserActiveModel {
        id: Set(request.id),
        updater: Set(Some(login_user.id)),
        password: Set(crypt_password),
        ..Default::default()
    };
    system_user.update(db).await?;
    Ok(())
}

pub async fn edit_password(db: &DatabaseConnection, login_user: LoginUserContext, request: EditPasswordSystemUserRequest) -> Result<()> {
    let system_user = SystemUserEntity::find_by_id(request.id)
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;
    // 比较旧密码
    let is_match = match verify_password(request.old_password, system_user.password) {
        Ok(is_match) => {
            is_match
        }
        Err(_) => {
            return Err(anyhow!("旧密码错误"));
        }
    };
    if !is_match {
        return Err(anyhow!("旧密码错误"));
    }
    let crypt_password = encrypt_password(request.new_password).with_context(|| "加密失败")?;
    let system_user = SystemUserActiveModel {
        id: Set(request.id),
        updater: Set(Some(login_user.id)),
        password: Set(crypt_password),
        ..Default::default()
    };
    system_user.update(db).await?;
    Ok(())
}

pub async fn get_by_username(db: &DatabaseConnection, username: String) -> Result<Option<SystemUserModel>> {
    let system_user = SystemUserEntity::find_active()
        .filter(Column::Username.eq(username))
        .one(db).await?;
    Ok(system_user)
}

pub async fn update_by_login(db: &DatabaseConnection, id: i64, login_ip: String) -> Result<()> {
    let system_user = SystemUserActiveModel {
        id: Set(id),
        login_ip: Set(Some(login_ip)),
        login_date: Set(Some(Utc::now().naive_utc())),
        ..Default::default()
    };
    system_user.update(db).await?;
    Ok(())
}

pub async fn find_by_id(db: &DatabaseConnection, id: i64) -> Result<Option<SystemUserResponse>> {
    let system_user = SystemUserEntity::find_active_by_id(id)
        .one(db).await?;
    Ok(system_user.map(model_to_response))
}

pub async fn list_department_user(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<SystemUserBaseResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));
    let list = SystemUserEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_base_response).collect())
}

pub async fn offline_tenant_user(db: &DatabaseConnection, tenant_id: i64) -> Result<()> {
    let condition = Condition::all().add(Column::TenantId.eq(tenant_id));
    let list = SystemUserEntity::find_active_with_condition(condition)
        .all(db).await?;
    for user in list {
        system_auth::offline_user(&db, user.id);
    }
    Ok(())
}

pub async fn offline_tenants_user(db: &DatabaseConnection, tenant_ids: Vec<i64>) -> Result<()> {
    if tenant_ids.is_empty() {
        return Ok(());
    }
    let condition = Condition::all().add(Column::TenantId.is_in(tenant_ids));
    let list = SystemUserEntity::find_active_with_condition(condition)
        .all(db).await?;
    for user in list {
        system_auth::offline_user(&db, user.id);
    }
    Ok(())
}

async fn exist_username(db: &DatabaseConnection, username: String) -> bool {
    SystemUserEntity::find()
        .filter(Column::Username.eq(username))
        .one(db)
        .await
        .map(|result| result.is_some())
        .unwrap_or(false)
}