use serde::{Serialize, Deserialize};
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug)]
pub struct CreateSystemUserRoleRequest {
    
    pub user_id: i64, // 用户ID
    
    pub role_id: i64, // 角色ID
    
}

#[derive(Serialize, Deserialize, Debug)]
pub struct UpdateSystemUserRoleRequest {
    
    pub id: i64, // id
    
    pub user_id: i64, // 用户ID
    
    pub role_id: i64, // 角色ID
    
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PaginatedKeywordRequest {
    pub page: u64,
    pub size: u64,
    pub keyword: Option<String>,
}