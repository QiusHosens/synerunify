use sea_orm::{Set, NotSet};
use crate::model::erp_product_unit::{self, Model as ErpProductUnit, ActiveModel as ErpProductUnitActiveModel};
use erp_model::request::erp_product_unit::{CreateErpProductUnitRequest, UpdateErpProductUnitRequest};
use erp_model::response::erp_product_unit::ErpProductUnitResponse;

pub fn create_request_to_model(request: &CreateErpProductUnitRequest) -> ErpProductUnitActiveModel {
    ErpProductUnitActiveModel {
        unit_name: Set(request.unit_name.clone()),
        status: Set(request.status.clone()),
        sort: Set(request.sort.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        department_code: Set(request.department_code.clone()),
        department_id: Set(request.department_id.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpProductUnitRequest, existing: ErpProductUnit) -> ErpProductUnitActiveModel {
    let mut active_model: ErpProductUnitActiveModel = existing.into();
    if let Some(unit_name) = &request.unit_name { 
        active_model.unit_name = Set(unit_name.clone());
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
    if let Some(department_code) = &request.department_code { 
        active_model.department_code = Set(department_code.clone());
    }
    if let Some(department_id) = &request.department_id { 
        active_model.department_id = Set(department_id.clone());
    }
    active_model
}

pub fn model_to_response(model: ErpProductUnit) -> ErpProductUnitResponse {
    ErpProductUnitResponse { 
        id: model.id,
        unit_name: model.unit_name,
        status: model.status,
        sort: model.sort,
        remarks: model.remarks,
        department_code: model.department_code,
        department_id: model.department_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}