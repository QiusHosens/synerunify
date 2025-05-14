
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateSystemRoleRequest {
    
    pub r#type: i8, // 角色类型
    
    pub name: String, // 角色名称
    
    pub code: String, // 角色权限字符串
    
    pub status: i8, // 角色状态（0正常 1停用）
    
    pub sort: i32, // 显示顺序
    
    pub data_scope_rule_id: Option<i64>, // 数据权限规则id
    
    pub data_scope_department_ids: Option<String>, // 数据范围(指定部门数组)
    
    pub remark: Option<String>, // 备注
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateSystemRoleRequest {
    
    pub id: i64, // id
    
    pub r#type: Option<i8>, // 角色类型
    
    pub name: Option<String>, // 角色名称
    
    pub code: Option<String>, // 角色权限字符串
    
    pub status: Option<i8>, // 角色状态（0正常 1停用）
    
    pub sort: Option<i32>, // 显示顺序
    
    pub data_scope_rule_id: Option<i64>, // 数据权限规则id
    
    pub data_scope_department_ids: Option<String>, // 数据范围(指定部门数组)
    
    pub remark: Option<String>, // 备注
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}