use std::sync::Arc;
use sea_orm::DatabaseConnection;
use axum::{routing::{get, post}, Router, extract::{State, Path, Json, Query}, response::IntoResponse};
use common::base::page::PaginatedResponse;
use crate::service::system_user_role::SystemUserRoleService;
use system_model::request::system_user_role::{CreateSystemUserRoleRequest, UpdateSystemUserRoleRequest, PaginatedKeywordRequest};
use system_model::response::system_user_role::SystemUserRoleResponse;

pub async fn system_user_role_route(db: Arc<DatabaseConnection>) -> Router {
    let system_user_role_service = SystemUserRoleService::get_instance(db).await;

    Router::new()
        .route("/system_user_role/create", post(create))
        .route("/system_user_role/update", post(update))
        .route("/system_user_role/delete", post(delete))
        .route("/system_user_role/get/:id", get(get_by_id))
        .route("/system_user_role/list", get(list))
        .route("/system_user_role/page", get(page))
        .with_state(AppState { system_user_role_service })
}

#[derive(Clone)]
struct AppState {
    system_user_role_service: Arc<SystemUserRoleService>,
}

async fn create(
    State(state): State<AppState>,
    Json(payload): Json<CreateSystemUserRoleRequest>,
) -> Result<Json<i64>, axum::http::StatusCode> {
    let id = state.system_user_role_service.create(payload)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(id))
}

async fn update(
    State(state): State<AppState>,
    Json(payload): Json<UpdateSystemUserRoleRequest>,
) -> Result<impl IntoResponse, axum::http::StatusCode> {
    state.system_user_role_service.update(payload)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(axum::http::StatusCode::NO_CONTENT)
}

async fn delete(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<impl IntoResponse, axum::http::StatusCode> {
    state.system_user_role_service.delete(id)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(axum::http::StatusCode::NO_CONTENT)
}

async fn get_by_id(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<Json<Option<SystemUserRoleResponse>>, axum::http::StatusCode> {
    let system_user_role = state.system_user_role_service.get_by_id(id)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(system_user_role))
}

async fn page(
    State(state): State<AppState>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> Result<Json<PaginatedResponse<SystemUserRoleResponse>>, axum::http::StatusCode> {
    let paginated = state.system_user_role_service.get_paginated(params)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(paginated))
}

async fn list(State(state): State<AppState>) -> Result<Json<Vec<SystemUserRoleResponse>>, axum::http::StatusCode> {
    let list = state.system_user_role_service.list()
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(list))
}