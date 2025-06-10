use sea_orm::{Set, NotSet};
use crate::model::erp_product_category::{self, Model as ErpProductCategory, ActiveModel as ErpProductCategoryActiveModel};
use erp_model::request::erp_product_category::{CreateErpProductCategoryRequest, UpdateErpProductCategoryRequest};
use erp_model::response::erp_product_category::ErpProductCategoryResponse;

pub fn create_request_to_model(request: &CreateErpProductCategoryRequest) -> ErpProductCategoryActiveModel {
    ErpProductCategoryActiveModel {
        code: request.code.as_ref().map_or(NotSet, |code| Set(Some(code.clone()))),
        name: Set(request.name.clone()),
        parent_id: request.parent_id.as_ref().map_or(NotSet, |parent_id| Set(Some(parent_id.clone()))),
        status: Set(request.status.clone()),
        sort: Set(request.sort.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpProductCategoryRequest, existing: ErpProductCategory) -> ErpProductCategoryActiveModel {
    let mut active_model: ErpProductCategoryActiveModel = existing.into();
    if let Some(code) = &request.code {
        active_model.code = Set(Some(code.clone()));
    }
    if let Some(name) = &request.name {
        active_model.name = Set(name.clone());
    }
    if let Some(parent_id) = &request.parent_id { 
        active_model.parent_id = Set(Some(parent_id.clone()));
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    if let Some(sort) = &request.sort {
        active_model.sort = Set(sort.clone());
    }
    if let Some(remarks) = &request.remarks { 
        active_model.remarks = Set(Some(remarks.clone()));
    }
    active_model
}

pub fn model_to_response(model: ErpProductCategory) -> ErpProductCategoryResponse {
    ErpProductCategoryResponse { 
        id: model.id,
        code: model.code,
        name: model.name,
        parent_id: model.parent_id,
        status: model.status,
        sort: model.sort,
        remarks: model.remarks,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}