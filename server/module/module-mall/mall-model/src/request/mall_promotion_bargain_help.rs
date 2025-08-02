


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallPromotionBargainHelpRequest {
    
    pub user_id: i64, // 用户编号
    
    pub activity_id: i64, // 砍价活动名称
    
    pub record_id: i64, // 砍价记录编号
    
    pub reduce_price: i32, // 减少砍价，单位：分
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallPromotionBargainHelpRequest {
    
    pub id: i64, // 砍价助力编号
    
    pub user_id: Option<i64>, // 用户编号
    
    pub activity_id: Option<i64>, // 砍价活动名称
    
    pub record_id: Option<i64>, // 砍价记录编号
    
    pub reduce_price: Option<i32>, // 减少砍价，单位：分
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}