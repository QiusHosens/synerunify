
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpPurchaseOrderDetailRequest {
    
    pub product_id: i64, // 产品ID
    
    pub quantity: i32, // 数量
    
    pub unit_price: i64, // 单价
    
    pub subtotal: i64, // 小计
    
    pub tax_rate: Option<i32>, // 税率,精确到万分位
    
    pub remarks: Option<String>, // 备注
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpPurchaseOrderDetailRequest {
    
    pub id: Option<i64>, // 采购订单详情ID,修改有,新增无

    pub product_id: i64, // 产品ID
    
    pub quantity: i32, // 数量
    
    pub unit_price: i64, // 单价
    
    pub subtotal: i64, // 小计
    
    pub tax_rate: Option<i32>, // 税率,精确到万分位
    
    pub remarks: Option<String>, // 备注
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}