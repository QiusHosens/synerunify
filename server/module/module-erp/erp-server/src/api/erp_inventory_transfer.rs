use std::sync::Arc;
use sea_orm::DatabaseConnection;
use utoipa_axum::router::OpenApiRouter;
use utoipa_axum::routes;
use ctor;
use macros::require_authorize;
use axum::{routing::{get, post}, Router, extract::{State, Path, Json, Query}, response::IntoResponse, Extension};
use common::base::page::PaginatedResponse;
use erp_model::{request::erp_inventory_transfer::{CreateErpInventoryTransferRequest, PaginatedKeywordRequest, UpdateErpInventoryTransferRequest}, response::erp_inventory_transfer::ErpInventoryTransferBaseResponse};
use erp_model::response::erp_inventory_transfer::ErpInventoryTransferResponse;
use common::base::response::CommonResult;
use common::context::context::LoginUserContext;
use crate::service;
use common::state::app_state::AppState;

pub async fn erp_inventory_transfer_router(state: AppState) -> OpenApiRouter {
    OpenApiRouter::new()
        .routes(routes!(create))
        .routes(routes!(update))
        .routes(routes!(delete))
        .routes(routes!(get_by_id))
        .routes(routes!(get_base_by_id))
        .routes(routes!(list))
        .routes(routes!(page))
        .with_state(state)
}

pub async fn erp_inventory_transfer_route(state: AppState) -> Router {
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
    operation_id = "erp_inventory_transfer_create",
    request_body(content = CreateErpInventoryTransferRequest, description = "create", content_type = "application/json"),
    responses(
        (status = 200, description = "id", body = CommonResult<i64>)
    ),
    tag = "erp_inventory_transfer",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_inventory_transfer_create", authorize = "")]
async fn create(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<CreateErpInventoryTransferRequest>,
) -> CommonResult<i64> {
    match service::erp_inventory_transfer::create(&state.db, login_user, payload).await {
        Ok(id) => {CommonResult::with_data(id)}
        Err(e) => {
            println!("create transfer error, {:#?}", e);
            CommonResult::with_err(&e.to_string())
        }
    }
}

#[utoipa::path(
    post,
    path = "/update",
    operation_id = "erp_inventory_transfer_update",
    request_body(content = UpdateErpInventoryTransferRequest, description = "update", content_type = "application/json"),
    responses(
        (status = 204, description = "update")
    ),
    tag = "erp_inventory_transfer",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_inventory_transfer_update", authorize = "")]
async fn update(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<UpdateErpInventoryTransferRequest>,
) -> CommonResult<()> {
    match service::erp_inventory_transfer::update(&state.db, login_user, payload).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/delete/{id}",
    operation_id = "erp_inventory_transfer_delete",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "delete")
    ),
    tag = "erp_inventory_transfer",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_inventory_transfer_delete", authorize = "")]
async fn delete(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::erp_inventory_transfer::delete(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/get/{id}",
    operation_id = "erp_inventory_transfer_get_by_id",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 200, description = "get by id", body = CommonResult<ErpInventoryTransferResponse>)
    ),
    tag = "erp_inventory_transfer",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_inventory_transfer_get_by_id", authorize = "")]
async fn get_by_id(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<ErpInventoryTransferResponse> {
    match service::erp_inventory_transfer::get_by_id(&state.db, login_user, id).await {
        Ok(Some(data)) => {CommonResult::with_data(data)}
        Ok(None) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/get_base/{id}",
    operation_id = "erp_inventory_transfer_get_base_by_id",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 200, description = "get base by id", body = CommonResult<ErpInventoryTransferBaseResponse>)
    ),
    tag = "erp_inventory_transfer",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_inventory_transfer_get_base_by_id", authorize = "")]
async fn get_base_by_id(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<ErpInventoryTransferBaseResponse> {
    match service::erp_inventory_transfer::get_base_by_id(&state.db, login_user, id).await {
        Ok(Some(data)) => {CommonResult::with_data(data)}
        Ok(None) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/page",
    operation_id = "erp_inventory_transfer_page",
    params(
        ("page" = u64, Query, description = "page number"),
        ("size" = u64, Query, description = "page size"),
        ("keyword" = Option<String>, Query, description = "keyword")
    ),
    responses(
        (status = 200, description = "get page", body = CommonResult<PaginatedResponse<ErpInventoryTransferResponse>>)
    ),
    tag = "erp_inventory_transfer",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_inventory_transfer_page", authorize = "")]
async fn page(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> CommonResult<PaginatedResponse<ErpInventoryTransferResponse>> {
    match service::erp_inventory_transfer::get_paginated(&state.db, login_user, params).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/list",
    operation_id = "erp_inventory_transfer_list",
    responses(
        (status = 200, description = "list all", body = CommonResult<Vec<ErpInventoryTransferResponse>>)
    ),
    tag = "erp_inventory_transfer",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_inventory_transfer_list", authorize = "")]
async fn list(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
) -> CommonResult<Vec<ErpInventoryTransferResponse>> {
    match service::erp_inventory_transfer::list(&state.db, login_user).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}
