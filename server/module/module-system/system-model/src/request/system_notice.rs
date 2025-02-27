use serde::{Serialize, Deserialize};
use crate::model::system_notice::{self, SystemNotice, SystemNoticeActiveModel};

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateSystemNoticeRequest {
    
    pub title: String, // 公告标题
    
    pub content: String, // 公告内容
    
    pub r#type: i8, // 公告类型（1通知 2公告）
    
    pub status: i8, // 公告状态（0正常 1关闭）
    
}

impl CreateSystemNoticeRequest {
    pub fn to_active_model(&self) -> SystemNoticeActiveModel {
        SystemNoticeActiveModel {
            title: Set(self.title.clone()),
            content: Set(self.content.clone()),
            r#type: Set(self.r#type.clone()),
            status: Set(self.status.clone()),
            ..Default::default()
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateSystemNoticeRequest {
    
    pub id: i64, // 公告ID
    
    pub title: String, // 公告标题
    
    pub content: String, // 公告内容
    
    pub r#type: i8, // 公告类型（1通知 2公告）
    
    pub status: i8, // 公告状态（0正常 1关闭）
    
}

impl UpdateSystemNoticeRequest {
    pub fn to_active_model(&self, existing: SystemNotice) -> SystemNoticeActiveModel {
        let mut active_model: SystemNoticeActiveModel = existing.into();
        if let Some(title) = &self.title {
            active_model.title = Set(title.clone());
        }
        if let Some(content) = &self.content {
            active_model.content = Set(content.clone());
        }
        if let Some(r#type) = &self.r#type {
            active_model.r#type = Set(r#type.clone());
        }
        if let Some(status) = &self.status {
            active_model.status = Set(status.clone());
        }
        active_model
    }
}