use sea_orm::{Set, NotSet};
use crate::model::system_department::{self, Model as SystemDepartment, ActiveModel as SystemDepartmentActiveModel};
use crate::model::system_user::{self, Model as SystemUser, ActiveModel as SystemUserActiveModel};
use system_model::request::system_department::{CreateSystemDepartmentRequest, UpdateSystemDepartmentRequest};
use system_model::response::system_department::{SystemDepartmentBaseResponse, SystemDepartmentPageResponse, SystemDepartmentResponse};

pub fn create_request_to_model(request: &CreateSystemDepartmentRequest) -> SystemDepartmentActiveModel {
    SystemDepartmentActiveModel {
        name: Set(request.name.clone()),
        parent_id: Set(request.parent_id.clone()),
        sort: Set(request.sort.clone()),
        leader_user_id: request.leader_user_id.as_ref().map_or(NotSet, |leader_user_id| Set(Some(leader_user_id.clone()))),
        phone: request.phone.as_ref().map_or(NotSet, |phone| Set(Some(phone.clone()))),
        email: request.email.as_ref().map_or(NotSet, |email| Set(Some(email.clone()))),
        status: Set(request.status.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateSystemDepartmentRequest, existing: SystemDepartment) -> SystemDepartmentActiveModel {
    let mut active_model: SystemDepartmentActiveModel = existing.into();
    if let Some(name) = &request.name { 
        active_model.name = Set(name.clone());
    }
    if let Some(sort) = &request.sort { 
        active_model.sort = Set(sort.clone());
    }
    if let Some(leader_user_id) = &request.leader_user_id { 
        active_model.leader_user_id = Set(Some(leader_user_id.clone()));
    }
    if let Some(phone) = &request.phone { 
        active_model.phone = Set(Some(phone.clone()));
    }
    if let Some(email) = &request.email { 
        active_model.email = Set(Some(email.clone()));
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    active_model
}

pub fn model_to_response(model: SystemDepartment) -> SystemDepartmentResponse {
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

pub fn model_to_page_response(model: SystemDepartment, user_model: Option<SystemUser>) -> SystemDepartmentPageResponse {
    let leader_user_name = user_model.map(|user| user.nickname.clone());

    SystemDepartmentPageResponse { 
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

        leader_user_name,
    }
}

pub fn model_to_base_response(model: SystemDepartment) -> SystemDepartmentBaseResponse {
    SystemDepartmentBaseResponse { 
        id: model.id,
        code: model.code,
        name: model.name,
    }
}