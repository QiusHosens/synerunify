use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

use crate::request::{erp_purchase_order_attachment::CreateErpPurchaseOrderAttachmentRequest, erp_purchase_order_detail::CreateErpPurchaseOrderDetailRequest};

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpPurchaseOrderRequest {
    
    pub supplier_id: i64, // 供应商ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub purchase_date: NaiveDateTime, // 采购日期
    
    pub total_amount: i64, // 总金额
    
    pub discount_rate: Option<i64>, // 优惠率（百分比，1000表示10.00%）
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
    pub deposit: Option<i64>, // 定金
    
    pub remarks: Option<String>, // 备注

    pub purchase_products: Vec<CreateErpPurchaseOrderDetailRequest>, // 采购的产品列表

    pub purchase_attachment: Vec<CreateErpPurchaseOrderAttachmentRequest>, // 采购的附件列表
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpPurchaseOrderRequest {
    
    pub id: i64, // 采购订单ID
    
    pub supplier_id: Option<i64>, // 供应商ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub purchase_date: Option<NaiveDateTime>, // 采购日期
    
    pub total_amount: Option<i64>, // 总金额
    
    pub order_status: Option<i8>, // 订单状态 (0=pending, 1=completed, 2=cancelled)
    
    pub discount_rate: Option<i64>, // 优惠率（百分比，1000表示10.00%）
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
    pub deposit: Option<i64>, // 定金
    
    pub remarks: Option<String>, // 备注

    pub purchase_products: Option<CreateErpPurchaseOrderDetailRequest>, // 采购的产品列表

    pub purchase_attachment: Option<CreateErpPurchaseOrderAttachmentRequest>, // 采购的附件列表
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}