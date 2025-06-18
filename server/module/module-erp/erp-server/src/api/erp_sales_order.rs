use std::sync::Arc;
use sea_orm::DatabaseConnection;
use utoipa_axum::router::OpenApiRouter;
use utoipa_axum::routes;
use ctor;
use macros::require_authorize;
use axum::{routing::{get, post}, Router, extract::{State, Path, Json, Query}, response::IntoResponse, Extension};
use common::base::page::PaginatedResponse;
use erp_model::{request::erp_sales_order::{CreateErpSalesOrderRequest, PaginatedKeywordRequest, UpdateErpSalesOrderRequest}, response::erp_sales_order::{ErpSalesOrderBaseResponse, ErpSalesOrderPageResponse}};
use erp_model::response::erp_sales_order::ErpSalesOrderResponse;
use common::base::response::CommonResult;
use common::context::context::LoginUserContext;
use crate::service;
use common::state::app_state::AppState;

pub async fn erp_sales_order_router(state: AppState) -> OpenApiRouter {
    OpenApiRouter::new()
        .routes(routes!(create))
        .routes(routes!(update))
        .routes(routes!(delete))
        .routes(routes!(get_by_id))
        .routes(routes!(list))
        .routes(routes!(page))
        .routes(routes!(ship_out))
        .routes(routes!(signed))
        .routes(routes!(completed))
        .routes(routes!(cancel))
        .routes(routes!(return_processing))
        .routes(routes!(return_completed))
        .with_state(state)
}

pub async fn erp_sales_order_route(state: AppState) -> Router {
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
    operation_id = "erp_sales_order_create",
    request_body(content = CreateErpSalesOrderRequest, description = "create", content_type = "application/json"),
    responses(
        (status = 200, description = "id", body = CommonResult<i64>)
    ),
    tag = "erp_sales_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_sales_order_create", authorize = "")]
async fn create(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<CreateErpSalesOrderRequest>,
) -> CommonResult<i64> {
    match service::erp_sales_order::create(&state.db, login_user, payload).await {
        Ok(id) => {CommonResult::with_data(id)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/update",
    operation_id = "erp_sales_order_update",
    request_body(content = UpdateErpSalesOrderRequest, description = "update", content_type = "application/json"),
    responses(
        (status = 204, description = "update")
    ),
    tag = "erp_sales_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_sales_order_update", authorize = "")]
async fn update(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<UpdateErpSalesOrderRequest>,
) -> CommonResult<()> {
    match service::erp_sales_order::update(&state.db, login_user, payload).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/delete/{id}",
    operation_id = "erp_sales_order_delete",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "delete")
    ),
    tag = "erp_sales_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_sales_order_delete", authorize = "")]
async fn delete(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::erp_sales_order::delete(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/get/{id}",
    operation_id = "erp_sales_order_get_by_id",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 200, description = "get by id", body = CommonResult<ErpSalesOrderResponse>)
    ),
    tag = "erp_sales_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_sales_order_get_by_id", authorize = "")]
async fn get_by_id(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<ErpSalesOrderResponse> {
    match service::erp_sales_order::get_by_id(&state.db, login_user, id).await {
        Ok(Some(data)) => {CommonResult::with_data(data)}
        Ok(None) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/page",
    operation_id = "erp_sales_order_page",
    params(
        ("page" = u64, Query, description = "page number"),
        ("size" = u64, Query, description = "page size"),
        ("keyword" = Option<String>, Query, description = "keyword")
    ),
    responses(
        (status = 200, description = "get page", body = CommonResult<PaginatedResponse<ErpSalesOrderPageResponse>>)
    ),
    tag = "erp_sales_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_sales_order_page", authorize = "")]
async fn page(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> CommonResult<PaginatedResponse<ErpSalesOrderPageResponse>> {
    match service::erp_sales_order::get_paginated(&state.db, login_user, params).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/list",
    operation_id = "erp_sales_order_list",
    responses(
        (status = 200, description = "list all", body = CommonResult<Vec<ErpSalesOrderResponse>>)
    ),
    tag = "erp_sales_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_sales_order_list", authorize = "")]
async fn list(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
) -> CommonResult<Vec<ErpSalesOrderResponse>> {
    match service::erp_sales_order::list(&state.db, login_user).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/get_detail/{id}",
    operation_id = "erp_sales_order_get_detail_by_id",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 200, description = "get detail by id", body = CommonResult<ErpSalesOrderBaseResponse>)
    ),
    tag = "erp_sales_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_sales_order_get_detail_by_id", authorize = "")]
async fn get_detail_by_id(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<ErpSalesOrderBaseResponse> {
    match service::erp_sales_order::get_detail_by_id(&state.db, login_user, id).await {
        Ok(Some(data)) => {CommonResult::with_data(data)}
        Ok(None) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/ship_out/{id}",
    operation_id = "erp_sales_order_ship_out",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "ship out")
    ),
    tag = "erp_sales_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_sales_order_ship_out", authorize = "")]
async fn ship_out(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::erp_sales_order::ship_out(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/signed/{id}",
    operation_id = "erp_sales_order_signed",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "signed")
    ),
    tag = "erp_sales_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_sales_order_signed", authorize = "")]
async fn signed(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::erp_sales_order::signed(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/completed/{id}",
    operation_id = "erp_sales_order_completed",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "completed")
    ),
    tag = "erp_sales_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_sales_order_completed", authorize = "")]
async fn completed(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::erp_sales_order::completed(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/cancel/{id}",
    operation_id = "erp_sales_order_cancel",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "cancel")
    ),
    tag = "erp_sales_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_sales_order_cancel", authorize = "")]
async fn cancel(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::erp_sales_order::cancel(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/return_processing/{id}",
    operation_id = "erp_sales_order_return_processing",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "return processing")
    ),
    tag = "erp_sales_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_sales_order_return_processing", authorize = "")]
async fn return_processing(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::erp_sales_order::return_processing(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/return_completed/{id}",
    operation_id = "erp_sales_order_return_completed",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "return completed")
    ),
    tag = "erp_sales_order",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_sales_order_return_completed", authorize = "")]
async fn return_completed(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::erp_sales_order::return_completed(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}