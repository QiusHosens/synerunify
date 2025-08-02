use std::sync::Arc;
use sea_orm::DatabaseConnection;
use utoipa_axum::router::OpenApiRouter;
use utoipa_axum::routes;
use ctor;
use macros::require_authorize;
use axum::{routing::{get, post}, Router, extract::{State, Path, Json, Query}, response::IntoResponse, Extension};
use common::base::page::PaginatedResponse;
use mall_model::request::mall_trade_brokerage_record::{CreateMallTradeBrokerageRecordRequest, UpdateMallTradeBrokerageRecordRequest, PaginatedKeywordRequest};
use mall_model::response::mall_trade_brokerage_record::MallTradeBrokerageRecordResponse;
use common::base::response::CommonResult;
use common::context::context::LoginUserContext;
use crate::service;
use common::state::app_state::AppState;

pub async fn mall_trade_brokerage_record_router(state: AppState) -> OpenApiRouter {
    OpenApiRouter::new()
        .routes(routes!(create))
        .routes(routes!(update))
        .routes(routes!(delete))
        .routes(routes!(get_by_id))
        .routes(routes!(list))
        .routes(routes!(page))
        .routes(routes!(enable))
        .routes(routes!(disable))
        .with_state(state)
}

pub async fn mall_trade_brokerage_record_route(state: AppState) -> Router {
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
    operation_id = "mall_trade_brokerage_record_create",
    request_body(content = CreateMallTradeBrokerageRecordRequest, description = "create", content_type = "application/json"),
    responses(
        (status = 200, description = "id", body = CommonResult<i64>)
    ),
    tag = "mall_trade_brokerage_record",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "mall_trade_brokerage_record_create", authorize = "")]
async fn create(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<CreateMallTradeBrokerageRecordRequest>,
) -> CommonResult<i64> {
    match service::mall_trade_brokerage_record::create(&state.db, login_user, payload).await {
        Ok(id) => {CommonResult::with_data(id)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/update",
    operation_id = "mall_trade_brokerage_record_update",
    request_body(content = UpdateMallTradeBrokerageRecordRequest, description = "update", content_type = "application/json"),
    responses(
        (status = 204, description = "update")
    ),
    tag = "mall_trade_brokerage_record",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "mall_trade_brokerage_record_update", authorize = "")]
async fn update(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<UpdateMallTradeBrokerageRecordRequest>,
) -> CommonResult<()> {
    match service::mall_trade_brokerage_record::update(&state.db, login_user, payload).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/delete/{id}",
    operation_id = "mall_trade_brokerage_record_delete",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "delete")
    ),
    tag = "mall_trade_brokerage_record",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "mall_trade_brokerage_record_delete", authorize = "")]
async fn delete(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::mall_trade_brokerage_record::delete(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/get/{id}",
    operation_id = "mall_trade_brokerage_record_get_by_id",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 200, description = "get by id", body = CommonResult<MallTradeBrokerageRecordResponse>)
    ),
    tag = "mall_trade_brokerage_record",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "mall_trade_brokerage_record_get_by_id", authorize = "")]
async fn get_by_id(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<MallTradeBrokerageRecordResponse> {
    match service::mall_trade_brokerage_record::get_by_id(&state.db, login_user, id).await {
        Ok(Some(data)) => {CommonResult::with_data(data)}
        Ok(None) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/page",
    operation_id = "mall_trade_brokerage_record_page",
    params(
        ("page" = u64, Query, description = "page number"),
        ("size" = u64, Query, description = "page size"),
        ("keyword" = Option<String>, Query, description = "keyword")
    ),
    responses(
        (status = 200, description = "get page", body = CommonResult<PaginatedResponse<MallTradeBrokerageRecordResponse>>)
    ),
    tag = "mall_trade_brokerage_record",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "mall_trade_brokerage_record_page", authorize = "")]
async fn page(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> CommonResult<PaginatedResponse<MallTradeBrokerageRecordResponse>> {
    match service::mall_trade_brokerage_record::get_paginated(&state.db, login_user, params).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/list",
    operation_id = "mall_trade_brokerage_record_list",
    responses(
        (status = 200, description = "list all", body = CommonResult<Vec<MallTradeBrokerageRecordResponse>>)
    ),
    tag = "mall_trade_brokerage_record",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "mall_trade_brokerage_record_list", authorize = "")]
async fn list(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
) -> CommonResult<Vec<MallTradeBrokerageRecordResponse>> {
    match service::mall_trade_brokerage_record::list(&state.db, login_user).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/enable/{id}",
    operation_id = "mall_trade_brokerage_record_enable",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "enable")
    ),
    tag = "mall_trade_brokerage_record",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "mall_trade_brokerage_record_enable", authorize = "")]
async fn enable(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::mall_trade_brokerage_record::enable(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/disable/{id}",
    operation_id = "mall_trade_brokerage_record_disable",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "disable")
    ),
    tag = "mall_trade_brokerage_record",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "mall_trade_brokerage_record_disable", authorize = "")]
async fn disable(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::mall_trade_brokerage_record::disable(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}