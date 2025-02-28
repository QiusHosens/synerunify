use serde::{Serialize, Deserialize};
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug)]
pub struct CreateSystemNoticeRequest {
    
    pub title: String, // 公告标题
    
    pub content: String, // 公告内容
    
    pub r#type: i8, // 公告类型（1通知 2公告）
    
    pub status: i8, // 公告状态（0正常 1关闭）
    
}

#[derive(Serialize, Deserialize, Debug)]
pub struct UpdateSystemNoticeRequest {
    
    pub id: i64, // 公告ID
    
    pub title: Option<String>, // 公告标题
    
    pub content: Option<String>, // 公告内容
    
    pub r#type: Option<i8>, // 公告类型（1通知 2公告）
    
    pub status: Option<i8>, // 公告状态（0正常 1关闭）
    
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}