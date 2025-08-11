use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct MallPromotionFlashProductResponse {
    
    pub id: i64, // 秒杀参与商品编号
    
    pub activity_id: i64, // 秒杀活动 id
    
    pub config_ids: String, // 秒杀时段 id 数组
    
    pub spu_id: i64, // 商品 spu_id
    
    pub sku_id: i64, // 商品 sku_id
    
    pub flash_price: i32, // 秒杀金额，单位：分
    
    pub stock: i32, // 秒杀库存
    
    pub activity_status: i8, // 秒杀商品状态
    
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