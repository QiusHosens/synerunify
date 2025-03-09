use crate::service::system_auth::SystemAuthService;
use axum::{extract::{Json, State}, routing::post, Router};
use common::utils::jwt_utils::AuthBody;
use sea_orm::DatabaseConnection;
use std::sync::Arc;
use system_model::request::system_auth::LoginRequest;
use utoipa_axum::router::OpenApiRouter;
use utoipa_axum::routes;
use common::base::model::CommonResult;

pub async fn system_auth_router(db: Arc<DatabaseConnection>) -> OpenApiRouter {
    let system_auth_service = SystemAuthService::get_instance(db).await;

    OpenApiRouter::new()
        .routes(routes!(login))
        .with_state(AppState { system_auth_service })
}

pub async fn system_auth_route(db: Arc<DatabaseConnection>) -> Router {
    let system_auth_service = SystemAuthService::get_instance(db).await;

    Router::new()
        .route("/login", post(login))
        .with_state(AppState { system_auth_service })
}

#[derive(Clone)]
struct AppState {
    system_auth_service: Arc<SystemAuthService>,
}

#[utoipa::path(
    post,
    path = "/login",
    operation_id = "system_auth_login",
    request_body(content = LoginRequest, description = "login", content_type = "application/json"),
    responses(
        (status = 200, description = "login success", body = CommonResult<AuthBody>),
        (status = 500, description = "login error", body = CommonResult<String>)
    ),
    tag = "system_auth"
)]
async fn login(
    State(state): State<AppState>,
    Json(payload): Json<LoginRequest>,
) -> CommonResult<AuthBody> {
    match state.system_auth_service.login(payload).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}