use std::sync::Arc;
use sea_orm::DatabaseConnection;
use axum::{routing::{get, post}, Router, extract::{State, Path, Json, Query}, response::IntoResponse};
use common::base::page::PaginatedResponse;
use crate::service::system_role::SystemRoleService;
use system_model::request::system_role::{CreateSystemRoleRequest, UpdateSystemRoleRequest, PaginatedKeywordRequest};
use system_model::response::system_role::SystemRoleResponse;

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

async fn create(
    State(state): State<AppState>,
    Json(payload): Json<CreateSystemRoleRequest>,
) -> Result<Json<i64>, axum::http::StatusCode> {
    let id = state.system_role_service.create(payload)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(id))
}

async fn update(
    State(state): State<AppState>,
    Json(payload): Json<UpdateSystemRoleRequest>,
) -> Result<impl IntoResponse, axum::http::StatusCode> {
    state.system_role_service.update(payload)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(axum::http::StatusCode::NO_CONTENT)
}

async fn delete(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<impl IntoResponse, axum::http::StatusCode> {
    state.system_role_service.delete(id)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(axum::http::StatusCode::NO_CONTENT)
}

async fn get_by_id(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<Json<Option<SystemRoleResponse>>, axum::http::StatusCode> {
    let system_role = state.system_role_service.get_by_id(id)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(system_role))
}

async fn page(
    State(state): State<AppState>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> Result<Json<PaginatedResponse<SystemRoleResponse>>, axum::http::StatusCode> {
    let paginated = state.system_role_service.get_paginated(params)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(paginated))
}

async fn list(State(state): State<AppState>) -> Result<Json<Vec<SystemRoleResponse>>, axum::http::StatusCode> {
    let list = state.system_role_service.list()
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(list))
}