use sea_orm::{Set, NotSet};
use crate::model::erp_inventory_transfers::{self, Model as ErpInventoryTransfers, ActiveModel as ErpInventoryTransfersActiveModel};
use erp_model::request::erp_inventory_transfers::{CreateErpInventoryTransfersRequest, UpdateErpInventoryTransfersRequest};
use erp_model::response::erp_inventory_transfers::ErpInventoryTransfersResponse;

pub fn create_request_to_model(request: &CreateErpInventoryTransfersRequest) -> ErpInventoryTransfersActiveModel {
    ErpInventoryTransfersActiveModel {
        from_warehouse_id: request.from_warehouse_id.as_ref().map_or(NotSet, |from_warehouse_id| Set(Some(from_warehouse_id.clone()))),
        to_warehouse_id: request.to_warehouse_id.as_ref().map_or(NotSet, |to_warehouse_id| Set(Some(to_warehouse_id.clone()))),
        product_id: request.product_id.as_ref().map_or(NotSet, |product_id| Set(Some(product_id.clone()))),
        quantity: Set(request.quantity.clone()),
        transfer_date: Set(request.transfer_date.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        department_code: Set(request.department_code.clone()),
        department_id: Set(request.department_id.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpInventoryTransfersRequest, existing: ErpInventoryTransfers) -> ErpInventoryTransfersActiveModel {
    let mut active_model: ErpInventoryTransfersActiveModel = existing.into();
    if let Some(from_warehouse_id) = &request.from_warehouse_id { 
        active_model.from_warehouse_id = Set(Some(from_warehouse_id.clone()));
    }
    if let Some(to_warehouse_id) = &request.to_warehouse_id { 
        active_model.to_warehouse_id = Set(Some(to_warehouse_id.clone()));
    }
    if let Some(product_id) = &request.product_id { 
        active_model.product_id = Set(Some(product_id.clone()));
    }
    if let Some(quantity) = &request.quantity { 
        active_model.quantity = Set(quantity.clone());
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

pub fn model_to_response(model: ErpInventoryTransfers) -> ErpInventoryTransfersResponse {
    ErpInventoryTransfersResponse { 
        id: model.id,
        from_warehouse_id: model.from_warehouse_id,
        to_warehouse_id: model.to_warehouse_id,
        product_id: model.product_id,
        quantity: model.quantity,
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