use std::sync::Arc;
use sea_orm::DatabaseConnection;
use axum::{routing::{get, post}, Router, extract::{State, Path, Json, Query}, response::IntoResponse};
use common::base::page::PaginatedResponse;
use crate::service::system_tenant_package::SystemTenantPackageService;
use system_model::request::system_tenant_package::{CreateSystemTenantPackageRequest, UpdateSystemTenantPackageRequest, PaginatedKeywordRequest};
use system_model::response::system_tenant_package::SystemTenantPackageResponse;

pub async fn system_tenant_package_route(db: Arc<DatabaseConnection>) -> Router {
    let system_tenant_package_service = SystemTenantPackageService::get_instance(db).await;

    Router::new()
        .route("/create", post(create))
        .route("/update", post(update))
        .route("/delete/{id}", post(delete))
        .route("/get/{id}", get(get_by_id))
        .route("/list", get(list))
        .route("/page", get(page))
        .with_state(AppState { system_tenant_package_service })
}

#[derive(Clone)]
struct AppState {
    system_tenant_package_service: Arc<SystemTenantPackageService>,
}

async fn create(
    State(state): State<AppState>,
    Json(payload): Json<CreateSystemTenantPackageRequest>,
) -> Result<Json<i64>, axum::http::StatusCode> {
    let id = state.system_tenant_package_service.create(payload)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(id))
}

async fn update(
    State(state): State<AppState>,
    Json(payload): Json<UpdateSystemTenantPackageRequest>,
) -> Result<impl IntoResponse, axum::http::StatusCode> {
    state.system_tenant_package_service.update(payload)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(axum::http::StatusCode::NO_CONTENT)
}

async fn delete(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<impl IntoResponse, axum::http::StatusCode> {
    state.system_tenant_package_service.delete(id)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(axum::http::StatusCode::NO_CONTENT)
}

async fn get_by_id(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<Json<Option<SystemTenantPackageResponse>>, axum::http::StatusCode> {
    let system_tenant_package = state.system_tenant_package_service.get_by_id(id)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(system_tenant_package))
}

async fn page(
    State(state): State<AppState>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> Result<Json<PaginatedResponse<SystemTenantPackageResponse>>, axum::http::StatusCode> {
    let paginated = state.system_tenant_package_service.get_paginated(params)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(paginated))
}

async fn list(State(state): State<AppState>) -> Result<Json<Vec<SystemTenantPackageResponse>>, axum::http::StatusCode> {
    let list = state.system_tenant_package_service.list()
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(list))
}