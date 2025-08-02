use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct MallPromotionKefuMessageResponse {
    
    pub id: i64, // 编号
    
    pub conversation_id: i64, // 会话编号
    
    pub sender_id: i64, // 发送人编号
    
    pub sender_type: i32, // 发送人类型
    
    pub receiver_id: Option<i64>, // 接收人编号
    
    pub receiver_type: Option<i32>, // 接收人类型
    
    pub content_type: i32, // 消息类型
    
    pub content: String, // 消息
    
    pub read_status: bool, // 是否已读
    
    pub creator: Option<i64>, // 创建者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间
    
}