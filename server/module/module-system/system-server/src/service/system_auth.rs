use std::future::Future;
use std::net::SocketAddr;
use crate::convert::system_data_scope_rule::create_request_to_model;
use anyhow::{anyhow, Result};
use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, QuerySelect};
use std::sync::Arc;
use std::time::Duration;
use chrono::Utc;
use system_model::request::system_auth::LoginRequest;
use tokio::sync::OnceCell;
use tracing::{error, info};
use tracing_subscriber::filter::filter_fn;
use common::base::logger::{LoginLogger, OperationLogger};
use common::constants::common_status::is_enable;
use common::context::context::{LoginUserContext, RequestContext};
use common::database::redis::RedisManager;
use common::database::redis_constants::{REDIS_KEY_LOGGER_LOGIN_PREFIX, REDIS_KEY_LOGGER_OPERATION_PREFIX, REDIS_KEY_LOGIN_USER_PREFIX};
use common::utils::crypt_utils::verify_password;
use common::utils::jwt_utils::{generate_token_pair, AuthBody, AuthError};
use system_model::response::system_department::SystemDepartmentResponse;
use crate::model::system_user::{Model as SystemUserModel};
use crate::service;

pub async fn login(db: &DatabaseConnection, request: LoginRequest, request_context: RequestContext) -> Result<AuthBody> {
    info!("into login: {:?}", request);
    // 验证验证码

    // 查询用户
    let user_result = service::system_user::get_by_username(db, request.username).await?;
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
    // 比较密码
    let is_match = match verify_password(request.password, user.clone().password) {
        Ok(isMatch) => {
            isMatch
        }
        Err(_) => {
            return Err(anyhow!("加密失败"));
        }
    };
    if !is_match {
        return Err(anyhow!("账号或密码不正确"));
    }

    // 创建token
    let auth = match generate_token_pair(user.clone().id, user.tenant_id) {
        Ok(auth) => {
            auth
        }
        Err(_) => {
            return Err(anyhow!("服务端异常"));
        }
    };
    info!("auth: {:?}", auth);
    // 更新登录用户最近登录IP和时间
    info!("request context: {:?}", request_context);
    service::system_user::update_by_login(db, user.clone().id, request_context.clone().ip).await?;
    // 记录登录日志
    add_login_logger_redis(request_context.clone(), user.clone(), serde_json::to_string(&auth)?).await?;
    // 保存登录用户信息缓存
    cache_login_user(db, user.clone()).await?;
    Ok(auth)
}

pub async fn cache_login_user(db: &DatabaseConnection, user: SystemUserModel) -> Result<()> {
    // 查询部门信息
    let department_result = service::system_department::find_by_id(db, user.department_id).await?;
    let role_id = service::system_user_role::get_role_id_by_user_id(db, user.id).await?;
    // 权限码
    let permissions = service::system_role_menu::get_role_menu_permissions(db, role_id).await?;
    let login_user = LoginUserContext {
        id: user.id,
        nickname: user.nickname,
        tenant_id: user.tenant_id,
        department_id: user.department_id,
        department_code: user.department_code,
        role_id,
        permissions: permissions.join(",")
    };
    info!("login user {:?}", login_user);
    RedisManager::set::<_, String>(format!("{}{}", REDIS_KEY_LOGIN_USER_PREFIX, user.id), serde_json::to_string(&login_user)?)?;
    Ok(())
}

async fn add_login_logger_redis(request_context: RequestContext, user: SystemUserModel, result: String) -> Result<()> {
    let user_id = user.id;
    let username = user.username;
    let user_nickname = user.nickname;
    let tenant_id = user.tenant_id;
    let department_code = user.department_code;
    let department_id = user.department_id;

    let login_logger = LoginLogger {
        id: None,
        trace_id: "".to_string(),
        user_id,
        user_type: None,
        username,
        result,
        user_ip: request_context.ip,
        user_agent: request_context.user_agent,
        department_code,
        department_id,
        operator: Some(user_id),
        operator_nickname: Some(user_nickname),
        operate_time: Utc::now().timestamp(),
        deleted: false,
        tenant_id
    };
    info!("login logger: {:?}", login_logger);
    RedisManager::push_list::<_, String>(REDIS_KEY_LOGGER_LOGIN_PREFIX, serde_json::to_string(&login_logger)?)?;
    Ok(())
}