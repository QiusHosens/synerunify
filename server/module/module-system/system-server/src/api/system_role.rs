use std::sync::Arc;
use sea_orm::DatabaseConnection;
use utoipa_axum::router::OpenApiRouter;
use utoipa_axum::routes;
use ctor;
use macros::require_authorize;
use axum::{routing::{get, post}, Router, extract::{State, Path, Json, Query}, response::IntoResponse, Extension};
use common::base::page::PaginatedResponse;
use system_model::{request::system_role::{CreateSystemRoleRequest, PaginatedKeywordRequest, UpdateSystemRoleRequest, UpdateSystemRoleRuleRequest}, response::system_role::SystemRoleRuleResponse};
use system_model::response::system_role::SystemRoleResponse;
use common::base::response::CommonResult;
use common::context::context::LoginUserContext;
use crate::service;
use common::state::app_state::AppState;

pub async fn system_role_router(state: AppState) -> OpenApiRouter {
    OpenApiRouter::new()
        .routes(routes!(create))
        .routes(routes!(update))
        .routes(routes!(delete))
        .routes(routes!(get_by_id))
        .routes(routes!(list))
        .routes(routes!(page))
        .routes(routes!(enable))
        .routes(routes!(disable))
        .routes(routes!(update_rule))
        .with_state(state)
}

pub async fn system_role_route(state: AppState) -> Router {
    Router::new()
        .route("/create", post(create))
        .route("/update", post(update))
        .route("/delete/{id}", post(delete))
        .route("/get/{id}", get(get_by_id))
        .route("/list", get(list))
        .route("/page", get(page))
        .with_state(state)
}

#[utoipa::path(
    post,
    path = "/create",
    operation_id = "system_role_create",
    request_body(content = CreateSystemRoleRequest, description = "create", content_type = "application/json"),
    responses(
        (status = 200, description = "id", body = CommonResult<i64>)
    ),
    tag = "system_role",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_role_create", authorize = "system:role:add")]
async fn create(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<CreateSystemRoleRequest>,
) -> CommonResult<i64> {
    match service::system_role::create(&state.db, login_user, payload).await {
        Ok(id) => {CommonResult::with_data(id)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/update",
    operation_id = "system_role_update",
    request_body(content = UpdateSystemRoleRequest, description = "update", content_type = "application/json"),
    responses(
        (status = 204, description = "update")
    ),
    tag = "system_role",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_role_update", authorize = "system:role:edit")]
async fn update(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<UpdateSystemRoleRequest>,
) -> CommonResult<()> {
    match service::system_role::update(&state.db, login_user, payload).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/update_rule",
    operation_id = "system_role_update_rule",
    request_body(content = UpdateSystemRoleRequest, description = "update rule", content_type = "application/json"),
    responses(
        (status = 204, description = "update rule")
    ),
    tag = "system_role",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_role_update_rule", authorize = "system:role:data")]
async fn update_rule(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<UpdateSystemRoleRuleRequest>,
) -> CommonResult<()> {
    match service::system_role::update_rule(&state.db, login_user, payload).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/delete/{id}",
    operation_id = "system_role_delete",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "delete")
    ),
    tag = "system_role",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_role_delete", authorize = "system:role:delete")]
async fn delete(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::system_role::delete(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/get/{id}",
    operation_id = "system_role_get_by_id",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 200, description = "get by id", body = CommonResult<SystemRoleResponse>)
    ),
    tag = "system_role",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_role_get_by_id", authorize = "system:role:get")]
async fn get_by_id(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<SystemRoleResponse> {
    match service::system_role::get_by_id(&state.db, login_user, id).await {
        Ok(Some(data)) => {CommonResult::with_data(data)}
        Ok(None) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/page",
    operation_id = "system_role_page",
    params(
        ("page" = u64, Query, description = "page number"),
        ("size" = u64, Query, description = "page size"),
        ("keyword" = Option<String>, Query, description = "keyword")
    ),
    responses(
        (status = 200, description = "get page", body = CommonResult<PaginatedResponse<SystemRoleRuleResponse>>)
    ),
    tag = "system_role",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_role_page", authorize = "system:role:get")]
async fn page(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> CommonResult<PaginatedResponse<SystemRoleRuleResponse>> {
    match service::system_role::get_paginated(&state.db, login_user, params).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/list",
    operation_id = "system_role_list",
    responses(
        (status = 200, description = "list all", body = CommonResult<Vec<SystemRoleResponse>>)
    ),
    tag = "system_role",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_role_list", authorize = "system:role:get")]
async fn list(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
) -> CommonResult<Vec<SystemRoleResponse>> {
    match service::system_role::list(&state.db, login_user).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/enable/{id}",
    operation_id = "system_role_enable",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "enable")
    ),
    tag = "system_role",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_role_enable", authorize = "system:role:enable")]
async fn enable(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::system_role::enable(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/disable/{id}",
    operation_id = "system_role_disable",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "disable")
    ),
    tag = "system_role",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_role_disable", authorize = "system:role:disable")]
async fn disable(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::system_role::disable(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}