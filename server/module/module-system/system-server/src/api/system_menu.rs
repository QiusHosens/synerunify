use std::sync::Arc;
use sea_orm::DatabaseConnection;
use utoipa_axum::router::OpenApiRouter;
use utoipa_axum::routes;
use ctor;
use macros::require_authorize;
use axum::{routing::{get, post}, Router, extract::{State, Path, Json, Query}, response::IntoResponse, Extension};
use common::base::page::PaginatedResponse;
use system_model::request::system_menu::{CreateSystemMenuRequest, UpdateSystemMenuRequest, PaginatedKeywordRequest};
use system_model::response::system_menu::SystemMenuResponse;
use common::base::response::CommonResult;
use common::context::context::LoginUserContext;
use crate::service;
use common::state::app_state::AppState;

pub async fn system_menu_router(state: AppState) -> OpenApiRouter {
    OpenApiRouter::new()
        .routes(routes!(create))
        .routes(routes!(update))
        .routes(routes!(delete))
        .routes(routes!(get_by_id))
        .routes(routes!(list))
        .routes(routes!(page))
        .routes(routes!(enable))
        .routes(routes!(disable))
        .with_state(state)
}

pub async fn system_menu_route(state: AppState) -> Router {
    Router::new()
        .route("/create", post(create))
        .route("/update", post(update))
        .route("/delete/{id}", post(delete))
        .route("/get/{id}", get(get_by_id))
        .route("/list", get(list))
        .route("/page", get(page))
        .with_state(state)
}

#[utoipa::path(
    post,
    path = "/create",
    operation_id = "system_menu_create",
    request_body(content = CreateSystemMenuRequest, description = "create", content_type = "application/json"),
    responses(
        (status = 200, description = "id", body = CommonResult<i64>)
    ),
    tag = "system_menu",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_menu_create", authorize = "config:menu:add")]
async fn create(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<CreateSystemMenuRequest>,
) -> CommonResult<i64> {
    match service::system_menu::create(&state.db, login_user, payload).await {
        Ok(id) => {CommonResult::with_data(id)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/update",
    operation_id = "system_menu_update",
    request_body(content = UpdateSystemMenuRequest, description = "update", content_type = "application/json"),
    responses(
        (status = 204, description = "update")
    ),
    tag = "system_menu",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_menu_update", authorize = "config:menu:edit")]
async fn update(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<UpdateSystemMenuRequest>,
) -> CommonResult<()> {
    match service::system_menu::update(&state.db, login_user, payload).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/delete/{id}",
    operation_id = "system_menu_delete",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "delete")
    ),
    tag = "system_menu",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_menu_delete", authorize = "config:menu:delete")]
async fn delete(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::system_menu::delete(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/get/{id}",
    operation_id = "system_menu_get_by_id",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 200, description = "get by id", body = CommonResult<SystemMenuResponse>)
    ),
    tag = "system_menu",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_menu_get_by_id", authorize = "config:menu:get")]
async fn get_by_id(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<SystemMenuResponse> {
    match service::system_menu::get_by_id(&state.db, login_user, id).await {
        Ok(Some(data)) => {CommonResult::with_data(data)}
        Ok(None) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/page",
    operation_id = "system_menu_page",
    params(
        ("page" = u64, Query, description = "page number"),
        ("size" = u64, Query, description = "page size"),
        ("keyword" = Option<String>, Query, description = "keyword")
    ),
    responses(
        (status = 200, description = "get page", body = CommonResult<PaginatedResponse<SystemMenuResponse>>)
    ),
    tag = "system_menu",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_menu_page", authorize = "config:menu:get")]
async fn page(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> CommonResult<PaginatedResponse<SystemMenuResponse>> {
    match service::system_menu::get_paginated(&state.db, login_user, params).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/list",
    operation_id = "system_menu_list",
    responses(
        (status = 200, description = "list all", body = CommonResult<Vec<SystemMenuResponse>>)
    ),
    tag = "system_menu",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_menu_list", authorize = "config:menu:get")]
async fn list(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
) -> CommonResult<Vec<SystemMenuResponse>> {
    match service::system_menu::list(&state.db, login_user).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/enable/{id}",
    operation_id = "system_menu_enable",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "enable")
    ),
    tag = "system_menu",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_menu_enable", authorize = "config:menu:enable")]
async fn enable(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::system_menu::enable(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/disable/{id}",
    operation_id = "system_menu_disable",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "disable")
    ),
    tag = "system_menu",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_menu_disable", authorize = "config:menu:disable")]
async fn disable(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::system_menu::disable(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}