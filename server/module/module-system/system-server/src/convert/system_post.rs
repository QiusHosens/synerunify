use sea_orm::{Set, NotSet};
use crate::model::system_post::{self, Model as SystemPost, ActiveModel as SystemPostActiveModel};
use system_model::request::system_post::{CreateSystemPostRequest, UpdateSystemPostRequest};
use system_model::response::system_post::SystemPostResponse;

pub fn create_request_to_model(request: &CreateSystemPostRequest) -> SystemPostActiveModel {
    SystemPostActiveModel {
        code: Set(request.code.clone()),
        name: Set(request.name.clone()),
        sort: Set(request.sort.clone()),
        status: Set(request.status.clone()),
        remark: request.remark.as_ref().map_or(NotSet, |remark| Set(Some(remark.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateSystemPostRequest, existing: SystemPost) -> SystemPostActiveModel {
    let mut active_model: SystemPostActiveModel = existing.into();
    if let Some(code) = &request.code { 
        active_model.code = Set(code.clone());
    }
    if let Some(name) = &request.name { 
        active_model.name = Set(name.clone());
    }
    if let Some(sort) = &request.sort { 
        active_model.sort = Set(sort.clone());
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    if let Some(remark) = &request.remark { 
        active_model.remark = Set(Some(remark.clone()));
    }
    active_model
}

pub fn model_to_response(model: SystemPost) -> SystemPostResponse {
    SystemPostResponse { 
        id: model.id,
        code: model.code,
        name: model.name,
        sort: model.sort,
        status: model.status,
        remark: model.remark,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}