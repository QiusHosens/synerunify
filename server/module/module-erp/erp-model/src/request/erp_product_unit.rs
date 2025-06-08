
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpProductUnitRequest {
    
    pub unit_name: String, // 单位名称
    
    pub status: i8, // 状态
    
    pub sort_order: i32, // 排序
    
    pub remarks: Option<String>, // 备注
    
    pub department_code: String, // 部门编码
    
    pub department_id: i64, // 部门ID
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpProductUnitRequest {
    
    pub id: i64, // 单位ID
    
    pub unit_name: Option<String>, // 单位名称
    
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