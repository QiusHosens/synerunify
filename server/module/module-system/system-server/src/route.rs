use axum::Router;
use sea_orm::DatabaseConnection;
use utoipa::OpenApi;
use utoipa_axum::router::OpenApiRouter;
use std::sync::Arc;
use crate::api::system_data_scope_rule::{ system_data_scope_rule_route, system_data_scope_rule_router };
use crate::api::system_department::{ system_department_route, system_department_router };
use crate::api::system_dict::{ system_dict_route, system_dict_router };
use crate::api::system_menu::{ system_menu_route, system_menu_router };
use crate::api::system_notice::{ system_notice_route, system_notice_router };
use crate::api::system_post::{ system_post_route, system_post_router };
use crate::api::system_role::{ system_role_route, system_role_router };
use crate::api::system_role_menu::{ system_role_menu_route, system_role_menu_router };
use crate::api::system_role_menu_data_scope::{ system_role_menu_data_scope_route, system_role_menu_data_scope_router };
use crate::api::system_tenant::{ system_tenant_route, system_tenant_router };
use crate::api::system_tenant_package::{ system_tenant_package_route, system_tenant_package_router };
use crate::api::system_user::{ system_user_route, system_user_router };
use crate::api::system_user_post::{ system_user_post_route, system_user_post_router };
use crate::api::system_user_role::{ system_user_role_route, system_user_role_router };

// openapi document
#[derive(OpenApi)]
#[openapi(
    info(
        title = "API",
        description = "api",
        version = "1.0.0"
    )
)]
pub struct ApiDocument;

pub async fn api(database: Arc<DatabaseConnection>) -> Router {
    let (router, api) = OpenApiRouter::with_openapi(ApiDocument::openapi())
        .nest("/system_data_scope_rule", system_data_scope_rule_router(database.clone()).await)
        .nest("/system_department", system_department_router(database.clone()).await)
        .nest("/system_dict", system_dict_router(database.clone()).await)
        .nest("/system_menu", system_menu_router(database.clone()).await)
        .nest("/system_notice", system_notice_router(database.clone()).await)
        .nest("/system_post", system_post_router(database.clone()).await)
        .nest("/system_role", system_role_router(database.clone()).await)
        .nest("/system_role_menu", system_role_menu_router(database.clone()).await)
        .nest("/system_role_menu_data_scope", system_role_menu_data_scope_router(database.clone()).await)
        .nest("/system_tenant", system_tenant_router(database.clone()).await)
        .nest("/system_tenant_package", system_tenant_package_router(database.clone()).await)
        .nest("/system_user", system_user_router(database.clone()).await)
        .nest("/system_user_post", system_user_post_router(database.clone()).await)
        .nest("/system_user_role", system_user_role_router(database.clone()).await)
        .split_for_parts();

    router
        .merge(utoipa_swagger_ui::SwaggerUi::new("/swagger-ui").url("/api-docs/openapi.json", api.clone()))
}