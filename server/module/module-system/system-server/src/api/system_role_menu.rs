use std::sync::Arc;
use axum::{routing::{get, post}, Router, extract::{State, Path, Json, Query}, response::IntoResponse};
use common::config::config::Config;
use common::base::page::PaginatedResponse;
use common::config::database::get_database_instance;
use crate::service::system_role_menu::SystemRoleMenuService;
use system_model::request::system_role_menu::{CreateSystemRoleMenuRequest, UpdateSystemRoleMenuRequest, PaginatedKeywordRequest};
use system_model::response::system_role_menu::SystemRoleMenuResponse;

pub async fn system_role_menu_route(config: Config) -> Router {
    let db = get_database_instance(&config).await.expect("Failed to get database connection");
    let system_role_menu_service = SystemRoleMenuService::get_instance(db).await;

    Router::new()
        .route("/system_role_menu/create", post(create))
        .route("/system_role_menu/update", post(update))
        .route("/system_role_menu/delete", post(delete))
        .route("/system_role_menu/get/:id", get(get_by_id))
        .route("/system_role_menu/list", get(list))
        .route("/system_role_menu/page", get(page))
        .with_state(AppState { system_role_menu_service })
}

#[derive(Clone)]
struct AppState {
    system_role_menu_service: Arc<SystemRoleMenuService>,
}

async fn create(
    State(state): State<AppState>,
    Json(payload): Json<CreateSystemRoleMenuRequest>,
) -> Result<Json<i64>, axum::http::StatusCode> {
    let id = state.system_role_menu_service.create(payload)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(id))
}

async fn update(
    State(state): State<AppState>,
    Json(payload): Json<UpdateSystemRoleMenuRequest>,
) -> Result<impl IntoResponse, axum::http::StatusCode> {
    state.system_role_menu_service.update(payload)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(axum::http::StatusCode::NO_CONTENT)
}

async fn delete(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<impl IntoResponse, axum::http::StatusCode> {
    state.system_role_menu_service.delete(id)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(axum::http::StatusCode::NO_CONTENT)
}

async fn get_by_id(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<Json<Option<SystemRoleMenuResponse>>, axum::http::StatusCode> {
    let system_role_menu = state.system_role_menu_service.get_by_id(id)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(system_role_menu))
}

async fn page(
    State(state): State<AppState>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> Result<Json<PaginatedResponse<SystemRoleMenuResponse>>, axum::http::StatusCode> {
    let paginated = state.system_role_menu_service.get_paginated(params)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(paginated))
}

async fn list(State(state): State<AppState>) -> Result<Json<Vec<SystemRoleMenuResponse>>, axum::http::StatusCode> {
    let list = state.system_role_menu_service.list()
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(list))
}