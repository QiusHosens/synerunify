use serde::{Serialize, Deserialize};
use serde_with::{serde_as, DisplayFromStr};
use sea_orm::sea_query::types::NaiveDateTime;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemUserPostResponse {
    
    pub id: i64, // id
    
    pub user_id: i64, // 用户ID
    
    pub post_id: i64, // 职位ID
    
    pub creator: Option<String>, // 创建者
    
    #[serde_as(as = "DisplayFromStr")]
    #[serde(with = "serde_with::chrono::naive_datetime")]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<String>, // 更新者
    
    #[serde_as(as = "DisplayFromStr")]
    #[serde(with = "serde_with::chrono::naive_datetime")]
    pub update_time: NaiveDateTime, // 更新时间
    
}