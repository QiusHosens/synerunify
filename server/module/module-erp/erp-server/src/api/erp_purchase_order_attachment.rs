use std::sync::Arc;
use sea_orm::DatabaseConnection;
use utoipa_axum::router::OpenApiRouter;
use utoipa_axum::routes;
use ctor;
use macros::require_authorize;
use axum::{routing::{get, post}, Router, extract::{State, Path, Json, Query}, response::IntoResponse, Extension};
use common::base::page::PaginatedResponse;
use erp_model::{request::erp_purchase_order_attachment::{CreateErpPurchaseOrderAttachmentRequest, PaginatedKeywordRequest, UpdateErpPurchaseOrderAttachmentRequest}, response::erp_purchase_order_attachment::ErpPurchaseOrderAttachmentBaseResponse};
use erp_model::response::erp_purchase_order_attachment::ErpPurchaseOrderAttachmentResponse;
use common::base::response::CommonResult;
use common::context::context::LoginUserContext;
use crate::service;
use common::state::app_state::AppState;

pub async fn erp_purchase_order_attachment_router(state: AppState) -> OpenApiRouter {
    OpenApiRouter::new()
        .routes(routes!(create))
        .routes(routes!(delete))
        .routes(routes!(get_by_id))
        .routes(routes!(list))
        .routes(routes!(page))
        .routes(routes!(list_purchase))
        .with_state(state)
}

pub async fn erp_purchase_order_attachment_route(state: AppState) -> Router {
    Router::new()
        .route("/create", post(create))
        .route("/delete/{id}", post(delete))
        .route("/get/{id}", get(get_by_id))
        .route("/list", get(list))
        .route("/page", get(page))
        .with_state(state)
}

#[utoipa::path(
    post,
    path = "/create",
    operation_id = "erp_purchase_order_attachment_create",
    request_body(content = CreateErpPurchaseOrderAttachmentRequest, description = "create", content_type = "application/json"),
    responses(
        (status = 200, description = "id", body = CommonResult<i64>)
    ),
    tag = "erp_purchase_order_attachment",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_purchase_order_attachment_create", authorize = "")]
async fn create(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<CreateErpPurchaseOrderAttachmentRequest>,
) -> CommonResult<i64> {
    match service::erp_purchase_order_attachment::create(&state.db, login_user, payload).await {
        Ok(id) => {CommonResult::with_data(id)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/delete/{id}",
    operation_id = "erp_purchase_order_attachment_delete",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "delete")
    ),
    tag = "erp_purchase_order_attachment",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_purchase_order_attachment_delete", authorize = "")]
async fn delete(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::erp_purchase_order_attachment::delete(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/get/{id}",
    operation_id = "erp_purchase_order_attachment_get_by_id",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 200, description = "get by id", body = CommonResult<ErpPurchaseOrderAttachmentResponse>)
    ),
    tag = "erp_purchase_order_attachment",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_purchase_order_attachment_get_by_id", authorize = "")]
async fn get_by_id(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<ErpPurchaseOrderAttachmentResponse> {
    match service::erp_purchase_order_attachment::get_by_id(&state.db, login_user, id).await {
        Ok(Some(data)) => {CommonResult::with_data(data)}
        Ok(None) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/page",
    operation_id = "erp_purchase_order_attachment_page",
    params(
        ("page" = u64, Query, description = "page number"),
        ("size" = u64, Query, description = "page size"),
        ("keyword" = Option<String>, Query, description = "keyword")
    ),
    responses(
        (status = 200, description = "get page", body = CommonResult<PaginatedResponse<ErpPurchaseOrderAttachmentResponse>>)
    ),
    tag = "erp_purchase_order_attachment",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_purchase_order_attachment_page", authorize = "")]
async fn page(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> CommonResult<PaginatedResponse<ErpPurchaseOrderAttachmentResponse>> {
    match service::erp_purchase_order_attachment::get_paginated(&state.db, login_user, params).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/list",
    operation_id = "erp_purchase_order_attachment_list",
    responses(
        (status = 200, description = "list all", body = CommonResult<Vec<ErpPurchaseOrderAttachmentResponse>>)
    ),
    tag = "erp_purchase_order_attachment",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_purchase_order_attachment_list", authorize = "")]
async fn list(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
) -> CommonResult<Vec<ErpPurchaseOrderAttachmentResponse>> {
    match service::erp_purchase_order_attachment::list(&state.db, login_user).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/list_purchase/{id}",
    operation_id = "erp_purchase_order_attachment_list_purchase",
    responses(
        (status = 200, description = "list purchase", body = CommonResult<Vec<ErpPurchaseOrderAttachmentBaseResponse>>)
    ),
    tag = "erp_purchase_order_attachment",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "erp_purchase_order_attachment_list_purchase", authorize = "")]
async fn list_purchase(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<Vec<ErpPurchaseOrderAttachmentBaseResponse>> {
    match service::erp_purchase_order_attachment::list_by_purchase_id(&state.db, login_user, id).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}