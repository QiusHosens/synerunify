use std::sync::Arc;
use sea_orm::DatabaseConnection;
use utoipa_axum::router::OpenApiRouter;
use utoipa_axum::routes;
use ctor;
use macros::require_authorize;
use axum::{routing::{get, post}, Router, extract::{State, Path, Json, Query}, response::IntoResponse};
use common::base::page::PaginatedResponse;
use system_model::request::system_department::{CreateSystemDepartmentRequest, UpdateSystemDepartmentRequest, PaginatedKeywordRequest};
use system_model::response::system_department::SystemDepartmentResponse;
use common::base::model::CommonResult;
use crate::{service, AppState};

pub async fn system_department_router(state: AppState) -> OpenApiRouter {
    OpenApiRouter::new()
        .routes(routes!(create))
        .routes(routes!(update))
        .routes(routes!(delete))
        .routes(routes!(get_by_id))
        .routes(routes!(list))
        .routes(routes!(page))
        .with_state(state)
}

pub async fn system_department_route(state: AppState) -> Router {
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
    operation_id = "system_department_create",
    params(
        ("Authorization" = String, Header, description = "JWT Authorization header (e.g., 'Bearer <token>')")
    ),
    request_body(content = CreateSystemDepartmentRequest, description = "create", content_type = "application/json"),
    responses(
        (status = 200, description = "id", body = CommonResult<i64>)
    ),
    tag = "system_department"
)]
#[require_authorize(operation_id = "system_department_create", authorize = "")]
async fn create(
    State(state): State<AppState>,
    Json(payload): Json<CreateSystemDepartmentRequest>,
) -> CommonResult<i64> {
    match service::system_department::create(&state.db, payload).await {
        Ok(id) => {CommonResult::with_data(id)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/update",
    operation_id = "system_department_update",
    params(
        ("Authorization" = String, Header, description = "JWT Authorization header (e.g., 'Bearer <token>')")
    ),
    request_body(content = UpdateSystemDepartmentRequest, description = "update", content_type = "application/json"),
    responses(
        (status = 204, description = "update")
    ),
    tag = "system_department"
)]
#[require_authorize(operation_id = "system_department_update", authorize = "")]
async fn update(
    State(state): State<AppState>,
    Json(payload): Json<UpdateSystemDepartmentRequest>,
) -> CommonResult<()> {
    match service::system_department::update(&state.db, payload).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/delete/{id}",
    operation_id = "system_department_delete",
    params(
        ("Authorization" = String, Header, description = "JWT Authorization header (e.g., 'Bearer <token>')"),
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "delete")
    ),
    tag = "system_department"
)]
#[require_authorize(operation_id = "system_department_delete", authorize = "")]
async fn delete(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::system_department::delete(&state.db, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/get/{id}",
    operation_id = "system_department_get_by_id",
    params(
        ("Authorization" = String, Header, description = "JWT Authorization header (e.g., 'Bearer <token>')"),
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 200, description = "get by id", body = CommonResult<SystemDepartmentResponse>)
    ),
    tag = "system_department"
)]
#[require_authorize(operation_id = "system_department_get_by_id", authorize = "")]
async fn get_by_id(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> CommonResult<SystemDepartmentResponse> {
    match service::system_department::get_by_id(&state.db, id).await {
        Ok(Some(data)) => {CommonResult::with_data(data)}
        Ok(None) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/page",
    operation_id = "system_department_page",
    params(
        ("Authorization" = String, Header, description = "JWT Authorization header (e.g., 'Bearer <token>')"),
        ("page" = u64, Query, description = "page number"),
        ("size" = u64, Query, description = "page size"),
        ("keyword" = Option<String>, Query, description = "keyword")
    ),
    responses(
        (status = 200, description = "get page", body = CommonResult<PaginatedResponse<SystemDepartmentResponse>>)
    ),
    tag = "system_department"
)]
#[require_authorize(operation_id = "system_department_page", authorize = "")]
async fn page(
    State(state): State<AppState>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> CommonResult<PaginatedResponse<SystemDepartmentResponse>> {
    match service::system_department::get_paginated(&state.db, params).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/list",
    operation_id = "system_department_list",
    params(
        ("Authorization" = String, Header, description = "JWT Authorization header (e.g., 'Bearer <token>')")
    ),
    responses(
        (status = 200, description = "list all", body = CommonResult<Vec<SystemDepartmentResponse>>)
    ),
    tag = "system_department"
)]
#[require_authorize(operation_id = "system_department_list", authorize = "")]
async fn list(
    State(state): State<AppState>
) -> CommonResult<Vec<SystemDepartmentResponse>> {
    match service::system_department::list(&state.db).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}