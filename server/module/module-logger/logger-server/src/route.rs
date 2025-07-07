
use crate::AppState;
use axum::Router;
use common::middleware::request_context::request_context_handler;
use common::utils::jwt_utils::AccessClaims;
use utoipa::{Modify, OpenApi};
use utoipa_axum::router::OpenApiRouter;
use common::middleware::authorize::{authorize_handler, init_route_authorizes};
use common::middleware::operation_logger::operation_logger_handler;
use crate::api::login_logger::login_logger_router;
use crate::api::operation_logger::operation_logger_router;

// openapi document
#[derive(OpenApi)]
#[openapi(
    info(
        title = "API",
        description = "logger",
        version = "1.0.0"
    ),
    tags(
        (name = "login_logger", description = "登录日志"),
        (name = "operation_logger", description = "操作日志"),
    ),
    modifiers(&SecurityAddon)
)]
pub struct ApiDocument;

pub async fn api(state: AppState) -> Router {
    let (router, api) = OpenApiRouter::with_openapi(ApiDocument::openapi())
        .nest("/logger", auth_router(state.clone()).await)
        .split_for_parts();

    // 注册路由权限
    init_route_authorizes(&api);

    router
        .merge(utoipa_swagger_ui::SwaggerUi::new("/logger/swagger-ui").url("/logger/api-docs/openapi.json", api.clone()))
}

pub async fn auth_router(state: AppState) -> OpenApiRouter {
    OpenApiRouter::new()
        .nest("/login_logger", login_logger_router(state.clone()).await)
        .nest("/operation_logger", operation_logger_router(state.clone()).await)
        .layer(axum::middleware::from_fn(authorize_handler))
        .layer(axum::middleware::from_fn(operation_logger_handler))
        .layer(axum::middleware::from_fn_with_state(state.clone(), request_context_handler))
        .layer(axum::middleware::from_extractor::<AccessClaims>())
}

struct SecurityAddon;

impl Modify for SecurityAddon {
    fn modify(&self, openapi: &mut utoipa::openapi::OpenApi) {
        let components = openapi.components.get_or_insert_with(Default::default);
        components.security_schemes.insert(
            "bearerAuth".to_string(),
            utoipa::openapi::security::SecurityScheme::Http(
                utoipa::openapi::security::HttpBuilder::new()
                    .scheme(utoipa::openapi::security::HttpAuthScheme::Bearer)
                    .bearer_format("JWT")
                    .build()
            ),
        );
    }
}