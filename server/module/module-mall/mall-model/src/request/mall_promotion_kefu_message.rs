


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallPromotionKefuMessageRequest {
    
    pub conversation_id: i64, // 会话编号
    
    pub sender_id: i64, // 发送人编号
    
    pub sender_type: i32, // 发送人类型
    
    pub receiver_id: Option<i64>, // 接收人编号
    
    pub receiver_type: Option<i32>, // 接收人类型
    
    pub content_type: i32, // 消息类型
    
    pub content: String, // 消息
    
    pub read_status: bool, // 是否已读
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallPromotionKefuMessageRequest {
    
    pub id: i64, // 编号
    
    pub conversation_id: Option<i64>, // 会话编号
    
    pub sender_id: Option<i64>, // 发送人编号
    
    pub sender_type: Option<i32>, // 发送人类型
    
    pub receiver_id: Option<i64>, // 接收人编号
    
    pub receiver_type: Option<i32>, // 接收人类型
    
    pub content_type: Option<i32>, // 消息类型
    
    pub content: Option<String>, // 消息
    
    pub read_status: Option<bool>, // 是否已读
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}