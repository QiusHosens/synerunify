use std::sync::Arc;
use sea_orm::DatabaseConnection;
use axum::{routing::{get, post}, Router, extract::{State, Path, Json, Query}, response::IntoResponse};
use common::base::page::PaginatedResponse;
use crate::service::system_data_scope_rule::SystemDataScopeRuleService;
use system_model::request::system_data_scope_rule::{CreateSystemDataScopeRuleRequest, UpdateSystemDataScopeRuleRequest, PaginatedKeywordRequest};
use system_model::response::system_data_scope_rule::SystemDataScopeRuleResponse;

pub async fn system_data_scope_rule_route(db: Arc<DatabaseConnection>) -> Router {
    let system_data_scope_rule_service = SystemDataScopeRuleService::get_instance(db).await;

    Router::new()
        .route("/system_data_scope_rule/create", post(create))
        .route("/system_data_scope_rule/update", post(update))
        .route("/system_data_scope_rule/delete/{id}", post(delete))
        .route("/system_data_scope_rule/get/{id}", get(get_by_id))
        .route("/system_data_scope_rule/list", get(list))
        .route("/system_data_scope_rule/page", get(page))
        .with_state(AppState { system_data_scope_rule_service })
}

#[derive(Clone)]
struct AppState {
    system_data_scope_rule_service: Arc<SystemDataScopeRuleService>,
}

async fn create(
    State(state): State<AppState>,
    Json(payload): Json<CreateSystemDataScopeRuleRequest>,
) -> Result<Json<i64>, axum::http::StatusCode> {
    let id = state.system_data_scope_rule_service.create(payload)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(id))
}

async fn update(
    State(state): State<AppState>,
    Json(payload): Json<UpdateSystemDataScopeRuleRequest>,
) -> Result<impl IntoResponse, axum::http::StatusCode> {
    state.system_data_scope_rule_service.update(payload)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(axum::http::StatusCode::NO_CONTENT)
}

async fn delete(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<impl IntoResponse, axum::http::StatusCode> {
    state.system_data_scope_rule_service.delete(id)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(axum::http::StatusCode::NO_CONTENT)
}

async fn get_by_id(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<Json<Option<SystemDataScopeRuleResponse>>, axum::http::StatusCode> {
    let system_data_scope_rule = state.system_data_scope_rule_service.get_by_id(id)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(system_data_scope_rule))
}

async fn page(
    State(state): State<AppState>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> Result<Json<PaginatedResponse<SystemDataScopeRuleResponse>>, axum::http::StatusCode> {
    let paginated = state.system_data_scope_rule_service.get_paginated(params)
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(paginated))
}

async fn list(State(state): State<AppState>) -> Result<Json<Vec<SystemDataScopeRuleResponse>>, axum::http::StatusCode> {
    let list = state.system_data_scope_rule_service.list()
        .await
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(list))
}