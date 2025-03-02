use std::sync::Arc;
use sea_orm::DatabaseConnection;
use axum::{routing::{get, post}, Router, extract::{State, Path, Json, Query}, response::IntoResponse};
use common::base::page::PaginatedResponse;
use crate::service::system_menu::SystemMenuService;
use system_model::request::system_menu::{CreateSystemMenuRequest, UpdateSystemMenuRequest, PaginatedKeywordRequest};
use system_model::response::system_menu::SystemMenuResponse;

pub async fn system_menu_route(db: Arc<DatabaseConnection>) -> Router {
    let system_menu_service = SystemMenuService::get_instance(db).await;

    Router::new()
        .route("/system_menu/create", post(create))
        .route("/system_menu/update", post(update))
        .route("/system_menu/delete", post(delete))
        .route("/system_menu/get/:id", get(get_by_id))
        .route("/system_menu/list", get(list))
        .route("/system_menu/page", get(page))
        .with_state(AppState { system_menu_service })
}

#[derive(Clone)]
struct AppState {
    system_menu_service: Arc<SystemMenuService>,
}

async fn create(
    State(state): State<AppState>,
    Json(payload): Json<CreateSystemMenuRequest>,
) -> Result<Json<i64>, axum::http::StatusCode> {
    let id = state.system_menu_service.create(payload)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(id))
}

async fn update(
    State(state): State<AppState>,
    Json(payload): Json<UpdateSystemMenuRequest>,
) -> Result<impl IntoResponse, axum::http::StatusCode> {
    state.system_menu_service.update(payload)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(axum::http::StatusCode::NO_CONTENT)
}

async fn delete(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<impl IntoResponse, axum::http::StatusCode> {
    state.system_menu_service.delete(id)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(axum::http::StatusCode::NO_CONTENT)
}

async fn get_by_id(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<Json<Option<SystemMenuResponse>>, axum::http::StatusCode> {
    let system_menu = state.system_menu_service.get_by_id(id)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(system_menu))
}

async fn page(
    State(state): State<AppState>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> Result<Json<PaginatedResponse<SystemMenuResponse>>, axum::http::StatusCode> {
    let paginated = state.system_menu_service.get_paginated(params)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(paginated))
}

async fn list(State(state): State<AppState>) -> Result<Json<Vec<SystemMenuResponse>>, axum::http::StatusCode> {
    let list = state.system_menu_service.list()
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(list))
}