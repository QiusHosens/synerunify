use std::sync::Arc;
use sea_orm::DatabaseConnection;
use utoipa_axum::router::OpenApiRouter;
use utoipa_axum::routes;
use ctor;
use macros::require_authorize;
use axum::{routing::{get, post}, Router, extract::{State, Path, Json, Query}, response::IntoResponse, Extension};
use common::base::page::PaginatedResponse;
use erp_model::request::erp_outbound_order::{CreateErpOutboundOrderOtherRequest, CreateErpOutboundOrderRequest, CreateErpOutboundOrderSaleRequest, PaginatedKeywordRequest, UpdateErpOutboundOrderOtherRequest, UpdateErpOutboundOrderRequest, UpdateErpOutboundOrderSaleRequest};
use erp_model::response::erp_outbound_order::ErpOutboundOrderResponse;
use common::base::response::CommonResult;
use common::context::context::LoginUserContext;
use crate::service;
use common::state::app_state::AppState;

pub async fn erp_outbound_order_router(state: AppState) -> OpenApiRouter {
    OpenApiRouter::new()
        .routes(routes!(create_sale))
        .routes(routes!(create_other))
        .routes(routes!(update_sale))
        .routes(routes!(update_other))
        .routes(routes!(delete))
        .routes(routes!(get_by_id))
        .routes(routes!(list))
        .routes(routes!(page))
        .with_state(state)
}

pub async fn erp_outbound_order_route(state: AppState) -> Router {
    Router::new()
        .route("/create", post(create_sale))
        .route("/update", post(update_sale))
        .route("/delete/{id}", post(delete))
        .route("/get/{id}", get(get_by_id))
        .route("/list", get(list))
        .route("/page", get(page))
        .with_state(state)
}

#[utoipa::path(
    post,
    path = "/create_sale",
    operation_id = "erp_outbound_order_create_sale",
    request_body(content = CreateErpOutboundOrderSaleRequest, description = "create sale", content_type = "application/json"),
    responses(
        (status = 200, description = "id", body = CommonResult<i64>)
    ),
    tag = "erp_outbound_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_outbound_order_create_sale", authorize = "")]
async fn create_sale(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<CreateErpOutboundOrderSaleRequest>,
) -> CommonResult<i64> {
    match service::erp_outbound_order::create_sale(&state.db, login_user, payload).await {
        Ok(id) => {CommonResult::with_data(id)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/create_other",
    operation_id = "erp_outbound_order_create_other",
    request_body(content = CreateErpOutboundOrderOtherRequest, description = "create other", content_type = "application/json"),
    responses(
        (status = 200, description = "id", body = CommonResult<i64>)
    ),
    tag = "erp_outbound_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_outbound_order_create_other", authorize = "")]
async fn create_other(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<CreateErpOutboundOrderOtherRequest>,
) -> CommonResult<i64> {
    match service::erp_outbound_order::create_other(&state.db, login_user, payload).await {
        Ok(id) => {CommonResult::with_data(id)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/update_sale",
    operation_id = "erp_outbound_order_update_sale",
    request_body(content = UpdateErpOutboundOrderSaleRequest, description = "update sale", content_type = "application/json"),
    responses(
        (status = 204, description = "update sale")
    ),
    tag = "erp_outbound_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_outbound_order_update_sale", authorize = "")]
async fn update_sale(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<UpdateErpOutboundOrderSaleRequest>,
) -> CommonResult<()> {
    match service::erp_outbound_order::update_sale(&state.db, login_user, payload).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/update_other",
    operation_id = "erp_outbound_order_update_other",
    request_body(content = UpdateErpOutboundOrderOtherRequest, description = "update other", content_type = "application/json"),
    responses(
        (status = 204, description = "update other")
    ),
    tag = "erp_outbound_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_outbound_order_update_other", authorize = "")]
async fn update_other(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<UpdateErpOutboundOrderOtherRequest>,
) -> CommonResult<()> {
    match service::erp_outbound_order::update_other(&state.db, login_user, payload).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/delete/{id}",
    operation_id = "erp_outbound_order_delete",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "delete")
    ),
    tag = "erp_outbound_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_outbound_order_delete", authorize = "")]
async fn delete(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::erp_outbound_order::delete(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/get/{id}",
    operation_id = "erp_outbound_order_get_by_id",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 200, description = "get by id", body = CommonResult<ErpOutboundOrderResponse>)
    ),
    tag = "erp_outbound_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_outbound_order_get_by_id", authorize = "")]
async fn get_by_id(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<ErpOutboundOrderResponse> {
    match service::erp_outbound_order::get_by_id(&state.db, login_user, id).await {
        Ok(Some(data)) => {CommonResult::with_data(data)}
        Ok(None) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/page",
    operation_id = "erp_outbound_order_page",
    params(
        ("page" = u64, Query, description = "page number"),
        ("size" = u64, Query, description = "page size"),
        ("keyword" = Option<String>, Query, description = "keyword")
    ),
    responses(
        (status = 200, description = "get page", body = CommonResult<PaginatedResponse<ErpOutboundOrderResponse>>)
    ),
    tag = "erp_outbound_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_outbound_order_page", authorize = "")]
async fn page(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> CommonResult<PaginatedResponse<ErpOutboundOrderResponse>> {
    match service::erp_outbound_order::get_paginated(&state.db, login_user, params).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/list",
    operation_id = "erp_outbound_order_list",
    responses(
        (status = 200, description = "list all", body = CommonResult<Vec<ErpOutboundOrderResponse>>)
    ),
    tag = "erp_outbound_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_outbound_order_list", authorize = "")]
async fn list(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
) -> CommonResult<Vec<ErpOutboundOrderResponse>> {
    match service::erp_outbound_order::list(&state.db, login_user).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}
