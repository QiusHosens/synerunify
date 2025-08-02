use chrono::NaiveDateTime;


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallPromotionDiscountProductRequest {
    
    pub activity_id: i64, // 活动编号
    
    pub spu_id: i64, // 商品 SPU 编号
    
    pub sku_id: i64, // 商品 SKU 编号
    
    pub discount_type: i32, // 优惠类型     *     * 1-代金卷     * 2-折扣卷
    
    pub discount_percent: Option<i16>, // 折扣百分比
    
    pub discount_price: Option<i32>, // 优惠金额，单位：分
    
    pub activity_status: i8, // 秒杀商品状态
    
    pub activity_name: String, // 活动标题
    
    #[schema(value_type = String, format = Date)]
    pub activity_start_time: NaiveDateTime, // 活动开始时间点
    
    #[schema(value_type = String, format = Date)]
    pub activity_end_time: NaiveDateTime, // 活动结束时间点
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallPromotionDiscountProductRequest {
    
    pub id: i64, // 编号，主键自增
    
    pub activity_id: Option<i64>, // 活动编号
    
    pub spu_id: Option<i64>, // 商品 SPU 编号
    
    pub sku_id: Option<i64>, // 商品 SKU 编号
    
    pub discount_type: Option<i32>, // 优惠类型     *     * 1-代金卷     * 2-折扣卷
    
    pub discount_percent: Option<i16>, // 折扣百分比
    
    pub discount_price: Option<i32>, // 优惠金额，单位：分
    
    pub activity_status: Option<i8>, // 秒杀商品状态
    
    pub activity_name: Option<String>, // 活动标题
    
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