


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallPromotionArticleRequest {
    
    pub category_id: i64, // 分类编号
    
    pub spu_id: i64, // 关联商品编号
    
    pub title: String, // 文章标题
    
    pub author: Option<String>, // 文章作者
    
    pub pic_url: String, // 文章封面图片地址
    
    pub introduction: Option<String>, // 文章简介
    
    pub browse_count: Option<String>, // 浏览次数
    
    pub sort: i32, // 排序
    
    pub status: i8, // 状态
    
    pub recommend_hot: bool, // 是否热门(小程序)
    
    pub recommend_banner: bool, // 是否轮播图(小程序)
    
    pub content: String, // 文章内容
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallPromotionArticleRequest {
    
    pub id: i64, // 文章管理编号
    
    pub category_id: Option<i64>, // 分类编号
    
    pub spu_id: Option<i64>, // 关联商品编号
    
    pub title: Option<String>, // 文章标题
    
    pub author: Option<String>, // 文章作者
    
    pub pic_url: Option<String>, // 文章封面图片地址
    
    pub introduction: Option<String>, // 文章简介
    
    pub browse_count: Option<String>, // 浏览次数
    
    pub sort: Option<i32>, // 排序
    
    pub status: Option<i8>, // 状态
    
    pub recommend_hot: Option<bool>, // 是否热门(小程序)
    
    pub recommend_banner: Option<bool>, // 是否轮播图(小程序)
    
    pub content: Option<String>, // 文章内容
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}