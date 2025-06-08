use axum::Router;
use sea_orm::DatabaseConnection;
use utoipa::{Modify, OpenApi};
use utoipa_axum::router::OpenApiRouter;
use common::middleware::request_context::request_context_handler;
use common::middleware::authorize::{authorize_handler, init_route_authorizes};
use common::middleware::operation_logger::operation_logger_handler;
use common::utils::jwt_utils::AccessClaims;
use std::sync::Arc;
use crate::api::erp_customers::{ erp_customers_route, erp_customers_router };
use crate::api::erp_financial_records::{ erp_financial_records_route, erp_financial_records_router };
use crate::api::erp_inbound_records::{ erp_inbound_records_route, erp_inbound_records_router };
use crate::api::erp_inventory_checks::{ erp_inventory_checks_route, erp_inventory_checks_router };
use crate::api::erp_inventory_records::{ erp_inventory_records_route, erp_inventory_records_router };
use crate::api::erp_inventory_transfers::{ erp_inventory_transfers_route, erp_inventory_transfers_router };
use crate::api::erp_outbound_records::{ erp_outbound_records_route, erp_outbound_records_router };
use crate::api::erp_payment_attachments::{ erp_payment_attachments_route, erp_payment_attachments_router };
use crate::api::erp_payment_details::{ erp_payment_details_route, erp_payment_details_router };
use crate::api::erp_payments::{ erp_payments_route, erp_payments_router };
use crate::api::erp_product_categories::{ erp_product_categories_route, erp_product_categories_router };
use crate::api::erp_product_units::{ erp_product_units_route, erp_product_units_router };
use crate::api::erp_products::{ erp_products_route, erp_products_router };
use crate::api::erp_purchase_order_attachments::{ erp_purchase_order_attachments_route, erp_purchase_order_attachments_router };
use crate::api::erp_purchase_order_details::{ erp_purchase_order_details_route, erp_purchase_order_details_router };
use crate::api::erp_purchase_orders::{ erp_purchase_orders_route, erp_purchase_orders_router };
use crate::api::erp_purchase_returns::{ erp_purchase_returns_route, erp_purchase_returns_router };
use crate::api::erp_receipt_attachments::{ erp_receipt_attachments_route, erp_receipt_attachments_router };
use crate::api::erp_receipt_details::{ erp_receipt_details_route, erp_receipt_details_router };
use crate::api::erp_receipts::{ erp_receipts_route, erp_receipts_router };
use crate::api::erp_sales_order_attachments::{ erp_sales_order_attachments_route, erp_sales_order_attachments_router };
use crate::api::erp_sales_order_details::{ erp_sales_order_details_route, erp_sales_order_details_router };
use crate::api::erp_sales_orders::{ erp_sales_orders_route, erp_sales_orders_router };
use crate::api::erp_sales_returns::{ erp_sales_returns_route, erp_sales_returns_router };
use crate::api::erp_settlement_accounts::{ erp_settlement_accounts_route, erp_settlement_accounts_router };
use crate::api::erp_suppliers::{ erp_suppliers_route, erp_suppliers_router };
use crate::api::erp_warehouses::{ erp_warehouses_route, erp_warehouses_router };
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
        (name = "erp_customers", description = "客户信息"),
        (name = "erp_financial_records", description = "财务记录"),
        (name = "erp_inbound_records", description = "入库记录"),
        (name = "erp_inventory_checks", description = "库存盘点"),
        (name = "erp_inventory_records", description = "库存记录"),
        (name = "erp_inventory_transfers", description = "库存调拨"),
        (name = "erp_outbound_records", description = "出库记录"),
        (name = "erp_payment_attachments", description = "付款附件"),
        (name = "erp_payment_details", description = "付款详情"),
        (name = "erp_payments", description = "付款"),
        (name = "erp_product_categories", description = "产品分类"),
        (name = "erp_product_units", description = "产品单位"),
        (name = "erp_products", description = "产品信息"),
        (name = "erp_purchase_order_attachments", description = "采购订单附件"),
        (name = "erp_purchase_order_details", description = "采购订单详情"),
        (name = "erp_purchase_orders", description = "采购订单"),
        (name = "erp_purchase_returns", description = "采购退货"),
        (name = "erp_receipt_attachments", description = "收款附件"),
        (name = "erp_receipt_details", description = "收款详情"),
        (name = "erp_receipts", description = "收款"),
        (name = "erp_sales_order_attachments", description = "销售订单附件"),
        (name = "erp_sales_order_details", description = "销售订单详情"),
        (name = "erp_sales_orders", description = "销售订单"),
        (name = "erp_sales_returns", description = "销售退货"),
        (name = "erp_settlement_accounts", description = "结算账户"),
        (name = "erp_suppliers", description = "供应商信息"),
        (name = "erp_warehouses", description = "仓库信息"),
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
        .nest("/erp_customers", erp_customers_router(state.clone()).await)
        .nest("/erp_financial_records", erp_financial_records_router(state.clone()).await)
        .nest("/erp_inbound_records", erp_inbound_records_router(state.clone()).await)
        .nest("/erp_inventory_checks", erp_inventory_checks_router(state.clone()).await)
        .nest("/erp_inventory_records", erp_inventory_records_router(state.clone()).await)
        .nest("/erp_inventory_transfers", erp_inventory_transfers_router(state.clone()).await)
        .nest("/erp_outbound_records", erp_outbound_records_router(state.clone()).await)
        .nest("/erp_payment_attachments", erp_payment_attachments_router(state.clone()).await)
        .nest("/erp_payment_details", erp_payment_details_router(state.clone()).await)
        .nest("/erp_payments", erp_payments_router(state.clone()).await)
        .nest("/erp_product_categories", erp_product_categories_router(state.clone()).await)
        .nest("/erp_product_units", erp_product_units_router(state.clone()).await)
        .nest("/erp_products", erp_products_router(state.clone()).await)
        .nest("/erp_purchase_order_attachments", erp_purchase_order_attachments_router(state.clone()).await)
        .nest("/erp_purchase_order_details", erp_purchase_order_details_router(state.clone()).await)
        .nest("/erp_purchase_orders", erp_purchase_orders_router(state.clone()).await)
        .nest("/erp_purchase_returns", erp_purchase_returns_router(state.clone()).await)
        .nest("/erp_receipt_attachments", erp_receipt_attachments_router(state.clone()).await)
        .nest("/erp_receipt_details", erp_receipt_details_router(state.clone()).await)
        .nest("/erp_receipts", erp_receipts_router(state.clone()).await)
        .nest("/erp_sales_order_attachments", erp_sales_order_attachments_router(state.clone()).await)
        .nest("/erp_sales_order_details", erp_sales_order_details_router(state.clone()).await)
        .nest("/erp_sales_orders", erp_sales_orders_router(state.clone()).await)
        .nest("/erp_sales_returns", erp_sales_returns_router(state.clone()).await)
        .nest("/erp_settlement_accounts", erp_settlement_accounts_router(state.clone()).await)
        .nest("/erp_suppliers", erp_suppliers_router(state.clone()).await)
        .nest("/erp_warehouses", erp_warehouses_router(state.clone()).await)
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