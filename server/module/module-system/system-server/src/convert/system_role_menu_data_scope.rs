use serde::{Serialize, Deserialize};
use crate::model::system_role_menu_data_scope::{self, SystemRoleMenuDataScope, SystemRoleMenuDataScopeActiveModel};
use crate::request::system_role_menu_data_scope::{CreateSystemRoleMenuDataScopeRequest, UpdateSystemRoleMenuDataScopeRequest};
use crate::response::system_role_menu_data_scope::SystemRoleMenuDataScopeResponse;

pub fn create_request_to_model(request: &CreateSystemRoleMenuDataScopeRequest) -> SystemRoleMenuDataScopeActiveModel {
    SystemRoleMenuDataScopeActiveModel {
        role_menu_id: Set(request.role_menu_id.clone()),
        data_scope_rule_id: Set(request.data_scope_rule_id.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: UpdateSystemRoleMenuDataScopeRequest, existing: SystemRoleMenuDataScope) -> SystemRoleMenuDataScopeActiveModel {
    let mut active_model: SystemRoleMenuDataScopeActiveModel = existing.into();
    if let Some(role_menu_id) = &request.role_menu_id {
        active_model.role_menu_id = Set(role_menu_id.clone());
    }
    if let Some(data_scope_rule_id) = &request.data_scope_rule_id {
        active_model.data_scope_rule_id = Set(data_scope_rule_id.clone());
    }
    active_model
}

fn model_to_response(model: SystemRoleMenuDataScope) -> SystemRoleMenuDataScopeResponse {
    SystemRoleMenuDataScopeResponse {
        id: model.id,
        role_menu_id: model.role_menu_id,
        data_scope_rule_id: model.data_scope_rule_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
        
    }
}