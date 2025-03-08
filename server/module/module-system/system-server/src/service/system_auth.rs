use crate::convert::system_data_scope_rule::create_request_to_model;
use anyhow::{anyhow, Result};
use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, QuerySelect};
use std::sync::Arc;
use system_model::request::system_auth::LoginRequest;
use tokio::sync::OnceCell;
use tracing_subscriber::filter::filter_fn;
use common::constants::common_status::is_enable;
use common::utils::crypt_utils::verify_password;
use common::utils::jwt_utils::{generate_token_pair, AuthBody, AuthError};
use system_model::request::system_user;
use crate::model::system_user::{Entity as SystemUserEntity, Column};

#[derive(Debug)]
pub struct SystemAuthService {
    db: Arc<DatabaseConnection>
}

static SYSTEM_AUTH_SERVICE: OnceCell<Arc<SystemAuthService>> = OnceCell::const_new();
 
impl SystemAuthService {
    pub async fn get_instance(db: Arc<DatabaseConnection>) -> Arc<SystemAuthService> {
        SYSTEM_AUTH_SERVICE
            .get_or_init(|| async { Arc::new(SystemAuthService { db }) })
            .await
            .clone()
    }

    pub async fn login(&self, request: LoginRequest) -> Result<AuthBody> {
        // 验证验证码

        // 查询用户
        let user = match SystemUserEntity::find()
            .filter(Column::Username.eq(request.username.clone()))
            .one(&*self.db).await? {
            Some(user) => {
                if is_enable(user.status) {
                    return Err(anyhow!("用户已被禁用"));
                } else {
                    user
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

        // 保存登录用户信息
        Ok(auth)
    }

    pub fn save_login_user(&self, id: i64) {

    }
}