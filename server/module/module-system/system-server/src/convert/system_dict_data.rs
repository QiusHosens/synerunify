use sea_orm::{Set, NotSet};
use crate::model::system_dict_data::{self, Model as SystemDictData, ActiveModel as SystemDictDataActiveModel};
use system_model::request::system_dict_data::{CreateSystemDictDataRequest, UpdateSystemDictDataRequest};
use system_model::response::system_dict_data::SystemDictDataResponse;

pub fn create_request_to_model(request: &CreateSystemDictDataRequest) -> SystemDictDataActiveModel {
    SystemDictDataActiveModel {
        sort: Set(request.sort.clone()),
        label: Set(request.label.clone()),
        value: Set(request.value.clone()),
        dict_type: Set(request.dict_type.clone()),
        // status: Set(request.status.clone()),
        color_type: request.color_type.as_ref().map_or(NotSet, |color_type| Set(Some(color_type.clone()))),
        css_class: request.css_class.as_ref().map_or(NotSet, |css_class| Set(Some(css_class.clone()))),
        remark: request.remark.as_ref().map_or(NotSet, |remark| Set(Some(remark.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateSystemDictDataRequest, existing: SystemDictData) -> SystemDictDataActiveModel {
    let mut active_model: SystemDictDataActiveModel = existing.into();
    if let Some(sort) = &request.sort { 
        active_model.sort = Set(sort.clone());
    }
    if let Some(label) = &request.label { 
        active_model.label = Set(label.clone());
    }
    if let Some(value) = &request.value { 
        active_model.value = Set(value.clone());
    }
    if let Some(dict_type) = &request.dict_type { 
        active_model.dict_type = Set(dict_type.clone());
    }
    // if let Some(status) = &request.status { 
    //     active_model.status = Set(status.clone());
    // }
    if let Some(color_type) = &request.color_type { 
        active_model.color_type = Set(Some(color_type.clone()));
    }
    if let Some(css_class) = &request.css_class { 
        active_model.css_class = Set(Some(css_class.clone()));
    }
    if let Some(remark) = &request.remark { 
        active_model.remark = Set(Some(remark.clone()));
    }
    active_model
}

pub fn model_to_response(model: SystemDictData) -> SystemDictDataResponse {
    SystemDictDataResponse { 
        id: model.id,
        sort: model.sort,
        label: model.label,
        value: model.value,
        dict_type: model.dict_type,
        status: model.status,
        color_type: model.color_type,
        css_class: model.css_class,
        remark: model.remark,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}