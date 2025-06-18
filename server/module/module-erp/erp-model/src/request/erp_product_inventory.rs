
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpProductInventoryRequest {
    
    pub product_id: i64, // 产品ID
    
    pub warehouse_id: i64, // 仓库ID
    
    pub stock_quantity: i32, // 库存数量
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct ErpProductInventoryInOutRequest {
    
    pub product_id: i64, // 产品ID
    
    pub warehouse_id: i64, // 仓库ID
    
    pub quantity: i32, // 数量
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpProductInventoryRequest {
    
    pub id: i64, // 产品库存ID
    
    pub product_id: Option<i64>, // 产品ID
    
    pub warehouse_id: Option<i64>, // 仓库ID
    
    pub stock_quantity: Option<i32>, // 库存数量
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}