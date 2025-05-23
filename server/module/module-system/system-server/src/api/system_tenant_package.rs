use std::sync::Arc;
use sea_orm::DatabaseConnection;
use utoipa_axum::router::OpenApiRouter;
use utoipa_axum::routes;
use ctor;
use macros::require_authorize;
use axum::{routing::{get, post}, Router, extract::{State, Path, Json, Query}, response::IntoResponse, Extension};
use common::base::page::PaginatedResponse;
use system_model::request::system_tenant_package::{CreateSystemTenantPackageRequest, PaginatedKeywordRequest, UpdateSystemTenantPackageMenuRequest, UpdateSystemTenantPackageRequest};
use system_model::response::system_tenant_package::SystemTenantPackageResponse;
use common::base::response::CommonResult;
use common::context::context::LoginUserContext;
use crate::service;
use common::state::app_state::AppState;

pub async fn system_tenant_package_router(state: AppState) -> OpenApiRouter {
    OpenApiRouter::new()
        .routes(routes!(create))
        .routes(routes!(update))
        .routes(routes!(delete))
        .routes(routes!(get_by_id))
        .routes(routes!(list))
        .routes(routes!(page))
        .routes(routes!(enable))
        .routes(routes!(disable))
        .routes(routes!(update_menu))
        .with_state(state)
}

pub async fn system_tenant_package_route(state: AppState) -> Router {
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
    operation_id = "system_tenant_package_create",
    request_body(content = CreateSystemTenantPackageRequest, description = "create", content_type = "application/json"),
    responses(
        (status = 200, description = "id", body = CommonResult<i64>)
    ),
    tag = "system_tenant_package",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_tenant_package_create", authorize = "system:tenant:package:add")]
async fn create(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<CreateSystemTenantPackageRequest>,
) -> CommonResult<i64> {
    match service::system_tenant_package::create(&state.db, login_user, payload).await {
        Ok(id) => {CommonResult::with_data(id)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/update",
    operation_id = "system_tenant_package_update",
    request_body(content = UpdateSystemTenantPackageRequest, description = "update", content_type = "application/json"),
    responses(
        (status = 204, description = "update")
    ),
    tag = "system_tenant_package",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_tenant_package_update", authorize = "system:tenant:package:edit")]
async fn update(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<UpdateSystemTenantPackageRequest>,
) -> CommonResult<()> {
    match service::system_tenant_package::update(&state.db, login_user, payload).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/update_menu",
    operation_id = "system_tenant_package_update_menu",
    request_body(content = UpdateSystemTenantPackageRequest, description = "update menu", content_type = "application/json"),
    responses(
        (status = 204, description = "update menu")
    ),
    tag = "system_tenant_package",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_tenant_package_update_menu", authorize = "system:tenant:package:menu")]
async fn update_menu(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<UpdateSystemTenantPackageMenuRequest>,
) -> CommonResult<()> {
    match service::system_tenant_package::update_menu(&state.db, login_user, payload).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/delete/{id}",
    operation_id = "system_tenant_package_delete",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "delete")
    ),
    tag = "system_tenant_package",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_tenant_package_delete", authorize = "system:tenant:package:delete")]
async fn delete(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::system_tenant_package::delete(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/get/{id}",
    operation_id = "system_tenant_package_get_by_id",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 200, description = "get by id", body = CommonResult<SystemTenantPackageResponse>)
    ),
    tag = "system_tenant_package",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_tenant_package_get_by_id", authorize = "system:tenant:package:get")]
async fn get_by_id(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<SystemTenantPackageResponse> {
    match service::system_tenant_package::get_by_id(&state.db, login_user, id).await {
        Ok(Some(data)) => {CommonResult::with_data(data)}
        Ok(None) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/page",
    operation_id = "system_tenant_package_page",
    params(
        ("page" = u64, Query, description = "page number"),
        ("size" = u64, Query, description = "page size"),
        ("keyword" = Option<String>, Query, description = "keyword")
    ),
    responses(
        (status = 200, description = "get page", body = CommonResult<PaginatedResponse<SystemTenantPackageResponse>>)
    ),
    tag = "system_tenant_package",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_tenant_package_page", authorize = "system:tenant:package:get")]
async fn page(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> CommonResult<PaginatedResponse<SystemTenantPackageResponse>> {
    match service::system_tenant_package::get_paginated(&state.db, login_user, params).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/list",
    operation_id = "system_tenant_package_list",
    responses(
        (status = 200, description = "list all", body = CommonResult<Vec<SystemTenantPackageResponse>>)
    ),
    tag = "system_tenant_package",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_tenant_package_list", authorize = "system:tenant:package:get")]
async fn list(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
) -> CommonResult<Vec<SystemTenantPackageResponse>> {
    match service::system_tenant_package::list(&state.db, login_user).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/enable/{id}",
    operation_id = "system_tenant_package_enable",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "enable")
    ),
    tag = "system_tenant_package",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_tenant_package_enable", authorize = "system:tenant:package:enable")]
async fn enable(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::system_tenant_package::enable(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/disable/{id}",
    operation_id = "system_tenant_package_disable",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "disable")
    ),
    tag = "system_tenant_package",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_tenant_package_disable", authorize = "system:tenant:package:disable")]
async fn disable(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::system_tenant_package::disable(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}