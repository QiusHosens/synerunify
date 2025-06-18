use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

use crate::request::{erp_inbound_order_attachment::{CreateErpInboundOrderAttachmentRequest, UpdateErpInboundOrderAttachmentRequest}, erp_inbound_order_detail::CreateErpInboundOrderDetailPurchaseRequest};

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpInboundOrderRequest {
    
    pub purchase_id: Option<i64>, // 采购订单ID
    
    pub supplier_id: i64, // 供应商ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub inbound_date: NaiveDateTime, // 入库日期
    
    pub remarks: Option<String>, // 备注
    
    pub discount_rate: Option<i64>, // 优惠率（百分比，1000表示10.00%）
    
    pub other_cost: Option<i64>, // 其他费用
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
    pub department_code: String, // 部门编码
    
    pub department_id: i64, // 部门ID
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpInboundOrderPurchaseRequest {
    
    pub purchase_id: i64, // 采购订单ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub inbound_date: NaiveDateTime, // 入库日期
    
    pub remarks: Option<String>, // 备注
    
    pub discount_rate: Option<i64>, // 优惠率（百分比，1000表示10.00%）
    
    pub other_cost: Option<i64>, // 其他费用
    
    pub settlement_account_id: Option<i64>, // 结算账户ID

    pub details: Vec<CreateErpInboundOrderDetailPurchaseRequest>, // 入库采购产品仓库列表

    pub attachments: Vec<CreateErpInboundOrderAttachmentRequest>, // 入库附件列表
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpInboundOrderRequest {
    
    pub id: i64, // 入库订单ID
    
    pub purchase_id: Option<i64>, // 采购订单ID
    
    pub supplier_id: Option<i64>, // 供应商ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub inbound_date: Option<NaiveDateTime>, // 入库日期
    
    pub remarks: Option<String>, // 备注
    
    pub discount_rate: Option<i64>, // 优惠率（百分比，1000表示10.00%）
    
    pub other_cost: Option<i64>, // 其他费用
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
    pub department_code: Option<String>, // 部门编码
    
    pub department_id: Option<i64>, // 部门ID
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpInboundOrderPurchaseRequest {
    
    pub id: i64, // 入库订单ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub inbound_date: Option<NaiveDateTime>, // 入库日期
    
    pub remarks: Option<String>, // 备注
    
    pub discount_rate: Option<i64>, // 优惠率（百分比，1000表示10.00%）
    
    pub other_cost: Option<i64>, // 其他费用
    
    pub settlement_account_id: Option<i64>, // 结算账户ID

    pub details: Vec<CreateErpInboundOrderDetailPurchaseRequest>, // 入库采购产品仓库列表

    pub attachments: Vec<UpdateErpInboundOrderAttachmentRequest>, // 入库附件列表
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}