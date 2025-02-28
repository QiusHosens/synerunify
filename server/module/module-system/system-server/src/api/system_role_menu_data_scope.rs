use axum::{routing::{get, post, put, delete}, Router, extract::{State, Path, Json, Query}, response::IntoResponse};
use crate::services::system_role_menu_data_scope::SystemRoleMenuDataScopeService;
use crate::model::system_role_menu_data_scope::{self, SystemRoleMenuDataScope, SystemRoleMenuDataScopeEntity, Column};
use crate::request::system_role_menu_data_scope::{CreateSystemRoleMenuDataScopeRequest, UpdateSystemRoleMenuDataScopeRequest, PaginatedKeywordRequest};
use crate::response::system_role_menu_data_scope::SystemRoleMenuDataScopeResponse;
use common::config::database::get_database_instance;
use crate::config::Config;
use std::sync::Arc;
use serde::Deserialize;

pub async fn system_role_menu_data_scope_route(config: Config) -> Router {
    let db = get_database_instance(&config).await.expect("Failed to get database connection");
    let system_role_menu_data_scope_service = SystemRoleMenuDataScopeService::get_instance(db).await;

    Router::new()
        .route("/system_role_menu_data_scope/create", post(create))
        .route("/system_role_menu_data_scope/update", post(update))
        .route("/system_role_menu_data_scope/delete", post(delete))
        .route("/system_role_menu_data_scope/get/:id", get(get_by_id))
        .route("/system_role_menu_data_scope/list", get(list))
        .route("/system_role_menu_data_scope/page", get(page))
        .with_state(AppState { system_role_menu_data_scope_service })
}

#[derive(Clone)]
struct AppState {
    system_role_menu_data_scope_service: Arc<SystemRoleMenuDataScopeService>,
}

async fn create(
    State(state): State<AppState>,
    Json(payload): Json<CreateSystemRoleMenuDataScopeRequest>,
) -> Result<Json<i32>, axum::http::StatusCode> {
    let id = state.system_role_menu_data_scope_service.create(payload)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(id))
}

async fn update(
    State(state): State<AppState>,
    Path(id): Path<i32>,
    Json(payload): Json<UpdateSystemRoleMenuDataScopeRequest>,
) -> Result<impl IntoResponse, axum::http::StatusCode> {
    state.system_role_menu_data_scope_service.update(id, payload)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(axum::http::StatusCode::NO_CONTENT)
}

async fn delete(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<impl IntoResponse, axum::http::StatusCode> {
    state.system_role_menu_data_scope_service.delete(id)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(axum::http::StatusCode::NO_CONTENT)
}

async fn get_by_id(
    State(state): State<AppState>,
    Path(id): Path<i32>,
) -> Result<Json<Option<SystemRoleMenuDataScopeResponse>>, axum::http::StatusCode> {
    let system_role_menu_data_scope = state.system_role_menu_data_scope_service.get_by_id(id)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(system_role_menu_data_scope))
}

async fn page(
    State(state): State<AppState>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> Result<Json<PaginatedResponse>, axum::http::StatusCode> {
    let paginated = state.system_role_menu_data_scope_service.get_paginated(params.page, params.page_size)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(paginated))
}

async fn list(State(state): State<AppState>) -> Result<Json<Vec<SystemRoleMenuDataScopeResponse>>, axum::http::StatusCode> {
    let list = state.system_role_menu_data_scope_service.list()
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(list))
}