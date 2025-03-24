use crate::{service, AppState};
use axum::{extract::{Json, State}, routing::post, Extension, Router};
use common::base::response::CommonResult;
use common::context::context::{LoginUserContext, RequestContext};
use common::utils::jwt_utils::AuthBody;
use ctor;
use system_model::request::system_auth::LoginRequest;
use utoipa_axum::router::OpenApiRouter;
use utoipa_axum::routes;
use system_model::response::system_auth::HomeResponse;

pub async fn system_auth_router(state: AppState) -> OpenApiRouter {
    OpenApiRouter::new()
        .routes(routes!(login))
        .with_state(state)
}

pub async fn system_auth_need_router(state: AppState) -> OpenApiRouter {
    OpenApiRouter::new()
        .routes(routes!(home))
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
    match service::system_auth::login(&state.db, payload, request_context).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/home",
    operation_id = "system_auth_home",
    responses(
        (status = 200, description = "login success", body = CommonResult<HomeResponse>)
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