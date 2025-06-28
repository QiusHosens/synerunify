use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use serde_with::serde_as;
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

use crate::request::{erp_payment_attachment::{CreateErpPaymentAttachmentRequest, UpdateErpPaymentAttachmentRequest}, erp_payment_detail::{CreateErpPaymentDetailRequest, UpdateErpPaymentDetailRequest}};

#[serde_as]
#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpPaymentRequest {
    
    pub supplier_id: i64, // 供应商ID
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
    pub amount: i64, // 付款金额
    
    pub discount_amount: Option<i64>, // 优惠金额
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub payment_date: NaiveDateTime, // 付款日期
    
    pub payment_method: Option<String>, // 付款方式 (如 bank_transfer, cash, credit)
    
    pub remarks: Option<String>, // 备注

    pub details: Vec<CreateErpPaymentDetailRequest>, // 付款列表

    pub attachments: Vec<CreateErpPaymentAttachmentRequest>, // 付款附件列表
    
}

#[serde_as]
#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpPaymentRequest {
    
    pub id: i64, // 付款ID
    
    pub supplier_id: Option<i64>, // 供应商ID
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
    pub amount: Option<i64>, // 付款金额
    
    pub discount_amount: Option<i64>, // 优惠金额
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "Option<common::formatter::string_date_time::StringDateTime>")]
    #[schema(value_type = String, format = Date)]
    pub payment_date: Option<NaiveDateTime>, // 付款日期
    
    pub payment_method: Option<String>, // 付款方式 (如 bank_transfer, cash, credit)
    
    pub remarks: Option<String>, // 备注

    pub details: Vec<UpdateErpPaymentDetailRequest>, // 付款列表

    pub attachments: Vec<UpdateErpPaymentAttachmentRequest>, // 付款附件列表
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}