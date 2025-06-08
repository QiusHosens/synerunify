
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpProductCategoryRequest {
    
    pub category_code: Option<String>, // 分类编码
    
    pub category_name: String, // 分类名称
    
    pub parent_id: Option<i64>, // 父分类ID
    
    pub status: i8, // 状态
    
    pub sort_order: i32, // 排序
    
    pub remarks: Option<String>, // 备注
    
    pub department_code: String, // 部门编码
    
    pub department_id: i64, // 部门ID
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpProductCategoryRequest {
    
    pub id: i64, // 分类ID
    
    pub category_code: Option<String>, // 分类编码
    
    pub category_name: Option<String>, // 分类名称
    
    pub parent_id: Option<i64>, // 父分类ID
    
    pub status: Option<i8>, // 状态
    
    pub sort_order: Option<i32>, // 排序
    
    pub remarks: Option<String>, // 备注
    
    pub department_code: Option<String>, // 部门编码
    
    pub department_id: Option<i64>, // 部门ID
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}