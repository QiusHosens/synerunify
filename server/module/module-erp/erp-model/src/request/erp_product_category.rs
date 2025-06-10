
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpProductCategoryRequest {
    
    pub code: Option<String>, // 分类编码
    
    pub name: String, // 分类名称
    
    pub parent_id: Option<i64>, // 父分类ID
    
    pub status: i8, // 状态
    
    pub sort: i32, // 排序
    
    pub remarks: Option<String>, // 备注
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpProductCategoryRequest {
    
    pub id: i64, // 分类ID
    
    pub code: Option<String>, // 分类编码
    
    pub name: Option<String>, // 分类名称
    
    pub parent_id: Option<i64>, // 父分类ID
    
    pub status: Option<i8>, // 状态
    
    pub sort: Option<i32>, // 排序
    
    pub remarks: Option<String>, // 备注
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}