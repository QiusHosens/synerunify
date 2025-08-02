use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct MallPromotionCombinationProductResponse {
    
    pub id: i64, // 编号
    
    pub activity_id: Option<i64>, // 拼团活动编号
    
    pub spu_id: Option<i64>, // 商品 SPU 编号
    
    pub sku_id: Option<i64>, // 商品 SKU 编号
    
    pub status: i8, // 状态
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub activity_start_time: NaiveDateTime, // 活动开始时间点
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub activity_end_time: NaiveDateTime, // 活动结束时间点
    
    pub combination_price: i32, // 拼团价格，单位分
    
    pub creator: Option<i64>, // 创建者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间
    
}