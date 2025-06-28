use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use serde_with::serde_as;
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

use crate::request::{erp_receipt_attachment::{CreateErpReceiptAttachmentRequest, UpdateErpReceiptAttachmentRequest}, erp_receipt_detail::{CreateErpReceiptDetailRequest, UpdateErpReceiptDetailRequest}};

#[serde_as]
#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpReceiptRequest {
    
    pub customer_id: i64, // 客户ID
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
    pub amount: i64, // 收款金额
    
    pub discount_amount: Option<i64>, // 优惠金额
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub receipt_date: NaiveDateTime, // 收款日期
    
    pub payment_method: Option<String>, // 收款方式 (如 bank_transfer, cash, credit)
    
    pub remarks: Option<String>, // 备注

    pub details: Vec<CreateErpReceiptDetailRequest>, // 收款列表

    pub attachments: Vec<CreateErpReceiptAttachmentRequest>, // 收款附件列表
    
}

#[serde_as]
#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpReceiptRequest {
    
    pub id: i64, // 收款ID
    
    pub customer_id: Option<i64>, // 客户ID
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
    pub amount: Option<i64>, // 收款金额
    
    pub discount_amount: Option<i64>, // 优惠金额
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "Option<common::formatter::string_date_time::StringDateTime>")]
    #[schema(value_type = String, format = Date)]
    pub receipt_date: Option<NaiveDateTime>, // 收款日期
    
    pub payment_method: Option<String>, // 收款方式 (如 bank_transfer, cash, credit)
    
    pub remarks: Option<String>, // 备注

    pub details: Vec<UpdateErpReceiptDetailRequest>, // 收款列表

    pub attachments: Vec<UpdateErpReceiptAttachmentRequest>, // 收款附件列表
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}