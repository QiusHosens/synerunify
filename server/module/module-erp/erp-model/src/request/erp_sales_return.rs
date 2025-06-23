use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpSalesReturnRequest {
    
    pub order_number: i64, // 订单编号
    
    pub sales_order_id: i64, // 销售订单ID
    
    pub customer_id: i64, // 客户ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub return_date: NaiveDateTime, // 退货日期
    
    pub total_amount: i64, // 总金额
    
    pub order_status: i8, // 订单状态
    
    pub discount_rate: Option<i64>, // 优惠率（百分比，1000表示10.00%）
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
    pub deposit: Option<i64>, // 定金
    
    pub remarks: Option<String>, // 备注
    
    pub department_code: String, // 部门编码
    
    pub department_id: i64, // 部门ID
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpSalesReturnRequest {
    
    pub id: i64, // 退货ID
    
    pub order_number: Option<i64>, // 订单编号
    
    pub sales_order_id: Option<i64>, // 销售订单ID
    
    pub customer_id: Option<i64>, // 客户ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub return_date: Option<NaiveDateTime>, // 退货日期
    
    pub total_amount: Option<i64>, // 总金额
    
    pub order_status: Option<i8>, // 订单状态
    
    pub discount_rate: Option<i64>, // 优惠率（百分比，1000表示10.00%）
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
    pub deposit: Option<i64>, // 定金
    
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