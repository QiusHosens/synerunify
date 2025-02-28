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
    
    pub user_id: Option<i64>, // 用户ID
    
    pub role_id: Option<i64>, // 角色ID
    
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}