use axum::{extract::{Query, State}, Extension};
use macros::require_authorize;
use utoipa_axum::router::OpenApiRouter;
use utoipa_axum::routes;
use common::{base::response::CommonResult, context::context::LoginUserContext};
use common::base::page::PaginatedResponse;
use logger_model::request::login_logger::PaginatedKeywordRequest;
use logger_model::response::login_logger::LoginLoggerResponse;
use crate::{service, AppState};

pub async fn login_logger_router(state: AppState) -> OpenApiRouter {
    OpenApiRouter::new()
        .routes(routes!(page))
        .with_state(state)
}

#[utoipa::path(
    get,
    path = "/page",
    operation_id = "login_logger_page",
    params(
        ("page" = u64, Query, description = "page number"),
        ("size" = u64, Query, description = "page size"),
        ("keyword" = Option<String>, Query, description = "keyword")
    ),
    responses(
        (status = 200, description = "get page", body = CommonResult<PaginatedResponse<LoginLoggerResponse>>)
    ),
    tag = "login_logger",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "login_logger_page", authorize = "")]
async fn page(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> CommonResult<PaginatedResponse<LoginLoggerResponse>> {
    match service::login_logger::get_paginated(params, login_user).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}