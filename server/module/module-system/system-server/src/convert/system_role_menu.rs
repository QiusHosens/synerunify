use sea_orm::{Set, NotSet};
use crate::model::system_role_menu::{self, Model as SystemRoleMenu, ActiveModel as SystemRoleMenuActiveModel};
use system_model::request::system_role_menu::{UpdateSystemRoleMenuRequest};
use system_model::response::system_role_menu::SystemRoleMenuResponse;

pub fn model_to_response(model: SystemRoleMenu) -> SystemRoleMenuResponse {
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