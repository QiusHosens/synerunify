use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use serde_with::{serde_as, DisplayFromStr};

// #[serde_as]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemUserRoleResponse {
    
    pub id: i64, // id
    
    pub user_id: i64, // 用户ID
    
    pub role_id: i64, // 角色ID
    
    pub creator: Option<String>, // 创建者
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    pub create_time: Option<NaiveDateTime>, // 创建时间
    
    pub updater: Option<String>, // 更新者
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    pub update_time: Option<NaiveDateTime>, // 更新时间
    
}