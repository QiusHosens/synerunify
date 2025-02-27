use serde::{Serialize, Deserialize};
use serde_with::{serde_as, DisplayFromStr};
use sea_orm::sea_query::types::NaiveDateTime;
use crate::model::system_menu::SystemMenu;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemMenuResponse {
    
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
    
    pub creator: Option<String>, // 创建者
    
    #[serde_as(as = "DisplayFromStr")]
    #[serde(with = "serde_with::chrono::naive_datetime")]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<String>, // 更新者
    
    #[serde_as(as = "DisplayFromStr")]
    #[serde(with = "serde_with::chrono::naive_datetime")]
    pub update_time: NaiveDateTime, // 更新时间
    
}

impl From<SystemMenu> for SystemMenuResponse {
    fn from(model: SystemMenu) -> Self {
        Self {
            id: model.id,
            name: model.name,
            permission: model.permission,
            r#type: model.r#type,
            sort: model.sort,
            parent_id: model.parent_id,
            path: model.path,
            icon: model.icon,
            component: model.component,
            component_name: model.component_name,
            status: model.status,
            visible: model.visible,
            keep_alive: model.keep_alive,
            always_show: model.always_show,
            creator: model.creator,
            create_time: model.create_time,
            updater: model.updater,
            update_time: model.update_time,
            
        }
    }
}