
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpOutboundOrderDetailRequest {
    
    pub order_id: i64, // 出库订单ID

    pub sale_detail_id: Option<i64>, // 销售订单详情ID
    
    pub warehouse_id: i64, // 仓库ID
    
    pub product_id: i64, // 产品ID
    
    pub quantity: i32, // 数量
    
    pub unit_price: i64, // 单价
    
    pub subtotal: i64, // 小计
    
    pub tax_rate: Option<i32>, // 税率,精确到万分位
    
    pub remarks: Option<String>, // 备注
    
    pub department_code: String, // 部门编码
    
    pub department_id: i64, // 部门ID
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpOutboundOrderDetailSaleRequest {

    pub sale_detail_id: i64, // 销售订单详情ID
    
    pub warehouse_id: i64, // 仓库ID
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpOutboundOrderDetailOtherRequest {
    
    pub warehouse_id: i64, // 仓库ID
    
    pub product_id: i64, // 产品ID
    
    pub quantity: i32, // 数量
    
    pub unit_price: i64, // 单价
    
    pub subtotal: i64, // 小计
    
    pub tax_rate: Option<i32>, // 税率,精确到万分位
    
    pub remarks: Option<String>, // 备注
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpOutboundOrderDetailRequest {
    
    pub id: i64, // 出库详情ID
    
    pub order_id: Option<i64>, // 出库订单ID

    pub sale_detail_id: Option<i64>, // 销售订单详情ID
    
    pub warehouse_id: Option<i64>, // 仓库ID
    
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