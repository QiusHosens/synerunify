use std::sync::Arc;
use sea_orm::DatabaseConnection;
use utoipa_axum::router::OpenApiRouter;
use utoipa_axum::routes;
use ctor;
use macros::require_authorize;
use axum::{routing::{get, post}, Router, extract::{State, Path, Json, Query}, response::IntoResponse, Extension};
use common::base::page::PaginatedResponse;
use system_model::request::system_role_menu::{UpdateSystemRoleMenuRequest};
use system_model::response::system_role_menu::SystemRoleMenuResponse;
use common::base::response::CommonResult;
use common::context::context::LoginUserContext;
use crate::service;
use common::state::app_state::AppState;

pub async fn system_role_menu_router(state: AppState) -> OpenApiRouter {
    OpenApiRouter::new()
        .routes(routes!(update))
        .routes(routes!(list))
        .routes(routes!(get_role_menu))
        .with_state(state)
}

pub async fn system_role_menu_route(state: AppState) -> Router {
    Router::new()
        .route("/update", post(update))
        .route("/list", get(list))
        .with_state(state)
}

#[utoipa::path(
    post,
    path = "/update",
    operation_id = "system_role_menu_update",
    request_body(content = UpdateSystemRoleMenuRequest, description = "update", content_type = "application/json"),
    responses(
        (status = 204, description = "update")
    ),
    tag = "system_role_menu",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_role_menu_update", authorize = "")]
async fn update(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<UpdateSystemRoleMenuRequest>,
) -> CommonResult<()> {
    match service::system_role_menu::update(&state.db, login_user, payload).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/list",
    operation_id = "system_role_menu_list",
    responses(
        (status = 200, description = "list all", body = CommonResult<Vec<SystemRoleMenuResponse>>)
    ),
    tag = "system_role_menu",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_role_menu_list", authorize = "")]
async fn list(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
) -> CommonResult<Vec<SystemRoleMenuResponse>> {
    match service::system_role_menu::list(&state.db, login_user).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/get_role_menu/{id}",
    operation_id = "system_role_menu_get_role_menu",
    responses(
        (status = 200, description = "get role menu", body = CommonResult<Vec<i64>>)
    ),
    tag = "system_role_menu",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_role_menu_get_role_menu", authorize = "")]
async fn get_role_menu(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<Vec<i64>> {
    match service::system_role_menu::get_role_menu(&state.db, login_user, id).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}