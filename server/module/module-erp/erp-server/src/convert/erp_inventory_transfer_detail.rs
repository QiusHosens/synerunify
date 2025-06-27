use sea_orm::{Set, NotSet};
use crate::model::erp_inventory_transfer_detail::{self, Model as ErpInventoryTransferDetail, ActiveModel as ErpInventoryTransferDetailActiveModel};
use erp_model::request::erp_inventory_transfer_detail::{CreateErpInventoryTransferDetailRequest, UpdateErpInventoryTransferDetailRequest};
use erp_model::response::erp_inventory_transfer_detail::ErpInventoryTransferDetailResponse;

pub fn create_request_to_model(request: &CreateErpInventoryTransferDetailRequest) -> ErpInventoryTransferDetailActiveModel {
    ErpInventoryTransferDetailActiveModel {
        order_id: Set(request.order_id.clone()),
        from_warehouse_id: Set(request.from_warehouse_id.clone()),
        to_warehouse_id: Set(request.to_warehouse_id.clone()),
        product_id: Set(request.product_id.clone()),
        quantity: Set(request.quantity.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        department_code: Set(request.department_code.clone()),
        department_id: Set(request.department_id.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpInventoryTransferDetailRequest, existing: ErpInventoryTransferDetail) -> ErpInventoryTransferDetailActiveModel {
    let mut active_model: ErpInventoryTransferDetailActiveModel = existing.into();
    if let Some(order_id) = &request.order_id { 
        active_model.order_id = Set(order_id.clone());
    }
    if let Some(from_warehouse_id) = &request.from_warehouse_id { 
        active_model.from_warehouse_id = Set(from_warehouse_id.clone());
    }
    if let Some(to_warehouse_id) = &request.to_warehouse_id { 
        active_model.to_warehouse_id = Set(to_warehouse_id.clone());
    }
    if let Some(product_id) = &request.product_id { 
        active_model.product_id = Set(product_id.clone());
    }
    if let Some(quantity) = &request.quantity { 
        active_model.quantity = Set(quantity.clone());
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