use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use axum::{
    extract::{State, Json, Extension},
    http::StatusCode,
    response::IntoResponse,
    Router,
    routing::put,
};
use axum::http::Request;
use axum::middleware::Next;
use axum::response::Response;
use axum::routing::{get, post, MethodRouter};
use serde::Deserialize;
use tracing::info;
use utoipa::OpenApi;
use macros::require_authorize;
use once_cell::sync::Lazy;
use ctor;
use dashmap::DashMap;

#[derive(Deserialize, Debug, Clone)]
struct LoginUserContext {
    id: String,
    username: String,
}

#[derive(Deserialize, Debug, utoipa::ToSchema)]
struct UpdateSystemDataScopeRuleRequest {
    rule_id: String,
    scope: String,
}

#[derive(Clone)]
struct AppState {}

#[utoipa::path(
    post,
    path = "/update",
    request_body = UpdateSystemDataScopeRuleRequest,
    responses(
        (status = 204, description = "Update successful"),
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error")
    )
)]
// #[require_permissions("user:read")]
// #[require_authorize(operation_id = "operation_id", authorize = "user:read,user:get")]
async fn update(
    State(_state): State<AppState>,
    Json(payload): Json<UpdateSystemDataScopeRuleRequest>,
    // Extension(user): Extension<LoginUserContext>,
    // req: Request<axum::body::Body>,
) -> Result<impl IntoResponse, StatusCode> {
    // let user = req.extensions().get::<LoginUserContext>();
    // if user.is_none() {
    //     return Err(StatusCode::UNAUTHORIZED);
    // }
    // let payload = req.body()
    // println!("User: {:?}", user);
    // println!("User: {:?}, Payload: {:?}", user, payload);
    Ok(StatusCode::NO_CONTENT)
}

#[utoipa::path(
    get,
    path = "/user",
    responses(
        (status = 204, description = "Update successful"),
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error")
    )
)]
// #[require_permissions("user:read,user:get")]
// #[require_authorize(operation_id = "operation_id", authorize = "user:read,user:get")]
async fn user() -> String {
    "User data".to_string()
}

#[derive(OpenApi)]
#[openapi(paths(update, user))]
struct ApiDoc;

// 全局静态变量存储路由和权限的映射
pub static ROUTE_PERMISSIONS: Lazy<DashMap<String, Vec<String>>> = Lazy::new(|| {
    DashMap::new()
});

// 注册路由权限的函数
pub fn register_operation_permissions(operation_id: &str, permissions: Vec<String>) {
    println!("Registering operation id: {} with permissions: {:?}", operation_id, permissions);
    // let mut route_permissions = ROUTE_PERMISSIONS.lock().unwrap();
    // route_permissions.insert(route.to_string(), permissions);
    ROUTE_PERMISSIONS.insert(operation_id.to_string(), permissions);
}

#[derive(Clone)]
pub struct RequiredPermissions(pub Vec<String>);

pub async fn auth_handler(request: axum::extract::Request, next: Next) -> Result<impl IntoResponse, StatusCode> {
    // let permissions = request.extensions()
    //     .get::<Permissions>();
    // let route_permissions = request.extensions().get::<Vec<String>>().cloned().unwrap_or_default();
    // let required_perms = required.0;
    let path = request.uri().path().to_string();
    // let route_permissions = ROUTE_PERMISSIONS.lock().unwrap();
    // info!("permissions: {:?}", route_permissions);
    println!("permissions: {:?}", path);
    println!("permissions: {:?}", ROUTE_PERMISSIONS);
    Ok(next.run(request).await)
}

// 中间件：指定具体的 Body 类型
async fn auth_middleware(req: Request<axum::body::Body>, next: Next) -> Result<Response, StatusCode> {
    let (mut parts, body) = req.into_parts();
    let login_user = LoginUserContext {
        id: "123".to_string(),
        username: "alice".to_string(),
    };
    parts.extensions.insert(login_user);
    let req = Request::from_parts(parts, body);
    Ok(next.run(req).await)
}

#[tokio::main]
async fn main() -> Result<(), anyhow::Error> {
    let state = AppState {};

    let app = Router::new()
        .route("/update", post(update)) // 使用 Axum 原生路由
        .route("/user", get(user))
        // .layer(axum::middleware::from_fn(auth_middleware))
        .layer(axum::middleware::from_fn(auth_handler))
        .with_state(state)
        .merge(utoipa_swagger_ui::SwaggerUi::new("/swagger-ui").url("/api-doc.json", ApiDoc::openapi()))
    ;

    // let app = axum::Router::new().merge(router);
    let listener = tokio::net::TcpListener::bind(&"127.0.0.1:3100").await?;
    axum::serve(listener, app.into_make_service_with_connect_info::<std::net::SocketAddr>()).await?;
    Ok(())
    // axum::Server::bind(&"127.0.0.1:3000".parse().unwrap())
    //     .serve(app.into_make_service())
    //     .await
    //     .unwrap();
}