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
    
    pub role_id: Option<i64>, // 角色ID
    
    pub menu_id: Option<i64>, // 菜单ID
    
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}