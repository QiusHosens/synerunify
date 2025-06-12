use chrono::Utc;
use tonic::{Request, Status};
use std::sync::Arc;
use tracing::{error, info};
use jsonwebtoken::{decode, encode, Algorithm, DecodingKey, EncodingKey, Header, Validation};
use jsonwebtoken::errors::{Error, ErrorKind};

use crate::context::context::LoginUserContext;
use crate::database::redis::RedisManager;
use crate::database::redis_constants::REDIS_KEY_LOGIN_USER_PREFIX;
use crate::utils::jwt_utils::{is_valid_tenant, AccessClaims, SECRET_KEY};

pub fn auth_interceptor() -> impl Fn(Request<()>) -> Result<Request<()>, Status> + Clone + Send + Sync + 'static {
    move |mut request: Request<()>| {
        // 获取元数据
        let metadata = request.metadata();
        let auth_header = metadata
            .get("authorization")
            .ok_or_else(|| Status::unauthenticated("授权失败"))?
            .to_str()
            .map_err(|_| Status::unauthenticated("授权失败"))?;

        // 期望 "Bearer <token>"
        let prefix = "Bearer ";
        let token = auth_header
            .strip_prefix(prefix)
            .ok_or_else(|| Status::unauthenticated("授权失败"))?;

        info!("token: {:?}", token);

        let token_data = decode::<AccessClaims>(
            token,
            &DecodingKey::from_secret(&*SECRET_KEY),
            &Validation::new(Algorithm::HS256),
        ).map_err(|e| {
            error!("decode token error, {}", e.to_string());
            match e.kind() {
                ErrorKind::ExpiredSignature => Status::unauthenticated("认证已过期"),
                _ => Status::unauthenticated("授权失败")
            }
        })?;

        info!("token data: {:?}", token_data);
        let claims = token_data.claims;
        let now = Utc::now().timestamp();
        if claims.exp < now {
            return Err(Status::unauthenticated("认证已过期"));
        }

        match is_valid_tenant(claims.tenant_id) {
            Ok(valid) => (
              if !valid {
                  return Err(Status::unauthenticated("无效租户"))
              }
            ),
            Err(_) => return Err(Status::unauthenticated("授权失败")),
        }

        // 获取用户登录信息
        let context = RedisManager::get::<_, String>(format!("{}{}:{}", REDIS_KEY_LOGIN_USER_PREFIX, claims.device_type, claims.sub));
        let login_user = match context {
            Ok(Some(ctx_str)) => serde_json::from_str::<LoginUserContext>(&ctx_str)
                .map_err(|_| Status::unauthenticated("授权失效")),
            Ok(None) => Err(Status::unauthenticated("授权失效")),
            Err(_) => Err(Status::unauthenticated("授权失效")),
        }?;

        request.extensions_mut().insert(login_user);

        Ok(request)
    }
}