use sea_orm::{Set, NotSet};
use crate::model::mall_product_category::{self, Model as MallProductCategory, ActiveModel as MallProductCategoryActiveModel};
use mall_model::request::mall_product_category::{CreateMallProductCategoryRequest, UpdateMallProductCategoryRequest};
use mall_model::response::mall_product_category::MallProductCategoryResponse;

pub fn create_request_to_model(request: &CreateMallProductCategoryRequest) -> MallProductCategoryActiveModel {
    MallProductCategoryActiveModel {
        parent_id: Set(request.parent_id.clone()),
        name: Set(request.name.clone()),
        pic_url: Set(request.pic_url.clone()),
        sort: request.sort.as_ref().map_or(NotSet, |sort| Set(Some(sort.clone()))),
        status: Set(request.status.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallProductCategoryRequest, existing: MallProductCategory) -> MallProductCategoryActiveModel {
    let mut active_model: MallProductCategoryActiveModel = existing.into();
    if let Some(parent_id) = &request.parent_id { 
        active_model.parent_id = Set(parent_id.clone());
    }
    if let Some(name) = &request.name { 
        active_model.name = Set(name.clone());
    }
    if let Some(pic_url) = &request.pic_url { 
        active_model.pic_url = Set(pic_url.clone());
    }
    if let Some(sort) = &request.sort { 
        active_model.sort = Set(Some(sort.clone()));
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    active_model
}

pub fn model_to_response(model: MallProductCategory) -> MallProductCategoryResponse {
    MallProductCategoryResponse { 
        id: model.id,
        parent_id: model.parent_id,
        name: model.name,
        pic_url: model.pic_url,
        sort: model.sort,
        status: model.status,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}