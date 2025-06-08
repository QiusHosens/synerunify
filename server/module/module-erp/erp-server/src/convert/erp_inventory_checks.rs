use sea_orm::{Set, NotSet};
use crate::model::erp_inventory_checks::{self, Model as ErpInventoryChecks, ActiveModel as ErpInventoryChecksActiveModel};
use erp_model::request::erp_inventory_checks::{CreateErpInventoryChecksRequest, UpdateErpInventoryChecksRequest};
use erp_model::response::erp_inventory_checks::ErpInventoryChecksResponse;

pub fn create_request_to_model(request: &CreateErpInventoryChecksRequest) -> ErpInventoryChecksActiveModel {
    ErpInventoryChecksActiveModel {
        warehouse_id: request.warehouse_id.as_ref().map_or(NotSet, |warehouse_id| Set(Some(warehouse_id.clone()))),
        product_id: request.product_id.as_ref().map_or(NotSet, |product_id| Set(Some(product_id.clone()))),
        checked_quantity: Set(request.checked_quantity.clone()),
        check_date: Set(request.check_date.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        department_code: Set(request.department_code.clone()),
        department_id: Set(request.department_id.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpInventoryChecksRequest, existing: ErpInventoryChecks) -> ErpInventoryChecksActiveModel {
    let mut active_model: ErpInventoryChecksActiveModel = existing.into();
    if let Some(warehouse_id) = &request.warehouse_id { 
        active_model.warehouse_id = Set(Some(warehouse_id.clone()));
    }
    if let Some(product_id) = &request.product_id { 
        active_model.product_id = Set(Some(product_id.clone()));
    }
    if let Some(checked_quantity) = &request.checked_quantity { 
        active_model.checked_quantity = Set(checked_quantity.clone());
    }
    if let Some(check_date) = &request.check_date { 
        active_model.check_date = Set(check_date.clone());
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

pub fn model_to_response(model: ErpInventoryChecks) -> ErpInventoryChecksResponse {
    ErpInventoryChecksResponse { 
        id: model.id,
        warehouse_id: model.warehouse_id,
        product_id: model.product_id,
        checked_quantity: model.checked_quantity,
        check_date: model.check_date,
        remarks: model.remarks,
        department_code: model.department_code,
        department_id: model.department_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}