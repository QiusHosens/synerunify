


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallProductStoreRequest {
    
    pub product_id: i64, // 商品编号
    
    pub store_id: i64, // 店铺编号
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallProductStoreRequest {
    
    pub id: i64, // 编号
    
    pub product_id: Option<i64>, // 商品编号
    
    pub store_id: Option<i64>, // 店铺编号
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}