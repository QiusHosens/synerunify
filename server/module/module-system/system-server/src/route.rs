use axum::Router;
use sea_orm::DatabaseConnection;
use utoipa::OpenApi;
use utoipa_axum::router::OpenApiRouter;
use std::sync::Arc;
use utoipa_axum::routes;
use crate::api::system_auth::system_auth_router;
use crate::api::system_data_scope_rule::{system_data_scope_rule_route, system_data_scope_rule_router };
use crate::api::system_department::{ system_department_route, system_department_router };
use crate::api::system_dict_data::{ system_dict_data_route, system_dict_data_router };
use crate::api::system_dict_type::{ system_dict_type_route, system_dict_type_router };
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
use crate::AppState;

// openapi document
#[derive(OpenApi)]
#[openapi(
    info(
        title = "API",
        description = "api",
        version = "1.0.0"
    ),
    tags(
        (name = "system_data_scope_rule", description = "数据权限规则"),
        (name = "system_department", description = "部门"),
        (name = "system_dict_data", description = "字典数据"),
        (name = "system_dict_type", description = "字典类型"),
        (name = "system_menu", description = "菜单权限"),
        (name = "system_notice", description = "通知公告"),
        (name = "system_post", description = "职位信息"),
        (name = "system_role", description = "角色信息"),
        (name = "system_role_menu", description = "角色和菜单关联"),
        (name = "system_role_menu_data_scope", description = "角色菜单和数据权限关联"),
        (name = "system_tenant", description = "租户"),
        (name = "system_tenant_package", description = "租户套餐"),
        (name = "system_user", description = "用户信息"),
        (name = "system_user_post", description = "用户职位"),
        (name = "system_user_role", description = "用户和角色关联"),
        (name = "system_auth", description = "认证"),
    )
)]
pub struct ApiDocument;

pub async fn api(state: AppState) -> Router {
    let (router, api) = OpenApiRouter::with_openapi(ApiDocument::openapi())
        .merge(no_auth_router(state.clone()).await)
        .merge(auth_router(state.clone()).await)
        .split_for_parts();

    router
        .merge(utoipa_swagger_ui::SwaggerUi::new("/swagger-ui").url("/api-docs/openapi.json", api.clone()))
}

pub async fn no_auth_router(state: AppState) -> OpenApiRouter {
    OpenApiRouter::new()
        .nest("/system_auth", system_auth_router(state).await)
}

pub async fn auth_router(state: AppState) -> OpenApiRouter {
    OpenApiRouter::new()
        .nest("/system_data_scope_rule", system_data_scope_rule_router(state.clone()).await)
        .nest("/system_department", system_department_router(state.clone()).await)
        .nest("/system_dict_data", system_dict_data_router(state.clone()).await)
        .nest("/system_dict_type", system_dict_type_router(state.clone()).await)
        .nest("/system_menu", system_menu_router(state.clone()).await)
        .nest("/system_notice", system_notice_router(state.clone()).await)
        .nest("/system_post", system_post_router(state.clone()).await)
        .nest("/system_role", system_role_router(state.clone()).await)
        .nest("/system_role_menu", system_role_menu_router(state.clone()).await)
        .nest("/system_role_menu_data_scope", system_role_menu_data_scope_router(state.clone()).await)
        .nest("/system_tenant", system_tenant_router(state.clone()).await)
        .nest("/system_tenant_package", system_tenant_package_router(state.clone()).await)
        .nest("/system_user", system_user_router(state.clone()).await)
        .nest("/system_user_post", system_user_post_router(state.clone()).await)
        .nest("/system_user_role", system_user_role_router(state.clone()).await)
}