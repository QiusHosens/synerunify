
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpInventoryTransferDetailRequest {
    
    pub from_warehouse_id: i64, // 调出仓库ID
    
    pub to_warehouse_id: i64, // 调入仓库ID
    
    pub product_id: i64, // 产品ID
    
    pub quantity: i32, // 调拨数量
    
    pub remarks: Option<String>, // 备注
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpInventoryTransferDetailRequest {
    
    pub id: Option<i64>, // ID,修改有,新增无
    
    pub from_warehouse_id: i64, // 调出仓库ID
    
    pub to_warehouse_id: i64, // 调入仓库ID
    
    pub product_id: i64, // 产品ID
    
    pub quantity: i32, // 调拨数量
    
    pub remarks: Option<String>, // 备注
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}