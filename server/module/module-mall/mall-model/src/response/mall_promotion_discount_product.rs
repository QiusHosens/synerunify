use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct MallPromotionDiscountProductResponse {
    
    pub id: i64, // 编号，主键自增
    
    pub activity_id: i64, // 活动编号
    
    pub spu_id: i64, // 商品 SPU 编号
    
    pub sku_id: i64, // 商品 SKU 编号
    
    pub discount_type: i32, // 优惠类型     *     * 1-代金卷     * 2-折扣卷
    
    pub discount_percent: Option<i16>, // 折扣百分比
    
    pub discount_price: Option<i32>, // 优惠金额，单位：分
    
    pub activity_status: i8, // 秒杀商品状态
    
    pub activity_name: String, // 活动标题
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub activity_start_time: NaiveDateTime, // 活动开始时间点
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub activity_end_time: NaiveDateTime, // 活动结束时间点
    
    pub creator: Option<i64>, // 创建者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间
    
}