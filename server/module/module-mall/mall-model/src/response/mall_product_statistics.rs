use chrono::NaiveDateTime;
use chrono::NaiveDate;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct MallProductStatisticsResponse {
    
    pub id: i64, // 编号，主键自增
    
    #[serde_as(as = "common::formatter::string_date_time::StringDate")]
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
    
    pub creator: Option<i64>, // 创建者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间
    
}