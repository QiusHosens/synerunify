use std::sync::Arc;
use sea_orm::DatabaseConnection;
use utoipa_axum::router::OpenApiRouter;
use utoipa_axum::routes;
use ctor;
use macros::require_authorize;
use axum::{routing::{get, post}, Router, extract::{State, Path, Json, Query}, response::IntoResponse, Extension};
use common::base::page::PaginatedResponse;
use erp_model::{request::erp_inventory_record::{CreateErpInventoryRecordRequest, PaginatedKeywordRequest, PaginatedProductWarehouseRequest, UpdateErpInventoryRecordRequest}, response::erp_inventory_record::ErpInventoryRecordPageResponse};
use erp_model::response::erp_inventory_record::ErpInventoryRecordResponse;
use common::base::response::CommonResult;
use common::context::context::LoginUserContext;
use crate::service;
use common::state::app_state::AppState;

pub async fn erp_inventory_record_router(state: AppState) -> OpenApiRouter {
    OpenApiRouter::new()
        .routes(routes!(create))
        .routes(routes!(update))
        .routes(routes!(delete))
        .routes(routes!(get_by_id))
        .routes(routes!(list))
        .routes(routes!(page))
        .routes(routes!(page_product_warehouse))
        .with_state(state)
}

pub async fn erp_inventory_record_route(state: AppState) -> Router {
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
    operation_id = "erp_inventory_record_create",
    request_body(content = CreateErpInventoryRecordRequest, description = "create", content_type = "application/json"),
    responses(
        (status = 200, description = "id", body = CommonResult<i64>)
    ),
    tag = "erp_inventory_record",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_inventory_record_create", authorize = "")]
async fn create(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<CreateErpInventoryRecordRequest>,
) -> CommonResult<i64> {
    match service::erp_inventory_record::create(&state.db, login_user, payload).await {
        Ok(id) => {CommonResult::with_data(id)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/update",
    operation_id = "erp_inventory_record_update",
    request_body(content = UpdateErpInventoryRecordRequest, description = "update", content_type = "application/json"),
    responses(
        (status = 204, description = "update")
    ),
    tag = "erp_inventory_record",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_inventory_record_update", authorize = "")]
async fn update(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<UpdateErpInventoryRecordRequest>,
) -> CommonResult<()> {
    match service::erp_inventory_record::update(&state.db, login_user, payload).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/delete/{id}",
    operation_id = "erp_inventory_record_delete",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "delete")
    ),
    tag = "erp_inventory_record",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_inventory_record_delete", authorize = "")]
async fn delete(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::erp_inventory_record::delete(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/get/{id}",
    operation_id = "erp_inventory_record_get_by_id",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 200, description = "get by id", body = CommonResult<ErpInventoryRecordResponse>)
    ),
    tag = "erp_inventory_record",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_inventory_record_get_by_id", authorize = "")]
async fn get_by_id(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<ErpInventoryRecordResponse> {
    match service::erp_inventory_record::get_by_id(&state.db, login_user, id).await {
        Ok(Some(data)) => {CommonResult::with_data(data)}
        Ok(None) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/page",
    operation_id = "erp_inventory_record_page",
    params(
        ("page" = u64, Query, description = "page number"),
        ("size" = u64, Query, description = "page size"),
        ("keyword" = Option<String>, Query, description = "keyword")
    ),
    responses(
        (status = 200, description = "get page", body = CommonResult<PaginatedResponse<ErpInventoryRecordPageResponse>>)
    ),
    tag = "erp_inventory_record",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_inventory_record_page", authorize = "")]
async fn page(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> CommonResult<PaginatedResponse<ErpInventoryRecordPageResponse>> {
    match service::erp_inventory_record::get_paginated(&state.db, login_user, params).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/page_product_warehouse",
    operation_id = "erp_inventory_record_page_product_warehouse",
    params(
        ("page" = u64, Query, description = "page number"),
        ("size" = u64, Query, description = "page size"),
        ("product_id" = Option<i64>, Query, description = "product id"),
        ("warehouse_id" = Option<i64>, Query, description = "warehouse id")
    ),
    responses(
        (status = 200, description = "get page product warehouse", body = CommonResult<PaginatedResponse<ErpInventoryRecordPageResponse>>)
    ),
    tag = "erp_inventory_record",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_inventory_record_page_product_warehouse", authorize = "")]
async fn page_product_warehouse(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Query(params): Query<PaginatedProductWarehouseRequest>,
) -> CommonResult<PaginatedResponse<ErpInventoryRecordPageResponse>> {
    match service::erp_inventory_record::get_paginated_product_warehouse(&state.db, login_user, params).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/list",
    operation_id = "erp_inventory_record_list",
    responses(
        (status = 200, description = "list all", body = CommonResult<Vec<ErpInventoryRecordResponse>>)
    ),
    tag = "erp_inventory_record",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_inventory_record_list", authorize = "")]
async fn list(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
) -> CommonResult<Vec<ErpInventoryRecordResponse>> {
    match service::erp_inventory_record::list(&state.db, login_user).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}
