use sea_orm::{Set, NotSet};
use crate::model::mall_store_notice::{self, Model as MallStoreNotice, ActiveModel as MallStoreNoticeActiveModel};
use mall_model::request::mall_store_notice::{CreateMallStoreNoticeRequest, UpdateMallStoreNoticeRequest};
use mall_model::response::mall_store_notice::MallStoreNoticeResponse;

pub fn create_request_to_model(request: &CreateMallStoreNoticeRequest) -> MallStoreNoticeActiveModel {
    MallStoreNoticeActiveModel {
        store_id: Set(request.store_id.clone()),
        title: Set(request.title.clone()),
        content: Set(request.content.clone()),
        top: Set(request.top.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallStoreNoticeRequest, existing: MallStoreNotice) -> MallStoreNoticeActiveModel {
    let mut active_model: MallStoreNoticeActiveModel = existing.into();
    if let Some(store_id) = &request.store_id { 
        active_model.store_id = Set(store_id.clone());
    }
    if let Some(title) = &request.title { 
        active_model.title = Set(title.clone());
    }
    if let Some(content) = &request.content { 
        active_model.content = Set(content.clone());
    }
    if let Some(top) = &request.top { 
        active_model.top = Set(top.clone());
    }
    active_model
}

pub fn model_to_response(model: MallStoreNotice) -> MallStoreNoticeResponse {
    MallStoreNoticeResponse { 
        id: model.id,
        store_id: model.store_id,
        title: model.title,
        content: model.content,
        top: model.top,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}