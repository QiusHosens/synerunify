use std::sync::Arc;
use sea_orm::DatabaseConnection;
use utoipa_axum::router::OpenApiRouter;
use utoipa_axum::routes;
use ctor;
use macros::require_authorize;
use axum::{routing::{get, post}, Router, extract::{State, Path, Json, Query}, response::IntoResponse, Extension};
use common::base::page::PaginatedResponse;
use mall_model::request::mall_store::{CreateMallStoreRequest, UpdateMallStoreRequest, PaginatedKeywordRequest, RejectMallStoreRequest};
use mall_model::response::mall_store::MallStoreResponse;
use common::base::response::CommonResult;
use common::context::context::LoginUserContext;
use crate::service;
use common::state::app_state::AppState;

pub async fn mall_store_router(state: AppState) -> OpenApiRouter {
    OpenApiRouter::new()
        .routes(routes!(create))
        .routes(routes!(update))
        .routes(routes!(delete))
        .routes(routes!(get_by_id))
        .routes(routes!(list))
        .routes(routes!(page))
        .routes(routes!(open))
        .routes(routes!(pause))
        .routes(routes!(accept))
        .routes(routes!(reject))
        .routes(routes!(close))
        .with_state(state)
}

pub async fn mall_store_route(state: AppState) -> Router {
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
    operation_id = "mall_store_create",
    request_body(content = CreateMallStoreRequest, description = "create", content_type = "application/json"),
    responses(
        (status = 200, description = "id", body = CommonResult<i64>)
    ),
    tag = "mall_store",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "mall_store_create", authorize = "")]
async fn create(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<CreateMallStoreRequest>,
) -> CommonResult<i64> {
    match service::mall_store::create(&state.db, login_user, payload).await {
        Ok(id) => {CommonResult::with_data(id)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/update",
    operation_id = "mall_store_update",
    request_body(content = UpdateMallStoreRequest, description = "update", content_type = "application/json"),
    responses(
        (status = 204, description = "update")
    ),
    tag = "mall_store",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "mall_store_update", authorize = "")]
async fn update(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<UpdateMallStoreRequest>,
) -> CommonResult<()> {
    match service::mall_store::update(&state.db, login_user, payload).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/delete/{id}",
    operation_id = "mall_store_delete",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "delete")
    ),
    tag = "mall_store",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "mall_store_delete", authorize = "")]
async fn delete(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::mall_store::delete(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/get/{id}",
    operation_id = "mall_store_get_by_id",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 200, description = "get by id", body = CommonResult<MallStoreResponse>)
    ),
    tag = "mall_store",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "mall_store_get_by_id", authorize = "")]
async fn get_by_id(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<MallStoreResponse> {
    match service::mall_store::get_by_id(&state.db, login_user, id).await {
        Ok(Some(data)) => {CommonResult::with_data(data)}
        Ok(None) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/page",
    operation_id = "mall_store_page",
    params(
        ("page" = u64, Query, description = "page number"),
        ("size" = u64, Query, description = "page size"),
        ("keyword" = Option<String>, Query, description = "keyword")
    ),
    responses(
        (status = 200, description = "get page", body = CommonResult<PaginatedResponse<MallStoreResponse>>)
    ),
    tag = "mall_store",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "mall_store_page", authorize = "")]
async fn page(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> CommonResult<PaginatedResponse<MallStoreResponse>> {
    match service::mall_store::get_paginated(&state.db, login_user, params).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/list",
    operation_id = "mall_store_list",
    responses(
        (status = 200, description = "list all", body = CommonResult<Vec<MallStoreResponse>>)
    ),
    tag = "mall_store",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "mall_store_list", authorize = "")]
async fn list(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
) -> CommonResult<Vec<MallStoreResponse>> {
    match service::mall_store::list(&state.db, login_user).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/open/{id}",
    operation_id = "mall_store_open",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "open")
    ),
    tag = "mall_store",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "mall_store_open", authorize = "")]
async fn open(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::mall_store::open(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/pause/{id}",
    operation_id = "mall_store_pause",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "pause")
    ),
    tag = "mall_store",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "mall_store_pause", authorize = "")]
async fn pause(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::mall_store::pause(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/accept/{id}",
    operation_id = "mall_store_accept",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "accept")
    ),
    tag = "mall_store",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "mall_store_accept", authorize = "")]
async fn accept(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::mall_store::accept(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/reject",
    operation_id = "mall_store_reject",
    request_body(content = RejectMallStoreRequest, description = "reject", content_type = "application/json"),
    responses(
        (status = 200, description = "id", body = CommonResult<i64>)
    ),
    tag = "mall_store",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "mall_store_reject", authorize = "")]
async fn reject(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<RejectMallStoreRequest>,
) -> CommonResult<i64> {
    match service::mall_store::reject(&state.db, login_user, payload).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/close/{id}",
    operation_id = "mall_store_close",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "close")
    ),
    tag = "mall_store",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "mall_store_close", authorize = "")]
async fn close(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::mall_store::close(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}