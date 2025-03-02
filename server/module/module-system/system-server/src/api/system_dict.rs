use std::sync::Arc;
use sea_orm::DatabaseConnection;
use axum::{routing::{get, post}, Router, extract::{State, Path, Json, Query}, response::IntoResponse};
use common::base::page::PaginatedResponse;
use crate::service::system_dict::SystemDictService;
use system_model::request::system_dict::{CreateSystemDictRequest, UpdateSystemDictRequest, PaginatedKeywordRequest};
use system_model::response::system_dict::SystemDictResponse;

pub async fn system_dict_route(db: Arc<DatabaseConnection>) -> Router {
    let system_dict_service = SystemDictService::get_instance(db).await;

    Router::new()
        .route("/system_dict/create", post(create))
        .route("/system_dict/update", post(update))
        .route("/system_dict/delete", post(delete))
        .route("/system_dict/get/:id", get(get_by_id))
        .route("/system_dict/list", get(list))
        .route("/system_dict/page", get(page))
        .with_state(AppState { system_dict_service })
}

#[derive(Clone)]
struct AppState {
    system_dict_service: Arc<SystemDictService>,
}

async fn create(
    State(state): State<AppState>,
    Json(payload): Json<CreateSystemDictRequest>,
) -> Result<Json<i64>, axum::http::StatusCode> {
    let id = state.system_dict_service.create(payload)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(id))
}

async fn update(
    State(state): State<AppState>,
    Json(payload): Json<UpdateSystemDictRequest>,
) -> Result<impl IntoResponse, axum::http::StatusCode> {
    state.system_dict_service.update(payload)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(axum::http::StatusCode::NO_CONTENT)
}

async fn delete(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<impl IntoResponse, axum::http::StatusCode> {
    state.system_dict_service.delete(id)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(axum::http::StatusCode::NO_CONTENT)
}

async fn get_by_id(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<Json<Option<SystemDictResponse>>, axum::http::StatusCode> {
    let system_dict = state.system_dict_service.get_by_id(id)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(system_dict))
}

async fn page(
    State(state): State<AppState>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> Result<Json<PaginatedResponse<SystemDictResponse>>, axum::http::StatusCode> {
    let paginated = state.system_dict_service.get_paginated(params)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(paginated))
}

async fn list(State(state): State<AppState>) -> Result<Json<Vec<SystemDictResponse>>, axum::http::StatusCode> {
    let list = state.system_dict_service.list()
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(list))
}