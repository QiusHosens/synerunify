use std::sync::Arc;
use sea_orm::DatabaseConnection;
use utoipa_axum::router::OpenApiRouter;
use utoipa_axum::routes;
use ctor;
use macros::require_authorize;
use axum::{routing::{get, post}, Router, extract::{State, Path, Json, Query}, response::IntoResponse};
use common::base::page::PaginatedResponse;
use system_model::request::system_role::{CreateSystemRoleRequest, UpdateSystemRoleRequest, PaginatedKeywordRequest};
use system_model::response::system_role::SystemRoleResponse;
use common::base::model::CommonResult;
use crate::{service, AppState};

pub async fn system_role_router(state: AppState) -> OpenApiRouter {
    OpenApiRouter::new()
        .routes(routes!(create))
        .routes(routes!(update))
        .routes(routes!(delete))
        .routes(routes!(get_by_id))
        .routes(routes!(list))
        .routes(routes!(page))
        .with_state(state)
}

pub async fn system_role_route(state: AppState) -> Router {
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
    operation_id = "system_role_create",
    params(
        ("Authorization" = String, Header, description = "JWT Authorization header (e.g., 'Bearer <token>')")
    ),
    request_body(content = CreateSystemRoleRequest, description = "create", content_type = "application/json"),
    responses(
        (status = 200, description = "id", body = CommonResult<i64>)
    ),
    tag = "system_role"
)]
#[require_authorize(operation_id = "system_role_create", authorize = "")]
async fn create(
    State(state): State<AppState>,
    Json(payload): Json<CreateSystemRoleRequest>,
) -> CommonResult<i64> {
    match service::system_role::create(&state.db, payload).await {
        Ok(id) => {CommonResult::with_data(id)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/update",
    operation_id = "system_role_update",
    params(
        ("Authorization" = String, Header, description = "JWT Authorization header (e.g., 'Bearer <token>')")
    ),
    request_body(content = UpdateSystemRoleRequest, description = "update", content_type = "application/json"),
    responses(
        (status = 204, description = "update")
    ),
    tag = "system_role"
)]
#[require_authorize(operation_id = "system_role_update", authorize = "")]
async fn update(
    State(state): State<AppState>,
    Json(payload): Json<UpdateSystemRoleRequest>,
) -> CommonResult<()> {
    match service::system_role::update(&state.db, payload).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/delete/{id}",
    operation_id = "system_role_delete",
    params(
        ("Authorization" = String, Header, description = "JWT Authorization header (e.g., 'Bearer <token>')"),
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "delete")
    ),
    tag = "system_role"
)]
#[require_authorize(operation_id = "system_role_delete", authorize = "")]
async fn delete(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::system_role::delete(&state.db, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/get/{id}",
    operation_id = "system_role_get_by_id",
    params(
        ("Authorization" = String, Header, description = "JWT Authorization header (e.g., 'Bearer <token>')"),
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 200, description = "get by id", body = CommonResult<SystemRoleResponse>)
    ),
    tag = "system_role"
)]
#[require_authorize(operation_id = "system_role_get_by_id", authorize = "")]
async fn get_by_id(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> CommonResult<SystemRoleResponse> {
    match service::system_role::get_by_id(&state.db, id).await {
        Ok(Some(data)) => {CommonResult::with_data(data)}
        Ok(None) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/page",
    operation_id = "system_role_page",
    params(
        ("Authorization" = String, Header, description = "JWT Authorization header (e.g., 'Bearer <token>')"),
        ("page" = u64, Query, description = "page number"),
        ("size" = u64, Query, description = "page size"),
        ("keyword" = Option<String>, Query, description = "keyword")
    ),
    responses(
        (status = 200, description = "get page", body = CommonResult<PaginatedResponse<SystemRoleResponse>>)
    ),
    tag = "system_role"
)]
#[require_authorize(operation_id = "system_role_page", authorize = "")]
async fn page(
    State(state): State<AppState>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> CommonResult<PaginatedResponse<SystemRoleResponse>> {
    match service::system_role::get_paginated(&state.db, params).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/list",
    operation_id = "system_role_list",
    params(
        ("Authorization" = String, Header, description = "JWT Authorization header (e.g., 'Bearer <token>')")
    ),
    responses(
        (status = 200, description = "list all", body = CommonResult<Vec<SystemRoleResponse>>)
    ),
    tag = "system_role"
)]
#[require_authorize(operation_id = "system_role_list", authorize = "")]
async fn list(
    State(state): State<AppState>
) -> CommonResult<Vec<SystemRoleResponse>> {
    match service::system_role::list(&state.db).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}