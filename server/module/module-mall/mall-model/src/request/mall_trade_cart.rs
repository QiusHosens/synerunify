


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallTradeCartRequest {
    
    pub user_id: i64, // 用户编号
    
    pub spu_id: i64, // 商品 SPU 编号
    
    pub sku_id: i64, // 商品 SKU 编号
    
    pub count: i32, // 商品购买数量
    
    pub selected: bool, // 是否选中
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallTradeCartRequest {
    
    pub id: i64, // 编号，唯一自增。
    
    pub user_id: Option<i64>, // 用户编号
    
    pub spu_id: Option<i64>, // 商品 SPU 编号
    
    pub sku_id: Option<i64>, // 商品 SKU 编号
    
    pub count: Option<i32>, // 商品购买数量
    
    pub selected: Option<bool>, // 是否选中
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}