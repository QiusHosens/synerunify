


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallProductCategoryRequest {
    
    pub parent_id: i64, // 父分类编号
    
    pub name: String, // 分类名称
    
    pub file_id: Option<i64>, // 分类图片ID
    
    pub sort: Option<i32>, // 分类排序
    
    pub status: i8, // 状态
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallProductCategoryRequest {
    
    pub id: i64, // 分类编号
    
    pub parent_id: Option<i64>, // 父分类编号
    
    pub name: Option<String>, // 分类名称
    
    pub file_id: Option<i64>, // 分类图片ID
    
    pub sort: Option<i32>, // 分类排序
    
    pub status: Option<i8>, // 状态
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}