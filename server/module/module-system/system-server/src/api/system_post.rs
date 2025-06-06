use std::sync::Arc;
use sea_orm::DatabaseConnection;
use utoipa_axum::router::OpenApiRouter;
use utoipa_axum::routes;
use ctor;
use macros::require_authorize;
use axum::{routing::{get, post}, Router, extract::{State, Path, Json, Query}, response::IntoResponse, Extension};
use common::base::page::PaginatedResponse;
use system_model::request::system_post::{CreateSystemPostRequest, UpdateSystemPostRequest, PaginatedKeywordRequest};
use system_model::response::system_post::SystemPostResponse;
use common::base::response::CommonResult;
use common::context::context::LoginUserContext;
use crate::service;
use common::state::app_state::AppState;

pub async fn system_post_router(state: AppState) -> OpenApiRouter {
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

pub async fn system_post_route(state: AppState) -> Router {
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
    operation_id = "system_post_create",
    request_body(content = CreateSystemPostRequest, description = "create", content_type = "application/json"),
    responses(
        (status = 200, description = "id", body = CommonResult<i64>)
    ),
    tag = "system_post",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_post_create", authorize = "system:post:add")]
async fn create(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<CreateSystemPostRequest>,
) -> CommonResult<i64> {
    match service::system_post::create(&state.db, login_user, payload).await {
        Ok(id) => {CommonResult::with_data(id)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/update",
    operation_id = "system_post_update",
    request_body(content = UpdateSystemPostRequest, description = "update", content_type = "application/json"),
    responses(
        (status = 204, description = "update")
    ),
    tag = "system_post",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_post_update", authorize = "system:post:edit")]
async fn update(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<UpdateSystemPostRequest>,
) -> CommonResult<()> {
    match service::system_post::update(&state.db, login_user, payload).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/delete/{id}",
    operation_id = "system_post_delete",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "delete")
    ),
    tag = "system_post",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_post_delete", authorize = "system:post:delete")]
async fn delete(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::system_post::delete(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/get/{id}",
    operation_id = "system_post_get_by_id",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 200, description = "get by id", body = CommonResult<SystemPostResponse>)
    ),
    tag = "system_post",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_post_get_by_id", authorize = "system:post:get")]
async fn get_by_id(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<SystemPostResponse> {
    match service::system_post::get_by_id(&state.db, login_user, id).await {
        Ok(Some(data)) => {CommonResult::with_data(data)}
        Ok(None) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/page",
    operation_id = "system_post_page",
    params(
        ("page" = u64, Query, description = "page number"),
        ("size" = u64, Query, description = "page size"),
        ("keyword" = Option<String>, Query, description = "keyword")
    ),
    responses(
        (status = 200, description = "get page", body = CommonResult<PaginatedResponse<SystemPostResponse>>)
    ),
    tag = "system_post",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_post_page", authorize = "system:post:get")]
async fn page(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> CommonResult<PaginatedResponse<SystemPostResponse>> {
    match service::system_post::get_paginated(&state.db, login_user, params).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/list",
    operation_id = "system_post_list",
    responses(
        (status = 200, description = "list all", body = CommonResult<Vec<SystemPostResponse>>)
    ),
    tag = "system_post",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_post_list", authorize = "system:post:get")]
async fn list(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
) -> CommonResult<Vec<SystemPostResponse>> {
    match service::system_post::list(&state.db, login_user).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/enable/{id}",
    operation_id = "system_post_enable",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "enable")
    ),
    tag = "system_post",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_post_enable", authorize = "system:post:enable")]
async fn enable(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::system_post::enable(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/disable/{id}",
    operation_id = "system_post_disable",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "disable")
    ),
    tag = "system_post",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_post_disable", authorize = "system:post:disable")]
async fn disable(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::system_post::disable(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}