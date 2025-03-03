use std::sync::Arc;
use sea_orm::DatabaseConnection;
use axum::{routing::{get, post}, Router, extract::{State, Path, Json, Query}, response::IntoResponse};
use common::base::page::PaginatedResponse;
use crate::service::system_tenant::SystemTenantService;
use system_model::request::system_tenant::{CreateSystemTenantRequest, UpdateSystemTenantRequest, PaginatedKeywordRequest};
use system_model::response::system_tenant::SystemTenantResponse;

pub async fn system_tenant_route(db: Arc<DatabaseConnection>) -> Router {
    let system_tenant_service = SystemTenantService::get_instance(db).await;

    Router::new()
        .route("/create", post(create))
        .route("/update", post(update))
        .route("/delete/{id}", post(delete))
        .route("/get/{id}", get(get_by_id))
        .route("/list", get(list))
        .route("/page", get(page))
        .with_state(AppState { system_tenant_service })
}

#[derive(Clone)]
struct AppState {
    system_tenant_service: Arc<SystemTenantService>,
}

async fn create(
    State(state): State<AppState>,
    Json(payload): Json<CreateSystemTenantRequest>,
) -> Result<Json<i64>, axum::http::StatusCode> {
    let id = state.system_tenant_service.create(payload)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(id))
}

async fn update(
    State(state): State<AppState>,
    Json(payload): Json<UpdateSystemTenantRequest>,
) -> Result<impl IntoResponse, axum::http::StatusCode> {
    state.system_tenant_service.update(payload)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(axum::http::StatusCode::NO_CONTENT)
}

async fn delete(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<impl IntoResponse, axum::http::StatusCode> {
    state.system_tenant_service.delete(id)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(axum::http::StatusCode::NO_CONTENT)
}

async fn get_by_id(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<Json<Option<SystemTenantResponse>>, axum::http::StatusCode> {
    let system_tenant = state.system_tenant_service.get_by_id(id)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(system_tenant))
}

async fn page(
    State(state): State<AppState>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> Result<Json<PaginatedResponse<SystemTenantResponse>>, axum::http::StatusCode> {
    let paginated = state.system_tenant_service.get_paginated(params)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(paginated))
}

async fn list(State(state): State<AppState>) -> Result<Json<Vec<SystemTenantResponse>>, axum::http::StatusCode> {
    let list = state.system_tenant_service.list()
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(list))
}