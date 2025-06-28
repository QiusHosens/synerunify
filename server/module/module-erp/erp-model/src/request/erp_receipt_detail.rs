
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpReceiptDetailRequest {
    
    pub sales_order_id: Option<i64>, // 销售订单ID
    
    pub sales_return_id: Option<i64>, // 销售退货ID
    
    pub amount: i64, // 金额
    
    pub remarks: Option<String>, // 描述
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpReceiptDetailRequest {
    
    pub id: Option<i64>, // 收款详情ID
    
    pub sales_order_id: Option<i64>, // 销售订单ID
    
    pub sales_return_id: Option<i64>, // 销售退货ID
    
    pub amount: i64, // 金额
    
    pub remarks: Option<String>, // 描述
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}