use chrono::NaiveDateTime;


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallPromotionCombinationRecordRequest {
    
    pub activity_id: Option<i64>, // 拼团活动编号
    
    pub spu_id: Option<i64>, // 商品 SPU 编号
    
    pub pic_url: String, // 商品图片
    
    pub spu_name: String, // 商品名称
    
    pub sku_id: Option<i64>, // 商品 SKU 编号
    
    pub count: Option<i32>, // 购买的商品数量
    
    pub user_id: Option<i64>, // 用户编号
    
    pub nickname: Option<String>, // 用户昵称
    
    pub avatar: Option<String>, // 用户头像
    
    pub head_id: Option<i64>, // 团长编号
    
    pub order_id: Option<i64>, // 订单编号
    
    pub user_size: i32, // 可参团人数
    
    pub user_count: i32, // 已参团人数
    
    pub virtual_group: Option<bool>, // 是否虚拟拼团
    
    pub status: i8, // 参与状态：1进行中 2已完成 3未完成
    
    pub combination_price: i32, // 拼团商品单价，单位分
    
    #[schema(value_type = String, format = Date)]
    pub expire_time: NaiveDateTime, // 过期时间
    
    #[schema(value_type = String, format = Date)]
    pub start_time: Option<NaiveDateTime>, // 开始时间 (订单付款后开始的时间)
    
    #[schema(value_type = String, format = Date)]
    pub end_time: Option<NaiveDateTime>, // 结束时间（成团时间/失败时间）
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallPromotionCombinationRecordRequest {
    
    pub id: i64, // 编号
    
    pub activity_id: Option<i64>, // 拼团活动编号
    
    pub spu_id: Option<i64>, // 商品 SPU 编号
    
    pub pic_url: Option<String>, // 商品图片
    
    pub spu_name: Option<String>, // 商品名称
    
    pub sku_id: Option<i64>, // 商品 SKU 编号
    
    pub count: Option<i32>, // 购买的商品数量
    
    pub user_id: Option<i64>, // 用户编号
    
    pub nickname: Option<String>, // 用户昵称
    
    pub avatar: Option<String>, // 用户头像
    
    pub head_id: Option<i64>, // 团长编号
    
    pub order_id: Option<i64>, // 订单编号
    
    pub user_size: Option<i32>, // 可参团人数
    
    pub user_count: Option<i32>, // 已参团人数
    
    pub virtual_group: Option<bool>, // 是否虚拟拼团
    
    pub status: Option<i8>, // 参与状态：1进行中 2已完成 3未完成
    
    pub combination_price: Option<i32>, // 拼团商品单价，单位分
    
    #[schema(value_type = String, format = Date)]
    pub expire_time: Option<NaiveDateTime>, // 过期时间
    
    #[schema(value_type = String, format = Date)]
    pub start_time: Option<NaiveDateTime>, // 开始时间 (订单付款后开始的时间)
    
    #[schema(value_type = String, format = Date)]
    pub end_time: Option<NaiveDateTime>, // 结束时间（成团时间/失败时间）
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}