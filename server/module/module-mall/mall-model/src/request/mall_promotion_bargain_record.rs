use chrono::NaiveDateTime;


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallPromotionBargainRecordRequest {
    
    pub activity_id: i64, // 砍价活动名称
    
    pub user_id: i64, // 用户编号
    
    pub spu_id: i64, // 商品 SPU 编号
    
    pub sku_id: i64, // 商品 SKU 编号
    
    pub bargain_first_price: i32, // 砍价起始价格，单位：分
    
    pub bargain_price: i32, // 当前砍价，单位：分
    
    pub status: i8, // 状态
    
    pub order_id: Option<i64>, // 订单编号
    
    #[schema(value_type = String, format = Date)]
    pub end_time: NaiveDateTime, // 结束时间
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallPromotionBargainRecordRequest {
    
    pub id: i64, // 砍价记录编号
    
    pub activity_id: Option<i64>, // 砍价活动名称
    
    pub user_id: Option<i64>, // 用户编号
    
    pub spu_id: Option<i64>, // 商品 SPU 编号
    
    pub sku_id: Option<i64>, // 商品 SKU 编号
    
    pub bargain_first_price: Option<i32>, // 砍价起始价格，单位：分
    
    pub bargain_price: Option<i32>, // 当前砍价，单位：分
    
    pub status: Option<i8>, // 状态
    
    pub order_id: Option<i64>, // 订单编号
    
    #[schema(value_type = String, format = Date)]
    pub end_time: Option<NaiveDateTime>, // 结束时间
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}