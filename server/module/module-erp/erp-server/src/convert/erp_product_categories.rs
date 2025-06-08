use sea_orm::{Set, NotSet};
use crate::model::erp_product_categories::{self, Model as ErpProductCategories, ActiveModel as ErpProductCategoriesActiveModel};
use erp_model::request::erp_product_categories::{CreateErpProductCategoriesRequest, UpdateErpProductCategoriesRequest};
use erp_model::response::erp_product_categories::ErpProductCategoriesResponse;

pub fn create_request_to_model(request: &CreateErpProductCategoriesRequest) -> ErpProductCategoriesActiveModel {
    ErpProductCategoriesActiveModel {
        category_code: request.category_code.as_ref().map_or(NotSet, |category_code| Set(Some(category_code.clone()))),
        category_name: Set(request.category_name.clone()),
        parent_id: request.parent_id.as_ref().map_or(NotSet, |parent_id| Set(Some(parent_id.clone()))),
        status: Set(request.status.clone()),
        sort_order: Set(request.sort_order.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        department_code: Set(request.department_code.clone()),
        department_id: Set(request.department_id.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpProductCategoriesRequest, existing: ErpProductCategories) -> ErpProductCategoriesActiveModel {
    let mut active_model: ErpProductCategoriesActiveModel = existing.into();
    if let Some(category_code) = &request.category_code { 
        active_model.category_code = Set(Some(category_code.clone()));
    }
    if let Some(category_name) = &request.category_name { 
        active_model.category_name = Set(category_name.clone());
    }
    if let Some(parent_id) = &request.parent_id { 
        active_model.parent_id = Set(Some(parent_id.clone()));
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    if let Some(sort_order) = &request.sort_order { 
        active_model.sort_order = Set(sort_order.clone());
    }
    if let Some(remarks) = &request.remarks { 
        active_model.remarks = Set(Some(remarks.clone()));
    }
    if let Some(department_code) = &request.department_code { 
        active_model.department_code = Set(department_code.clone());
    }
    if let Some(department_id) = &request.department_id { 
        active_model.department_id = Set(department_id.clone());
    }
    active_model
}

pub fn model_to_response(model: ErpProductCategories) -> ErpProductCategoriesResponse {
    ErpProductCategoriesResponse { 
        id: model.id,
        category_code: model.category_code,
        category_name: model.category_name,
        parent_id: model.parent_id,
        status: model.status,
        sort_order: model.sort_order,
        remarks: model.remarks,
        department_code: model.department_code,
        department_id: model.department_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}