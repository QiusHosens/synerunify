use serde::{Serialize, Deserialize};
use crate::model::system_user_role::{self, SystemUserRole, SystemUserRoleActiveModel};

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateSystemUserRoleRequest {
    
    pub user_id: i64, // 用户ID
    
    pub role_id: i64, // 角色ID
    
}

impl CreateSystemUserRoleRequest {
    pub fn to_active_model(&self) -> SystemUserRoleActiveModel {
        SystemUserRoleActiveModel {
            user_id: Set(self.user_id.clone()),
            role_id: Set(self.role_id.clone()),
            ..Default::default()
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateSystemUserRoleRequest {
    
    pub id: i64, // id
    
    pub user_id: i64, // 用户ID
    
    pub role_id: i64, // 角色ID
    
}

impl UpdateSystemUserRoleRequest {
    pub fn to_active_model(&self, existing: SystemUserRole) -> SystemUserRoleActiveModel {
        let mut active_model: SystemUserRoleActiveModel = existing.into();
        if let Some(user_id) = &self.user_id {
            active_model.user_id = Set(user_id.clone());
        }
        if let Some(role_id) = &self.role_id {
            active_model.role_id = Set(role_id.clone());
        }
        active_model
    }
}