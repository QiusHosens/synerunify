use std::sync::Arc;
use sea_orm::DatabaseConnection;
use utoipa_axum::router::OpenApiRouter;
use axum::{routing::{get, post}, extract::{State, Path, Json, Query}, response::IntoResponse};
use common::base::page::PaginatedResponse;
use crate::service::system_user_post::SystemUserPostService;
use system_model::request::system_user_post::{CreateSystemUserPostRequest, UpdateSystemUserPostRequest, PaginatedKeywordRequest};
use system_model::response::system_user_post::SystemUserPostResponse;

pub async fn system_user_post_route(db: Arc<DatabaseConnection>) -> OpenApiRouter {
    let system_user_post_service = SystemUserPostService::get_instance(db).await;

    OpenApiRouter::new()
        .route("/create", post(create))
        .route("/update", post(update))
        .route("/delete/{id}", post(delete))
        .route("/get/{id}", get(get_by_id))
        .route("/list", get(list))
        .route("/page", get(page))
        .with_state(AppState { system_user_post_service })
}

#[derive(Clone)]
struct AppState {
    system_user_post_service: Arc<SystemUserPostService>,
}

#[utoipa::path(
    post,
    path = "/create",
    request_body(content = CreateSystemUserPostRequest, description = "create", content_type = "application/json"),
    responses(
        (status = 200, description = "id", body = i64, example = json!(1))
    )
)]
async fn create(
    State(state): State<AppState>,
    Json(payload): Json<CreateSystemUserPostRequest>,
) -> Result<Json<i64>, axum::http::StatusCode> {
    let id = state.system_user_post_service.create(payload)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(id))
}

#[utoipa::path(
    post,
    path = "/update",
    request_body(content = UpdateSystemUserPostRequest, description = "update", content_type = "application/json"),
    responses(
        (status = 204, description = "update")
    )
)]
async fn update(
    State(state): State<AppState>,
    Json(payload): Json<UpdateSystemUserPostRequest>,
) -> Result<impl IntoResponse, axum::http::StatusCode> {
    state.system_user_post_service.update(payload)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(axum::http::StatusCode::NO_CONTENT)
}

#[utoipa::path(
    post,
    path = "/delete/{id}",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "delete")
    )
)]
async fn delete(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<impl IntoResponse, axum::http::StatusCode> {
    state.system_user_post_service.delete(id)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(axum::http::StatusCode::NO_CONTENT)
}

#[utoipa::path(
    get,
    path = "/get/{id}",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 200, description = "get by id", body = Option<SystemUserPostResponse>)
    )
)]
async fn get_by_id(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<Json<Option<SystemUserPostResponse>>, axum::http::StatusCode> {
    let system_user_post = state.system_user_post_service.get_by_id(id)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(system_user_post))
}

#[utoipa::path(
    get,
    path = "/page",
    params(
        ("page" = u64, Query, description = "page number"),
        ("page_size" = u64, Query, description = "page size"),
        ("keyword" = Option<String>, Query, description = "keyword")
    ),
    responses(
        (status = 200, description = "get page", body = SystemUserPostResponse)
    )
)]
async fn page(
    State(state): State<AppState>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> Result<Json<PaginatedResponse<SystemUserPostResponse>>, axum::http::StatusCode> {
    let paginated = state.system_user_post_service.get_paginated(params)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(paginated))
}

#[utoipa::path(
    get,
    path = "/list",
    responses(
        (status = 200, description = "list all", body = Vec<SystemUserPostResponse>)
    )
)]
async fn list(State(state): State<AppState>) -> Result<Json<Vec<SystemUserPostResponse>>, axum::http::StatusCode> {
    let list = state.system_user_post_service.list()
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(list))
}