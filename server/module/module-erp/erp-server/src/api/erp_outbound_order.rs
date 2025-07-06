use std::sync::Arc;
use sea_orm::DatabaseConnection;
use utoipa_axum::router::OpenApiRouter;
use utoipa_axum::routes;
use ctor;
use macros::require_authorize;
use axum::{routing::{get, post}, Router, extract::{State, Path, Json, Query}, response::IntoResponse, Extension};
use common::base::page::PaginatedResponse;
use erp_model::{request::erp_outbound_order::{CreateErpOutboundOrderOtherRequest, CreateErpOutboundOrderRequest, CreateErpOutboundOrderSaleRequest, PaginatedKeywordRequest, UpdateErpOutboundOrderOtherRequest, UpdateErpOutboundOrderRequest, UpdateErpOutboundOrderSaleRequest}, response::erp_outbound_order::{ErpOutboundOrderBaseOtherResponse, ErpOutboundOrderBaseSalesResponse, ErpOutboundOrderInfoOtherResponse, ErpOutboundOrderInfoSalesResponse, ErpOutboundOrderPageOtherResponse, ErpOutboundOrderPageSalesResponse}};
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
        .routes(routes!(get_base_sales_by_id))
        .routes(routes!(get_info_sales_by_id))
        .routes(routes!(get_base_other_by_id))
        .routes(routes!(get_info_other_by_id))
        .routes(routes!(list))
        .routes(routes!(page_sales))
        .routes(routes!(page_other))
        .routes(routes!(list_by_customer_id))
        .with_state(state)
}

pub async fn erp_outbound_order_route(state: AppState) -> Router {
    Router::new()
        .route("/create", post(create_sale))
        .route("/update", post(update_sale))
        .route("/delete/{id}", post(delete))
        .route("/get/{id}", get(get_by_id))
        .route("/list", get(list))
        .route("/page", get(page_other))
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
    path = "/get_base_sales/{id}",
    operation_id = "erp_outbound_order_get_base_sales_by_id",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 200, description = "get base sales by id", body = CommonResult<ErpOutboundOrderBaseSalesResponse>)
    ),
    tag = "erp_outbound_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_outbound_order_get_base_sales_by_id", authorize = "")]
async fn get_base_sales_by_id(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<ErpOutboundOrderBaseSalesResponse> {
    match service::erp_outbound_order::get_base_sales_by_id(&state.db, login_user, id).await {
        Ok(Some(data)) => {CommonResult::with_data(data)}
        Ok(None) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/get_base_other/{id}",
    operation_id = "erp_outbound_order_get_base_other_by_id",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 200, description = "get base other by id", body = CommonResult<ErpOutboundOrderBaseOtherResponse>)
    ),
    tag = "erp_outbound_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_outbound_order_get_base_other_by_id", authorize = "")]
async fn get_base_other_by_id(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<ErpOutboundOrderBaseOtherResponse> {
    match service::erp_outbound_order::get_base_other_by_id(&state.db, login_user, id).await {
        Ok(Some(data)) => {CommonResult::with_data(data)}
        Ok(None) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/get_info_other/{id}",
    operation_id = "erp_outbound_order_get_info_other_by_id",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 200, description = "get info other by id", body = CommonResult<ErpOutboundOrderInfoOtherResponse>)
    ),
    tag = "erp_outbound_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_outbound_order_get_info_other_by_id", authorize = "")]
async fn get_info_other_by_id(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<ErpOutboundOrderInfoOtherResponse> {
    match service::erp_outbound_order::get_info_other_by_id(&state.db, login_user, id).await {
        Ok(Some(data)) => {CommonResult::with_data(data)}
        Ok(None) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/get_info_sales/{id}",
    operation_id = "erp_outbound_order_get_info_sales_by_id",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 200, description = "get info sales by id", body = CommonResult<ErpOutboundOrderInfoSalesResponse>)
    ),
    tag = "erp_outbound_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_outbound_order_get_info_sales_by_id", authorize = "")]
async fn get_info_sales_by_id(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<ErpOutboundOrderInfoSalesResponse> {
    match service::erp_outbound_order::get_info_sales_by_id(&state.db, login_user, id).await {
        Ok(Some(data)) => {CommonResult::with_data(data)}
        Ok(None) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/page_sales",
    operation_id = "erp_outbound_order_page_sales",
    params(
        ("page" = u64, Query, description = "page number"),
        ("size" = u64, Query, description = "page size"),
        ("keyword" = Option<String>, Query, description = "keyword")
    ),
    responses(
        (status = 200, description = "get page sales", body = CommonResult<PaginatedResponse<ErpOutboundOrderPageSalesResponse>>)
    ),
    tag = "erp_outbound_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_outbound_order_page_sales", authorize = "")]
async fn page_sales(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> CommonResult<PaginatedResponse<ErpOutboundOrderPageSalesResponse>> {
    match service::erp_outbound_order::get_paginated_sales(&state.db, login_user, params).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/page_other",
    operation_id = "erp_outbound_order_page_other",
    params(
        ("page" = u64, Query, description = "page number"),
        ("size" = u64, Query, description = "page size"),
        ("keyword" = Option<String>, Query, description = "keyword")
    ),
    responses(
        (status = 200, description = "get page other", body = CommonResult<PaginatedResponse<ErpOutboundOrderPageOtherResponse>>)
    ),
    tag = "erp_outbound_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_outbound_order_page_other", authorize = "")]
async fn page_other(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> CommonResult<PaginatedResponse<ErpOutboundOrderPageOtherResponse>> {
    match service::erp_outbound_order::get_paginated_other(&state.db, login_user, params).await {
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

#[utoipa::path(
    get,
    path = "/list_customer/{id}",
    operation_id = "erp_outbound_order_list_customer",
    params(
        ("customer_id" = i64, Path, description = "customer id")
    ),
    responses(
        (status = 200, description = "list customer all", body = CommonResult<Vec<ErpOutboundOrderResponse>>)
    ),
    tag = "erp_outbound_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_outbound_order_list_customer", authorize = "")]
async fn list_by_customer_id(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(customer_id): Path<i64>,
) -> CommonResult<Vec<ErpOutboundOrderResponse>> {
    match service::erp_outbound_order::list_by_customer_id(&state.db, login_user, customer_id).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}