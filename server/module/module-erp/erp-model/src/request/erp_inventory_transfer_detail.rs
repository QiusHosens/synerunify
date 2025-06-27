
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpInventoryTransferDetailRequest {
    
    pub order_id: i64, // 调拨订单ID
    
    pub from_warehouse_id: i64, // 调出仓库ID
    
    pub to_warehouse_id: i64, // 调入仓库ID
    
    pub product_id: i64, // 产品ID
    
    pub quantity: i32, // 调拨数量
    
    pub remarks: Option<String>, // 备注
    
    pub department_code: String, // 部门编码
    
    pub department_id: i64, // 部门ID
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpInventoryTransferDetailRequest {
    
    pub id: i64, // ID
    
    pub order_id: Option<i64>, // 调拨订单ID
    
    pub from_warehouse_id: Option<i64>, // 调出仓库ID
    
    pub to_warehouse_id: Option<i64>, // 调入仓库ID
    
    pub product_id: Option<i64>, // 产品ID
    
    pub quantity: Option<i32>, // 调拨数量
    
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