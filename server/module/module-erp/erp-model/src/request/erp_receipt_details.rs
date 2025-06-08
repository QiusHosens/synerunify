
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpReceiptDetailsRequest {
    
    pub receipt_id: i64, // 收款ID
    
    pub sales_order_id: Option<i64>, // 销售订单ID
    
    pub sales_return_id: Option<i64>, // 销售退货ID
    
    pub amount: i64, // 金额
    
    pub description: Option<String>, // 描述
    
    pub department_code: String, // 部门编码
    
    pub department_id: i64, // 部门ID
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpReceiptDetailsRequest {
    
    pub id: i64, // 收款详情ID
    
    pub receipt_id: Option<i64>, // 收款ID
    
    pub sales_order_id: Option<i64>, // 销售订单ID
    
    pub sales_return_id: Option<i64>, // 销售退货ID
    
    pub amount: Option<i64>, // 金额
    
    pub description: Option<String>, // 描述
    
    pub department_code: Option<String>, // 部门编码
    
    pub department_id: Option<i64>, // 部门ID
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}