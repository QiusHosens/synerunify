use sea_orm::{Set, NotSet};
use crate::model::system_file::{self, Model as SystemFile, ActiveModel as SystemFileActiveModel};
use file_model::request::system_file::{CreateSystemFileRequest, UpdateSystemFileRequest};
use file_model::response::system_file::{SystemFileDataResponse, SystemFileResponse};

pub fn create_request_to_model(request: &CreateSystemFileRequest) -> SystemFileActiveModel {
    SystemFileActiveModel {
        file_name: Set(request.file_name.clone()),
        file_type: request.file_type.as_ref().map_or(NotSet, |file_type| Set(Some(file_type.clone()))),
        file_size: Set(request.file_size.clone()),
        file_path: Set(request.file_path.clone()),
        department_code: Set(request.department_code.clone()),
        department_id: Set(request.department_id.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateSystemFileRequest, existing: SystemFile) -> SystemFileActiveModel {
    let mut active_model: SystemFileActiveModel = existing.into();
    if let Some(file_name) = &request.file_name { 
        active_model.file_name = Set(file_name.clone());
    }
    if let Some(file_type) = &request.file_type { 
        active_model.file_type = Set(Some(file_type.clone()));
    }
    if let Some(file_size) = &request.file_size { 
        active_model.file_size = Set(file_size.clone());
    }
    if let Some(file_path) = &request.file_path { 
        active_model.file_path = Set(file_path.clone());
    }
    if let Some(department_code) = &request.department_code { 
        active_model.department_code = Set(department_code.clone());
    }
    if let Some(department_id) = &request.department_id { 
        active_model.department_id = Set(department_id.clone());
    }
    active_model
}

pub fn model_to_response(model: SystemFile) -> SystemFileResponse {
    SystemFileResponse { 
        id: model.id,
        file_name: model.file_name,
        file_type: model.file_type,
        file_size: model.file_size,
        file_path: model.file_path,
        department_code: model.department_code,
        department_id: model.department_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}

pub fn model_to_data_response(model: SystemFile, data: Vec<u8>) -> SystemFileDataResponse {
    SystemFileDataResponse { 
        id: model.id,
        file_name: model.file_name,
        file_type: model.file_type,
        file_size: model.file_size,
        file_path: model.file_path,

        data
    }
}