use crate::service;
use axum::{extract::{Json, State}, routing::post, Extension, Router};
use common::base::response::CommonResult;
use common::context::context::{LoginUserContext, RequestContext};
use common::utils::jwt_utils::AuthBody;
use ctor;
use system_model::request::system_auth::{LoginAccountRequest, LoginRequest, RefreshTokenRequest};
use utoipa_axum::router::OpenApiRouter;
use utoipa_axum::routes;
use common::state::app_state::AppState;
use system_model::response::system_auth::{HomeResponse, UserResponse};

pub async fn system_auth_router(state: AppState) -> OpenApiRouter {
    OpenApiRouter::new()
        .routes(routes!(login))
        .routes(routes!(login_account))
        .routes(routes!(refresh_token))
        .with_state(state)
}

pub async fn system_auth_need_router(state: AppState) -> OpenApiRouter {
    OpenApiRouter::new()
        .routes(routes!(logout))
        .routes(routes!(home))
        .routes(routes!(get_user))
        .with_state(state)
}

pub async fn system_auth_route(state: AppState) -> Router {
    Router::new()
        .route("/login", post(login))
        .with_state(state)
}

#[utoipa::path(
    post,
    path = "/login",
    operation_id = "system_auth_login",
    request_body(content = LoginRequest, description = "login", content_type = "application/json"),
    responses(
        (status = 200, description = "login success", body = CommonResult<AuthBody>)
    ),
    tag = "system_auth"
)]
async fn login(
    State(state): State<AppState>,
    Extension(request_context): Extension<RequestContext>,
    Json(payload): Json<LoginRequest>,
) -> CommonResult<AuthBody> {
    match service::system_auth::login(&state.db, request_context, payload).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/login_account",
    operation_id = "system_auth_login_account",
    request_body(content = LoginAccountRequest, description = "login", content_type = "application/json"),
    responses(
        (status = 200, description = "login success", body = CommonResult<AuthBody>)
    ),
    tag = "system_auth"
)]
async fn login_account(
    State(state): State<AppState>,
    Extension(request_context): Extension<RequestContext>,
    Json(payload): Json<LoginAccountRequest>,
) -> CommonResult<AuthBody> {
    match service::system_auth::login_account(&state.db, request_context, payload).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/refresh_token",
    operation_id = "system_auth_refresh_token",
    request_body(content = String, description = "refresh token", content_type = "application/json"),
    responses(
        (status = 200, description = "login success", body = CommonResult<AuthBody>)
    ),
    tag = "system_auth",
)]
async fn refresh_token(
    State(state): State<AppState>,
    Json(payload): Json<RefreshTokenRequest>,
) -> CommonResult<AuthBody> {
    match service::system_auth::refresh_token(&state.db, payload.refresh_token).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/logout",
    operation_id = "system_auth_logout",
    responses(
        (status = 200, description = "logout", body = CommonResult<String>)
    ),
    tag = "system_auth",
    security(
        ("bearerAuth" = [])
    )
)]
async fn logout(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
) -> CommonResult<String> {
    match service::system_auth::logout(&state.db, login_user).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/home",
    operation_id = "system_auth_home",
    responses(
        (status = 200, description = "web home", body = CommonResult<HomeResponse>)
    ),
    tag = "system_auth",
    security(
        ("bearerAuth" = [])
    )
)]
async fn home(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
) -> CommonResult<HomeResponse> {
    match service::system_auth::home(&state.db, login_user).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/get_user",
    operation_id = "system_auth_get_user",
    responses(
        (status = 200, description = "get user", body = CommonResult<HomeResponse>)
    ),
    tag = "system_auth",
    security(
        ("bearerAuth" = [])
    )
)]
async fn get_user(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
) -> CommonResult<UserResponse> {
    match service::system_auth::get_user(&state.db, login_user).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}