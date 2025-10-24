use crate::context::context::LoginUserContext;
use crate::database::redis::RedisManager;
use crate::database::redis_constants::{REDIS_KEY_LOGIN_USER_PREFIX, REDIS_KEY_TENANTS_LIST};
use axum::extract::Query;
use axum::{extract::FromRequestParts, http::{request::Parts, StatusCode}, response::{IntoResponse, Response}, Json, RequestPartsExt};
use axum_extra::headers::Authorization;
use axum_extra::TypedHeader;
use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, Algorithm, DecodingKey, EncodingKey, Header, Validation};
use jsonwebtoken::errors::{Error, ErrorKind};
use once_cell::sync::Lazy;
use serde::{Deserialize, Serialize};
use serde_json::json;
use tracing::{error, info};
use utoipa::ToSchema;

pub static SECRET_KEY: Lazy<Vec<u8>> = Lazy::new(|| b"synerunify:token:secret-key".to_vec());

// Access Token Claims
#[derive(Debug, Serialize, Deserialize)]
pub struct AccessClaims {
    pub device_type: String, // 设备类型
    pub sub: i64,  // 用户id
    pub tenant_id: i64, // 租户id
    pub exp: i64, // 过期时间
    iat: i64, // 签发时间
}

// Refresh Token Claims
#[derive(Debug, Serialize, Deserialize)]
struct RefreshClaims {
    device_type: String, // 设备类型
    sub: i64,  // 用户id
    tenant_id: i64, // 租户id
    exp: i64, // 过期时间
    iat: i64, // 签发时间
}

#[derive(Debug, Serialize, Deserialize, Clone, ToSchema)]
pub struct AuthBody {
    access_token: String,
    refresh_token: String,
    token_type: String,
    exp: i64, // 过期时间
    iat: i64, // 签发时间
}
impl AuthBody {
    fn new(access_token: String, refresh_token: String, exp: i64, iat: i64) -> Self {
        Self {
            access_token,
            refresh_token,
            token_type: "Bearer".to_string(),
            exp,
            iat,
        }
    }
}

// 应用状态
#[derive(Clone)]
struct AppState {
    secret: Vec<u8>,
}

#[derive(Deserialize)]
struct TokenQuery {
    token: Option<String>,
}

// 自定义错误类型
#[derive(Debug)]
pub enum AuthError {
    WrongCredentials,
    MissingCredentials,
    TokenCreation,
    InvalidToken,
    CheckOutToken,
    TokenExpired,
    InvalidTenant,
    InvalidUser,
    UserExpired, // 用户过期,用户权限变化,需重新登录
}
impl IntoResponse for AuthError {
    fn into_response(self) -> Response {
        let (status, error_message) = match self {
            AuthError::WrongCredentials => (StatusCode::UNAUTHORIZED, "Wrong credentials"),
            AuthError::InvalidTenant => (StatusCode::UNAUTHORIZED, "Invalid tenant"),
            AuthError::InvalidUser => (StatusCode::UNAUTHORIZED, "Invalid user"),
            AuthError::MissingCredentials => (StatusCode::UNAUTHORIZED, "Missing credentials"),
            AuthError::TokenCreation => (StatusCode::INTERNAL_SERVER_ERROR, "Token creation error"),
            AuthError::InvalidToken => (StatusCode::UNAUTHORIZED, "Invalid token"),
            AuthError::TokenExpired => (StatusCode::UNAUTHORIZED, "Expired token"),
            AuthError::UserExpired => (StatusCode::UNAUTHORIZED, "Expired user"),
            AuthError::CheckOutToken => (StatusCode::UNAUTHORIZED, "该账户已经退出"),
        };
        let body = Json(json!({
            "error": error_message,
        }));
        (status, body).into_response()
    }
}

// Access Token 提取器
impl<S> FromRequestParts<S> for AccessClaims
where
    S: Send + Sync,
{
    type Rejection = AuthError;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        // 使用 TypedHeader 提取 Authorization Bearer token
        let auth_result = TypedHeader::<Authorization<headers::authorization::Bearer>>::from_request_parts(parts, &()).await;
        let mut token = match auth_result {
            Ok(TypedHeader(auth)) => auth.0.token().to_string(),
            Err(e) => {
                info!("No Authorization header found: {}", e);
                String::new() // 如果没有 Authorization 头，设置为空字符串
            }
        };

        info!("Extracted token from header: {}, path: {}", token, parts.uri);

        // 如果 token 为空，并且 URI 以 /file/ 开头，则尝试从查询参数中提取 token
        if token.is_empty() && parts.uri.path().contains("system_file/download") {
            let query: Query<TokenQuery> = Query::try_from_uri(&parts.uri)
                .map_err(|e| {
                    error!("Failed to parse query parameters: {}", e);
                    AuthError::InvalidToken
                })?;
            
            token = query.0.token.unwrap_or_default();
            info!("Extracted token from query: {}", token);
        }

        if token.is_empty() {
            return Err(AuthError::InvalidToken);
        }

        let token_data = decode::<AccessClaims>(
            &token,
            &DecodingKey::from_secret(&*SECRET_KEY),
            &Validation::new(Algorithm::HS256),
        ).map_err(|e| {
            error!("decode token error, {}", e.to_string());
            match e.kind() {
                ErrorKind::ExpiredSignature => AuthError::TokenExpired,
                _ => AuthError::InvalidToken
            }
        })?;

        info!("token data: {:?}", token_data);
        let claims = token_data.claims;
        let now = Utc::now().timestamp();
        if claims.exp < now {
            return Err(AuthError::TokenExpired);
        }

        if !is_valid_tenant(claims.tenant_id)? {
            return Err(AuthError::InvalidTenant);
        }

        // 获取用户登录信息
        let context = RedisManager::get::<_, String>(format!("{}{}:{}", REDIS_KEY_LOGIN_USER_PREFIX, claims.device_type, claims.sub));
        let login_user = match context {
            Ok(Some(ctx_str)) => serde_json::from_str::<LoginUserContext>(&ctx_str)
                .map_err(|_| AuthError::UserExpired),
            Ok(None) => Err(AuthError::UserExpired),
            Err(_) => Err(AuthError::UserExpired),
        }?;
        // info!("login user: {:?}", login_user);
        parts.extensions.insert(login_user);
        // parts.extensions.insert(UserTenantContext {
        //     id: claims.sub.clone(),  // 用户id
        //     tenant_id: claims.tenant_id.clone(), // 租户id
        // });

        Ok(claims)
    }
}

pub fn is_valid_tenant(tenant_id: i64) -> Result<bool, AuthError> {
    let exists: bool = RedisManager::is_set_member(REDIS_KEY_TENANTS_LIST, tenant_id)
        .map_err(|e| AuthError::InvalidTenant)?;

    Ok(exists)
}

pub fn add_tenants(tenants: &[i64]) {
    // 添加新的租户ID
    if let Err(e) = RedisManager::add_to_set(REDIS_KEY_TENANTS_LIST, tenants) {
        error!("add tenants fail: {}", e.to_string());
    }
}

// 生成 token 对
pub fn generate_token_pair(device_type: String, user_id: i64, tenant_id: i64) -> Result<AuthBody, AuthError> {
    let now = Utc::now();

    let access_exp = now.checked_add_signed(Duration::minutes(15)).unwrap().timestamp();
    let access_claims = AccessClaims {
        device_type: device_type.clone(),
        sub: user_id,
        tenant_id,
        exp: access_exp,
        iat: now.timestamp(),
    };
    let access_token = encode(&Header::default(), &access_claims, &EncodingKey::from_secret(&*SECRET_KEY))
        .map_err(|e| AuthError::TokenCreation)?;

    let refresh_exp = now.checked_add_signed(Duration::days(7)).unwrap().timestamp();
    let refresh_claims = RefreshClaims {
        device_type: device_type.clone(),
        sub: user_id,
        tenant_id,
        exp: refresh_exp,
        iat: now.timestamp(),
    };
    let refresh_token = encode(&Header::default(), &refresh_claims, &EncodingKey::from_secret(&*SECRET_KEY))
        .map_err(|e| AuthError::TokenCreation)?;

    Ok(AuthBody::new(access_token, refresh_token, refresh_exp, now.timestamp()))
}

// 刷新 token
pub async fn refresh_token(refresh_token: String) -> Result<AuthBody, AuthError> {
    info!("refresh token: {:?}", refresh_token);
    let token_data = decode::<RefreshClaims>(
        refresh_token.as_str(),
        &DecodingKey::from_secret(&*SECRET_KEY),
        &Validation::new(Algorithm::HS256),
    )
        .map_err(|e| {
            error!("decode refresh token error, {}", e.to_string());
            match e.kind() {
                ErrorKind::ExpiredSignature => AuthError::TokenExpired,
                _ => AuthError::InvalidToken
            }
        })?;

    info!("refresh token data: {:?}", token_data);
    let now = Utc::now().timestamp();
    if token_data.claims.exp < now {
        error!("token expired");
        return Err(AuthError::TokenExpired);
    }

    if !is_valid_tenant(token_data.claims.tenant_id)? {
        error!("invalid tenant");
        return Err(AuthError::InvalidTenant);
    }

    generate_token_pair(token_data.claims.device_type, token_data.claims.sub, token_data.claims.tenant_id)
}