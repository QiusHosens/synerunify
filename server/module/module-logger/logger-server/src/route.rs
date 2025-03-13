
use crate::AppState;
use axum::Router;
use common::middleware::request_context::request_context_handler;
use utoipa::OpenApi;
use utoipa_axum::router::OpenApiRouter;
use common::middleware::auth::auth_handler;
use crate::api::login_logger::login_logger_router;
use crate::api::operation_logger::operation_logger_router;

// openapi document
#[derive(OpenApi)]
#[openapi(
    info(
        title = "API",
        description = "api",
        version = "1.0.0"
    ),
    tags(
        (name = "login_logger", description = "登录日志"),
        (name = "operation_logger", description = "操作日志"),
    )
)]
pub struct ApiDocument;

pub async fn api(state: AppState) -> Router {
    let (router, api) = OpenApiRouter::with_openapi(ApiDocument::openapi())
        .merge(auth_router(state.clone()).await)
        .split_for_parts();

    router
        .merge(utoipa_swagger_ui::SwaggerUi::new("/swagger-ui").url("/api-docs/openapi.json", api.clone()))
}

pub async fn auth_router(state: AppState) -> OpenApiRouter {
    OpenApiRouter::new()
        .nest("/login_logger", login_logger_router(state.clone()).await)
        .nest("/operation_logger", operation_logger_router(state.clone()).await)
        .layer(axum::middleware::from_fn(request_context_handler))
}