use chrono::NaiveDateTime;


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallPromotionServingConversationRequest {
    
    pub user_id: i64, // 会话所属用户
    
    #[schema(value_type = String, format = Date)]
    pub last_message_time: NaiveDateTime, // 最后聊天时间
    
    pub last_message_content: String, // 最后聊天内容
    
    pub last_message_content_type: i32, // 最后发送的消息类型
    
    pub admin_pinned: bool, // 管理端置顶
    
    pub user_deleted: bool, // 用户是否可见
    
    pub admin_deleted: bool, // 管理员是否可见
    
    pub admin_unread_message_count: i32, // 管理员未读消息数
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallPromotionServingConversationRequest {
    
    pub id: i64, // 编号
    
    pub user_id: Option<i64>, // 会话所属用户
    
    #[schema(value_type = String, format = Date)]
    pub last_message_time: Option<NaiveDateTime>, // 最后聊天时间
    
    pub last_message_content: Option<String>, // 最后聊天内容
    
    pub last_message_content_type: Option<i32>, // 最后发送的消息类型
    
    pub admin_pinned: Option<bool>, // 管理端置顶
    
    pub user_deleted: Option<bool>, // 用户是否可见
    
    pub admin_deleted: Option<bool>, // 管理员是否可见
    
    pub admin_unread_message_count: Option<i32>, // 管理员未读消息数
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}