use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct MallPromotionRewardActivityResponse {
    
    pub id: i64, // 活动编号
    
    pub name: String, // 活动标题
    
    pub status: i8, // 活动状态
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub start_time: NaiveDateTime, // 开始时间
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub end_time: NaiveDateTime, // 结束时间
    
    pub remark: Option<String>, // 备注
    
    pub condition_type: i8, // 条件类型
    
    pub product_scope: i8, // 商品范围
    
    pub product_scope_values: Option<String>, // 商品范围编号的数组
    
    pub rules: Option<String>, // 优惠规则的数组
    
    pub creator: Option<i64>, // 创建者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间
    
}