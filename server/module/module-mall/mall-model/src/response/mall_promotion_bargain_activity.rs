use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct MallPromotionBargainActivityResponse {
    
    pub id: i64, // 砍价活动编号
    
    pub name: String, // 砍价活动名称
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub start_time: NaiveDateTime, // 活动开始时间
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub end_time: NaiveDateTime, // 活动结束时间
    
    pub status: i8, // 状态
    
    pub spu_id: i64, // 商品 SPU 编号
    
    pub sku_id: i64, // 商品 SKU 编号
    
    pub bargain_first_price: i32, // 砍价起始价格，单位分
    
    pub bargain_min_price: i32, // 砍价底价，单位：分
    
    pub stock: i32, // 砍价库存
    
    pub total_stock: i32, // 砍价总库存
    
    pub help_max_count: i32, // 砍价人数
    
    pub bargain_count: i32, // 最大帮砍次数
    
    pub total_limit_count: i32, // 总限购数量
    
    pub random_min_price: i32, // 用户每次砍价的最小金额，单位：分
    
    pub random_max_price: i32, // 用户每次砍价的最大金额，单位：分
    
    pub creator: Option<i64>, // 创建者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间
    
}