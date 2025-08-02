use chrono::NaiveDateTime;


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallPromotionCombinationProductRequest {
    
    pub activity_id: Option<i64>, // 拼团活动编号
    
    pub spu_id: Option<i64>, // 商品 SPU 编号
    
    pub sku_id: Option<i64>, // 商品 SKU 编号
    
    pub status: i8, // 状态
    
    #[schema(value_type = String, format = Date)]
    pub activity_start_time: NaiveDateTime, // 活动开始时间点
    
    #[schema(value_type = String, format = Date)]
    pub activity_end_time: NaiveDateTime, // 活动结束时间点
    
    pub combination_price: i32, // 拼团价格，单位分
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallPromotionCombinationProductRequest {
    
    pub id: i64, // 编号
    
    pub activity_id: Option<i64>, // 拼团活动编号
    
    pub spu_id: Option<i64>, // 商品 SPU 编号
    
    pub sku_id: Option<i64>, // 商品 SKU 编号
    
    pub status: Option<i8>, // 状态
    
    #[schema(value_type = String, format = Date)]
    pub activity_start_time: Option<NaiveDateTime>, // 活动开始时间点
    
    #[schema(value_type = String, format = Date)]
    pub activity_end_time: Option<NaiveDateTime>, // 活动结束时间点
    
    pub combination_price: Option<i32>, // 拼团价格，单位分
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}