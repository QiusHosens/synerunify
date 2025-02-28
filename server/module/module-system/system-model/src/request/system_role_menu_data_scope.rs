use serde::{Serialize, Deserialize};
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug)]
pub struct CreateSystemRoleMenuDataScopeRequest {
    
    pub role_menu_id: i64, // 角色菜单ID
    
    pub data_scope_rule_id: i64, // 权限规则ID
    
}

#[derive(Serialize, Deserialize, Debug)]
pub struct UpdateSystemRoleMenuDataScopeRequest {
    
    pub id: i64, // id
    
    pub role_menu_id: i64, // 角色菜单ID
    
    pub data_scope_rule_id: i64, // 权限规则ID
    
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PaginatedKeywordRequest {
    pub page: u64,
    pub size: u64,
    pub keyword: Option<String>,
}