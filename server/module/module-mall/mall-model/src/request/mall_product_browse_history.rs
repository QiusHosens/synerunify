


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallProductBrowseHistoryRequest {
    
    pub user_id: i64, // 用户编号
    
    pub spu_id: i64, // 商品 SPU 编号
    
    pub user_deleted: bool, // 用户是否删除
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallProductBrowseHistoryRequest {
    
    pub id: i64, // 记录编号
    
    pub user_id: Option<i64>, // 用户编号
    
    pub spu_id: Option<i64>, // 商品 SPU 编号
    
    pub user_deleted: Option<bool>, // 用户是否删除
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}