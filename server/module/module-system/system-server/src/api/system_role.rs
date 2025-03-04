use std::sync::Arc;
use sea_orm::DatabaseConnection;
use utoipa_axum::router::OpenApiRouter;
use utoipa_axum::routes;
use axum::{routing::{get, post}, Router, extract::{State, Path, Json, Query}, response::IntoResponse};
use common::base::page::PaginatedResponse;
use crate::service::system_role::SystemRoleService;
use system_model::request::system_role::{CreateSystemRoleRequest, UpdateSystemRoleRequest, PaginatedKeywordRequest};
use system_model::response::system_role::SystemRoleResponse;

pub async fn system_role_router(db: Arc<DatabaseConnection>) -> OpenApiRouter {
    let system_role_service = SystemRoleService::get_instance(db).await;

    OpenApiRouter::new()
        .routes(routes!(create))
        .routes(routes!(update))
        .routes(routes!(delete))
        .routes(routes!(get_by_id))
        .routes(routes!(list))
        .routes(routes!(page))
        .with_state(AppState { system_role_service })
}

pub async fn system_role_route(db: Arc<DatabaseConnection>) -> Router {
    let system_role_service = SystemRoleService::get_instance(db).await;

    Router::new()
        .route("/create", post(create))
        .route("/update", post(update))
        .route("/delete/{id}", post(delete))
        .route("/get/{id}", get(get_by_id))
        .route("/list", get(list))
        .route("/page", get(page))
        .with_state(AppState { system_role_service })
}

#[derive(Clone)]
struct AppState {
    system_role_service: Arc<SystemRoleService>,
}

#[utoipa::path(
    post,
    path = "/create",
    request_body(content = CreateSystemRoleRequest, description = "create", content_type = "application/json"),
    responses(
        (status = 200, description = "id", body = i64, example = json!(1))
    ),
    tag = "system_role"
)]
async fn create(
    State(state): State<AppState>,
    Json(payload): Json<CreateSystemRoleRequest>,
) -> Result<Json<i64>, axum::http::StatusCode> {
    let id = state.system_role_service.create(payload)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(id))
}

#[utoipa::path(
    post,
    path = "/update",
    request_body(content = UpdateSystemRoleRequest, description = "update", content_type = "application/json"),
    responses(
        (status = 204, description = "update")
    ),
    tag = "system_role"
)]
async fn update(
    State(state): State<AppState>,
    Json(payload): Json<UpdateSystemRoleRequest>,
) -> Result<impl IntoResponse, axum::http::StatusCode> {
    state.system_role_service.update(payload)
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
    tag = "system_role"
)]
async fn delete(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<impl IntoResponse, axum::http::StatusCode> {
    state.system_role_service.delete(id)
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
        (status = 200, description = "get by id", body = Option<SystemRoleResponse>)
    ),
    tag = "system_role"
)]
async fn get_by_id(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<Json<Option<SystemRoleResponse>>, axum::http::StatusCode> {
    let system_role = state.system_role_service.get_by_id(id)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(system_role))
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
        (status = 200, description = "get page", body = SystemRoleResponse)
    ),
    tag = "system_role"
)]
async fn page(
    State(state): State<AppState>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> Result<Json<PaginatedResponse<SystemRoleResponse>>, axum::http::StatusCode> {
    let paginated = state.system_role_service.get_paginated(params)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(paginated))
}

#[utoipa::path(
    get,
    path = "/list",
    responses(
        (status = 200, description = "list all", body = Vec<SystemRoleResponse>)
    ),
    tag = "system_role"
)]
async fn list(State(state): State<AppState>) -> Result<Json<Vec<SystemRoleResponse>>, axum::http::StatusCode> {
    let list = state.system_role_service.list()
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(list))
}