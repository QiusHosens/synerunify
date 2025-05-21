use std::sync::Arc;
use sea_orm::DatabaseConnection;
use utoipa_axum::router::OpenApiRouter;
use utoipa_axum::routes;
use ctor;
use macros::require_authorize;
use axum::{routing::{get, post}, Router, extract::{State, Path, Json, Query}, response::IntoResponse, Extension};
use common::base::page::PaginatedResponse;
use system_model::{request::system_user::{CreateSystemUserRequest, EditPasswordSystemUserRequest, PaginatedKeywordRequest, ResetPasswordSystemUserRequest, UpdateSystemUserRequest}, response::system_user::{SystemUserBaseResponse, SystemUserPageResponse}};
use system_model::response::system_user::SystemUserResponse;
use common::base::response::CommonResult;
use common::context::context::LoginUserContext;
use crate::service;
use common::state::app_state::AppState;

pub async fn system_user_router(state: AppState) -> OpenApiRouter {
    OpenApiRouter::new()
        .routes(routes!(create))
        .routes(routes!(update))
        .routes(routes!(delete))
        .routes(routes!(get_by_id))
        .routes(routes!(list))
        .routes(routes!(page))
        .routes(routes!(enable))
        .routes(routes!(disable))
        .routes(routes!(list_department_user))
        .routes(routes!(reset_password))
        .routes(routes!(edit_password))
        .with_state(state)
}

pub async fn system_user_route(state: AppState) -> Router {
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
    operation_id = "system_user_create",
    request_body(content = CreateSystemUserRequest, description = "create", content_type = "application/json"),
    responses(
        (status = 200, description = "id", body = CommonResult<i64>)
    ),
    tag = "system_user",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_user_create", authorize = "")]
async fn create(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<CreateSystemUserRequest>,
) -> CommonResult<i64> {
    match service::system_user::create(&state.db, login_user, payload).await {
        Ok(id) => {CommonResult::with_data(id)}
        Err(e) => {
            eprintln!("Error: {:#?}", e);
            CommonResult::with_err(&e.to_string())
        }
    }
}

#[utoipa::path(
    post,
    path = "/update",
    operation_id = "system_user_update",
    request_body(content = UpdateSystemUserRequest, description = "update", content_type = "application/json"),
    responses(
        (status = 204, description = "update")
    ),
    tag = "system_user",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_user_update", authorize = "")]
async fn update(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<UpdateSystemUserRequest>,
) -> CommonResult<()> {
    match service::system_user::update(&state.db, login_user, payload).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/delete/{id}",
    operation_id = "system_user_delete",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "delete")
    ),
    tag = "system_user",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_user_delete", authorize = "")]
async fn delete(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::system_user::delete(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/get/{id}",
    operation_id = "system_user_get_by_id",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 200, description = "get by id", body = CommonResult<SystemUserResponse>)
    ),
    tag = "system_user",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_user_get_by_id", authorize = "")]
async fn get_by_id(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<SystemUserResponse> {
    match service::system_user::get_by_id(&state.db, login_user, id).await {
        Ok(Some(data)) => {CommonResult::with_data(data)}
        Ok(None) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/page",
    operation_id = "system_user_page",
    params(
        ("page" = u64, Query, description = "page number"),
        ("size" = u64, Query, description = "page size"),
        ("keyword" = Option<String>, Query, description = "keyword")
    ),
    responses(
        (status = 200, description = "get page", body = CommonResult<PaginatedResponse<SystemUserPageResponse>>)
    ),
    tag = "system_user",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_user_page", authorize = "")]
async fn page(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> CommonResult<PaginatedResponse<SystemUserPageResponse>> {
    match service::system_user::get_paginated(&state.db, login_user, params).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/list",
    operation_id = "system_user_list",
    responses(
        (status = 200, description = "list all", body = CommonResult<Vec<SystemUserResponse>>)
    ),
    tag = "system_user",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_user_list", authorize = "")]
async fn list(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
) -> CommonResult<Vec<SystemUserResponse>> {
    match service::system_user::list(&state.db, login_user).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/enable/{id}",
    operation_id = "system_user_enable",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "enable")
    ),
    tag = "system_user",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_user_enable", authorize = "")]
async fn enable(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::system_user::enable(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/disable/{id}",
    operation_id = "system_user_disable",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "disable")
    ),
    tag = "system_user",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_user_disable", authorize = "")]
async fn disable(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::system_user::disable(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/list_department_user",
    operation_id = "system_user_list_department_user",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 200, description = "list department user", body = CommonResult<Vec<SystemUserBaseResponse>>)
    ),
    tag = "system_user",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_user_list_department_user", authorize = "")]
async fn list_department_user(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
) -> CommonResult<Vec<SystemUserBaseResponse>> {
    match service::system_user::list_department_user(&state.db, login_user).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/reset_password",
    operation_id = "system_user_reset_password",
    request_body(content = ResetPasswordSystemUserRequest, description = "reset password", content_type = "application/json"),
    responses(
        (status = 204, description = "update")
    ),
    tag = "system_user",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_user_reset_password", authorize = "")]
async fn reset_password(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<ResetPasswordSystemUserRequest>,
) -> CommonResult<()> {
    match service::system_user::reset_password(&state.db, login_user, payload).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/edit_password",
    operation_id = "system_user_edit_password",
    request_body(content = EditPasswordSystemUserRequest, description = "edit password", content_type = "application/json"),
    responses(
        (status = 204, description = "edit password")
    ),
    tag = "system_user",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_user_edit_password", authorize = "")]
async fn edit_password(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<EditPasswordSystemUserRequest>,
) -> CommonResult<()> {
    match service::system_user::edit_password(&state.db, login_user, payload).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}