use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct MallTradeOrderLogResponse {
    
    pub id: i64, // 日志主键
    
    pub user_id: i64, // 用户编号
    
    pub user_type: i8, // 用户类型
    
    pub order_id: i64, // 订单号
    
    pub before_status: Option<i8>, // 操作前状态
    
    pub after_status: Option<i8>, // 操作后状态
    
    pub operate_type: i32, // 操作类型
    
    pub content: String, // 操作内容
    
    pub creator: Option<i64>, // 创建者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间
    
}