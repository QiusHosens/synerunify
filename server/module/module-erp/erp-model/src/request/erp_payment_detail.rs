
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpPaymentDetailRequest {
    
    pub purchase_order_id: Option<i64>, // 采购订单ID
    
    pub purchase_return_id: Option<i64>, // 采购退货ID
    
    pub amount: i64, // 金额
    
    pub remarks: Option<String>, // 描述
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpPaymentDetailRequest {
    
    pub id: Option<i64>, // 付款详情ID,修改有,新增无
    
    pub purchase_order_id: Option<i64>, // 采购订单ID
    
    pub purchase_return_id: Option<i64>, // 采购退货ID
    
    pub amount: i64, // 金额
    
    pub remarks: Option<String>, // 描述
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}