


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallPromotionArticleCategoryRequest {
    
    pub name: String, // 分类名称
    
    pub pic_url: Option<String>, // 图标地址
    
    pub status: i8, // 状态
    
    pub sort: i32, // 排序
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallPromotionArticleCategoryRequest {
    
    pub id: i64, // 文章分类编号
    
    pub name: Option<String>, // 分类名称
    
    pub pic_url: Option<String>, // 图标地址
    
    pub status: Option<i8>, // 状态
    
    pub sort: Option<i32>, // 排序
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}