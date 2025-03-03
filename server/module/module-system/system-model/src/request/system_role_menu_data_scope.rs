
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateSystemRoleMenuDataScopeRequest {
    
    pub role_menu_id: i64, // 角色菜单ID
    
    pub data_scope_rule_id: i64, // 权限规则ID
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateSystemRoleMenuDataScopeRequest {
    
    pub id: i64, // id
    
    pub role_menu_id: Option<i64>, // 角色菜单ID
    
    pub data_scope_rule_id: Option<i64>, // 权限规则ID
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}