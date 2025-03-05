use std::sync::Arc;
use sea_orm::DatabaseConnection;
use utoipa_axum::router::OpenApiRouter;
use utoipa_axum::routes;
use axum::{routing::{get, post}, Router, extract::{State, Path, Json, Query}, response::IntoResponse};
use common::base::page::PaginatedResponse;
use crate::service::system_dict_type::SystemDictTypeService;
use system_model::request::system_dict_type::{CreateSystemDictTypeRequest, UpdateSystemDictTypeRequest, PaginatedKeywordRequest};
use system_model::response::system_dict_type::SystemDictTypeResponse;

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
    request_body(content = CreateSystemDictTypeRequest, description = "create", content_type = "application/json"),
    responses(
        (status = 200, description = "id", body = i64, example = json!(1))
    ),
    tag = "system_dict_type"
)]
async fn create(
    State(state): State<AppState>,
    Json(payload): Json<CreateSystemDictTypeRequest>,
) -> Result<Json<i64>, axum::http::StatusCode> {
    let id = state.system_dict_type_service.create(payload)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(id))
}

#[utoipa::path(
    post,
    path = "/update",
    request_body(content = UpdateSystemDictTypeRequest, description = "update", content_type = "application/json"),
    responses(
        (status = 204, description = "update")
    ),
    tag = "system_dict_type"
)]
async fn update(
    State(state): State<AppState>,
    Json(payload): Json<UpdateSystemDictTypeRequest>,
) -> Result<impl IntoResponse, axum::http::StatusCode> {
    state.system_dict_type_service.update(payload)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(axum::http::StatusCode::NO_CONTENT)
}

#[utoipa::path(
    post,
    path = "/delete/{id}",
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
) -> Result<impl IntoResponse, axum::http::StatusCode> {
    state.system_dict_type_service.delete(id)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(axum::http::StatusCode::NO_CONTENT)
}

#[utoipa::path(
    get,
    path = "/get/{id}",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 200, description = "get by id", body = Option<SystemDictTypeResponse>)
    ),
    tag = "system_dict_type"
)]
async fn get_by_id(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<Json<Option<SystemDictTypeResponse>>, axum::http::StatusCode> {
    let system_dict_type = state.system_dict_type_service.get_by_id(id)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(system_dict_type))
}

#[utoipa::path(
    get,
    path = "/page",
    params(
        ("page" = u64, Query, description = "page number"),
        ("page_size" = u64, Query, description = "page size"),
        ("keyword" = Option<String>, Query, description = "keyword")
    ),
    responses(
        (status = 200, description = "get page", body = SystemDictTypeResponse)
    ),
    tag = "system_dict_type"
)]
async fn page(
    State(state): State<AppState>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> Result<Json<PaginatedResponse<SystemDictTypeResponse>>, axum::http::StatusCode> {
    let paginated = state.system_dict_type_service.get_paginated(params)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(paginated))
}

#[utoipa::path(
    get,
    path = "/list",
    responses(
        (status = 200, description = "list all", body = Vec<SystemDictTypeResponse>)
    ),
    tag = "system_dict_type"
)]
async fn list(State(state): State<AppState>) -> Result<Json<Vec<SystemDictTypeResponse>>, axum::http::StatusCode> {
    let list = state.system_dict_type_service.list()
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(list))
}