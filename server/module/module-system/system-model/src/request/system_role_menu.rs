use serde::{Serialize, Deserialize};
use crate::model::system_role_menu::{self, SystemRoleMenu, SystemRoleMenuActiveModel};

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateSystemRoleMenuRequest {
    
    pub role_id: i64, // 角色ID
    
    pub menu_id: i64, // 菜单ID
    
}

impl CreateSystemRoleMenuRequest {
    pub fn to_active_model(&self) -> SystemRoleMenuActiveModel {
        SystemRoleMenuActiveModel {
            role_id: Set(self.role_id.clone()),
            menu_id: Set(self.menu_id.clone()),
            ..Default::default()
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateSystemRoleMenuRequest {
    
    pub id: i64, // id
    
    pub role_id: i64, // 角色ID
    
    pub menu_id: i64, // 菜单ID
    
}

impl UpdateSystemRoleMenuRequest {
    pub fn to_active_model(&self, existing: SystemRoleMenu) -> SystemRoleMenuActiveModel {
        let mut active_model: SystemRoleMenuActiveModel = existing.into();
        if let Some(role_id) = &self.role_id {
            active_model.role_id = Set(role_id.clone());
        }
        if let Some(menu_id) = &self.menu_id {
            active_model.menu_id = Set(menu_id.clone());
        }
        active_model
    }
}