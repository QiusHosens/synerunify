use sea_orm::{Set, NotSet};
use crate::model::system_dict_type::{self, Model as SystemDictType, ActiveModel as SystemDictTypeActiveModel};
use system_model::request::system_dict_type::{CreateSystemDictTypeRequest, UpdateSystemDictTypeRequest};
use system_model::response::system_dict_type::SystemDictTypeResponse;

pub fn create_request_to_model(request: &CreateSystemDictTypeRequest) -> SystemDictTypeActiveModel {
    SystemDictTypeActiveModel {
        name: Set(request.name.clone()),
        r#type: Set(request.r#type.clone()),
        status: Set(request.status.clone()),
        remark: request.remark.as_ref().map_or(NotSet, |remark| Set(Some(remark.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateSystemDictTypeRequest, existing: SystemDictType) -> SystemDictTypeActiveModel {
    let mut active_model: SystemDictTypeActiveModel = existing.into();
    if let Some(name) = &request.name { 
        active_model.name = Set(name.clone());
    }
    if let Some(r#type) = &request.r#type { 
        active_model.r#type = Set(r#type.clone());
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    if let Some(remark) = &request.remark { 
        active_model.remark = Set(Some(remark.clone()));
    }
    active_model
}

pub fn model_to_response(model: SystemDictType) -> SystemDictTypeResponse {
    SystemDictTypeResponse { 
        id: model.id,
        name: model.name,
        r#type: model.r#type,
        status: model.status,
        remark: model.remark,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}