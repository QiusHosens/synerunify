use sea_orm::{Set, NotSet};
use crate::model::system_user_role::{self, Model as SystemUserRole, ActiveModel as SystemUserRoleActiveModel};
use system_model::request::system_user_role::{CreateSystemUserRoleRequest, UpdateSystemUserRoleRequest};
use system_model::response::system_user_role::SystemUserRoleResponse;

pub fn create_request_to_model(request: &CreateSystemUserRoleRequest) -> SystemUserRoleActiveModel {
    SystemUserRoleActiveModel {
        user_id: Set(request.user_id.clone()),
            role_id: Set(request.role_id.clone()),
            ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateSystemUserRoleRequest, existing: SystemUserRole) -> SystemUserRoleActiveModel {
    let mut active_model: SystemUserRoleActiveModel = existing.into();
    if let Some(user_id) = &request.user_id {
        active_model.user_id = Set(user_id.clone());
        }
    if let Some(role_id) = &request.role_id {
        active_model.role_id = Set(role_id.clone());
        }
    active_model
}

fn model_to_response(model: SystemUserRole) -> SystemUserRoleResponse {
    SystemUserRoleResponse {
        id: model.id,
        user_id: model.user_id,
        role_id: model.role_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
        
    }
}