use serde::{Serialize, Deserialize};
use serde_with::{serde_as, DisplayFromStr};
use sea_orm::sea_query::types::NaiveDateTime;
use crate::model::system_notice::SystemNotice;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemNoticeResponse {
    
    pub id: i64, // 公告ID
    
    pub title: String, // 公告标题
    
    pub content: String, // 公告内容
    
    pub r#type: i8, // 公告类型（1通知 2公告）
    
    pub status: i8, // 公告状态（0正常 1关闭）
    
    pub creator: Option<String>, // 创建者
    
    #[serde_as(as = "DisplayFromStr")]
    #[serde(with = "serde_with::chrono::naive_datetime")]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<String>, // 更新者
    
    #[serde_as(as = "DisplayFromStr")]
    #[serde(with = "serde_with::chrono::naive_datetime")]
    pub update_time: NaiveDateTime, // 更新时间
    
}

impl From<SystemNotice> for SystemNoticeResponse {
    fn from(model: SystemNotice) -> Self {
        Self {
            id: model.id,
            title: model.title,
            content: model.content,
            r#type: model.r#type,
            status: model.status,
            creator: model.creator,
            create_time: model.create_time,
            updater: model.updater,
            update_time: model.update_time,
            
        }
    }
}