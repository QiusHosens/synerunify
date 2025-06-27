use sea_orm::{Set, NotSet};
use crate::model::erp_inventory_check_detail::{self, Model as ErpInventoryCheckDetail, ActiveModel as ErpInventoryCheckDetailActiveModel};
use erp_model::request::erp_inventory_check_detail::{CreateErpInventoryCheckDetailRequest, UpdateErpInventoryCheckDetailRequest};
use erp_model::response::erp_inventory_check_detail::ErpInventoryCheckDetailResponse;

pub fn create_request_to_model(request: &CreateErpInventoryCheckDetailRequest) -> ErpInventoryCheckDetailActiveModel {
    ErpInventoryCheckDetailActiveModel {
        order_id: Set(request.order_id.clone()),
        warehouse_id: Set(request.warehouse_id.clone()),
        product_id: Set(request.product_id.clone()),
        checked_quantity: Set(request.checked_quantity.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        department_code: Set(request.department_code.clone()),
        department_id: Set(request.department_id.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpInventoryCheckDetailRequest, existing: ErpInventoryCheckDetail) -> ErpInventoryCheckDetailActiveModel {
    let mut active_model: ErpInventoryCheckDetailActiveModel = existing.into();
    if let Some(order_id) = &request.order_id { 
        active_model.order_id = Set(order_id.clone());
    }
    if let Some(warehouse_id) = &request.warehouse_id { 
        active_model.warehouse_id = Set(warehouse_id.clone());
    }
    if let Some(product_id) = &request.product_id { 
        active_model.product_id = Set(product_id.clone());
    }
    if let Some(checked_quantity) = &request.checked_quantity { 
        active_model.checked_quantity = Set(checked_quantity.clone());
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

pub fn model_to_response(model: ErpInventoryCheckDetail) -> ErpInventoryCheckDetailResponse {
    ErpInventoryCheckDetailResponse { 
        id: model.id,
        order_id: model.order_id,
        warehouse_id: model.warehouse_id,
        product_id: model.product_id,
        checked_quantity: model.checked_quantity,
        remarks: model.remarks,
        department_code: model.department_code,
        department_id: model.department_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}