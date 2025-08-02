use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct MallTradeBrokerageUserResponse {
    
    pub id: i64, // 用户编号
    
    pub bind_user_id: Option<i64>, // 推广员编号
    
    #[serde_as(as = "Option<common::formatter::string_date_time::StringDateTime>")]
    #[schema(value_type = String, format = Date)]
    pub bind_user_time: Option<NaiveDateTime>, // 推广员绑定时间
    
    pub brokerage_enabled: bool, // 是否成为推广员
    
    #[serde_as(as = "Option<common::formatter::string_date_time::StringDateTime>")]
    #[schema(value_type = String, format = Date)]
    pub brokerage_time: Option<NaiveDateTime>, // 成为分销员时间
    
    pub brokerage_price: i32, // 可用佣金
    
    pub frozen_price: i32, // 冻结佣金
    
    pub creator: Option<i64>, // 创建者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间
    
}