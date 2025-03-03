use sea_orm::{Set, NotSet};
use crate::model::system_dict::{self, Model as SystemDict, ActiveModel as SystemDictActiveModel};
use system_model::request::system_dict::{CreateSystemDictRequest, UpdateSystemDictRequest};
use system_model::response::system_dict::SystemDictResponse;

pub fn create_request_to_model(request: &CreateSystemDictRequest) -> SystemDictActiveModel {
    SystemDictActiveModel {
        category: Set(request.category.clone()),
            category_name: Set(request.category_name.clone()),
            code: Set(request.code.clone()),
            name: Set(request.name.clone()),
            remark: request.remark.as_ref().map_or(NotSet, |remark| Set(Some(remark.clone()))),
            sort: Set(request.sort.clone()),
            status: Set(request.status.clone()),
            color_type: request.color_type.as_ref().map_or(NotSet, |color_type| Set(Some(color_type.clone()))),
            css_class: request.css_class.as_ref().map_or(NotSet, |css_class| Set(Some(css_class.clone()))),
            ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateSystemDictRequest, existing: SystemDict) -> SystemDictActiveModel {
    let mut active_model: SystemDictActiveModel = existing.into();
    if let Some(category) = &request.category { 
        active_model.category = Set(category.clone());
    }
    if let Some(category_name) = &request.category_name { 
        active_model.category_name = Set(category_name.clone());
    }
    if let Some(code) = &request.code { 
        active_model.code = Set(code.clone());
    }
    if let Some(name) = &request.name { 
        active_model.name = Set(name.clone());
    }
    if let Some(remark) = &request.remark { 
        active_model.remark = Set(Some(remark.clone()));
    }
    if let Some(sort) = &request.sort { 
        active_model.sort = Set(sort.clone());
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    if let Some(color_type) = &request.color_type { 
        active_model.color_type = Set(Some(color_type.clone()));
    }
    if let Some(css_class) = &request.css_class { 
        active_model.css_class = Set(Some(css_class.clone()));
    }
    active_model
}

pub fn model_to_response(model: SystemDict) -> SystemDictResponse {
    SystemDictResponse { 
        id: model.id,
        category: model.category,
        category_name: model.category_name,
        code: model.code,
        name: model.name,
        remark: model.remark,
        sort: model.sort,
        status: model.status,
        color_type: model.color_type,
        css_class: model.css_class,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}