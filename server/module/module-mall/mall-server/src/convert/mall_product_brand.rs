use sea_orm::{Set, NotSet};
use crate::model::mall_product_brand::{self, Model as MallProductBrand, ActiveModel as MallProductBrandActiveModel};
use mall_model::request::mall_product_brand::{CreateMallProductBrandRequest, UpdateMallProductBrandRequest};
use mall_model::response::mall_product_brand::MallProductBrandResponse;

pub fn create_request_to_model(request: &CreateMallProductBrandRequest) -> MallProductBrandActiveModel {
    MallProductBrandActiveModel {
        name: Set(request.name.clone()),
        file_id: Set(request.file_id.clone()),
        sort: request.sort.as_ref().map_or(NotSet, |sort| Set(Some(sort.clone()))),
        description: request.description.as_ref().map_or(NotSet, |description| Set(Some(description.clone()))),
        status: Set(request.status.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallProductBrandRequest, existing: MallProductBrand) -> MallProductBrandActiveModel {
    let mut active_model: MallProductBrandActiveModel = existing.into();
    if let Some(name) = &request.name { 
        active_model.name = Set(name.clone());
    }
    if let Some(file_id) = &request.file_id { 
        active_model.file_id = Set(Some(file_id.clone()));
    }
    if let Some(sort) = &request.sort { 
        active_model.sort = Set(Some(sort.clone()));
    }
    if let Some(description) = &request.description { 
        active_model.description = Set(Some(description.clone()));
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    active_model
}

pub fn model_to_response(model: MallProductBrand) -> MallProductBrandResponse {
    MallProductBrandResponse { 
        id: model.id,
        name: model.name,
        file_id: model.file_id,
        sort: model.sort,
        description: model.description,
        status: model.status,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}