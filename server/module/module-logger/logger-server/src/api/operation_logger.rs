use axum::extract::{Query, State};
use utoipa_axum::router::OpenApiRouter;
use utoipa_axum::routes;
use common::base::model::CommonResult;
use common::base::page::PaginatedResponse;
use logger_model::request::operation_logger::PaginatedKeywordRequest;
use logger_model::response::operation_logger::OperationLoggerResponse;
use crate::{service, AppState};

pub async fn operation_logger_router(state: AppState) -> OpenApiRouter {
    OpenApiRouter::new()
        .routes(routes!(page))
        .with_state(state)
}

#[utoipa::path(
    get,
    path = "/page",
    operation_id = "operation_logger_page",
    params(
        ("page" = u64, Query, description = "page number"),
        ("page_size" = u64, Query, description = "page size"),
        ("keyword" = Option<String>, Query, description = "keyword")
    ),
    responses(
        (status = 200, description = "get page", body = CommonResult<PaginatedResponse<OperationLoggerResponse>>)
    ),
    tag = "operation_logger"
)]
async fn page(
    State(state): State<AppState>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> CommonResult<PaginatedResponse<OperationLoggerResponse>> {
    match service::operation_logger::get_paginated(params).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}