use std::sync::Arc;
use sea_orm::DatabaseConnection;
use utoipa_axum::router::OpenApiRouter;
use utoipa_axum::routes;
use ctor;
use macros::require_authorize;
use axum::{routing::{get, post}, Router, extract::{State, Path, Json, Query}, response::IntoResponse, Extension};
use common::base::page::PaginatedResponse;
use erp_model::{request::erp_inbound_order::{CreateErpInboundOrderOtherRequest, CreateErpInboundOrderPurchaseRequest, CreateErpInboundOrderRequest, PaginatedKeywordRequest, UpdateErpInboundOrderOtherRequest, UpdateErpInboundOrderPurchaseRequest, UpdateErpInboundOrderRequest}, response::erp_inbound_order::{ErpInboundOrderPageOtherResponse, ErpInboundOrderPagePurchaseResponse}};
use erp_model::response::erp_inbound_order::ErpInboundOrderResponse;
use common::base::response::CommonResult;
use common::context::context::LoginUserContext;
use crate::service;
use common::state::app_state::AppState;

pub async fn erp_inbound_order_router(state: AppState) -> OpenApiRouter {
    OpenApiRouter::new()
        .routes(routes!(create_purchase))
        .routes(routes!(create_other))
        .routes(routes!(update_purchase))
        .routes(routes!(update_other))
        .routes(routes!(delete))
        .routes(routes!(get_by_id))
        .routes(routes!(list))
        .routes(routes!(paginated_purchase))
        .routes(routes!(paginated_other))
        .with_state(state)
}

pub async fn erp_inbound_order_route(state: AppState) -> Router {
    Router::new()
        .route("/create_purchase", post(create_purchase))
        .route("/create_other", post(create_other))
        .route("/update_purchase", post(update_purchase))
        .route("/update_other", post(update_other))
        .route("/delete/{id}", post(delete))
        .route("/get/{id}", get(get_by_id))
        .route("/list", get(list))
        .route("/page", get(paginated_purchase))
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
    path = "/create_other",
    operation_id = "erp_inbound_order_create_other",
    request_body(content = CreateErpInboundOrderOtherRequest, description = "create other", content_type = "application/json"),
    responses(
        (status = 200, description = "id", body = CommonResult<i64>)
    ),
    tag = "erp_inbound_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_inbound_order_create_other", authorize = "")]
async fn create_other(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<CreateErpInboundOrderOtherRequest>,
) -> CommonResult<i64> {
    match service::erp_inbound_order::create_other(&state.db, login_user, payload).await {
        Ok(id) => {CommonResult::with_data(id)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/update_purchase",
    operation_id = "erp_inbound_order_update_purchase",
    request_body(content = UpdateErpInboundOrderPurchaseRequest, description = "update purchase", content_type = "application/json"),
    responses(
        (status = 204, description = "update purchase")
    ),
    tag = "erp_inbound_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_inbound_order_update_purchase", authorize = "")]
async fn update_purchase(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<UpdateErpInboundOrderPurchaseRequest>,
) -> CommonResult<()> {
    match service::erp_inbound_order::update_purchase(&state.db, login_user, payload).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/update_other",
    operation_id = "erp_inbound_order_update_other",
    request_body(content = UpdateErpInboundOrderOtherRequest, description = "update other", content_type = "application/json"),
    responses(
        (status = 204, description = "update other")
    ),
    tag = "erp_inbound_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_inbound_order_update_other", authorize = "")]
async fn update_other(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<UpdateErpInboundOrderOtherRequest>,
) -> CommonResult<()> {
    match service::erp_inbound_order::update_other(&state.db, login_user, payload).await {
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
    path = "/page_purchase",
    operation_id = "erp_inbound_order_paginated_purchase",
    params(
        ("page" = u64, Query, description = "page number"),
        ("size" = u64, Query, description = "page size"),
        ("keyword" = Option<String>, Query, description = "keyword")
    ),
    responses(
        (status = 200, description = "get page purchase", body = CommonResult<PaginatedResponse<ErpInboundOrderPagePurchaseResponse>>)
    ),
    tag = "erp_inbound_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_inbound_order_paginated_purchase", authorize = "")]
async fn paginated_purchase(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> CommonResult<PaginatedResponse<ErpInboundOrderPagePurchaseResponse>> {
    match service::erp_inbound_order::get_paginated_purchase(&state.db, login_user, params).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/page_other",
    operation_id = "erp_inbound_order_paginated_other",
    params(
        ("page" = u64, Query, description = "page number"),
        ("size" = u64, Query, description = "page size"),
        ("keyword" = Option<String>, Query, description = "keyword")
    ),
    responses(
        (status = 200, description = "get page other", body = CommonResult<PaginatedResponse<ErpInboundOrderPageOtherResponse>>)
    ),
    tag = "erp_inbound_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_inbound_order_paginated_other", authorize = "")]
async fn paginated_other(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> CommonResult<PaginatedResponse<ErpInboundOrderPageOtherResponse>> {
    match service::erp_inbound_order::get_paginated_other(&state.db, login_user, params).await {
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
