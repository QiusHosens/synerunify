use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpSalesReturnsRequest {
    
    pub sales_order_id: Option<i64>, // 销售订单ID
    
    pub customer_id: Option<i64>, // 客户ID
    
    pub warehouse_id: Option<i64>, // 仓库ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub return_date: NaiveDateTime, // 退货日期
    
    pub total_amount: i64, // 退货总金额
    
    pub status: i8, // 状态 (0=pending, 1=completed, 2=cancelled)
    
    pub remarks: Option<String>, // 备注
    
    pub department_code: String, // 部门编码
    
    pub department_id: i64, // 部门ID
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpSalesReturnsRequest {
    
    pub id: i64, // 退货ID
    
    pub sales_order_id: Option<i64>, // 销售订单ID
    
    pub customer_id: Option<i64>, // 客户ID
    
    pub warehouse_id: Option<i64>, // 仓库ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub return_date: Option<NaiveDateTime>, // 退货日期
    
    pub total_amount: Option<i64>, // 退货总金额
    
    pub status: Option<i8>, // 状态 (0=pending, 1=completed, 2=cancelled)
    
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