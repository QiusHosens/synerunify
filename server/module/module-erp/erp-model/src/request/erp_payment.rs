use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpPaymentRequest {
    
    pub supplier_id: i64, // 供应商ID
    
    pub user_id: i64, // 关联用户ID
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
    pub amount: i64, // 付款金额
    
    pub discount_amount: Option<i64>, // 优惠金额
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub payment_date: NaiveDateTime, // 付款日期
    
    pub payment_method: Option<String>, // 付款方式 (如 bank_transfer, cash, credit)
    
    pub description: Option<String>, // 描述
    
    pub payment_status: i8, // 状态 (0=pending, 1=completed, 2=cancelled)
    
    pub remarks: Option<String>, // 备注
    
    pub department_code: String, // 部门编码
    
    pub department_id: i64, // 部门ID
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpPaymentRequest {
    
    pub id: i64, // 付款ID
    
    pub supplier_id: Option<i64>, // 供应商ID
    
    pub user_id: Option<i64>, // 关联用户ID
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
    pub amount: Option<i64>, // 付款金额
    
    pub discount_amount: Option<i64>, // 优惠金额
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub payment_date: Option<NaiveDateTime>, // 付款日期
    
    pub payment_method: Option<String>, // 付款方式 (如 bank_transfer, cash, credit)
    
    pub description: Option<String>, // 描述
    
    pub payment_status: Option<i8>, // 状态 (0=pending, 1=completed, 2=cancelled)
    
    pub remarks: Option<String>, // 备注
    
    pub department_code: Option<String>, // 部门编码
    
    pub department_id: Option<i64>, // 部门ID
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}