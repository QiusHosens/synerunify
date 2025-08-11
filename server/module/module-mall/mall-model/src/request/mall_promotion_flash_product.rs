use chrono::NaiveDateTime;


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallPromotionFlashProductRequest {
    
    pub activity_id: i64, // 秒杀活动 id
    
    pub config_ids: String, // 秒杀时段 id 数组
    
    pub spu_id: i64, // 商品 spu_id
    
    pub sku_id: i64, // 商品 sku_id
    
    pub flash_price: i32, // 秒杀金额，单位：分
    
    pub stock: i32, // 秒杀库存
    
    pub activity_status: i8, // 秒杀商品状态
    
    #[schema(value_type = String, format = Date)]
    pub activity_start_time: NaiveDateTime, // 活动开始时间点
    
    #[schema(value_type = String, format = Date)]
    pub activity_end_time: NaiveDateTime, // 活动结束时间点
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallPromotionFlashProductRequest {
    
    pub id: i64, // 秒杀参与商品编号
    
    pub activity_id: Option<i64>, // 秒杀活动 id
    
    pub config_ids: Option<String>, // 秒杀时段 id 数组
    
    pub spu_id: Option<i64>, // 商品 spu_id
    
    pub sku_id: Option<i64>, // 商品 sku_id
    
    pub flash_price: Option<i32>, // 秒杀金额，单位：分
    
    pub stock: Option<i32>, // 秒杀库存
    
    pub activity_status: Option<i8>, // 秒杀商品状态
    
    #[schema(value_type = String, format = Date)]
    pub activity_start_time: Option<NaiveDateTime>, // 活动开始时间点
    
    #[schema(value_type = String, format = Date)]
    pub activity_end_time: Option<NaiveDateTime>, // 活动结束时间点
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}