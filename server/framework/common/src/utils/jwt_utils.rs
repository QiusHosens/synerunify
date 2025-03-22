use crate::context::context::LoginUserContext;
use crate::database::redis::RedisManager;
use crate::database::redis_constants::{REDIS_KEY_LOGIN_USER_PREFIX, REDIS_KEY_TENANTS_LIST};
use axum::{extract::FromRequestParts, http::{request::Parts, StatusCode}, response::{IntoResponse, Response}, Json, RequestPartsExt};
use axum_extra::headers::Authorization;
use axum_extra::TypedHeader;
use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, Algorithm, DecodingKey, EncodingKey, Header, Validation};
use once_cell::sync::Lazy;
use serde::{Deserialize, Serialize};
use serde_json::json;
use tracing::{error, info};
use utoipa::ToSchema;

static SECRET_KEY: Lazy<Vec<u8>> = Lazy::new(|| b"synerunify:token:secret-key".to_vec());

// Access Token Claims
#[derive(Debug, Serialize, Deserialize)]
pub struct AccessClaims {
    sub: i64,  // 用户id
    tenant_id: i64, // 租户id
    exp: i64, // 过期时间
    iat: i64, // 签发时间
}

// Refresh Token Claims
#[derive(Debug, Serialize, Deserialize)]
struct RefreshClaims {
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

// 自定义错误类型
#[derive(Debug)]
pub enum AuthError {
    WrongCredentials,
    MissingCredentials,
    TokenCreation,
    InvalidToken,
    CheckOutToken,
    TokenExpired,
    InvalidTenant
}
impl IntoResponse for AuthError {
    fn into_response(self) -> Response {
        let (status, error_message) = match self {
            AuthError::WrongCredentials => (StatusCode::UNAUTHORIZED, "Wrong credentials"),
            AuthError::InvalidTenant => (StatusCode::UNAUTHORIZED, "Invalid tenant"),
            AuthError::MissingCredentials => (StatusCode::BAD_REQUEST, "Missing credentials"),
            AuthError::TokenCreation => (StatusCode::INTERNAL_SERVER_ERROR, "Token creation error"),
            AuthError::InvalidToken => (StatusCode::BAD_REQUEST, "Invalid token"),
            AuthError::TokenExpired => (StatusCode::BAD_REQUEST, "Expired token"),
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
        let TypedHeader(auth) = TypedHeader::<Authorization<headers::authorization::Bearer>>::from_request_parts(parts, _state)
            .await
            .map_err(|e| AuthError::InvalidToken)?;

        let token = auth.token();

        info!("token: {:?}", token);

        let token_data = decode::<AccessClaims>(
            token,
            &DecodingKey::from_secret(&*SECRET_KEY),
            &Validation::new(Algorithm::HS256),
        ).map_err(|e| {
            error!("decode token error, {}", e.to_string());
            AuthError::InvalidToken
        })?;

        info!("token data: {:?}", token_data);
        let claims = token_data.claims;
        let now = Utc::now().timestamp();
        if claims.exp < now {
            return Err(AuthError::TokenExpired);
        }

        if !is_valid_tenant(claims.tenant_id).await? {
            return Err(AuthError::InvalidTenant);
        }

        // 获取用户登录信息
        let context = RedisManager::get::<_, String>(format!("{}{}", REDIS_KEY_LOGIN_USER_PREFIX, claims.sub));
        let login_user = match context {
            Ok(Some(ctx_str)) => serde_json::from_str::<LoginUserContext>(&ctx_str)
                .map_err(|_| AuthError::WrongCredentials),
            Ok(None) => Err(AuthError::WrongCredentials),
            Err(_) => Err(AuthError::WrongCredentials),
        }?;
        info!("login user: {:?}", login_user);
        parts.extensions.insert(login_user);
        // parts.extensions.insert(UserTenantContext {
        //     id: claims.sub.clone(),  // 用户id
        //     tenant_id: claims.tenant_id.clone(), // 租户id
        // });

        Ok(claims)
    }
}

pub async fn is_valid_tenant(tenant_id: i64) -> Result<bool, AuthError> {
    let exists: bool = RedisManager::is_set_member(REDIS_KEY_TENANTS_LIST, tenant_id)
        .map_err(|e| AuthError::InvalidTenant)?;

    Ok(exists)
}

pub fn set_tenants(tenants: &[i64]) -> Result<(), AuthError> {
    // 添加新的租户ID
    RedisManager::add_to_set(REDIS_KEY_TENANTS_LIST, tenants).expect("add tenants fail");
    Ok(())
}

// 生成 token 对
pub fn generate_token_pair(user_id: i64, tenant_id: i64) -> Result<AuthBody, AuthError> {
    let now = Utc::now();

    let access_exp = now.checked_add_signed(Duration::minutes(15)).unwrap().timestamp();
    let access_claims = AccessClaims {
        sub: user_id,
        tenant_id,
        exp: access_exp,
        iat: now.timestamp(),
    };
    let access_token = encode(&Header::default(), &access_claims, &EncodingKey::from_secret(&*SECRET_KEY))
        .map_err(|e| AuthError::TokenCreation)?;

    let refresh_exp = now.checked_add_signed(Duration::days(7)).unwrap().timestamp();
    let refresh_claims = RefreshClaims {
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
pub async fn refresh_token(
    Json(payload): Json<serde_json::Value>,
) -> Result<impl IntoResponse, AuthError> {
    let refresh_token = payload
        .get("refresh_token")
        .and_then(|v| v.as_str())
        .ok_or(AuthError::MissingCredentials)?;

    let token_data = decode::<RefreshClaims>(
        refresh_token,
        &DecodingKey::from_secret(&*SECRET_KEY),
        &Validation::new(Algorithm::HS256),
    )
        .map_err(|e| AuthError::InvalidToken)?;

    let now = Utc::now().timestamp();
    if token_data.claims.exp < now {
        return Err(AuthError::TokenExpired);
    }

    if is_valid_tenant(token_data.claims.tenant_id).await? {
        return Err(AuthError::InvalidTenant);
    }

    let new_tokens = generate_token_pair(token_data.claims.sub, token_data.claims.tenant_id)?;
    Ok(Json(new_tokens))
}

// 受保护的路由
async fn protected_route(claims: AccessClaims) -> impl IntoResponse {
    format!(
        "Welcome user: {}\nTenant ID: {}\nToken expires at: {}",
        claims.sub, claims.tenant_id, claims.exp
    )
}

// // 获取初始 token
// async fn login(
//     State(state): State<Arc<AppState>>,
//     Json(payload): Json<serde_json::Value>,
// ) -> Result<impl IntoResponse, AuthError> {
//     let user_id = payload.get("user_id")
//         .and_then(|v| v.as_i64())
//         .ok_or(AuthError("Missing or invalid user_id".to_string()))?;
//     let tenant_id = payload.get("tenant_id")
//         .and_then(|v| v.as_i64())
//         .ok_or(AuthError("Missing or invalid tenant_id".to_string()))?;
//
//     if !redis_manager::RedisManager::instance().is_valid_tenant(tenant_id).await? {
//         return Err(AuthError(format!("Invalid tenant ID: {}", tenant_id)));
//     }
//
//     let tokens = generate_token_pair(user_id, tenant_id, &state.secret)?;
//     Ok(Json(tokens))
// }
//
// #[tokio::main]
// async fn main() {
//     let state = Arc::new(AppState {
//         secret: b"my-secret-key".to_vec(),
//     });
//
//     redis_manager::RedisManager::instance().set_tenants(&[123, 456])
//         .expect("Failed to initialize Redis tenants");
//
//     let state_clone = state.clone();
//     tokio::spawn(redis_manager::update_tenants_task(state_clone));
//
//     let app = Router::new()
//         .route("/login", axum::routing::post(login))
//         .route("/protected", axum::routing::get(protected_route))
//         .route("/refresh", axum::routing::post(refresh_token))
//         .with_state(state);
//
//     let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
//     println!("Server running on http://localhost:3000");
//     axum::serve(listener, app.into_make_service()).await.unwrap();
// }
//
// // 测试
// #[cfg(test)]
// mod tests {
//     use super::*;
//     use axum::http::Request;
//     use axum::body::Body;
//
//     #[tokio::test]
//     async fn test_redis_tenants() {
//         let state = Arc::new(AppState {
//             secret: b"my-secret-key".to_vec(),
//         });
//
//         redis_manager::RedisManager::instance().set_tenants(&[123, 456]).unwrap();
//
//         let app = Router::new()
//             .route("/login", axum::routing::post(login))
//             .route("/protected", axum::routing::get(protected_route))
//             .route("/refresh", axum::routing::post(refresh_token))
//             .with_state(state.clone());
//
//         // 测试登录
//         let login_request = Request::post("/login")
//             .header("Content-Type", "application/json")
//             .body(Body::from(serde_json::to_string(&serde_json::json!({
//                 "user_id": 1001,
//                 "tenant_id": 123
//             })).unwrap()))
//             .unwrap();
//         let login_response = app.clone()
//             .oneshot(login_request)
//             .await
//             .unwrap();
//         let tokens: TokenPair = serde_json::from_slice(&hyper::body::to_bytes(login_response.into_body()).await.unwrap()).unwrap();
//
//         // 测试 protected 路由
//         let protected_response = app.clone()
//             .oneshot(
//                 Request::get("/protected")
//                     .header("Authorization", format!("Bearer {}", tokens.access_token))
//                     .body(Body::empty())
//                     .unwrap()
//             )
//             .await
//             .unwrap();
//         let body = String::from_utf8(hyper::body::to_bytes(protected_response.into_body()).await.unwrap().to_vec()).unwrap();
//         assert!(body.contains("Tenant ID: 123"));
//         assert!(body.contains("Welcome user: 1001"));
//     }
// }