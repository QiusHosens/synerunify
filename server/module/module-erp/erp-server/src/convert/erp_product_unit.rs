use sea_orm::{Set, NotSet};
use crate::model::erp_product_unit::{self, Model as ErpProductUnit, ActiveModel as ErpProductUnitActiveModel};
use erp_model::request::erp_product_unit::{CreateErpProductUnitRequest, UpdateErpProductUnitRequest};
use erp_model::response::erp_product_unit::ErpProductUnitResponse;

pub fn create_request_to_model(request: &CreateErpProductUnitRequest) -> ErpProductUnitActiveModel {
    ErpProductUnitActiveModel {
        name: Set(request.name.clone()),
        status: Set(request.status.clone()),
        sort: Set(request.sort.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpProductUnitRequest, existing: ErpProductUnit) -> ErpProductUnitActiveModel {
    let mut active_model: ErpProductUnitActiveModel = existing.into();
    if let Some(name) = &request.name {
        active_model.name = Set(name.clone());
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

pub fn model_to_response(model: ErpProductUnit) -> ErpProductUnitResponse {
    ErpProductUnitResponse { 
        id: model.id,
        name: model.name,
        status: model.status,
        sort: model.sort,
        remarks: model.remarks,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}