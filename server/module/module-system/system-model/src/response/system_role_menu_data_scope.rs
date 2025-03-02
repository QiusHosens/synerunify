use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use serde_with::{serde_as, DisplayFromStr};

// #[serde_as]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemRoleMenuDataScopeResponse {
    
    pub id: i64, // id
    
    pub role_menu_id: i64, // 角色菜单ID
    
    pub data_scope_rule_id: i64, // 权限规则ID
    
    pub creator: Option<String>, // 创建者
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<String>, // 更新者
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    pub update_time: NaiveDateTime, // 更新时间
    
}