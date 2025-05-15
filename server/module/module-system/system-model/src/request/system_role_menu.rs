
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateSystemRoleMenuRequest {
    
    pub role_id: i64, // 角色ID
    
    pub menu_id_list: Vec<i64>, // 菜单ID列表
    
}