use serde::{Serialize, Deserialize};
use crate::model::system_department::{self, SystemDepartment, SystemDepartmentActiveModel};
use crate::request::system_department::{CreateSystemDepartmentRequest, UpdateSystemDepartmentRequest};
use crate::response::system_department::SystemDepartmentResponse;

pub fn create_request_to_model(request: &CreateSystemDepartmentRequest) -> SystemDepartmentActiveModel {
    SystemDepartmentActiveModel {
        code: Set(request.code.clone()),
        name: Set(request.name.clone()),
        parent_id: Set(request.parent_id.clone()),
        sort: Set(request.sort.clone()),
        leader_user_id: Set(request.leader_user_id.clone()),
        phone: Set(request.phone.clone()),
        email: Set(request.email.clone()),
        status: Set(request.status.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: UpdateSystemDepartmentRequest, existing: SystemDepartment) -> SystemDepartmentActiveModel {
    let mut active_model: SystemDepartmentActiveModel = existing.into();
    if let Some(code) = &request.code {
        active_model.code = Set(code.clone());
    }
    if let Some(name) = &request.name {
        active_model.name = Set(name.clone());
    }
    if let Some(parent_id) = &request.parent_id {
        active_model.parent_id = Set(parent_id.clone());
    }
    if let Some(sort) = &request.sort {
        active_model.sort = Set(sort.clone());
    }
    if let Some(leader_user_id) = &request.leader_user_id {
        active_model.leader_user_id = Set(leader_user_id.clone());
    }
    if let Some(phone) = &request.phone {
        active_model.phone = Set(phone.clone());
    }
    if let Some(email) = &request.email {
        active_model.email = Set(email.clone());
    }
    if let Some(status) = &request.status {
        active_model.status = Set(status.clone());
    }
    active_model
}

fn model_to_response(model: SystemDepartment) -> SystemDepartmentResponse {
    SystemDepartmentResponse {
        id: model.id,
        code: model.code,
        name: model.name,
        parent_id: model.parent_id,
        sort: model.sort,
        leader_user_id: model.leader_user_id,
        phone: model.phone,
        email: model.email,
        status: model.status,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
        
    }
}