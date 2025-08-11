use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct MallPromotionServingConversationResponse {
    
    pub id: i64, // 编号
    
    pub user_id: i64, // 会话所属用户
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub last_message_time: NaiveDateTime, // 最后聊天时间
    
    pub last_message_content: String, // 最后聊天内容
    
    pub last_message_content_type: i32, // 最后发送的消息类型
    
    pub admin_pinned: bool, // 管理端置顶
    
    pub user_deleted: bool, // 用户是否可见
    
    pub admin_deleted: bool, // 管理员是否可见
    
    pub admin_unread_message_count: i32, // 管理员未读消息数
    
    pub creator: Option<i64>, // 创建者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间
    
}