use serde::{Serialize, Deserialize};
use serde_with::{serde_as, DisplayFromStr};
use sea_orm::sea_query::types::NaiveDateTime;
use crate::model::system_role_menu::SystemRoleMenu;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemRoleMenuResponse {
    
    pub id: i64, // id
    
    pub role_id: i64, // 角色ID
    
    pub menu_id: i64, // 菜单ID
    
    pub creator: Option<String>, // 创建者
    
    #[serde_as(as = "DisplayFromStr")]
    #[serde(with = "serde_with::chrono::naive_datetime")]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<String>, // 更新者
    
    #[serde_as(as = "DisplayFromStr")]
    #[serde(with = "serde_with::chrono::naive_datetime")]
    pub update_time: NaiveDateTime, // 更新时间
    
}

impl From<SystemRoleMenu> for SystemRoleMenuResponse {
    fn from(model: SystemRoleMenu) -> Self {
        Self {
            id: model.id,
            role_id: model.role_id,
            menu_id: model.menu_id,
            creator: model.creator,
            create_time: model.create_time,
            updater: model.updater,
            update_time: model.update_time,
            
        }
    }
}