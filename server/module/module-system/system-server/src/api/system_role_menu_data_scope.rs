use std::sync::Arc;
use sea_orm::DatabaseConnection;
use utoipa_axum::router::OpenApiRouter;
use utoipa_axum::routes;
use ctor;
use macros::require_authorize;
use axum::{routing::{get, post}, Router, extract::{State, Path, Json, Query}, response::IntoResponse, Extension};
use common::base::page::PaginatedResponse;
use system_model::request::system_role_menu_data_scope::{CreateSystemRoleMenuDataScopeRequest, UpdateSystemRoleMenuDataScopeRequest, PaginatedKeywordRequest};
use system_model::response::system_role_menu_data_scope::SystemRoleMenuDataScopeResponse;
use common::base::response::CommonResult;
use common::context::context::LoginUserContext;
use crate::{service, AppState};

pub async fn system_role_menu_data_scope_router(state: AppState) -> OpenApiRouter {
    OpenApiRouter::new()
        .routes(routes!(create))
        .routes(routes!(update))
        .routes(routes!(delete))
        .routes(routes!(get_by_id))
        .routes(routes!(list))
        .routes(routes!(page))
        .with_state(state)
}

pub async fn system_role_menu_data_scope_route(state: AppState) -> Router {
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
    operation_id = "system_role_menu_data_scope_create",
    request_body(content = CreateSystemRoleMenuDataScopeRequest, description = "create", content_type = "application/json"),
    responses(
        (status = 200, description = "id", body = CommonResult<i64>)
    ),
    tag = "system_role_menu_data_scope",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_role_menu_data_scope_create", authorize = "")]
async fn create(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<CreateSystemRoleMenuDataScopeRequest>,
) -> CommonResult<i64> {
    match service::system_role_menu_data_scope::create(&state.db, login_user, payload).await {
        Ok(id) => {CommonResult::with_data(id)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/update",
    operation_id = "system_role_menu_data_scope_update",
    request_body(content = UpdateSystemRoleMenuDataScopeRequest, description = "update", content_type = "application/json"),
    responses(
        (status = 204, description = "update")
    ),
    tag = "system_role_menu_data_scope",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_role_menu_data_scope_update", authorize = "")]
async fn update(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<UpdateSystemRoleMenuDataScopeRequest>,
) -> CommonResult<()> {
    match service::system_role_menu_data_scope::update(&state.db, login_user, payload).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/delete/{id}",
    operation_id = "system_role_menu_data_scope_delete",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "delete")
    ),
    tag = "system_role_menu_data_scope",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_role_menu_data_scope_delete", authorize = "")]
async fn delete(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::system_role_menu_data_scope::delete(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/get/{id}",
    operation_id = "system_role_menu_data_scope_get_by_id",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 200, description = "get by id", body = CommonResult<SystemRoleMenuDataScopeResponse>)
    ),
    tag = "system_role_menu_data_scope",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_role_menu_data_scope_get_by_id", authorize = "")]
async fn get_by_id(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<SystemRoleMenuDataScopeResponse> {
    match service::system_role_menu_data_scope::get_by_id(&state.db, login_user, id).await {
        Ok(Some(data)) => {CommonResult::with_data(data)}
        Ok(None) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/page",
    operation_id = "system_role_menu_data_scope_page",
    params(
        ("page" = u64, Query, description = "page number"),
        ("size" = u64, Query, description = "page size"),
        ("keyword" = Option<String>, Query, description = "keyword")
    ),
    responses(
        (status = 200, description = "get page", body = CommonResult<PaginatedResponse<SystemRoleMenuDataScopeResponse>>)
    ),
    tag = "system_role_menu_data_scope",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_role_menu_data_scope_page", authorize = "")]
async fn page(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> CommonResult<PaginatedResponse<SystemRoleMenuDataScopeResponse>> {
    match service::system_role_menu_data_scope::get_paginated(&state.db, login_user, params).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/list",
    operation_id = "system_role_menu_data_scope_list",
    responses(
        (status = 200, description = "list all", body = CommonResult<Vec<SystemRoleMenuDataScopeResponse>>)
    ),
    tag = "system_role_menu_data_scope",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_role_menu_data_scope_list", authorize = "")]
async fn list(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
) -> CommonResult<Vec<SystemRoleMenuDataScopeResponse>> {
    match service::system_role_menu_data_scope::list(&state.db, login_user).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}