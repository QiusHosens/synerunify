use axum::{routing::{get, post, put, delete}, Router, extract::{State, Path, Json, Query}, response::IntoResponse};
use crate::services::system_tenant::SystemTenantService;
use crate::model::system_tenant::{self, SystemTenant, SystemTenantEntity, Column};
use crate::request::system_tenant::{CreateSystemTenantRequest, UpdateSystemTenantRequest, PaginatedKeywordRequest};
use crate::response::system_tenant::SystemTenantResponse;
use common::config::database::get_database_instance;
use crate::config::Config;
use std::sync::Arc;
use serde::Deserialize;

pub async fn system_tenant_route(config: Config) -> Router {
    let db = get_database_instance(&config).await.expect("Failed to get database connection");
    let system_tenant_service = SystemTenantService::get_instance(db).await;

    Router::new()
        .route("/system_tenant/create", post(create))
        .route("/system_tenant/update", post(update))
        .route("/system_tenant/delete", post(delete))
        .route("/system_tenant/get/:id", get(get_by_id))
        .route("/system_tenant/list", get(list))
        .route("/system_tenant/page", get(page))
        .with_state(AppState { system_tenant_service })
}

#[derive(Clone)]
struct AppState {
    system_tenant_service: Arc<SystemTenantService>,
}

async fn create(
    State(state): State<AppState>,
    Json(payload): Json<CreateSystemTenantRequest>,
) -> Result<Json<i32>, axum::http::StatusCode> {
    let id = state.system_tenant_service.create(payload)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(id))
}

async fn update(
    State(state): State<AppState>,
    Path(id): Path<i32>,
    Json(payload): Json<UpdateSystemTenantRequest>,
) -> Result<impl IntoResponse, axum::http::StatusCode> {
    state.system_tenant_service.update(id, payload)
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
    Path(id): Path<i32>,
) -> Result<Json<Option<SystemTenantResponse>>, axum::http::StatusCode> {
    let system_tenant = state.system_tenant_service.get_by_id(id)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(system_tenant))
}

async fn page(
    State(state): State<AppState>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> Result<Json<PaginatedResponse>, axum::http::StatusCode> {
    let paginated = state.system_tenant_service.get_paginated(params.page, params.page_size)
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