use sea_orm::{Set, NotSet};
use crate::model::system_role::{self, Model as SystemRole, ActiveModel as SystemRoleActiveModel};
use crate::model::system_data_scope_rule::{self, Model as SystemDataScopeRule, ActiveModel as SystemDataScopeRuleActiveModel};
use system_model::request::system_role::{CreateSystemRoleRequest, UpdateSystemRoleRequest, UpdateSystemRoleRuleRequest};
use system_model::response::system_role::{SystemRoleResponse, SystemRoleRuleResponse};

pub fn create_request_to_model(request: &CreateSystemRoleRequest) -> SystemRoleActiveModel {
    SystemRoleActiveModel {
        r#type: Set(request.r#type.clone()),
        name: Set(request.name.clone()),
        code: Set(request.code.clone()),
        status: Set(request.status.clone()),
        sort: Set(request.sort.clone()),
        data_scope_rule_id: request.data_scope_rule_id.as_ref().map_or(NotSet, |data_scope_rule_id| Set(Some(data_scope_rule_id.clone()))),
        data_scope_department_ids: request.data_scope_department_ids.as_ref().map_or(NotSet, |data_scope_department_ids| Set(Some(data_scope_department_ids.clone()))),
        remark: request.remark.as_ref().map_or(NotSet, |remark| Set(Some(remark.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateSystemRoleRequest, existing: SystemRole) -> SystemRoleActiveModel {
    let mut active_model: SystemRoleActiveModel = existing.into();
    if let Some(r#type) = &request.r#type { 
        active_model.r#type = Set(r#type.clone());
    }
    if let Some(name) = &request.name { 
        active_model.name = Set(name.clone());
    }
    if let Some(code) = &request.code { 
        active_model.code = Set(code.clone());
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    if let Some(sort) = &request.sort { 
        active_model.sort = Set(sort.clone());
    }
    if let Some(data_scope_rule_id) = &request.data_scope_rule_id { 
        active_model.data_scope_rule_id = Set(Some(data_scope_rule_id.clone()));
    }
    if let Some(data_scope_department_ids) = &request.data_scope_department_ids { 
        active_model.data_scope_department_ids = Set(Some(data_scope_department_ids.clone()));
    }
    if let Some(remark) = &request.remark { 
        active_model.remark = Set(Some(remark.clone()));
    }
    active_model
}

pub fn update_rule_request_to_model(request: &UpdateSystemRoleRuleRequest, existing: SystemRole) -> SystemRoleActiveModel {
    let mut active_model: SystemRoleActiveModel = existing.into();
    if let Some(data_scope_rule_id) = &request.data_scope_rule_id { 
        active_model.data_scope_rule_id = Set(Some(data_scope_rule_id.clone()));
    }
    if let Some(data_scope_department_ids) = &request.data_scope_department_ids { 
        active_model.data_scope_department_ids = Set(Some(data_scope_department_ids.clone()));
    }
    active_model
}

pub fn model_to_response(model: SystemRole) -> SystemRoleResponse {
    SystemRoleResponse { 
        id: model.id,
        r#type: model.r#type,
        name: model.name,
        code: model.code,
        status: model.status,
        sort: model.sort,
        data_scope_rule_id: model.data_scope_rule_id,
        data_scope_department_ids: model.data_scope_department_ids,
        remark: model.remark,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}

pub fn model_to_rule_response(model: SystemRole, rule_model: Option<SystemDataScopeRule>) -> SystemRoleRuleResponse {
    let (data_scope_rule_name, data_scope_rule_type) = match rule_model {
        Some(t) => (
            Some(t.name.clone()),
            Some(t.r#type.clone()),
        ),
        None => (None, None),
    };

    SystemRoleRuleResponse {
        id: model.id,
        r#type: model.r#type,
        name: model.name,
        code: model.code,
        status: model.status,
        sort: model.sort,
        data_scope_rule_id: model.data_scope_rule_id,
        data_scope_department_ids: model.data_scope_department_ids,
        remark: model.remark,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,

        data_scope_rule_name,
        data_scope_rule_type,
    }
}