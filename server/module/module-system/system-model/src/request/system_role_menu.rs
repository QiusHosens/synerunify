use serde::{Serialize, Deserialize};
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug)]
pub struct CreateSystemRoleMenuRequest {
    
    pub role_id: i64, // 角色ID
    
    pub menu_id: i64, // 菜单ID
    
}

#[derive(Serialize, Deserialize, Debug)]
pub struct UpdateSystemRoleMenuRequest {
    
    pub id: i64, // id
    
    pub role_id: i64, // 角色ID
    
    pub menu_id: i64, // 菜单ID
    
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PaginatedKeywordRequest {
    pub page: u64,
    pub size: u64,
    pub keyword: Option<String>,
}