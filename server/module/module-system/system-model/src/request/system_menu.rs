use serde::{Serialize, Deserialize};
use crate::model::system_menu::{self, SystemMenu, SystemMenuActiveModel};

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateSystemMenuRequest {
    
    pub name: String, // 菜单名称
    
    pub permission: String, // 权限标识
    
    pub r#type: i8, // 菜单类型
    
    pub sort: i32, // 显示顺序
    
    pub parent_id: i64, // 父菜单ID
    
    pub path: Option<String>, // 路由地址
    
    pub icon: Option<String>, // 菜单图标
    
    pub component: Option<String>, // 组件路径
    
    pub component_name: Option<String>, // 组件名
    
    pub status: i8, // 菜单状态
    
    pub visible: bool, // 是否可见
    
    pub keep_alive: bool, // 是否缓存
    
    pub always_show: bool, // 是否总是显示
    
}

impl CreateSystemMenuRequest {
    pub fn to_active_model(&self) -> SystemMenuActiveModel {
        SystemMenuActiveModel {
            name: Set(self.name.clone()),
            permission: Set(self.permission.clone()),
            r#type: Set(self.r#type.clone()),
            sort: Set(self.sort.clone()),
            parent_id: Set(self.parent_id.clone()),
            path: Set(self.path.clone()),
            icon: Set(self.icon.clone()),
            component: Set(self.component.clone()),
            component_name: Set(self.component_name.clone()),
            status: Set(self.status.clone()),
            visible: Set(self.visible.clone()),
            keep_alive: Set(self.keep_alive.clone()),
            always_show: Set(self.always_show.clone()),
            ..Default::default()
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateSystemMenuRequest {
    
    pub id: i64, // 菜单ID
    
    pub name: String, // 菜单名称
    
    pub permission: String, // 权限标识
    
    pub r#type: i8, // 菜单类型
    
    pub sort: i32, // 显示顺序
    
    pub parent_id: i64, // 父菜单ID
    
    pub path: Option<String>, // 路由地址
    
    pub icon: Option<String>, // 菜单图标
    
    pub component: Option<String>, // 组件路径
    
    pub component_name: Option<String>, // 组件名
    
    pub status: i8, // 菜单状态
    
    pub visible: bool, // 是否可见
    
    pub keep_alive: bool, // 是否缓存
    
    pub always_show: bool, // 是否总是显示
    
}

impl UpdateSystemMenuRequest {
    pub fn to_active_model(&self, existing: SystemMenu) -> SystemMenuActiveModel {
        let mut active_model: SystemMenuActiveModel = existing.into();
        if let Some(name) = &self.name {
            active_model.name = Set(name.clone());
        }
        if let Some(permission) = &self.permission {
            active_model.permission = Set(permission.clone());
        }
        if let Some(r#type) = &self.r#type {
            active_model.r#type = Set(r#type.clone());
        }
        if let Some(sort) = &self.sort {
            active_model.sort = Set(sort.clone());
        }
        if let Some(parent_id) = &self.parent_id {
            active_model.parent_id = Set(parent_id.clone());
        }
        if let Some(path) = &self.path {
            active_model.path = Set(path.clone());
        }
        if let Some(icon) = &self.icon {
            active_model.icon = Set(icon.clone());
        }
        if let Some(component) = &self.component {
            active_model.component = Set(component.clone());
        }
        if let Some(component_name) = &self.component_name {
            active_model.component_name = Set(component_name.clone());
        }
        if let Some(status) = &self.status {
            active_model.status = Set(status.clone());
        }
        if let Some(visible) = &self.visible {
            active_model.visible = Set(visible.clone());
        }
        if let Some(keep_alive) = &self.keep_alive {
            active_model.keep_alive = Set(keep_alive.clone());
        }
        if let Some(always_show) = &self.always_show {
            active_model.always_show = Set(always_show.clone());
        }
        active_model
    }
}