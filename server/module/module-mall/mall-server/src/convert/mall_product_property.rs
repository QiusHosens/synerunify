use sea_orm::{Set, NotSet};
use crate::model::mall_product_property::{self, Model as MallProductProperty, ActiveModel as MallProductPropertyActiveModel};
use mall_model::request::mall_product_property::{CreateMallProductPropertyRequest, UpdateMallProductPropertyRequest};
use mall_model::response::mall_product_property::MallProductPropertyResponse;

pub fn create_request_to_model(request: &CreateMallProductPropertyRequest) -> MallProductPropertyActiveModel {
    MallProductPropertyActiveModel {
        name: request.name.as_ref().map_or(NotSet, |name| Set(Some(name.clone()))),
        status: Set(request.status.clone()),
        remark: request.remark.as_ref().map_or(NotSet, |remark| Set(Some(remark.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallProductPropertyRequest, existing: MallProductProperty) -> MallProductPropertyActiveModel {
    let mut active_model: MallProductPropertyActiveModel = existing.into();
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

pub fn model_to_response(model: MallProductProperty) -> MallProductPropertyResponse {
    MallProductPropertyResponse { 
        id: model.id,
        name: model.name,
        status: model.status,
        remark: model.remark,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}