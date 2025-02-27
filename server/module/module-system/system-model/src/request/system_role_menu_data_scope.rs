use serde::{Serialize, Deserialize};
use crate::model::system_role_menu_data_scope::{self, SystemRoleMenuDataScope, SystemRoleMenuDataScopeActiveModel};

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateSystemRoleMenuDataScopeRequest {
    
    pub role_menu_id: i64, // 角色菜单ID
    
    pub data_scope_rule_id: i64, // 权限规则ID
    
}

impl CreateSystemRoleMenuDataScopeRequest {
    pub fn to_active_model(&self) -> SystemRoleMenuDataScopeActiveModel {
        SystemRoleMenuDataScopeActiveModel {
            role_menu_id: Set(self.role_menu_id.clone()),
            data_scope_rule_id: Set(self.data_scope_rule_id.clone()),
            ..Default::default()
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateSystemRoleMenuDataScopeRequest {
    
    pub id: i64, // id
    
    pub role_menu_id: i64, // 角色菜单ID
    
    pub data_scope_rule_id: i64, // 权限规则ID
    
}

impl UpdateSystemRoleMenuDataScopeRequest {
    pub fn to_active_model(&self, existing: SystemRoleMenuDataScope) -> SystemRoleMenuDataScopeActiveModel {
        let mut active_model: SystemRoleMenuDataScopeActiveModel = existing.into();
        if let Some(role_menu_id) = &self.role_menu_id {
            active_model.role_menu_id = Set(role_menu_id.clone());
        }
        if let Some(data_scope_rule_id) = &self.data_scope_rule_id {
            active_model.data_scope_rule_id = Set(data_scope_rule_id.clone());
        }
        active_model
    }
}