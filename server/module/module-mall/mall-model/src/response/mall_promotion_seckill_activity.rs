use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct MallPromotionSeckillActivityResponse {
    
    pub id: i64, // 秒杀活动编号
    
    pub spu_id: i64, // 秒杀活动商品
    
    pub name: String, // 秒杀活动名称
    
    pub status: i8, // 活动状态
    
    pub remark: Option<String>, // 备注
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub start_time: NaiveDateTime, // 活动开始时间
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub end_time: NaiveDateTime, // 活动结束时间
    
    pub sort: i32, // 排序
    
    pub config_ids: String, // 秒杀时段 id 数组
    
    pub total_limit_count: Option<i32>, // 总限购数量
    
    pub single_limit_count: Option<i32>, // 单次限够数量
    
    pub stock: Option<i32>, // 秒杀库存
    
    pub total_stock: Option<i32>, // 秒杀总库存
    
    pub creator: Option<i64>, // 创建者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间
    
}