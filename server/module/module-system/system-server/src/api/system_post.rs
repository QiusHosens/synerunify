use std::sync::Arc;
use sea_orm::DatabaseConnection;
use axum::{routing::{get, post}, Router, extract::{State, Path, Json, Query}, response::IntoResponse};
use common::base::page::PaginatedResponse;
use crate::service::system_post::SystemPostService;
use system_model::request::system_post::{CreateSystemPostRequest, UpdateSystemPostRequest, PaginatedKeywordRequest};
use system_model::response::system_post::SystemPostResponse;

pub async fn system_post_route(db: Arc<DatabaseConnection>) -> Router {
    let system_post_service = SystemPostService::get_instance(db).await;

    Router::new()
        .route("/system_post/create", post(create))
        .route("/system_post/update", post(update))
        .route("/system_post/delete", post(delete))
        .route("/system_post/get/:id", get(get_by_id))
        .route("/system_post/list", get(list))
        .route("/system_post/page", get(page))
        .with_state(AppState { system_post_service })
}

#[derive(Clone)]
struct AppState {
    system_post_service: Arc<SystemPostService>,
}

async fn create(
    State(state): State<AppState>,
    Json(payload): Json<CreateSystemPostRequest>,
) -> Result<Json<i64>, axum::http::StatusCode> {
    let id = state.system_post_service.create(payload)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(id))
}

async fn update(
    State(state): State<AppState>,
    Json(payload): Json<UpdateSystemPostRequest>,
) -> Result<impl IntoResponse, axum::http::StatusCode> {
    state.system_post_service.update(payload)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(axum::http::StatusCode::NO_CONTENT)
}

async fn delete(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<impl IntoResponse, axum::http::StatusCode> {
    state.system_post_service.delete(id)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(axum::http::StatusCode::NO_CONTENT)
}

async fn get_by_id(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<Json<Option<SystemPostResponse>>, axum::http::StatusCode> {
    let system_post = state.system_post_service.get_by_id(id)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(system_post))
}

async fn page(
    State(state): State<AppState>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> Result<Json<PaginatedResponse<SystemPostResponse>>, axum::http::StatusCode> {
    let paginated = state.system_post_service.get_paginated(params)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(paginated))
}

async fn list(State(state): State<AppState>) -> Result<Json<Vec<SystemPostResponse>>, axum::http::StatusCode> {
    let list = state.system_post_service.list()
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(list))
}