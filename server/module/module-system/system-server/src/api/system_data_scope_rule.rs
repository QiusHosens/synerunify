use std::sync::Arc;
use sea_orm::DatabaseConnection;
use utoipa_axum::router::OpenApiRouter;
use utoipa_axum::routes;
use axum::{routing::{get, post}, Router, extract::{State, Path, Json, Query}, response::IntoResponse};
use common::base::page::PaginatedResponse;
use crate::service::system_data_scope_rule::SystemDataScopeRuleService;
use system_model::request::system_data_scope_rule::{CreateSystemDataScopeRuleRequest, UpdateSystemDataScopeRuleRequest, PaginatedKeywordRequest};
use system_model::response::system_data_scope_rule::SystemDataScopeRuleResponse;

pub async fn system_data_scope_rule_router(db: Arc<DatabaseConnection>) -> OpenApiRouter {
    let system_data_scope_rule_service = SystemDataScopeRuleService::get_instance(db).await;

    OpenApiRouter::new()
        .routes(routes!(create))
        .routes(routes!(update))
        .routes(routes!(delete))
        .routes(routes!(get_by_id))
        .routes(routes!(list))
        .routes(routes!(page))
        .with_state(AppState { system_data_scope_rule_service })
}

pub async fn system_data_scope_rule_route(db: Arc<DatabaseConnection>) -> Router {
    let system_data_scope_rule_service = SystemDataScopeRuleService::get_instance(db).await;

    Router::new()
        .route("/create", post(create))
        .route("/update", post(update))
        .route("/delete/{id}", post(delete))
        .route("/get/{id}", get(get_by_id))
        .route("/list", get(list))
        .route("/page", get(page))
        .with_state(AppState { system_data_scope_rule_service })
}

#[derive(Clone)]
struct AppState {
    system_data_scope_rule_service: Arc<SystemDataScopeRuleService>,
}

#[utoipa::path(
    post,
    path = "/create",
    operation_id = "system_data_scope_rule_create",
    request_body(content = CreateSystemDataScopeRuleRequest, description = "create", content_type = "application/json"),
    responses(
        (status = 200, description = "id", body = i64, example = json!(1))
    ),
    tag = "system_data_scope_rule"
)]
async fn create(
    State(state): State<AppState>,
    Json(payload): Json<CreateSystemDataScopeRuleRequest>,
) -> Result<Json<i64>, axum::http::StatusCode> {
    let id = state.system_data_scope_rule_service.create(payload)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(id))
}

#[utoipa::path(
    post,
    path = "/update",
    operation_id = "system_data_scope_rule_update",
    request_body(content = UpdateSystemDataScopeRuleRequest, description = "update", content_type = "application/json"),
    responses(
        (status = 204, description = "update")
    ),
    tag = "system_data_scope_rule"
)]
async fn update(
    State(state): State<AppState>,
    Json(payload): Json<UpdateSystemDataScopeRuleRequest>,
) -> Result<impl IntoResponse, axum::http::StatusCode> {
    state.system_data_scope_rule_service.update(payload)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(axum::http::StatusCode::NO_CONTENT)
}

#[utoipa::path(
    post,
    path = "/delete/{id}",
    operation_id = "system_data_scope_rule_delete",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "delete")
    ),
    tag = "system_data_scope_rule"
)]
async fn delete(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<impl IntoResponse, axum::http::StatusCode> {
    state.system_data_scope_rule_service.delete(id)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(axum::http::StatusCode::NO_CONTENT)
}

#[utoipa::path(
    get,
    path = "/get/{id}",
    operation_id = "system_data_scope_rule_get_by_id",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 200, description = "get by id", body = Option<SystemDataScopeRuleResponse>)
    ),
    tag = "system_data_scope_rule"
)]
async fn get_by_id(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<Json<Option<SystemDataScopeRuleResponse>>, axum::http::StatusCode> {
    let system_data_scope_rule = state.system_data_scope_rule_service.get_by_id(id)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(system_data_scope_rule))
}

#[utoipa::path(
    get,
    path = "/page",
    operation_id = "system_data_scope_rule_page",
    params(
        ("page" = u64, Query, description = "page number"),
        ("page_size" = u64, Query, description = "page size"),
        ("keyword" = Option<String>, Query, description = "keyword")
    ),
    responses(
        (status = 200, description = "get page", body = SystemDataScopeRuleResponse)
    ),
    tag = "system_data_scope_rule"
)]
async fn page(
    State(state): State<AppState>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> Result<Json<PaginatedResponse<SystemDataScopeRuleResponse>>, axum::http::StatusCode> {
    let paginated = state.system_data_scope_rule_service.get_paginated(params)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(paginated))
}

#[utoipa::path(
    get,
    path = "/list",
    operation_id = "system_data_scope_rule_list",
    responses(
        (status = 200, description = "list all", body = Vec<SystemDataScopeRuleResponse>)
    ),
    tag = "system_data_scope_rule"
)]
async fn list(State(state): State<AppState>) -> Result<Json<Vec<SystemDataScopeRuleResponse>>, axum::http::StatusCode> {
    let list = state.system_data_scope_rule_service.list()
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(list))
}