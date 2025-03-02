use sea_orm::{Set, NotSet};
use crate::model::system_menu::{self, Model as SystemMenu, ActiveModel as SystemMenuActiveModel};
use system_model::request::system_menu::{CreateSystemMenuRequest, UpdateSystemMenuRequest};
use system_model::response::system_menu::SystemMenuResponse;

pub fn create_request_to_model(request: &CreateSystemMenuRequest) -> SystemMenuActiveModel {
    SystemMenuActiveModel {
        name: Set(request.name.clone()),
            permission: Set(request.permission.clone()),
            r#type: Set(request.r#type.clone()),
            sort: Set(request.sort.clone()),
            parent_id: Set(request.parent_id.clone()),
            path: request.path.as_ref().map_or(NotSet, |path| Set(Some(path.clone()))),
            icon: request.icon.as_ref().map_or(NotSet, |icon| Set(Some(icon.clone()))),
            component: request.component.as_ref().map_or(NotSet, |component| Set(Some(component.clone()))),
            component_name: request.component_name.as_ref().map_or(NotSet, |component_name| Set(Some(component_name.clone()))),
            status: Set(request.status.clone()),
            visible: Set(request.visible.clone()),
            keep_alive: Set(request.keep_alive.clone()),
            always_show: Set(request.always_show.clone()),
            ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateSystemMenuRequest, existing: SystemMenu) -> SystemMenuActiveModel {
    let mut active_model: SystemMenuActiveModel = existing.into();
    if let Some(name) = &request.name {
        active_model.name = Set(name.clone());
        }
    if let Some(permission) = &request.permission {
        active_model.permission = Set(permission.clone());
        }
    if let Some(r#type) = &request.r#type {
        active_model.r#type = Set(r#type.clone());
        }
    if let Some(sort) = &request.sort {
        active_model.sort = Set(sort.clone());
        }
    if let Some(parent_id) = &request.parent_id {
        active_model.parent_id = Set(parent_id.clone());
        }
    if let Some(path) = &request.path {
        active_model.path = Set(Some(path.clone()));
        }
    if let Some(icon) = &request.icon {
        active_model.icon = Set(Some(icon.clone()));
        }
    if let Some(component) = &request.component {
        active_model.component = Set(Some(component.clone()));
        }
    if let Some(component_name) = &request.component_name {
        active_model.component_name = Set(Some(component_name.clone()));
        }
    if let Some(status) = &request.status {
        active_model.status = Set(status.clone());
        }
    if let Some(visible) = &request.visible {
        active_model.visible = Set(visible.clone());
        }
    if let Some(keep_alive) = &request.keep_alive {
        active_model.keep_alive = Set(keep_alive.clone());
        }
    if let Some(always_show) = &request.always_show {
        active_model.always_show = Set(always_show.clone());
        }
    active_model
}

pub fn model_to_response(model: SystemMenu) -> SystemMenuResponse {
    SystemMenuResponse {
        id: model.id,
        name: model.name,
        permission: model.permission,
        r#type: model.r#type,
        sort: model.sort,
        parent_id: model.parent_id,
        path: model.path,
        icon: model.icon,
        component: model.component,
        component_name: model.component_name,
        status: model.status,
        visible: model.visible,
        keep_alive: model.keep_alive,
        always_show: model.always_show,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
        
    }
}