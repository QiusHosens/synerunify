use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use serde_with::serde_as;
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;
use common::formatter::string_date_time::StringDateTime;

use crate::request::erp_sales_order_attachment::{CreateErpSalesOrderAttachmentRequest, UpdateErpSalesOrderAttachmentRequest};
use crate::request::erp_sales_order_detail::{CreateErpSalesOrderDetailRequest, UpdateErpSalesOrderDetailRequest};

#[serde_as]
#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpSalesOrderRequest {
    
    pub customer_id: i64, // 客户ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub order_date: NaiveDateTime, // 订单日期
    
    pub total_amount: i64, // 总金额
    
    pub discount_rate: Option<i64>, // 优惠率（百分比，1000表示10.00%）
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
    pub deposit: Option<i64>, // 定金

    pub remarks: Option<String>, // 备注

    pub details: Vec<CreateErpSalesOrderDetailRequest>, // 销售的产品列表

    pub attachments: Vec<CreateErpSalesOrderAttachmentRequest>, // 销售的附件列表
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpSalesOrderRequest {
    
    pub id: i64, // 订单ID
    
    pub customer_id: Option<i64>, // 客户ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub order_date: Option<NaiveDateTime>, // 订单日期
    
    pub total_amount: Option<i64>, // 总金额
    
    pub discount_rate: Option<i64>, // 优惠率（百分比，1000表示10.00%）
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
    pub deposit: Option<i64>, // 定金

    pub remarks: Option<String>, // 备注

    pub details: Vec<UpdateErpSalesOrderDetailRequest>, // 销售的产品列表

    pub attachments: Vec<UpdateErpSalesOrderAttachmentRequest>, // 销售的附件列表
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}