use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use serde_with::serde_as;
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;
use common::formatter::string_date_time::StringDateTime;

use crate::request::erp_purchase_return_attachment::{CreateErpPurchaseReturnAttachmentRequest, UpdateErpPurchaseReturnAttachmentRequest};
use crate::request::erp_purchase_return_detail::{CreateErpPurchaseReturnDetailRequest, UpdateErpPurchaseReturnDetailRequest};

#[serde_as]
#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpPurchaseReturnRequest {
    
    pub purchase_order_id: i64, // 采购订单ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub return_date: NaiveDateTime, // 退货日期
    
    pub total_amount: i64, // 总金额
    
    pub discount_rate: Option<i64>, // 优惠率（百分比，1000表示10.00%）
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
    pub deposit: Option<i64>, // 定金
    
    pub remarks: Option<String>, // 备注

    pub details: Vec<CreateErpPurchaseReturnDetailRequest>, // 退货采购产品仓库列表

    pub attachments: Vec<CreateErpPurchaseReturnAttachmentRequest>, // 退货附件列表
    
}

#[serde_as]
#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpPurchaseReturnRequest {
    
    pub id: i64, // 退货ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "Option<common::formatter::string_date_time::StringDateTime>")]
    #[schema(value_type = String, format = Date)]
    pub return_date: Option<NaiveDateTime>, // 退货日期
    
    pub total_amount: Option<i64>, // 总金额
    
    pub order_status: Option<i8>, // 订单状态
    
    pub discount_rate: Option<i64>, // 优惠率（百分比，1000表示10.00%）
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
    pub deposit: Option<i64>, // 定金
    
    pub remarks: Option<String>, // 备注
    
    pub details: Vec<UpdateErpPurchaseReturnDetailRequest>, // 退货采购产品仓库列表

    pub attachments: Vec<UpdateErpPurchaseReturnAttachmentRequest>, // 退货附件列表
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}