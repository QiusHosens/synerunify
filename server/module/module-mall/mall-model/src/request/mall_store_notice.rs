


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallStoreNoticeRequest {
    
    pub store_id: i64, // 店铺编号
    
    pub title: String, // 公告标题
    
    pub content: String, // 公告内容
    
    pub top: i8, // 是否置顶:0-置顶,1-不置顶
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallStoreNoticeRequest {
    
    pub id: i64, // 公告编号
    
    pub store_id: Option<i64>, // 店铺编号
    
    pub title: Option<String>, // 公告标题
    
    pub content: Option<String>, // 公告内容
    
    pub top: Option<i8>, // 是否置顶:0-置顶,1-不置顶
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}