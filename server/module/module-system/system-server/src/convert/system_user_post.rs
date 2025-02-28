use serde::{Serialize, Deserialize};
use crate::model::system_user_post::{self, SystemUserPost, SystemUserPostActiveModel};
use crate::request::system_user_post::{CreateSystemUserPostRequest, UpdateSystemUserPostRequest};
use crate::response::system_user_post::SystemUserPostResponse;

pub fn create_request_to_model(request: &CreateSystemUserPostRequest) -> SystemUserPostActiveModel {
    SystemUserPostActiveModel {
        user_id: Set(request.user_id.clone()),
        post_id: Set(request.post_id.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: UpdateSystemUserPostRequest, existing: SystemUserPost) -> SystemUserPostActiveModel {
    let mut active_model: SystemUserPostActiveModel = existing.into();
    if let Some(user_id) = &request.user_id {
        active_model.user_id = Set(user_id.clone());
    }
    if let Some(post_id) = &request.post_id {
        active_model.post_id = Set(post_id.clone());
    }
    active_model
}

fn model_to_response(model: SystemUserPost) -> SystemUserPostResponse {
    SystemUserPostResponse {
        id: model.id,
        user_id: model.user_id,
        post_id: model.post_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
        
    }
}