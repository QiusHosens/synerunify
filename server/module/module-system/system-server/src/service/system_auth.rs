use std::future::Future;
use std::net::SocketAddr;
use crate::convert::system_data_scope_rule::create_request_to_model;
use crate::grpc::client::captcha;
use anyhow::{anyhow, Result};
use common::constants::enums::DeviceType;
use common::utils::snowflake_generator::SnowflakeGenerator;
use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, QuerySelect};
use strum::IntoEnumIterator;
use std::sync::Arc;
use std::time::{Duration, Instant};
use axum::Json;
use chrono::Utc;
use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};
use system_model::request::system_auth::{LoginAccountRequest, LoginRequest};
use tokio::sync::OnceCell;
use tracing::{error, info};
use tracing_subscriber::filter::filter_fn;
use common::base::logger::{LoginLogger, OperationLogger};
use common::constants::common_status::{is_disable, is_enable};
use common::context::context::{DataPermission, LoginUserContext, RequestContext};
use common::database::redis::RedisManager;
use common::database::redis_constants::{REDIS_KEY_LOGGER_LOGIN_PREFIX, REDIS_KEY_LOGGER_OPERATION_PREFIX, REDIS_KEY_LOGIN_USER_PREFIX};
use common::utils::crypt_utils::verify_password;
use common::utils::jwt_utils::{generate_token_pair, is_valid_tenant, AuthBody, AuthError};
use system_model::response::system_auth::HomeResponse;
use system_model::response::system_department::SystemDepartmentResponse;
use crate::model::system_user::{Model as SystemUserModel};
use crate::service::{self, system_data_scope_rule, system_department, system_role, system_tenant, system_tenant_package, system_user_role};

use super::{system_menu, system_user};

pub async fn login(db: &DatabaseConnection, request_context: RequestContext, request: LoginRequest) -> Result<AuthBody> {
    let start = Instant::now();
    info!("into login: {:?}", request);
    // 验证验证码
    let status = captcha::check_status(request.captcha_key).await?;
    if !status {
        return Err(anyhow!("验证码校验失败"));
    }

    let auth = _login(db, request_context, request.username, request.password).await?;
    Ok(auth)
}

pub async fn login_account(db: &DatabaseConnection, request_context: RequestContext, request: LoginAccountRequest) -> Result<AuthBody> {
    let auth = _login(db, request_context, request.username, request.password).await?;
    Ok(auth)
}

async fn _login(db: &DatabaseConnection, request_context: RequestContext, username: String, password: String) -> Result<AuthBody> {
    let start = Instant::now();

    // 查询用户
    let user_result = service::system_user::get_by_username(db, username).await?;
    let user: SystemUserModel = match user_result {
        Some(user) => {
            if is_enable(user.status) {
                user
            } else {
                return Err(anyhow!("用户已被禁用"));
            }
        }
        None => {
            return Err(anyhow!("用户不存在"));
        }
    };
    let duration_select = start.elapsed();
    // 校验用户角色状态
    let role = system_user_role::get_user_role(&db, user.id).await?;
    match role {
        Some(role) => {
            if is_disable(role.status) {
                return Err(anyhow!("用户已被禁用"));
            }
        }
        None => {
            return Err(anyhow!("用户已被禁用"));
        }
    }
    // 校验用户部门状态
    let department = system_department::find_by_id(&db, user.department_id).await?;
    match department {
        Some(department) => {
            if is_disable(department.status) {
                return Err(anyhow!("用户已被禁用"));
            }
        }
        None => {
            return Err(anyhow!("用户已被禁用"));
        }
    }
    // 校验用户租户状态
    let tenant = system_tenant::find_by_id(&db, user.tenant_id).await?;
    match tenant {
        Some(tenant) => {
            if is_disable(tenant.status) {
                return Err(anyhow!("用户已被禁用"));
            } else {
                // 检查用户租户过期时间
                let now = Utc::now().naive_utc();
                if tenant.expire_time < now {
                    return Err(anyhow!("用户已过期"));
                }
                // 校验用户租户套餐状态
                let tenant_package = system_tenant_package::find_by_id(&db, user.department_id).await?;
                match tenant_package {
                    Some(tenant_package) => {
                        if is_disable(tenant_package.status) {
                            return Err(anyhow!("用户已被禁用"));
                        }
                    }
                    None => {
                        return Err(anyhow!("用户已被禁用"));
                    }
                }
            }
        }
        None => {
            return Err(anyhow!("用户已被禁用"));
        }
    }

    // 比较密码
    let is_match = match verify_password(password, user.clone().password) {
        Ok(is_match) => {
            is_match
        }
        Err(_) => {
            return Err(anyhow!("账号或密码不正确"));
        }
    };
    if !is_match {
        return Err(anyhow!("账号或密码不正确"));
    }
    let duration_match = start.elapsed();

    // 创建token
    let auth = match generate_token_pair(request_context.clone().device_type, user.clone().id, user.tenant_id) {
        Ok(auth) => auth,
        Err(_) => {
            return Err(anyhow!("服务端异常"));
        }
    };
    info!("auth: {:?}", auth);
    let duration_auth = start.elapsed();
    // 更新登录用户最近登录IP和时间
    // info!("request context: {:?}", request_context);
    // service::system_user::update_by_login(db, user.clone().id, request_context.clone().ip).await?;
    // // 记录登录日志
    // add_login_logger_redis(request_context.clone(), user.clone(), &auth).await?;
    // 保存登录用户信息缓存
    cache_login_user(db, request_context.clone(), user.clone()).await?;
    invoke_after_login(db, user.clone(), request_context.clone(), &auth);
    let duration_after = start.elapsed();
    println!("duration, select: {:?}, match: {:?}, auth: {:?}, after: {:?}", duration_select, duration_match, duration_auth, duration_after);
    Ok(auth)
}

pub async fn refresh_token(_db: &DatabaseConnection, refresh_token: String) -> Result<AuthBody> {
    let auth = match common::utils::jwt_utils::refresh_token(refresh_token).await {
        Ok(auth) => auth,
        Err(_) => {
            return Err(anyhow!("服务端异常"));
        }
    };
    Ok(auth)
}

pub async fn logout(_db: &DatabaseConnection, login_user: LoginUserContext) -> Result<()> {
    // 删除用户缓存
    RedisManager::delete::<_>(format!("{}{}:{}", REDIS_KEY_LOGIN_USER_PREFIX, login_user.device_type, login_user.id))?;
    Ok(())
}

pub async fn home(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<HomeResponse> {
    let system_user = system_user::find_by_id(db, login_user.id).await?;
    let nickname = system_user.map(|u| u.nickname).unwrap_or("".to_string());
    // 查询角色菜单
    let menus = system_menu::get_home_by_role_id(db, login_user.role_id).await?;

    let response = HomeResponse {
        nickname,
        menus
    };
    Ok(response)
}

pub async fn offline_user(_db: &DatabaseConnection, user_id: i64) -> Result<()> {
    // 删除用户所有端缓存
    for device in DeviceType::iter() {
        // 获取字符串形式
        let device_str: &'static str = device.into();
        RedisManager::delete::<_>(format!("{}{}:{}", REDIS_KEY_LOGIN_USER_PREFIX, device_str, user_id))?;
    }
    Ok(())
}

fn invoke_after_login(db: &DatabaseConnection, user: SystemUserModel, request_context: RequestContext, auth: &AuthBody) {
    let db_clone = db.clone();
    let auth_clone = auth.clone();
    tokio::spawn(async move {
        // 保存登录用户信息缓存
        // if let Err(e) = cache_login_user(&db_clone, request_context.clone(), user.clone()).await {
        //     error!("cache login user error: {}", e.to_string());
        // }
        // 更新登录用户最近登录IP和时间
        info!("request context: {:?}", request_context);
        if let Err(e) = system_user::update_by_login(&db_clone, user.clone().id, request_context.clone().ip).await {
            error!("update login error: {}", e.to_string());
        }
        // 记录登录日志
        if let Err(e) = add_login_logger_redis(request_context.clone(), user.clone(), &auth_clone).await {
            error!("add login logger error: {}", e.to_string());
        };
    });
}

async fn cache_login_user(db: &DatabaseConnection, request_context: RequestContext, user: SystemUserModel) -> Result<()> {
    // 查询部门信息
    let _department_result = system_department::find_by_id(&db, user.department_id).await?;
    let role_id = system_user_role::get_role_id_by_user_id(&db, user.id).await?;
    info!("role id {:?}", role_id);
    // 菜单权限
    let permissions = system_menu::get_role_menus_permissions(&db, role_id).await?;
    info!("permissions {:?}", permissions);
    // 数据权限
    let role = system_role::find_by_id(&db, role_id).await?;
    let mut data_permission: Option<DataPermission> = None;
    if let Some(role) = role {
        if let Some(rule_id) = role.data_scope_rule_id {
            let rule = system_data_scope_rule::find_by_id(&db, rule_id).await?;
            if let Some(rule) = rule {
                data_permission = Some(DataPermission {
                    id: rule.id,
                    name: rule.name,
                    field: rule.field,
                    condition: rule.condition,
                    value: rule.value,
                    data_scope_department_ids: role.data_scope_department_ids
                });
            }
        }
    }
    let login_user = LoginUserContext {
        device_type: request_context.clone().device_type,
        id: user.id,
        nickname: user.nickname,
        tenant_id: user.tenant_id,
        department_id: user.department_id,
        department_code: user.department_code,
        role_id,
        permissions,
        data_permission,
    };
    info!("login user {:?}", login_user);
    RedisManager::set::<_, String>(format!("{}{}:{}", REDIS_KEY_LOGIN_USER_PREFIX, request_context.device_type, user.id), serde_json::to_string(&login_user)?)?;
    Ok(())
}

async fn add_login_logger_redis(request_context: RequestContext, user: SystemUserModel, auth: &AuthBody) -> Result<()> {
    let result = serde_json::to_string(&auth)?;
    let user_id = user.id;
    let username = user.username;
    let user_nickname = user.nickname;
    let tenant_id = user.tenant_id;
    let department_code = user.department_code;
    let department_id = user.department_id;

    let mut login_logger = LoginLogger {
        id: None,
        trace_id: None,
        user_id: Some(user_id),
        user_type: None,
        username,
        result,
        user_ip: request_context.ip,
        user_agent: request_context.user_agent,
        department_code: Some(department_code),
        department_id: Some(department_id),
        operator: Some(user_id),
        operator_nickname: Some(user_nickname),
        operate_time: Some(Utc::now().timestamp()),
        deleted: Some(false),
        tenant_id: Some(tenant_id)
    };
    // 生成id
    let generator = SnowflakeGenerator::new_with_machine_id(1000).unwrap();
    match generator.generate() {
        Ok(id) => login_logger.id = Some(id),
        Err(e) => login_logger.id = None
    }
    info!("login logger: {:?}", login_logger);
    RedisManager::push_list::<_, String>(REDIS_KEY_LOGGER_LOGIN_PREFIX, serde_json::to_string(&login_logger)?)?;
    Ok(())
}