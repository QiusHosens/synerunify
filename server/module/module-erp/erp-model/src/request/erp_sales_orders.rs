use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpSalesOrdersRequest {
    
    pub order_number: String, // 订单编号
    
    pub customer_id: Option<i64>, // 客户ID
    
    pub user_id: Option<i64>, // 用户ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub order_date: NaiveDateTime, // 订单日期
    
    pub total_amount: i64, // 总金额
    
    pub status: i8, // 订单状态 (0=pending, 1=completed, 2=cancelled)
    
    pub discount_rate: Option<i64>, // 优惠率（百分比，1000表示10.00%）
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
    pub deposit: Option<i64>, // 定金
    
    pub department_code: String, // 部门编码
    
    pub department_id: i64, // 部门ID
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpSalesOrdersRequest {
    
    pub id: i64, // 订单ID
    
    pub order_number: Option<String>, // 订单编号
    
    pub customer_id: Option<i64>, // 客户ID
    
    pub user_id: Option<i64>, // 用户ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub order_date: Option<NaiveDateTime>, // 订单日期
    
    pub total_amount: Option<i64>, // 总金额
    
    pub status: Option<i8>, // 订单状态 (0=pending, 1=completed, 2=cancelled)
    
    pub discount_rate: Option<i64>, // 优惠率（百分比，1000表示10.00%）
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
    pub deposit: Option<i64>, // 定金
    
    pub department_code: Option<String>, // 部门编码
    
    pub department_id: Option<i64>, // 部门ID
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}