use sea_orm::{Set, NotSet};
use crate::model::system_data_scope_rule::{self, Model as SystemDataScopeRule, ActiveModel as SystemDataScopeRuleActiveModel};
use system_model::request::system_data_scope_rule::{CreateSystemDataScopeRuleRequest, UpdateSystemDataScopeRuleRequest};
use system_model::response::system_data_scope_rule::SystemDataScopeRuleResponse;

pub fn create_request_to_model(request: &CreateSystemDataScopeRuleRequest) -> SystemDataScopeRuleActiveModel {
    SystemDataScopeRuleActiveModel {
        r#type: Set(request.r#type.clone()),
            name: Set(request.name.clone()),
            field: request.field.as_ref().map_or(NotSet, |field| Set(Some(field.clone()))),
            condition: request.condition.as_ref().map_or(NotSet, |condition| Set(Some(condition.clone()))),
            value: request.value.as_ref().map_or(NotSet, |value| Set(Some(value.clone()))),
            ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateSystemDataScopeRuleRequest, existing: SystemDataScopeRule) -> SystemDataScopeRuleActiveModel {
    let mut active_model: SystemDataScopeRuleActiveModel = existing.into();
    if let Some(r#type) = &request.r#type { 
        active_model.r#type = Set(r#type.clone());
    }
    if let Some(name) = &request.name { 
        active_model.name = Set(name.clone());
    }
    if let Some(field) = &request.field { 
        active_model.field = Set(Some(field.clone()));
    }
    if let Some(condition) = &request.condition { 
        active_model.condition = Set(Some(condition.clone()));
    }
    if let Some(value) = &request.value { 
        active_model.value = Set(Some(value.clone()));
    }
    active_model
}

pub fn model_to_response(model: SystemDataScopeRule) -> SystemDataScopeRuleResponse {
    SystemDataScopeRuleResponse { 
        id: model.id,
        r#type: model.r#type,
        name: model.name,
        field: model.field,
        condition: model.condition,
        value: model.value,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}