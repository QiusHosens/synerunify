use sea_orm::{Set, NotSet};
use crate::model::system_role_menu::{self, Model as SystemRoleMenu, ActiveModel as SystemRoleMenuActiveModel};
use system_model::request::system_role_menu::{CreateSystemRoleMenuRequest, UpdateSystemRoleMenuRequest};
use system_model::response::system_role_menu::SystemRoleMenuResponse;

pub fn create_request_to_model(request: &CreateSystemRoleMenuRequest) -> SystemRoleMenuActiveModel {
    SystemRoleMenuActiveModel {
        role_id: Set(request.role_id.clone()),
            menu_id: Set(request.menu_id.clone()),
            ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateSystemRoleMenuRequest, existing: SystemRoleMenu) -> SystemRoleMenuActiveModel {
    let mut active_model: SystemRoleMenuActiveModel = existing.into();
    if let Some(role_id) = &request.role_id {
        active_model.role_id = Set(role_id.clone());
        }
    if let Some(menu_id) = &request.menu_id {
        active_model.menu_id = Set(menu_id.clone());
        }
    active_model
}

fn model_to_response(model: SystemRoleMenu) -> SystemRoleMenuResponse {
    SystemRoleMenuResponse {
        id: model.id,
        role_id: model.role_id,
        menu_id: model.menu_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
        
    }
}