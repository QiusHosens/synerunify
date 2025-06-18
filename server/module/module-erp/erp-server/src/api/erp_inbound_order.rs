use std::sync::Arc;
use sea_orm::DatabaseConnection;
use utoipa_axum::router::OpenApiRouter;
use utoipa_axum::routes;
use ctor;
use macros::require_authorize;
use axum::{routing::{get, post}, Router, extract::{State, Path, Json, Query}, response::IntoResponse, Extension};
use common::base::page::PaginatedResponse;
use erp_model::request::erp_inbound_order::{CreateErpInboundOrderPurchaseRequest, CreateErpInboundOrderRequest, PaginatedKeywordRequest, UpdateErpInboundOrderRequest};
use erp_model::response::erp_inbound_order::ErpInboundOrderResponse;
use common::base::response::CommonResult;
use common::context::context::LoginUserContext;
use crate::service;
use common::state::app_state::AppState;

pub async fn erp_inbound_order_router(state: AppState) -> OpenApiRouter {
    OpenApiRouter::new()
        .routes(routes!(create_purchase))
        .routes(routes!(update))
        .routes(routes!(delete))
        .routes(routes!(get_by_id))
        .routes(routes!(list))
        .routes(routes!(page))
        .with_state(state)
}

pub async fn erp_inbound_order_route(state: AppState) -> Router {
    Router::new()
        .route("/create", post(create_purchase))
        .route("/update", post(update))
        .route("/delete/{id}", post(delete))
        .route("/get/{id}", get(get_by_id))
        .route("/list", get(list))
        .route("/page", get(page))
        .with_state(state)
}

#[utoipa::path(
    post,
    path = "/create_purchase",
    operation_id = "erp_inbound_order_create_purchase",
    request_body(content = CreateErpInboundOrderPurchaseRequest, description = "create purchase", content_type = "application/json"),
    responses(
        (status = 200, description = "id", body = CommonResult<i64>)
    ),
    tag = "erp_inbound_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_inbound_order_create_purchase", authorize = "")]
async fn create_purchase(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<CreateErpInboundOrderPurchaseRequest>,
) -> CommonResult<i64> {
    match service::erp_inbound_order::create_purchase(&state.db, login_user, payload).await {
        Ok(id) => {CommonResult::with_data(id)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/update",
    operation_id = "erp_inbound_order_update",
    request_body(content = UpdateErpInboundOrderRequest, description = "update", content_type = "application/json"),
    responses(
        (status = 204, description = "update")
    ),
    tag = "erp_inbound_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_inbound_order_update", authorize = "")]
async fn update(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<UpdateErpInboundOrderRequest>,
) -> CommonResult<()> {
    match service::erp_inbound_order::update(&state.db, login_user, payload).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/delete/{id}",
    operation_id = "erp_inbound_order_delete",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "delete")
    ),
    tag = "erp_inbound_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_inbound_order_delete", authorize = "")]
async fn delete(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::erp_inbound_order::delete(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/get/{id}",
    operation_id = "erp_inbound_order_get_by_id",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 200, description = "get by id", body = CommonResult<ErpInboundOrderResponse>)
    ),
    tag = "erp_inbound_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_inbound_order_get_by_id", authorize = "")]
async fn get_by_id(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<ErpInboundOrderResponse> {
    match service::erp_inbound_order::get_by_id(&state.db, login_user, id).await {
        Ok(Some(data)) => {CommonResult::with_data(data)}
        Ok(None) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/page",
    operation_id = "erp_inbound_order_page",
    params(
        ("page" = u64, Query, description = "page number"),
        ("size" = u64, Query, description = "page size"),
        ("keyword" = Option<String>, Query, description = "keyword")
    ),
    responses(
        (status = 200, description = "get page", body = CommonResult<PaginatedResponse<ErpInboundOrderResponse>>)
    ),
    tag = "erp_inbound_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_inbound_order_page", authorize = "")]
async fn page(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> CommonResult<PaginatedResponse<ErpInboundOrderResponse>> {
    match service::erp_inbound_order::get_paginated(&state.db, login_user, params).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/list",
    operation_id = "erp_inbound_order_list",
    responses(
        (status = 200, description = "list all", body = CommonResult<Vec<ErpInboundOrderResponse>>)
    ),
    tag = "erp_inbound_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_inbound_order_list", authorize = "")]
async fn list(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
) -> CommonResult<Vec<ErpInboundOrderResponse>> {
    match service::erp_inbound_order::list(&state.db, login_user).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}
