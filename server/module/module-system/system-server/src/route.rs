use crate::api::system_data_scope_rule::system_data_scope_rule_route;
use crate::api::system_department::system_department_route;
use crate::api::system_dict::system_dict_route;
use crate::api::system_menu::system_menu_route;
use crate::api::system_notice::system_notice_route;
use crate::api::system_post::system_post_route;
use crate::api::system_role::system_role_route;
use crate::api::system_role_menu::system_role_menu_route;
use crate::api::system_role_menu_data_scope::system_role_menu_data_scope_route;
use crate::api::system_tenant::system_tenant_route;
use crate::api::system_tenant_package::system_tenant_package_route;
use crate::api::system_user::system_user_route;
use crate::api::system_user_post::system_user_post_route;
use crate::api::system_user_role::system_user_role_route;
use axum::Router;
use sea_orm::DatabaseConnection;
use std::sync::Arc;
use utoipa::OpenApi;
use utoipa_axum::router::OpenApiRouter;

// 定义 OpenAPI 文档，自动扫描 routes 模块
#[derive(OpenApi)]
#[openapi(
    info(
        title = "API",
        description = "api",
        version = "1.0.0"
    )
)]
pub struct ApiDoc;

pub async fn api(database: Arc<DatabaseConnection>) -> Router {
    let (router, api) = OpenApiRouter::with_openapi(ApiDoc::openapi())
        .nest("/system_data_scope_rule", system_data_scope_rule_route(database.clone()).await)
        .nest("/system_department", system_department_route(database.clone()).await)
        .nest("/system_dict", system_dict_route(database.clone()).await)
        .nest("/system_menu", system_menu_route(database.clone()).await)
        .nest("/system_notice", system_notice_route(database.clone()).await)
        .nest("/system_post", system_post_route(database.clone()).await)
        .nest("/system_role", system_role_route(database.clone()).await)
        .nest("/system_role_menu", system_role_menu_route(database.clone()).await)
        .nest("/system_role_menu_data_scope", system_role_menu_data_scope_route(database.clone()).await)
        .nest("/system_tenant", system_tenant_route(database.clone()).await)
        .nest("/system_tenant_package", system_tenant_package_route(database.clone()).await)
        .nest("/system_user", system_user_route(database.clone()).await)
        .nest("/system_user_post", system_user_post_route(database.clone()).await)
        .nest("/system_user_role", system_user_role_route(database.clone()).await)
        .split_for_parts();

    router
        .merge(utoipa_swagger_ui::SwaggerUi::new("/swagger-ui").url("/api-docs/openapi.json", api.clone()))
}

pub async fn api_routes(database: Arc<DatabaseConnection>) -> Router {
    Router::new()
        // .nest("/system_data_scope_rule", system_data_scope_rule_route(database.clone()).await)
        // .nest("/system_department", system_department_route(database.clone()).await)
        // .nest("/system_dict", system_dict_route(database.clone()).await)
        // .nest("/system_menu", system_menu_route(database.clone()).await)
        // .nest("/system_notice", system_notice_route(database.clone()).await)
        // .nest("/system_post", system_post_route(database.clone()).await)
        // .nest("/system_role", system_role_route(database.clone()).await)
        // .nest("/system_role_menu", system_role_menu_route(database.clone()).await)
        // .nest("/system_role_menu_data_scope", system_role_menu_data_scope_route(database.clone()).await)
        // .nest("/system_tenant", system_tenant_route(database.clone()).await)
        // .nest("/system_tenant_package", system_tenant_package_route(database.clone()).await)
        // .nest("/system_user", system_user_route(database.clone()).await)
        // .nest("/system_user_post", system_user_post_route(database.clone()).await)
        // .nest("/system_user_role", system_user_role_route(database.clone()).await)
}