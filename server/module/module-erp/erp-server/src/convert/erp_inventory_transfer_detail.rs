use sea_orm::{Set, NotSet};
use crate::model::erp_inventory_transfer_detail::{self, Model as ErpInventoryTransferDetail, ActiveModel as ErpInventoryTransferDetailActiveModel};
use erp_model::request::erp_inventory_transfer_detail::{CreateErpInventoryTransferDetailRequest, UpdateErpInventoryTransferDetailRequest};
use erp_model::response::erp_inventory_transfer_detail::{ErpInventoryTransferDetailBaseResponse, ErpInventoryTransferDetailResponse};

pub fn create_request_to_model(request: &CreateErpInventoryTransferDetailRequest) -> ErpInventoryTransferDetailActiveModel {
    ErpInventoryTransferDetailActiveModel {
        from_warehouse_id: Set(request.from_warehouse_id.clone()),
        to_warehouse_id: Set(request.to_warehouse_id.clone()),
        product_id: Set(request.product_id.clone()),
        quantity: Set(request.quantity.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        ..Default::default()
    }
}

pub fn update_add_request_to_model(request: &UpdateErpInventoryTransferDetailRequest) -> ErpInventoryTransferDetailActiveModel {
    ErpInventoryTransferDetailActiveModel {
        from_warehouse_id: Set(request.from_warehouse_id.clone()),
        to_warehouse_id: Set(request.to_warehouse_id.clone()),
        product_id: Set(request.product_id.clone()),
        quantity: Set(request.quantity.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpInventoryTransferDetailRequest, existing: ErpInventoryTransferDetail) -> ErpInventoryTransferDetailActiveModel {
    let mut active_model: ErpInventoryTransferDetailActiveModel = existing.into();
    if let from_warehouse_id = &request.from_warehouse_id { 
        active_model.from_warehouse_id = Set(from_warehouse_id.clone());
    }
    if let to_warehouse_id = &request.to_warehouse_id { 
        active_model.to_warehouse_id = Set(to_warehouse_id.clone());
    }
    if let product_id = &request.product_id { 
        active_model.product_id = Set(product_id.clone());
    }
    if let quantity = &request.quantity { 
        active_model.quantity = Set(quantity.clone());
    }
    if let Some(remarks) = &request.remarks { 
        active_model.remarks = Set(Some(remarks.clone()));
    }
    active_model
}

pub fn model_to_response(model: ErpInventoryTransferDetail) -> ErpInventoryTransferDetailResponse {
    ErpInventoryTransferDetailResponse { 
        id: model.id,
        order_id: model.order_id,
        from_warehouse_id: model.from_warehouse_id,
        to_warehouse_id: model.to_warehouse_id,
        product_id: model.product_id,
        quantity: model.quantity,
        remarks: model.remarks,
        department_code: model.department_code,
        department_id: model.department_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}

pub fn model_to_base_response(model: ErpInventoryTransferDetail) -> ErpInventoryTransferDetailBaseResponse {
    ErpInventoryTransferDetailBaseResponse { 
        id: model.id,
        from_warehouse_id: model.from_warehouse_id,
        to_warehouse_id: model.to_warehouse_id,
        product_id: model.product_id,
        quantity: model.quantity,
        remarks: model.remarks,
    }
}