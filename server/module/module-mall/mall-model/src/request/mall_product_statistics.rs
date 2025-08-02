
use chrono::NaiveDate;

use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallProductStatisticsRequest {
    
    #[schema(value_type = String, format = Date)]
    pub time: NaiveDate, // 统计日期
    
    pub spu_id: i64, // 商品 SPU 编号
    
    pub browse_count: i32, // 浏览量
    
    pub browse_user_count: i32, // 访客量
    
    pub favorite_count: i32, // 收藏数量
    
    pub cart_count: i32, // 加购数量
    
    pub order_count: i32, // 下单件数
    
    pub order_pay_count: i32, // 支付件数
    
    pub order_pay_price: i32, // 支付金额，单位：分
    
    pub after_sale_count: i32, // 退款件数
    
    pub after_sale_refund_price: i32, // 退款金额，单位：分
    
    pub browse_convert_percent: i32, // 访客支付转化率（百分比）
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallProductStatisticsRequest {
    
    pub id: i64, // 编号，主键自增
    
    #[schema(value_type = String, format = Date)]
    pub time: Option<NaiveDate>, // 统计日期
    
    pub spu_id: Option<i64>, // 商品 SPU 编号
    
    pub browse_count: Option<i32>, // 浏览量
    
    pub browse_user_count: Option<i32>, // 访客量
    
    pub favorite_count: Option<i32>, // 收藏数量
    
    pub cart_count: Option<i32>, // 加购数量
    
    pub order_count: Option<i32>, // 下单件数
    
    pub order_pay_count: Option<i32>, // 支付件数
    
    pub order_pay_price: Option<i32>, // 支付金额，单位：分
    
    pub after_sale_count: Option<i32>, // 退款件数
    
    pub after_sale_refund_price: Option<i32>, // 退款金额，单位：分
    
    pub browse_convert_percent: Option<i32>, // 访客支付转化率（百分比）
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}