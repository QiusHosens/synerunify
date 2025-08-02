use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct MallPromotionCombinationActivityResponse {
    
    pub id: i64, // 活动编号
    
    pub name: String, // 拼团名称
    
    pub spu_id: i64, // 商品 SPU ID
    
    pub total_limit_count: i32, // 总限购数量
    
    pub single_limit_count: i32, // 单次限购数量
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub start_time: NaiveDateTime, // 开始时间
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub end_time: NaiveDateTime, // 结束时间
    
    pub user_size: Option<i32>, // 购买人数
    
    pub virtual_group: i32, // 虚拟成团
    
    pub status: i8, // 状态
    
    pub limit_duration: i32, // 限制时长（小时）
    
    pub creator: Option<i64>, // 创建者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间
    
}