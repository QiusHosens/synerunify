
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpSalesOrderDetailRequest {
    
    pub order_id: Option<i64>, // 订单ID
    
    pub product_id: Option<i64>, // 产品ID
    
    pub quantity: i32, // 数量
    
    pub unit_price: i64, // 单价
    
    pub subtotal: i64, // 小计
    
    pub tax_rate: Option<i32>, // 税率,精确到万分位
    
    pub remarks: Option<String>, // 备注
    
    pub department_code: String, // 部门编码
    
    pub department_id: i64, // 部门ID
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpSalesOrderDetailRequest {
    
    pub id: i64, // 订单详情ID
    
    pub order_id: Option<i64>, // 订单ID
    
    pub product_id: Option<i64>, // 产品ID
    
    pub quantity: Option<i32>, // 数量
    
    pub unit_price: Option<i64>, // 单价
    
    pub subtotal: Option<i64>, // 小计
    
    pub tax_rate: Option<i32>, // 税率,精确到万分位
    
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