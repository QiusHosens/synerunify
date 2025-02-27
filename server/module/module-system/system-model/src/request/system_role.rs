use serde::{Serialize, Deserialize};
use crate::model::system_role::{self, SystemRole, SystemRoleActiveModel};

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateSystemRoleRequest {
    
    pub r#type: i8, // 角色类型
    
    pub name: String, // 角色名称
    
    pub code: String, // 角色权限字符串
    
    pub status: i8, // 角色状态（0正常 1停用）
    
    pub sort: i32, // 显示顺序
    
    pub data_scope_rule_id: i64, // 数据权限规则id
    
    pub data_scope_department_ids: String, // 数据范围(指定部门数组)
    
    pub remark: Option<String>, // 备注
    
}

impl CreateSystemRoleRequest {
    pub fn to_active_model(&self) -> SystemRoleActiveModel {
        SystemRoleActiveModel {
            r#type: Set(self.r#type.clone()),
            name: Set(self.name.clone()),
            code: Set(self.code.clone()),
            status: Set(self.status.clone()),
            sort: Set(self.sort.clone()),
            data_scope_rule_id: Set(self.data_scope_rule_id.clone()),
            data_scope_department_ids: Set(self.data_scope_department_ids.clone()),
            remark: Set(self.remark.clone()),
            ..Default::default()
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateSystemRoleRequest {
    
    pub id: i64, // 角色ID
    
    pub r#type: i8, // 角色类型
    
    pub name: String, // 角色名称
    
    pub code: String, // 角色权限字符串
    
    pub status: i8, // 角色状态（0正常 1停用）
    
    pub sort: i32, // 显示顺序
    
    pub data_scope_rule_id: i64, // 数据权限规则id
    
    pub data_scope_department_ids: String, // 数据范围(指定部门数组)
    
    pub remark: Option<String>, // 备注
    
}

impl UpdateSystemRoleRequest {
    pub fn to_active_model(&self, existing: SystemRole) -> SystemRoleActiveModel {
        let mut active_model: SystemRoleActiveModel = existing.into();
        if let Some(r#type) = &self.r#type {
            active_model.r#type = Set(r#type.clone());
        }
        if let Some(name) = &self.name {
            active_model.name = Set(name.clone());
        }
        if let Some(code) = &self.code {
            active_model.code = Set(code.clone());
        }
        if let Some(status) = &self.status {
            active_model.status = Set(status.clone());
        }
        if let Some(sort) = &self.sort {
            active_model.sort = Set(sort.clone());
        }
        if let Some(data_scope_rule_id) = &self.data_scope_rule_id {
            active_model.data_scope_rule_id = Set(data_scope_rule_id.clone());
        }
        if let Some(data_scope_department_ids) = &self.data_scope_department_ids {
            active_model.data_scope_department_ids = Set(data_scope_department_ids.clone());
        }
        if let Some(remark) = &self.remark {
            active_model.remark = Set(remark.clone());
        }
        active_model
    }
}