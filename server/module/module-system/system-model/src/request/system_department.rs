use serde::{Serialize, Deserialize};
use crate::model::system_department::{self, SystemDepartment, SystemDepartmentActiveModel};

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateSystemDepartmentRequest {
    
    pub code: String, // 部门编码
    
    pub name: String, // 部门名称
    
    pub parent_id: i64, // 父部门id
    
    pub sort: i32, // 显示顺序
    
    pub leader_user_id: Option<i64>, // 负责人
    
    pub phone: Option<String>, // 联系电话
    
    pub email: Option<String>, // 邮箱
    
    pub status: i8, // 部门状态（0正常 1停用）
    
}

impl CreateSystemDepartmentRequest {
    pub fn to_active_model(&self) -> SystemDepartmentActiveModel {
        SystemDepartmentActiveModel {
            code: Set(self.code.clone()),
            name: Set(self.name.clone()),
            parent_id: Set(self.parent_id.clone()),
            sort: Set(self.sort.clone()),
            leader_user_id: Set(self.leader_user_id.clone()),
            phone: Set(self.phone.clone()),
            email: Set(self.email.clone()),
            status: Set(self.status.clone()),
            ..Default::default()
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateSystemDepartmentRequest {
    
    pub id: i64, // 部门id
    
    pub code: String, // 部门编码
    
    pub name: String, // 部门名称
    
    pub parent_id: i64, // 父部门id
    
    pub sort: i32, // 显示顺序
    
    pub leader_user_id: Option<i64>, // 负责人
    
    pub phone: Option<String>, // 联系电话
    
    pub email: Option<String>, // 邮箱
    
    pub status: i8, // 部门状态（0正常 1停用）
    
}

impl UpdateSystemDepartmentRequest {
    pub fn to_active_model(&self, existing: SystemDepartment) -> SystemDepartmentActiveModel {
        let mut active_model: SystemDepartmentActiveModel = existing.into();
        if let Some(code) = &self.code {
            active_model.code = Set(code.clone());
        }
        if let Some(name) = &self.name {
            active_model.name = Set(name.clone());
        }
        if let Some(parent_id) = &self.parent_id {
            active_model.parent_id = Set(parent_id.clone());
        }
        if let Some(sort) = &self.sort {
            active_model.sort = Set(sort.clone());
        }
        if let Some(leader_user_id) = &self.leader_user_id {
            active_model.leader_user_id = Set(leader_user_id.clone());
        }
        if let Some(phone) = &self.phone {
            active_model.phone = Set(phone.clone());
        }
        if let Some(email) = &self.email {
            active_model.email = Set(email.clone());
        }
        if let Some(status) = &self.status {
            active_model.status = Set(status.clone());
        }
        active_model
    }
}