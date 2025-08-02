use chrono::NaiveDateTime;


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallPromotionCombinationActivityRequest {
    
    pub name: String, // 拼团名称
    
    pub spu_id: i64, // 商品 SPU ID
    
    pub total_limit_count: i32, // 总限购数量
    
    pub single_limit_count: i32, // 单次限购数量
    
    #[schema(value_type = String, format = Date)]
    pub start_time: NaiveDateTime, // 开始时间
    
    #[schema(value_type = String, format = Date)]
    pub end_time: NaiveDateTime, // 结束时间
    
    pub user_size: Option<i32>, // 购买人数
    
    pub virtual_group: i32, // 虚拟成团
    
    pub status: i8, // 状态
    
    pub limit_duration: i32, // 限制时长（小时）
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallPromotionCombinationActivityRequest {
    
    pub id: i64, // 活动编号
    
    pub name: Option<String>, // 拼团名称
    
    pub spu_id: Option<i64>, // 商品 SPU ID
    
    pub total_limit_count: Option<i32>, // 总限购数量
    
    pub single_limit_count: Option<i32>, // 单次限购数量
    
    #[schema(value_type = String, format = Date)]
    pub start_time: Option<NaiveDateTime>, // 开始时间
    
    #[schema(value_type = String, format = Date)]
    pub end_time: Option<NaiveDateTime>, // 结束时间
    
    pub user_size: Option<i32>, // 购买人数
    
    pub virtual_group: Option<i32>, // 虚拟成团
    
    pub status: Option<i8>, // 状态
    
    pub limit_duration: Option<i32>, // 限制时长（小时）
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}