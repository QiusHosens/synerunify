use sea_orm::{Set, NotSet};
use crate::model::erp_warehouse::{self, Model as ErpWarehouse, ActiveModel as ErpWarehouseActiveModel};
use erp_model::request::erp_warehouse::{CreateErpWarehouseRequest, UpdateErpWarehouseRequest};
use erp_model::response::erp_warehouse::ErpWarehouseResponse;

pub fn create_request_to_model(request: &CreateErpWarehouseRequest) -> ErpWarehouseActiveModel {
    ErpWarehouseActiveModel {
        name: Set(request.name.clone()),
        location: request.location.as_ref().map_or(NotSet, |location| Set(Some(location.clone()))),
        status: Set(request.status.clone()),
        sort_order: Set(request.sort_order.clone()),
        storage_fee: request.storage_fee.as_ref().map_or(NotSet, |storage_fee| Set(Some(storage_fee.clone()))),
        handling_fee: request.handling_fee.as_ref().map_or(NotSet, |handling_fee| Set(Some(handling_fee.clone()))),
        manager: request.manager.as_ref().map_or(NotSet, |manager| Set(Some(manager.clone()))),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        department_code: Set(request.department_code.clone()),
        department_id: Set(request.department_id.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpWarehouseRequest, existing: ErpWarehouse) -> ErpWarehouseActiveModel {
    let mut active_model: ErpWarehouseActiveModel = existing.into();
    if let Some(name) = &request.name {
        active_model.name = Set(name.clone());
    }
    if let Some(location) = &request.location { 
        active_model.location = Set(Some(location.clone()));
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    if let Some(sort_order) = &request.sort_order { 
        active_model.sort_order = Set(sort_order.clone());
    }
    if let Some(storage_fee) = &request.storage_fee { 
        active_model.storage_fee = Set(Some(storage_fee.clone()));
    }
    if let Some(handling_fee) = &request.handling_fee { 
        active_model.handling_fee = Set(Some(handling_fee.clone()));
    }
    if let Some(manager) = &request.manager { 
        active_model.manager = Set(Some(manager.clone()));
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

pub fn model_to_response(model: ErpWarehouse) -> ErpWarehouseResponse {
    ErpWarehouseResponse { 
        id: model.id,
        name: model.name,
        location: model.location,
        status: model.status,
        sort_order: model.sort_order,
        storage_fee: model.storage_fee,
        handling_fee: model.handling_fee,
        manager: model.manager,
        remarks: model.remarks,
        department_code: model.department_code,
        department_id: model.department_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}