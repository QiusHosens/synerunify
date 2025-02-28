use axum::{routing::{get, post, put, delete}, Router, extract::{State, Path, Json, Query}, response::IntoResponse};
use crate::services::system_notice::SystemNoticeService;
use crate::model::system_notice::{self, SystemNotice, SystemNoticeEntity, Column};
use crate::request::system_notice::{CreateSystemNoticeRequest, UpdateSystemNoticeRequest, PaginatedKeywordRequest};
use crate::response::system_notice::SystemNoticeResponse;
use common::config::database::get_database_instance;
use crate::config::Config;
use std::sync::Arc;
use serde::Deserialize;

pub async fn system_notice_route(config: Config) -> Router {
    let db = get_database_instance(&config).await.expect("Failed to get database connection");
    let system_notice_service = SystemNoticeService::get_instance(db).await;

    Router::new()
        .route("/system_notice/create", post(create))
        .route("/system_notice/update", post(update))
        .route("/system_notice/delete", post(delete))
        .route("/system_notice/get/:id", get(get_by_id))
        .route("/system_notice/list", get(list))
        .route("/system_notice/page", get(page))
        .with_state(AppState { system_notice_service })
}

#[derive(Clone)]
struct AppState {
    system_notice_service: Arc<SystemNoticeService>,
}

async fn create(
    State(state): State<AppState>,
    Json(payload): Json<CreateSystemNoticeRequest>,
) -> Result<Json<i32>, axum::http::StatusCode> {
    let id = state.system_notice_service.create(payload)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(id))
}

async fn update(
    State(state): State<AppState>,
    Path(id): Path<i32>,
    Json(payload): Json<UpdateSystemNoticeRequest>,
) -> Result<impl IntoResponse, axum::http::StatusCode> {
    state.system_notice_service.update(id, payload)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(axum::http::StatusCode::NO_CONTENT)
}

async fn delete(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<impl IntoResponse, axum::http::StatusCode> {
    state.system_notice_service.delete(id)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(axum::http::StatusCode::NO_CONTENT)
}

async fn get_by_id(
    State(state): State<AppState>,
    Path(id): Path<i32>,
) -> Result<Json<Option<SystemNoticeResponse>>, axum::http::StatusCode> {
    let system_notice = state.system_notice_service.get_by_id(id)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(system_notice))
}

async fn page(
    State(state): State<AppState>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> Result<Json<PaginatedResponse>, axum::http::StatusCode> {
    let paginated = state.system_notice_service.get_paginated(params.page, params.page_size)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(paginated))
}

async fn list(State(state): State<AppState>) -> Result<Json<Vec<SystemNoticeResponse>>, axum::http::StatusCode> {
    let list = state.system_notice_service.list()
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(list))
}