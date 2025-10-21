use axum::Router;
use sea_orm::DatabaseConnection;
use utoipa::{Modify, OpenApi};
use utoipa_axum::router::OpenApiRouter;
use common::middleware::request_context::request_context_handler;
use common::middleware::authorize::{authorize_handler, init_route_authorizes};
use common::middleware::operation_logger::operation_logger_handler;
use common::utils::jwt_utils::AccessClaims;
use std::sync::Arc;
use crate::api::mall_product_brand::{ mall_product_brand_route, mall_product_brand_router };
use crate::api::mall_product_browse_history::{ mall_product_browse_history_route, mall_product_browse_history_router };
use crate::api::mall_product_category::{mall_product_category_no_auth_router, mall_product_category_route, mall_product_category_router};
use crate::api::mall_product_comment::{ mall_product_comment_route, mall_product_comment_router };
use crate::api::mall_product_favorite::{ mall_product_favorite_route, mall_product_favorite_router };
use crate::api::mall_product_property::{ mall_product_property_route, mall_product_property_router };
use crate::api::mall_product_property_value::{ mall_product_property_value_route, mall_product_property_value_router };
use crate::api::mall_product_sku::{ mall_product_sku_route, mall_product_sku_router };
use crate::api::mall_product_spu::{ mall_product_spu_route, mall_product_spu_router };
use crate::api::mall_product_statistics::{ mall_product_statistics_route, mall_product_statistics_router };
use crate::api::mall_promotion_article::{ mall_promotion_article_route, mall_promotion_article_router };
use crate::api::mall_promotion_article_category::{ mall_promotion_article_category_route, mall_promotion_article_category_router };
use crate::api::mall_promotion_banner::{ mall_promotion_banner_route, mall_promotion_banner_router };
use crate::api::mall_promotion_bargain_activity::{ mall_promotion_bargain_activity_route, mall_promotion_bargain_activity_router };
use crate::api::mall_promotion_bargain_help::{ mall_promotion_bargain_help_route, mall_promotion_bargain_help_router };
use crate::api::mall_promotion_bargain_record::{ mall_promotion_bargain_record_route, mall_promotion_bargain_record_router };
use crate::api::mall_promotion_combination_activity::{ mall_promotion_combination_activity_route, mall_promotion_combination_activity_router };
use crate::api::mall_promotion_combination_product::{ mall_promotion_combination_product_route, mall_promotion_combination_product_router };
use crate::api::mall_promotion_combination_record::{ mall_promotion_combination_record_route, mall_promotion_combination_record_router };
use crate::api::mall_promotion_coupon::{ mall_promotion_coupon_route, mall_promotion_coupon_router };
use crate::api::mall_promotion_coupon_template::{ mall_promotion_coupon_template_route, mall_promotion_coupon_template_router };
use crate::api::mall_promotion_discount_activity::{ mall_promotion_discount_activity_route, mall_promotion_discount_activity_router };
use crate::api::mall_promotion_discount_product::{ mall_promotion_discount_product_route, mall_promotion_discount_product_router };
use crate::api::mall_promotion_diy_page::{ mall_promotion_diy_page_route, mall_promotion_diy_page_router };
use crate::api::mall_promotion_diy_template::{ mall_promotion_diy_template_route, mall_promotion_diy_template_router };
use crate::api::mall_promotion_flash_activity::{ mall_promotion_flash_activity_route, mall_promotion_flash_activity_router };
use crate::api::mall_promotion_flash_config::{ mall_promotion_flash_config_route, mall_promotion_flash_config_router };
use crate::api::mall_promotion_flash_product::{ mall_promotion_flash_product_route, mall_promotion_flash_product_router };
use crate::api::mall_promotion_point_activity::{ mall_promotion_point_activity_route, mall_promotion_point_activity_router };
use crate::api::mall_promotion_point_product::{ mall_promotion_point_product_route, mall_promotion_point_product_router };
use crate::api::mall_promotion_reward_activity::{ mall_promotion_reward_activity_route, mall_promotion_reward_activity_router };
use crate::api::mall_promotion_serving_conversation::{ mall_promotion_serving_conversation_route, mall_promotion_serving_conversation_router };
use crate::api::mall_promotion_serving_message::{ mall_promotion_serving_message_route, mall_promotion_serving_message_router };
use crate::api::mall_trade_after_sale::{ mall_trade_after_sale_route, mall_trade_after_sale_router };
use crate::api::mall_trade_after_sale_log::{ mall_trade_after_sale_log_route, mall_trade_after_sale_log_router };
use crate::api::mall_trade_brokerage_record::{ mall_trade_brokerage_record_route, mall_trade_brokerage_record_router };
use crate::api::mall_trade_brokerage_user::{ mall_trade_brokerage_user_route, mall_trade_brokerage_user_router };
use crate::api::mall_trade_brokerage_withdraw::{ mall_trade_brokerage_withdraw_route, mall_trade_brokerage_withdraw_router };
use crate::api::mall_trade_cart::{ mall_trade_cart_route, mall_trade_cart_router };
use crate::api::mall_trade_config::{ mall_trade_config_route, mall_trade_config_router };
use crate::api::mall_trade_delivery_express::{ mall_trade_delivery_express_route, mall_trade_delivery_express_router };
use crate::api::mall_trade_delivery_express_template::{ mall_trade_delivery_express_template_route, mall_trade_delivery_express_template_router };
use crate::api::mall_trade_delivery_express_template_charge::{ mall_trade_delivery_express_template_charge_route, mall_trade_delivery_express_template_charge_router };
use crate::api::mall_trade_delivery_express_template_free::{ mall_trade_delivery_express_template_free_route, mall_trade_delivery_express_template_free_router };
use crate::api::mall_trade_delivery_pick_up_store::{ mall_trade_delivery_pick_up_store_route, mall_trade_delivery_pick_up_store_router };
use crate::api::mall_trade_order::{ mall_trade_order_route, mall_trade_order_router };
use crate::api::mall_trade_order_item::{ mall_trade_order_item_route, mall_trade_order_item_router };
use crate::api::mall_trade_order_log::{ mall_trade_order_log_route, mall_trade_order_log_router };
use crate::api::mall_trade_statistics::{ mall_trade_statistics_route, mall_trade_statistics_router };
use crate::AppState;

// openapi document
#[derive(OpenApi)]
#[openapi(
    info(
        title = "API",
        description = "erp",
        version = "1.0.0"
    ),
    tags(
        (name = "mall_product_brand", description = "商品品牌"),
        (name = "mall_product_browse_history", description = "商品浏览记录"),
        (name = "mall_product_category", description = "商品分类"),
        (name = "mall_product_comment", description = "商品评论"),
        (name = "mall_product_favorite", description = "商品收藏"),
        (name = "mall_product_property", description = "商品属性项"),
        (name = "mall_product_property_value", description = "商品属性值"),
        (name = "mall_product_sku", description = "商品sku"),
        (name = "mall_product_spu", description = "商品spu"),
        (name = "mall_product_statistics", description = "商品统计"),
        (name = "mall_promotion_article", description = "文章管理"),
        (name = "mall_promotion_article_category", description = "文章分类"),
        (name = "mall_promotion_banner", description = "Banner 广告位"),
        (name = "mall_promotion_bargain_activity", description = "砍价活动"),
        (name = "mall_promotion_bargain_help", description = "砍价助力"),
        (name = "mall_promotion_bargain_record", description = "砍价记录"),
        (name = "mall_promotion_combination_activity", description = "拼团活动"),
        (name = "mall_promotion_combination_product", description = "拼团商品"),
        (name = "mall_promotion_combination_record", description = "拼团记录"),
        (name = "mall_promotion_coupon", description = "优惠劵"),
        (name = "mall_promotion_coupon_template", description = "优惠劵模板"),
        (name = "mall_promotion_discount_activity", description = "限时折扣活动"),
        (name = "mall_promotion_discount_product", description = "限时折扣商品"),
        (name = "mall_promotion_diy_page", description = "装修页面"),
        (name = "mall_promotion_diy_template", description = "装修模板"),
        (name = "mall_promotion_flash_activity", description = "秒杀活动"),
        (name = "mall_promotion_flash_config", description = "秒杀时段"),
        (name = "mall_promotion_flash_product", description = "秒杀参与商品"),
        (name = "mall_promotion_point_activity", description = "积分商城活动"),
        (name = "mall_promotion_point_product", description = "积分商城商品"),
        (name = "mall_promotion_reward_activity", description = "满减送活动"),
        (name = "mall_promotion_serving_conversation", description = "客服会话"),
        (name = "mall_promotion_serving_message", description = "客服消息"),
        (name = "mall_trade_after_sale", description = "售后订单"),
        (name = "mall_trade_after_sale_log", description = "售后订单日志"),
        (name = "mall_trade_brokerage_record", description = "佣金记录"),
        (name = "mall_trade_brokerage_user", description = "分销用户"),
        (name = "mall_trade_brokerage_withdraw", description = "佣金提现"),
        (name = "mall_trade_cart", description = "购物车的商品信息"),
        (name = "mall_trade_config", description = "交易中心配置"),
        (name = "mall_trade_delivery_express", description = "快递公司"),
        (name = "mall_trade_delivery_express_template", description = "快递运费模板"),
        (name = "mall_trade_delivery_express_template_charge", description = "快递运费模板计费配置"),
        (name = "mall_trade_delivery_express_template_free", description = "快递运费模板包邮配置"),
        (name = "mall_trade_delivery_pick_up_store", description = "自提门店"),
        (name = "mall_trade_order", description = "交易订单"),
        (name = "mall_trade_order_item", description = "交易订单明细"),
        (name = "mall_trade_order_log", description = "交易订单日志"),
        (name = "mall_trade_statistics", description = "交易统计"),
    ),
    modifiers(&SecurityAddon)
)]
pub struct ApiDocument;

pub async fn api(state: AppState) -> Router {
    let (router, api) = OpenApiRouter::with_openapi(ApiDocument::openapi())
        .nest("/mall", no_auth_router(state.clone()).await)
        .nest("/mall", auth_router(state.clone()).await)
        .split_for_parts();

    // 注册路由权限
    init_route_authorizes(&api);

    router
        .merge(utoipa_swagger_ui::SwaggerUi::new("/mall/swagger-ui").url("/mall/api-docs/openapi.json", api.clone()))
}

pub async fn no_auth_router(state: AppState) -> OpenApiRouter {
    OpenApiRouter::new()
        .nest("/mall_product_category", mall_product_category_no_auth_router(state.clone()).await)
        .layer(axum::middleware::from_fn(authorize_handler))
        .layer(axum::middleware::from_fn(operation_logger_handler))
        .layer(axum::middleware::from_fn_with_state(state.clone(), request_context_handler))
}

pub async fn auth_router(state: AppState) -> OpenApiRouter {
    OpenApiRouter::new()
        .nest("/mall_product_brand", mall_product_brand_router(state.clone()).await)
        .nest("/mall_product_browse_history", mall_product_browse_history_router(state.clone()).await)
        .nest("/mall_product_category", mall_product_category_router(state.clone()).await)
        .nest("/mall_product_comment", mall_product_comment_router(state.clone()).await)
        .nest("/mall_product_favorite", mall_product_favorite_router(state.clone()).await)
        .nest("/mall_product_property", mall_product_property_router(state.clone()).await)
        .nest("/mall_product_property_value", mall_product_property_value_router(state.clone()).await)
        .nest("/mall_product_sku", mall_product_sku_router(state.clone()).await)
        .nest("/mall_product_spu", mall_product_spu_router(state.clone()).await)
        .nest("/mall_product_statistics", mall_product_statistics_router(state.clone()).await)
        .nest("/mall_promotion_article", mall_promotion_article_router(state.clone()).await)
        .nest("/mall_promotion_article_category", mall_promotion_article_category_router(state.clone()).await)
        .nest("/mall_promotion_banner", mall_promotion_banner_router(state.clone()).await)
        .nest("/mall_promotion_bargain_activity", mall_promotion_bargain_activity_router(state.clone()).await)
        .nest("/mall_promotion_bargain_help", mall_promotion_bargain_help_router(state.clone()).await)
        .nest("/mall_promotion_bargain_record", mall_promotion_bargain_record_router(state.clone()).await)
        .nest("/mall_promotion_combination_activity", mall_promotion_combination_activity_router(state.clone()).await)
        .nest("/mall_promotion_combination_product", mall_promotion_combination_product_router(state.clone()).await)
        .nest("/mall_promotion_combination_record", mall_promotion_combination_record_router(state.clone()).await)
        .nest("/mall_promotion_coupon", mall_promotion_coupon_router(state.clone()).await)
        .nest("/mall_promotion_coupon_template", mall_promotion_coupon_template_router(state.clone()).await)
        .nest("/mall_promotion_discount_activity", mall_promotion_discount_activity_router(state.clone()).await)
        .nest("/mall_promotion_discount_product", mall_promotion_discount_product_router(state.clone()).await)
        .nest("/mall_promotion_diy_page", mall_promotion_diy_page_router(state.clone()).await)
        .nest("/mall_promotion_diy_template", mall_promotion_diy_template_router(state.clone()).await)
        .nest("/mall_promotion_flash_activity", mall_promotion_flash_activity_router(state.clone()).await)
        .nest("/mall_promotion_flash_config", mall_promotion_flash_config_router(state.clone()).await)
        .nest("/mall_promotion_flash_product", mall_promotion_flash_product_router(state.clone()).await)
        .nest("/mall_promotion_point_activity", mall_promotion_point_activity_router(state.clone()).await)
        .nest("/mall_promotion_point_product", mall_promotion_point_product_router(state.clone()).await)
        .nest("/mall_promotion_reward_activity", mall_promotion_reward_activity_router(state.clone()).await)
        .nest("/mall_promotion_serving_conversation", mall_promotion_serving_conversation_router(state.clone()).await)
        .nest("/mall_promotion_serving_message", mall_promotion_serving_message_router(state.clone()).await)
        .nest("/mall_trade_after_sale", mall_trade_after_sale_router(state.clone()).await)
        .nest("/mall_trade_after_sale_log", mall_trade_after_sale_log_router(state.clone()).await)
        .nest("/mall_trade_brokerage_record", mall_trade_brokerage_record_router(state.clone()).await)
        .nest("/mall_trade_brokerage_user", mall_trade_brokerage_user_router(state.clone()).await)
        .nest("/mall_trade_brokerage_withdraw", mall_trade_brokerage_withdraw_router(state.clone()).await)
        .nest("/mall_trade_cart", mall_trade_cart_router(state.clone()).await)
        .nest("/mall_trade_config", mall_trade_config_router(state.clone()).await)
        .nest("/mall_trade_delivery_express", mall_trade_delivery_express_router(state.clone()).await)
        .nest("/mall_trade_delivery_express_template", mall_trade_delivery_express_template_router(state.clone()).await)
        .nest("/mall_trade_delivery_express_template_charge", mall_trade_delivery_express_template_charge_router(state.clone()).await)
        .nest("/mall_trade_delivery_express_template_free", mall_trade_delivery_express_template_free_router(state.clone()).await)
        .nest("/mall_trade_delivery_pick_up_store", mall_trade_delivery_pick_up_store_router(state.clone()).await)
        .nest("/mall_trade_order", mall_trade_order_router(state.clone()).await)
        .nest("/mall_trade_order_item", mall_trade_order_item_router(state.clone()).await)
        .nest("/mall_trade_order_log", mall_trade_order_log_router(state.clone()).await)
        .nest("/mall_trade_statistics", mall_trade_statistics_router(state.clone()).await)
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