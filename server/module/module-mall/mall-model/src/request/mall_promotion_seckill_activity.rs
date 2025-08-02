use chrono::NaiveDateTime;


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallPromotionSeckillActivityRequest {
    
    pub spu_id: i64, // 秒杀活动商品
    
    pub name: String, // 秒杀活动名称
    
    pub status: i8, // 活动状态
    
    pub remark: Option<String>, // 备注
    
    #[schema(value_type = String, format = Date)]
    pub start_time: NaiveDateTime, // 活动开始时间
    
    #[schema(value_type = String, format = Date)]
    pub end_time: NaiveDateTime, // 活动结束时间
    
    pub sort: i32, // 排序
    
    pub config_ids: String, // 秒杀时段 id 数组
    
    pub total_limit_count: Option<i32>, // 总限购数量
    
    pub single_limit_count: Option<i32>, // 单次限够数量
    
    pub stock: Option<i32>, // 秒杀库存
    
    pub total_stock: Option<i32>, // 秒杀总库存
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallPromotionSeckillActivityRequest {
    
    pub id: i64, // 秒杀活动编号
    
    pub spu_id: Option<i64>, // 秒杀活动商品
    
    pub name: Option<String>, // 秒杀活动名称
    
    pub status: Option<i8>, // 活动状态
    
    pub remark: Option<String>, // 备注
    
    #[schema(value_type = String, format = Date)]
    pub start_time: Option<NaiveDateTime>, // 活动开始时间
    
    #[schema(value_type = String, format = Date)]
    pub end_time: Option<NaiveDateTime>, // 活动结束时间
    
    pub sort: Option<i32>, // 排序
    
    pub config_ids: Option<String>, // 秒杀时段 id 数组
    
    pub total_limit_count: Option<i32>, // 总限购数量
    
    pub single_limit_count: Option<i32>, // 单次限够数量
    
    pub stock: Option<i32>, // 秒杀库存
    
    pub total_stock: Option<i32>, // 秒杀总库存
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}