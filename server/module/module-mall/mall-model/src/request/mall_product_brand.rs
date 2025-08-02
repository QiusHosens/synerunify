


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallProductBrandRequest {
    
    pub name: String, // 品牌名称
    
    pub pic_url: String, // 品牌图片
    
    pub sort: Option<i32>, // 品牌排序
    
    pub description: Option<String>, // 品牌描述
    
    pub status: i8, // 状态
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallProductBrandRequest {
    
    pub id: i64, // 品牌编号
    
    pub name: Option<String>, // 品牌名称
    
    pub pic_url: Option<String>, // 品牌图片
    
    pub sort: Option<i32>, // 品牌排序
    
    pub description: Option<String>, // 品牌描述
    
    pub status: Option<i8>, // 状态
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}