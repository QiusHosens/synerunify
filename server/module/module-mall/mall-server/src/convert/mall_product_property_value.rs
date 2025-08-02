use sea_orm::{Set, NotSet};
use crate::model::mall_product_property_value::{self, Model as MallProductPropertyValue, ActiveModel as MallProductPropertyValueActiveModel};
use mall_model::request::mall_product_property_value::{CreateMallProductPropertyValueRequest, UpdateMallProductPropertyValueRequest};
use mall_model::response::mall_product_property_value::MallProductPropertyValueResponse;

pub fn create_request_to_model(request: &CreateMallProductPropertyValueRequest) -> MallProductPropertyValueActiveModel {
    MallProductPropertyValueActiveModel {
        property_id: request.property_id.as_ref().map_or(NotSet, |property_id| Set(Some(property_id.clone()))),
        name: request.name.as_ref().map_or(NotSet, |name| Set(Some(name.clone()))),
        status: Set(request.status.clone()),
        remark: request.remark.as_ref().map_or(NotSet, |remark| Set(Some(remark.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallProductPropertyValueRequest, existing: MallProductPropertyValue) -> MallProductPropertyValueActiveModel {
    let mut active_model: MallProductPropertyValueActiveModel = existing.into();
    if let Some(property_id) = &request.property_id { 
        active_model.property_id = Set(Some(property_id.clone()));
    }
    if let Some(name) = &request.name { 
        active_model.name = Set(Some(name.clone()));
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    if let Some(remark) = &request.remark { 
        active_model.remark = Set(Some(remark.clone()));
    }
    active_model
}

pub fn model_to_response(model: MallProductPropertyValue) -> MallProductPropertyValueResponse {
    MallProductPropertyValueResponse { 
        id: model.id,
        property_id: model.property_id,
        name: model.name,
        status: model.status,
        remark: model.remark,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}