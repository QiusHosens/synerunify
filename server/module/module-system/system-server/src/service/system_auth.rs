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
use common::database::redis_constants::REDIS_KEY_LOGIN_USER_PREFIX;
use common::utils::crypt_utils::verify_password;
use common::utils::jwt_utils::{generate_token_pair, AuthBody, AuthError};
use crate::service::system_user;
use crate::service::system_department;
use crate::service::system_user_role;
use crate::service::system_role;

pub async fn login(db: &DatabaseConnection, request: LoginRequest) -> Result<AuthBody> {
    info!("into login: {:?}", request);
    // 验证验证码

    // 查询用户
    let user_result = system_user::get_by_username(db, request.username).await?;
    let user = match user_result {
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
    let is_match = match verify_password(request.password, user.password) {
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
    Ok(auth)
}

// pub async fn cache_login_user(db: &DatabaseConnection, user: SystemUserModel) {
//     // 查询部门信息
//     let department = system_dep
//     let role = match SystemRoleEntity::find {  };
//     let login_user = LoginUserContext {
//
//     };
//     RedisManager::set::<_, String>(format!("{}{}", REDIS_KEY_LOGIN_USER_PREFIX, id))
// }