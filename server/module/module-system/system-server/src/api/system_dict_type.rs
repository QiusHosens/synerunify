use std::sync::Arc;
use sea_orm::DatabaseConnection;
use utoipa_axum::router::OpenApiRouter;
use utoipa_axum::routes;
use axum::{routing::{get, post}, Router, extract::{State, Path, Json, Query}, response::IntoResponse};
use common::base::page::PaginatedResponse;
use crate::service::system_dict_type::SystemDictTypeService;
use system_model::request::system_dict_type::{CreateSystemDictTypeRequest, UpdateSystemDictTypeRequest, PaginatedKeywordRequest};
use system_model::response::system_dict_type::SystemDictTypeResponse;
use common::base::model::CommonResult;

pub async fn system_dict_type_router(db: Arc<DatabaseConnection>) -> OpenApiRouter {
    let system_dict_type_service = SystemDictTypeService::get_instance(db).await;

    OpenApiRouter::new()
        .routes(routes!(create))
        .routes(routes!(update))
        .routes(routes!(delete))
        .routes(routes!(get_by_id))
        .routes(routes!(list))
        .routes(routes!(page))
        .with_state(AppState { system_dict_type_service })
}

pub async fn system_dict_type_route(db: Arc<DatabaseConnection>) -> Router {
    let system_dict_type_service = SystemDictTypeService::get_instance(db).await;

    Router::new()
        .route("/create", post(create))
        .route("/update", post(update))
        .route("/delete/{id}", post(delete))
        .route("/get/{id}", get(get_by_id))
        .route("/list", get(list))
        .route("/page", get(page))
        .with_state(AppState { system_dict_type_service })
}

#[derive(Clone)]
struct AppState {
    system_dict_type_service: Arc<SystemDictTypeService>,
}

#[utoipa::path(
    post,
    path = "/create",
    operation_id = "system_dict_type_create",
    request_body(content = CreateSystemDictTypeRequest, description = "create", content_type = "application/json"),
    responses(
        (status = 200, description = "id", body = CommonResult<i64>)
    ),
    tag = "system_dict_type"
)]
async fn create(
    State(state): State<AppState>,
    Json(payload): Json<CreateSystemDictTypeRequest>,
) -> CommonResult<i64> {
    match state.system_dict_type_service.create(payload).await {
        Ok(id) => {CommonResult::with_data(id)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/update",
    operation_id = "system_dict_type_update",
    request_body(content = UpdateSystemDictTypeRequest, description = "update", content_type = "application/json"),
    responses(
        (status = 204, description = "update")
    ),
    tag = "system_dict_type"
)]
async fn update(
    State(state): State<AppState>,
    Json(payload): Json<UpdateSystemDictTypeRequest>,
) -> CommonResult<()> {
    match state.system_dict_type_service.update(payload).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/delete/{id}",
    operation_id = "system_dict_type_delete",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "delete")
    ),
    tag = "system_dict_type"
)]
async fn delete(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match state.system_dict_type_service.delete(id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/get/{id}",
    operation_id = "system_dict_type_get_by_id",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 200, description = "get by id", body = CommonResult<SystemDictTypeResponse>)
    ),
    tag = "system_dict_type"
)]
async fn get_by_id(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> CommonResult<SystemDictTypeResponse> {
    match state.system_dict_type_service.get_by_id(id).await {
        Ok(Some(data)) => {CommonResult::with_data(data)}
        Ok(None) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/page",
    operation_id = "system_dict_type_page",
    params(
        ("page" = u64, Query, description = "page number"),
        ("page_size" = u64, Query, description = "page size"),
        ("keyword" = Option<String>, Query, description = "keyword")
    ),
    responses(
        (status = 200, description = "get page", body = CommonResult<PaginatedResponse<SystemDictTypeResponse>>)
    ),
    tag = "system_dict_type"
)]
async fn page(
    State(state): State<AppState>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> CommonResult<PaginatedResponse<SystemDictTypeResponse>> {
    match state.system_dict_type_service.get_paginated(params).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/list",
    operation_id = "system_dict_type_list",
    responses(
        (status = 200, description = "list all", body = CommonResult<Vec<SystemDictTypeResponse>>)
    ),
    tag = "system_dict_type"
)]
async fn list(
    State(state): State<AppState>
) -> CommonResult<Vec<SystemDictTypeResponse>> {
    match state.system_dict_type_service.list().await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}