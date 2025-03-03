
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateSystemDepartmentRequest {
    
    pub code: String, // 部门编码
    
    pub name: String, // 部门名称
    
    pub parent_id: i64, // 父部门id
    
    pub sort: i32, // 显示顺序
    
    pub leader_user_id: Option<i64>, // 负责人
    
    pub phone: Option<String>, // 联系电话
    
    pub email: Option<String>, // 邮箱
    
    pub status: i8, // 部门状态（0正常 1停用）
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateSystemDepartmentRequest {
    
    pub id: i64, // 部门id
    
    pub code: Option<String>, // 部门编码
    
    pub name: Option<String>, // 部门名称
    
    pub parent_id: Option<i64>, // 父部门id
    
    pub sort: Option<i32>, // 显示顺序
    
    pub leader_user_id: Option<i64>, // 负责人
    
    pub phone: Option<String>, // 联系电话
    
    pub email: Option<String>, // 邮箱
    
    pub status: Option<i8>, // 部门状态（0正常 1停用）
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}