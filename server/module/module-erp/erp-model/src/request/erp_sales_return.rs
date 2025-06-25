use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use serde_with::serde_as;
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;
use common::formatter::string_date_time::StringDateTime;

use crate::request::erp_sales_return_attachment::{CreateErpSalesReturnAttachmentRequest, UpdateErpSalesReturnAttachmentRequest};
use crate::request::erp_sales_return_detail::{CreateErpSalesReturnDetailRequest, UpdateErpSalesReturnDetailRequest};

#[serde_as]
#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpSalesReturnRequest {
    
    pub sales_order_id: i64, // 销售订单ID
    
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

    pub details: Vec<CreateErpSalesReturnDetailRequest>, // 退货采购产品仓库列表

    pub attachments: Vec<CreateErpSalesReturnAttachmentRequest>, // 退货附件列表
    
}

#[serde_as]
#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpSalesReturnRequest {
    
    pub id: i64, // 退货ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "Option<common::formatter::string_date_time::StringDateTime>")]
    #[schema(value_type = String, format = Date)]
    pub return_date: Option<NaiveDateTime>, // 退货日期
    
    pub total_amount: Option<i64>, // 总金额
    
    pub discount_rate: Option<i64>, // 优惠率（百分比，1000表示10.00%）
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
    pub deposit: Option<i64>, // 定金
    
    pub remarks: Option<String>, // 备注
    
    pub details: Vec<UpdateErpSalesReturnDetailRequest>, // 退货采购产品仓库列表

    pub attachments: Vec<UpdateErpSalesReturnAttachmentRequest>, // 退货附件列表
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}