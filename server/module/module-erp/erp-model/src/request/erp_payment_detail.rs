
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpPaymentDetailRequest {
    
    pub payment_id: i64, // 付款ID
    
    pub purchase_order_id: Option<i64>, // 采购订单ID
    
    pub purchase_return_id: Option<i64>, // 采购退货ID
    
    pub amount: i64, // 金额
    
    pub description: Option<String>, // 描述
    
    pub department_code: String, // 部门编码
    
    pub department_id: i64, // 部门ID
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpPaymentDetailRequest {
    
    pub id: i64, // 付款详情ID
    
    pub payment_id: Option<i64>, // 付款ID
    
    pub purchase_order_id: Option<i64>, // 采购订单ID
    
    pub purchase_return_id: Option<i64>, // 采购退货ID
    
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