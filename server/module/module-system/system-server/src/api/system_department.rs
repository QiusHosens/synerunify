use std::sync::Arc;
use sea_orm::DatabaseConnection;
use axum::{routing::{get, post}, Router, extract::{State, Path, Json, Query}, response::IntoResponse};
use common::base::page::PaginatedResponse;
use crate::service::system_department::SystemDepartmentService;
use system_model::request::system_department::{CreateSystemDepartmentRequest, UpdateSystemDepartmentRequest, PaginatedKeywordRequest};
use system_model::response::system_department::SystemDepartmentResponse;

pub async fn system_department_route(db: Arc<DatabaseConnection>) -> Router {
    let system_department_service = SystemDepartmentService::get_instance(db).await;

    Router::new()
        .route("/system_department/create", post(create))
        .route("/system_department/update", post(update))
        .route("/system_department/delete", post(delete))
        .route("/system_department/get/:id", get(get_by_id))
        .route("/system_department/list", get(list))
        .route("/system_department/page", get(page))
        .with_state(AppState { system_department_service })
}

#[derive(Clone)]
struct AppState {
    system_department_service: Arc<SystemDepartmentService>,
}

async fn create(
    State(state): State<AppState>,
    Json(payload): Json<CreateSystemDepartmentRequest>,
) -> Result<Json<i64>, axum::http::StatusCode> {
    let id = state.system_department_service.create(payload)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(id))
}

async fn update(
    State(state): State<AppState>,
    Json(payload): Json<UpdateSystemDepartmentRequest>,
) -> Result<impl IntoResponse, axum::http::StatusCode> {
    state.system_department_service.update(payload)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(axum::http::StatusCode::NO_CONTENT)
}

async fn delete(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<impl IntoResponse, axum::http::StatusCode> {
    state.system_department_service.delete(id)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(axum::http::StatusCode::NO_CONTENT)
}

async fn get_by_id(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<Json<Option<SystemDepartmentResponse>>, axum::http::StatusCode> {
    let system_department = state.system_department_service.get_by_id(id)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(system_department))
}

async fn page(
    State(state): State<AppState>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> Result<Json<PaginatedResponse<SystemDepartmentResponse>>, axum::http::StatusCode> {
    let paginated = state.system_department_service.get_paginated(params)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(paginated))
}

async fn list(State(state): State<AppState>) -> Result<Json<Vec<SystemDepartmentResponse>>, axum::http::StatusCode> {
    let list = state.system_department_service.list()
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(list))
}