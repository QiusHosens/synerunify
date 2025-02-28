use std::sync::Arc;
use axum::{routing::{get, post}, Router, extract::{State, Path, Json, Query}, response::IntoResponse};
use common::config::config::Config;
use common::base::page::PaginatedResponse;
use common::config::database::get_database_instance;
use crate::service::system_user::SystemUserService;
use system_model::request::system_user::{CreateSystemUserRequest, UpdateSystemUserRequest, PaginatedKeywordRequest};
use system_model::response::system_user::SystemUserResponse;

pub async fn system_user_route(config: Config) -> Router {
    let db = get_database_instance(&config).await.expect("Failed to get database connection");
    let system_user_service = SystemUserService::get_instance(db).await;

    Router::new()
        .route("/system_user/create", post(create))
        .route("/system_user/update", post(update))
        .route("/system_user/delete", post(delete))
        .route("/system_user/get/:id", get(get_by_id))
        .route("/system_user/list", get(list))
        .route("/system_user/page", get(page))
        .with_state(AppState { system_user_service })
}

#[derive(Clone)]
struct AppState {
    system_user_service: Arc<SystemUserService>,
}

async fn create(
    State(state): State<AppState>,
    Json(payload): Json<CreateSystemUserRequest>,
) -> Result<Json<i64>, axum::http::StatusCode> {
    let id = state.system_user_service.create(payload)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(id))
}

async fn update(
    State(state): State<AppState>,
    Json(payload): Json<UpdateSystemUserRequest>,
) -> Result<impl IntoResponse, axum::http::StatusCode> {
    state.system_user_service.update(payload)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(axum::http::StatusCode::NO_CONTENT)
}

async fn delete(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<impl IntoResponse, axum::http::StatusCode> {
    state.system_user_service.delete(id)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(axum::http::StatusCode::NO_CONTENT)
}

async fn get_by_id(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<Json<Option<SystemUserResponse>>, axum::http::StatusCode> {
    let system_user = state.system_user_service.get_by_id(id)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(system_user))
}

async fn page(
    State(state): State<AppState>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> Result<Json<PaginatedResponse<SystemUserResponse>>, axum::http::StatusCode> {
    let paginated = state.system_user_service.get_paginated(params)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(paginated))
}

async fn list(State(state): State<AppState>) -> Result<Json<Vec<SystemUserResponse>>, axum::http::StatusCode> {
    let list = state.system_user_service.list()
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(list))
}