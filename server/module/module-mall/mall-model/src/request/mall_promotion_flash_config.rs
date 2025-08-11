


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallPromotionFlashConfigRequest {
    
    pub name: String, // 秒杀时段名称
    
    pub start_time: String, // 开始时间点
    
    pub end_time: String, // 结束时间点
    
    pub slider_file_ids: String, // 秒杀主图
    
    pub status: i8, // 活动状态
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallPromotionFlashConfigRequest {
    
    pub id: i64, // 编号
    
    pub name: Option<String>, // 秒杀时段名称
    
    pub start_time: Option<String>, // 开始时间点
    
    pub end_time: Option<String>, // 结束时间点
    
    pub slider_file_ids: Option<String>, // 秒杀主图
    
    pub status: Option<i8>, // 活动状态
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}