use std::sync::Arc;
use sea_orm::DatabaseConnection;
use utoipa_axum::router::OpenApiRouter;
use utoipa_axum::routes;
use axum::{routing::{get, post}, Router, extract::{State, Path, Json, Query}, response::IntoResponse};
use common::base::page::PaginatedResponse;
use crate::service::system_post::SystemPostService;
use system_model::request::system_post::{CreateSystemPostRequest, UpdateSystemPostRequest, PaginatedKeywordRequest};
use system_model::response::system_post::SystemPostResponse;
use common::base::model::CommonResult;

pub async fn system_post_router(db: Arc<DatabaseConnection>) -> OpenApiRouter {
    let system_post_service = SystemPostService::get_instance(db).await;

    OpenApiRouter::new()
        .routes(routes!(create))
        .routes(routes!(update))
        .routes(routes!(delete))
        .routes(routes!(get_by_id))
        .routes(routes!(list))
        .routes(routes!(page))
        .with_state(AppState { system_post_service })
}

pub async fn system_post_route(db: Arc<DatabaseConnection>) -> Router {
    let system_post_service = SystemPostService::get_instance(db).await;

    Router::new()
        .route("/create", post(create))
        .route("/update", post(update))
        .route("/delete/{id}", post(delete))
        .route("/get/{id}", get(get_by_id))
        .route("/list", get(list))
        .route("/page", get(page))
        .with_state(AppState { system_post_service })
}

#[derive(Clone)]
struct AppState {
    system_post_service: Arc<SystemPostService>,
}

#[utoipa::path(
    post,
    path = "/create",
    operation_id = "system_post_create",
    request_body(content = CreateSystemPostRequest, description = "create", content_type = "application/json"),
    responses(
        (status = 200, description = "id", body = CommonResult<i64>)
    ),
    tag = "system_post"
)]
async fn create(
    State(state): State<AppState>,
    Json(payload): Json<CreateSystemPostRequest>,
) -> CommonResult<i64> {
    match state.system_post_service.create(payload).await {
        Ok(id) => {CommonResult::with_data(id)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/update",
    operation_id = "system_post_update",
    request_body(content = UpdateSystemPostRequest, description = "update", content_type = "application/json"),
    responses(
        (status = 204, description = "update")
    ),
    tag = "system_post"
)]
async fn update(
    State(state): State<AppState>,
    Json(payload): Json<UpdateSystemPostRequest>,
) -> CommonResult<()> {
    match state.system_post_service.update(payload).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/delete/{id}",
    operation_id = "system_post_delete",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "delete")
    ),
    tag = "system_post"
)]
async fn delete(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match state.system_post_service.delete(id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/get/{id}",
    operation_id = "system_post_get_by_id",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 200, description = "get by id", body = CommonResult<SystemPostResponse>)
    ),
    tag = "system_post"
)]
async fn get_by_id(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> CommonResult<SystemPostResponse> {
    match state.system_post_service.get_by_id(id).await {
        Ok(Some(data)) => {CommonResult::with_data(data)}
        Ok(None) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/page",
    operation_id = "system_post_page",
    params(
        ("page" = u64, Query, description = "page number"),
        ("page_size" = u64, Query, description = "page size"),
        ("keyword" = Option<String>, Query, description = "keyword")
    ),
    responses(
        (status = 200, description = "get page", body = CommonResult<PaginatedResponse<SystemPostResponse>>)
    ),
    tag = "system_post"
)]
async fn page(
    State(state): State<AppState>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> CommonResult<PaginatedResponse<SystemPostResponse>> {
    match state.system_post_service.get_paginated(params).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/list",
    operation_id = "system_post_list",
    responses(
        (status = 200, description = "list all", body = CommonResult<Vec<SystemPostResponse>>)
    ),
    tag = "system_post"
)]
async fn list(
    State(state): State<AppState>
) -> CommonResult<Vec<SystemPostResponse>> {
    match state.system_post_service.list().await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}