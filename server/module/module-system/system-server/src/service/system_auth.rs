use std::future::Future;
use crate::convert::system_data_scope_rule::create_request_to_model;
use anyhow::{anyhow, Result};
use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, QuerySelect};
use std::sync::Arc;
use system_model::request::system_auth::LoginRequest;
use tokio::sync::OnceCell;
use tracing::{error, info};
use tracing_subscriber::filter::filter_fn;
use common::constants::common_status::is_enable;
use common::context::context::LoginUserContext;
use common::database::redis::RedisManager;
use common::database::redis_constants::REDIS_KEY_LOGIN_USER_PREFIX;
use common::utils::crypt_utils::verify_password;
use common::utils::jwt_utils::{generate_token_pair, AuthBody, AuthError};
use system_model::response::system_department::SystemDepartmentResponse;
use crate::model::system_user::{Model as SystemUserModel};
use crate::service;

pub async fn login(db: &DatabaseConnection, request: LoginRequest) -> Result<AuthBody> {
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
    let auth = match generate_token_pair(user.id, user.tenant_id) {
        Ok(auth) => {
            auth
        }
        Err(_) => {
            return Err(anyhow!("服务端异常"));
        }
    };
    info!("{:?}", auth);
    // 更新登录用户最近登录IP和时间
    // 记录登录日志
    // 保存登录用户信息缓存
    cache_login_user(db, user.clone()).await?;
    Ok(auth)
}

pub async fn cache_login_user(db: &DatabaseConnection, user: SystemUserModel) -> Result<()> {
    // 查询部门信息
    let department_result = service::system_department::find_by_id(db, user.department_id).await?;
    let role_id = service::system_user_role::get_role_id_by_user_id(db, user.id).await?;
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