


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallPromotionBannerRequest {
    
    pub title: String, // Banner 标题
    
    pub pic_url: String, // 图片 URL
    
    pub url: String, // 跳转地址
    
    pub status: i8, // 状态
    
    pub sort: Option<i32>, // 排序
    
    pub position: i8, // 位置
    
    pub memo: Option<String>, // 描述
    
    pub browse_count: Option<i32>, // Banner 点击次数
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallPromotionBannerRequest {
    
    pub id: i64, // Banner 编号
    
    pub title: Option<String>, // Banner 标题
    
    pub pic_url: Option<String>, // 图片 URL
    
    pub url: Option<String>, // 跳转地址
    
    pub status: Option<i8>, // 状态
    
    pub sort: Option<i32>, // 排序
    
    pub position: Option<i8>, // 位置
    
    pub memo: Option<String>, // 描述
    
    pub browse_count: Option<i32>, // Banner 点击次数
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}