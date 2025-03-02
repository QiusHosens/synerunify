use sea_orm::{Set, NotSet};
use crate::model::system_notice::{self, Model as SystemNotice, ActiveModel as SystemNoticeActiveModel};
use system_model::request::system_notice::{CreateSystemNoticeRequest, UpdateSystemNoticeRequest};
use system_model::response::system_notice::SystemNoticeResponse;

pub fn create_request_to_model(request: &CreateSystemNoticeRequest) -> SystemNoticeActiveModel {
    SystemNoticeActiveModel {
        title: Set(request.title.clone()),
            content: Set(request.content.clone()),
            r#type: Set(request.r#type.clone()),
            status: Set(request.status.clone()),
            ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateSystemNoticeRequest, existing: SystemNotice) -> SystemNoticeActiveModel {
    let mut active_model: SystemNoticeActiveModel = existing.into();
    if let Some(title) = &request.title {
        active_model.title = Set(title.clone());
        }
    if let Some(content) = &request.content {
        active_model.content = Set(content.clone());
        }
    if let Some(r#type) = &request.r#type {
        active_model.r#type = Set(r#type.clone());
        }
    if let Some(status) = &request.status {
        active_model.status = Set(status.clone());
        }
    active_model
}

pub fn model_to_response(model: SystemNotice) -> SystemNoticeResponse {
    SystemNoticeResponse {
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