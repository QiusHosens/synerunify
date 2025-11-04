use crate::api::system_area::system_area_router;
use crate::api::system_auth::{system_auth_need_router, system_auth_router};
use crate::api::system_data_scope_rule::system_data_scope_rule_router;
use crate::api::system_department::system_department_router;
use crate::api::system_dict_data::system_dict_data_router;
use crate::api::system_dict_type::system_dict_type_router;
use crate::api::system_menu::system_menu_router;
use crate::api::system_notice::system_notice_router;
use crate::api::system_post::system_post_router;
use crate::api::system_role::system_role_router;
use crate::api::system_role_menu::system_role_menu_router;
use crate::api::system_role_menu_data_scope::system_role_menu_data_scope_router;
use crate::api::system_tenant::{system_tenant_no_auth_router, system_tenant_router};
use crate::api::system_tenant_package::system_tenant_package_router;
use crate::api::system_user::system_user_router;
use crate::api::system_user_post::system_user_post_router;
use crate::api::system_user_role::system_user_role_router;
use axum::Router;
use common::middleware::request_context::request_context_handler;
use utoipa::{Modify, OpenApi};
use utoipa_axum::router::OpenApiRouter;
use common::middleware::authorize::{authorize_handler, init_route_authorizes};
use common::middleware::operation_logger::operation_logger_handler;
use common::state::app_state::AppState;
use common::utils::jwt_utils::AccessClaims;

// openapi document
#[derive(OpenApi)]
#[openapi(
    info(
        title = "API",
        description = "system",
        version = "1.0.0"
    ),
    tags(
        (name = "system_auth", description = "认证"),
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
        (name = "system_area", description = "区域管理"),
    ),
    modifiers(&SecurityAddon)
)]
pub struct ApiDocument;

pub async fn api(state: AppState) -> Router {
    let (router, api) = OpenApiRouter::with_openapi(ApiDocument::openapi())
        .nest("/system", no_auth_router(state.clone()).await)
        .nest("/system", auth_router(state.clone()).await)
        .split_for_parts();

    // 注册路由权限
    init_route_authorizes(&api);

    router
        .merge(utoipa_swagger_ui::SwaggerUi::new("/system/swagger-ui").url("/system/api-docs/openapi.json", api.clone()))
}

pub async fn no_auth_router(state: AppState) -> OpenApiRouter {
    OpenApiRouter::new()
        .nest("/system_auth", system_auth_router(state.clone()).await)
        .nest("/system_area", system_area_router().await)
        .nest("/system_tenant", system_tenant_no_auth_router(state.clone()).await)
        .layer(axum::middleware::from_fn(authorize_handler))
        .layer(axum::middleware::from_fn(operation_logger_handler))
        .layer(axum::middleware::from_fn_with_state(state.clone(), request_context_handler))
}

pub async fn auth_router(state: AppState) -> OpenApiRouter {
    OpenApiRouter::new()
        .nest("/system_auth", system_auth_need_router(state.clone()).await)
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