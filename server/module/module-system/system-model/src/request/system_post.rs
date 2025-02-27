use serde::{Serialize, Deserialize};
use crate::model::system_post::{self, SystemPost, SystemPostActiveModel};

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateSystemPostRequest {
    
    pub code: String, // 职位编码
    
    pub name: String, // 职位名称
    
    pub sort: i32, // 显示顺序
    
    pub status: i8, // 状态（0正常 1停用）
    
    pub remark: Option<String>, // 备注
    
}

impl CreateSystemPostRequest {
    pub fn to_active_model(&self) -> SystemPostActiveModel {
        SystemPostActiveModel {
            code: Set(self.code.clone()),
            name: Set(self.name.clone()),
            sort: Set(self.sort.clone()),
            status: Set(self.status.clone()),
            remark: Set(self.remark.clone()),
            ..Default::default()
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateSystemPostRequest {
    
    pub id: i64, // 职位ID
    
    pub code: String, // 职位编码
    
    pub name: String, // 职位名称
    
    pub sort: i32, // 显示顺序
    
    pub status: i8, // 状态（0正常 1停用）
    
    pub remark: Option<String>, // 备注
    
}

impl UpdateSystemPostRequest {
    pub fn to_active_model(&self, existing: SystemPost) -> SystemPostActiveModel {
        let mut active_model: SystemPostActiveModel = existing.into();
        if let Some(code) = &self.code {
            active_model.code = Set(code.clone());
        }
        if let Some(name) = &self.name {
            active_model.name = Set(name.clone());
        }
        if let Some(sort) = &self.sort {
            active_model.sort = Set(sort.clone());
        }
        if let Some(status) = &self.status {
            active_model.status = Set(status.clone());
        }
        if let Some(remark) = &self.remark {
            active_model.remark = Set(remark.clone());
        }
        active_model
    }
}