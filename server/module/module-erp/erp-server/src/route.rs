use axum::Router;
use sea_orm::DatabaseConnection;
use utoipa::{Modify, OpenApi};
use utoipa_axum::router::OpenApiRouter;
use common::middleware::request_context::request_context_handler;
use common::middleware::authorize::{authorize_handler, init_route_authorizes};
use common::middleware::operation_logger::operation_logger_handler;
use common::utils::jwt_utils::AccessClaims;
use std::sync::Arc;
use crate::api::erp_customer::{ erp_customer_route, erp_customer_router };
use crate::api::erp_financial_record::{ erp_financial_record_route, erp_financial_record_router };
use crate::api::erp_inbound_record::{ erp_inbound_record_route, erp_inbound_record_router };
use crate::api::erp_inventory_check::{ erp_inventory_check_route, erp_inventory_check_router };
use crate::api::erp_inventory_record::{ erp_inventory_record_route, erp_inventory_record_router };
use crate::api::erp_inventory_transfer::{ erp_inventory_transfer_route, erp_inventory_transfer_router };
use crate::api::erp_outbound_record::{ erp_outbound_record_route, erp_outbound_record_router };
use crate::api::erp_payment::{ erp_payment_route, erp_payment_router };
use crate::api::erp_payment_attachment::{ erp_payment_attachment_route, erp_payment_attachment_router };
use crate::api::erp_payment_detail::{ erp_payment_detail_route, erp_payment_detail_router };
use crate::api::erp_product::{ erp_product_route, erp_product_router };
use crate::api::erp_product_category::{ erp_product_category_route, erp_product_category_router };
use crate::api::erp_product_unit::{ erp_product_unit_route, erp_product_unit_router };
use crate::api::erp_purchase_order::{ erp_purchase_order_route, erp_purchase_order_router };
use crate::api::erp_purchase_order_attachment::{ erp_purchase_order_attachment_route, erp_purchase_order_attachment_router };
use crate::api::erp_purchase_order_detail::{ erp_purchase_order_detail_route, erp_purchase_order_detail_router };
use crate::api::erp_purchase_return::{ erp_purchase_return_route, erp_purchase_return_router };
use crate::api::erp_receipt::{ erp_receipt_route, erp_receipt_router };
use crate::api::erp_receipt_attachment::{ erp_receipt_attachment_route, erp_receipt_attachment_router };
use crate::api::erp_receipt_detail::{ erp_receipt_detail_route, erp_receipt_detail_router };
use crate::api::erp_sales_order::{ erp_sales_order_route, erp_sales_order_router };
use crate::api::erp_sales_order_attachment::{ erp_sales_order_attachment_route, erp_sales_order_attachment_router };
use crate::api::erp_sales_order_detail::{ erp_sales_order_detail_route, erp_sales_order_detail_router };
use crate::api::erp_sales_return::{ erp_sales_return_route, erp_sales_return_router };
use crate::api::erp_settlement_account::{ erp_settlement_account_route, erp_settlement_account_router };
use crate::api::erp_supplier::{ erp_supplier_route, erp_supplier_router };
use crate::api::erp_warehouse::{ erp_warehouse_route, erp_warehouse_router };
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
        (name = "erp_customer", description = "客户信息"),
        (name = "erp_financial_record", description = "财务记录"),
        (name = "erp_inbound_record", description = "入库记录"),
        (name = "erp_inventory_check", description = "库存盘点"),
        (name = "erp_inventory_record", description = "库存记录"),
        (name = "erp_inventory_transfer", description = "库存调拨"),
        (name = "erp_outbound_record", description = "出库记录"),
        (name = "erp_payment", description = "付款"),
        (name = "erp_payment_attachment", description = "付款附件"),
        (name = "erp_payment_detail", description = "付款详情"),
        (name = "erp_product", description = "产品信息"),
        (name = "erp_product_category", description = "产品分类"),
        (name = "erp_product_unit", description = "产品单位"),
        (name = "erp_purchase_order", description = "采购订单"),
        (name = "erp_purchase_order_attachment", description = "采购订单附件"),
        (name = "erp_purchase_order_detail", description = "采购订单详情"),
        (name = "erp_purchase_return", description = "采购退货"),
        (name = "erp_receipt", description = "收款"),
        (name = "erp_receipt_attachment", description = "收款附件"),
        (name = "erp_receipt_detail", description = "收款详情"),
        (name = "erp_sales_order", description = "销售订单"),
        (name = "erp_sales_order_attachment", description = "销售订单附件"),
        (name = "erp_sales_order_detail", description = "销售订单详情"),
        (name = "erp_sales_return", description = "销售退货"),
        (name = "erp_settlement_account", description = "结算账户"),
        (name = "erp_supplier", description = "供应商信息"),
        (name = "erp_warehouse", description = "仓库信息"),
    ),
    modifiers(&SecurityAddon)
)]
pub struct ApiDocument;

pub async fn api(state: AppState) -> Router {
    let (router, api) = OpenApiRouter::with_openapi(ApiDocument::openapi())
        .nest("/erp", auth_router(state.clone()).await)
        .split_for_parts();

    // 注册路由权限
    init_route_authorizes(&api);
    router
        .merge(utoipa_swagger_ui::SwaggerUi::new("/erp/swagger-ui").url("/erp/api-docs/openapi.json", api.clone()))
}

pub async fn auth_router(state: AppState) -> OpenApiRouter {
    OpenApiRouter::new()
        .nest("/erp_customer", erp_customer_router(state.clone()).await)
        .nest("/erp_financial_record", erp_financial_record_router(state.clone()).await)
        .nest("/erp_inbound_record", erp_inbound_record_router(state.clone()).await)
        .nest("/erp_inventory_check", erp_inventory_check_router(state.clone()).await)
        .nest("/erp_inventory_record", erp_inventory_record_router(state.clone()).await)
        .nest("/erp_inventory_transfer", erp_inventory_transfer_router(state.clone()).await)
        .nest("/erp_outbound_record", erp_outbound_record_router(state.clone()).await)
        .nest("/erp_payment", erp_payment_router(state.clone()).await)
        .nest("/erp_payment_attachment", erp_payment_attachment_router(state.clone()).await)
        .nest("/erp_payment_detail", erp_payment_detail_router(state.clone()).await)
        .nest("/erp_product", erp_product_router(state.clone()).await)
        .nest("/erp_product_category", erp_product_category_router(state.clone()).await)
        .nest("/erp_product_unit", erp_product_unit_router(state.clone()).await)
        .nest("/erp_purchase_order", erp_purchase_order_router(state.clone()).await)
        .nest("/erp_purchase_order_attachment", erp_purchase_order_attachment_router(state.clone()).await)
        .nest("/erp_purchase_order_detail", erp_purchase_order_detail_router(state.clone()).await)
        .nest("/erp_purchase_return", erp_purchase_return_router(state.clone()).await)
        .nest("/erp_receipt", erp_receipt_router(state.clone()).await)
        .nest("/erp_receipt_attachment", erp_receipt_attachment_router(state.clone()).await)
        .nest("/erp_receipt_detail", erp_receipt_detail_router(state.clone()).await)
        .nest("/erp_sales_order", erp_sales_order_router(state.clone()).await)
        .nest("/erp_sales_order_attachment", erp_sales_order_attachment_router(state.clone()).await)
        .nest("/erp_sales_order_detail", erp_sales_order_detail_router(state.clone()).await)
        .nest("/erp_sales_return", erp_sales_return_router(state.clone()).await)
        .nest("/erp_settlement_account", erp_settlement_account_router(state.clone()).await)
        .nest("/erp_supplier", erp_supplier_router(state.clone()).await)
        .nest("/erp_warehouse", erp_warehouse_router(state.clone()).await)
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