use serde::{Serialize, Deserialize};
use crate::model::system_dict::{self, SystemDict, SystemDictActiveModel};

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateSystemDictRequest {
    
    pub category: String, // 类型
    
    pub category_name: String, // 类型名称
    
    pub code: String, // 编码
    
    pub name: String, // 名称
    
    pub remark: Option<String>, // 备注
    
    pub sort: i32, // 排序
    
    pub status: i8, // 状态（0正常 1停用）
    
    pub color_type: Option<String>, // 颜色类型
    
    pub css_class: Option<String>, // css 样式
    
}

impl CreateSystemDictRequest {
    pub fn to_active_model(&self) -> SystemDictActiveModel {
        SystemDictActiveModel {
            category: Set(self.category.clone()),
            category_name: Set(self.category_name.clone()),
            code: Set(self.code.clone()),
            name: Set(self.name.clone()),
            remark: Set(self.remark.clone()),
            sort: Set(self.sort.clone()),
            status: Set(self.status.clone()),
            color_type: Set(self.color_type.clone()),
            css_class: Set(self.css_class.clone()),
            ..Default::default()
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateSystemDictRequest {
    
    pub id: i64, // 主键
    
    pub category: String, // 类型
    
    pub category_name: String, // 类型名称
    
    pub code: String, // 编码
    
    pub name: String, // 名称
    
    pub remark: Option<String>, // 备注
    
    pub sort: i32, // 排序
    
    pub status: i8, // 状态（0正常 1停用）
    
    pub color_type: Option<String>, // 颜色类型
    
    pub css_class: Option<String>, // css 样式
    
}

impl UpdateSystemDictRequest {
    pub fn to_active_model(&self, existing: SystemDict) -> SystemDictActiveModel {
        let mut active_model: SystemDictActiveModel = existing.into();
        if let Some(category) = &self.category {
            active_model.category = Set(category.clone());
        }
        if let Some(category_name) = &self.category_name {
            active_model.category_name = Set(category_name.clone());
        }
        if let Some(code) = &self.code {
            active_model.code = Set(code.clone());
        }
        if let Some(name) = &self.name {
            active_model.name = Set(name.clone());
        }
        if let Some(remark) = &self.remark {
            active_model.remark = Set(remark.clone());
        }
        if let Some(sort) = &self.sort {
            active_model.sort = Set(sort.clone());
        }
        if let Some(status) = &self.status {
            active_model.status = Set(status.clone());
        }
        if let Some(color_type) = &self.color_type {
            active_model.color_type = Set(color_type.clone());
        }
        if let Some(css_class) = &self.css_class {
            active_model.css_class = Set(css_class.clone());
        }
        active_model
    }
}