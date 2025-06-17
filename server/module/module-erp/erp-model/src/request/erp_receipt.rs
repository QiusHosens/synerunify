use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpReceiptRequest {
    
    pub customer_id: i64, // 客户ID
    
    pub user_id: i64, // 关联用户ID
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
    pub amount: i64, // 收款金额
    
    pub discount_amount: Option<i64>, // 优惠金额
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub receipt_date: NaiveDateTime, // 收款日期
    
    pub payment_method: Option<String>, // 收款方式 (如 bank_transfer, cash, credit)
    
    pub description: Option<String>, // 描述
    
    pub receipt_status: i8, // 状态 (0=pending, 1=completed, 2=cancelled)
    
    pub remarks: Option<String>, // 备注
    
    pub department_code: String, // 部门编码
    
    pub department_id: i64, // 部门ID
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpReceiptRequest {
    
    pub id: i64, // 收款ID
    
    pub customer_id: Option<i64>, // 客户ID
    
    pub user_id: Option<i64>, // 关联用户ID
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
    pub amount: Option<i64>, // 收款金额
    
    pub discount_amount: Option<i64>, // 优惠金额
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub receipt_date: Option<NaiveDateTime>, // 收款日期
    
    pub payment_method: Option<String>, // 收款方式 (如 bank_transfer, cash, credit)
    
    pub description: Option<String>, // 描述
    
    pub receipt_status: Option<i8>, // 状态 (0=pending, 1=completed, 2=cancelled)
    
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