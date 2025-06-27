use sea_orm::{Set, NotSet};
use crate::model::erp_inventory_transfer::{self, Model as ErpInventoryTransfer, ActiveModel as ErpInventoryTransferActiveModel};
use erp_model::request::erp_inventory_transfer::{CreateErpInventoryTransferRequest, UpdateErpInventoryTransferRequest};
use erp_model::response::erp_inventory_transfer::ErpInventoryTransferResponse;

pub fn create_request_to_model(request: &CreateErpInventoryTransferRequest) -> ErpInventoryTransferActiveModel {
    ErpInventoryTransferActiveModel {
        order_number: Set(request.order_number.clone()),
        transfer_date: Set(request.transfer_date.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        department_code: Set(request.department_code.clone()),
        department_id: Set(request.department_id.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpInventoryTransferRequest, existing: ErpInventoryTransfer) -> ErpInventoryTransferActiveModel {
    let mut active_model: ErpInventoryTransferActiveModel = existing.into();
    if let Some(order_number) = &request.order_number { 
        active_model.order_number = Set(order_number.clone());
    }
    if let Some(transfer_date) = &request.transfer_date { 
        active_model.transfer_date = Set(transfer_date.clone());
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

pub fn model_to_response(model: ErpInventoryTransfer) -> ErpInventoryTransferResponse {
    ErpInventoryTransferResponse { 
        id: model.id,
        order_number: model.order_number,
        transfer_date: model.transfer_date,
        remarks: model.remarks,
        department_code: model.department_code,
        department_id: model.department_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}