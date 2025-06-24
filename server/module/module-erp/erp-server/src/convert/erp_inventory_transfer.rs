use sea_orm::{Set, NotSet};
use crate::model::erp_inventory_transfer::{self, Model as ErpInventoryTransfer, ActiveModel as ErpInventoryTransferActiveModel};
use crate::model::erp_product::{self, Model as ErpProduct};
use crate::model::erp_product_unit::{self, Model as ErpProductUnit};
use crate::model::erp_warehouse::{self, Model as ErpWarehouse};
use erp_model::request::erp_inventory_transfer::{CreateErpInventoryTransferRequest, UpdateErpInventoryTransferRequest};
use erp_model::response::erp_inventory_transfer::{ErpInventoryTransferPageResponse, ErpInventoryTransferResponse};

pub fn create_request_to_model(request: &CreateErpInventoryTransferRequest) -> ErpInventoryTransferActiveModel {
    ErpInventoryTransferActiveModel {
        from_warehouse_id: Set(request.from_warehouse_id.clone()),
        to_warehouse_id: Set(request.to_warehouse_id.clone()),
        product_id: Set(request.product_id.clone()),
        quantity: Set(request.quantity.clone()),
        transfer_date: Set(request.transfer_date.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpInventoryTransferRequest, existing: ErpInventoryTransfer) -> ErpInventoryTransferActiveModel {
    let mut active_model: ErpInventoryTransferActiveModel = existing.into();
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
    if let Some(transfer_date) = &request.transfer_date { 
        active_model.transfer_date = Set(transfer_date.clone());
    }
    if let Some(remarks) = &request.remarks { 
        active_model.remarks = Set(Some(remarks.clone()));
    }
    active_model
}

pub fn model_to_response(model: ErpInventoryTransfer) -> ErpInventoryTransferResponse {
    ErpInventoryTransferResponse { 
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

pub fn model_to_page_response(model: ErpInventoryTransfer, model_product: Option<ErpProduct>, model_from_warehouse: Option<ErpWarehouse>, model_to_warehouse: Option<ErpWarehouse>, model_unit: Option<ErpProductUnit>) -> ErpInventoryTransferPageResponse {
    let product_name = model_product.map(|product| product.name.clone());
    let from_warehouse_name = model_from_warehouse.map(|warehouse| warehouse.name.clone());
    let to_warehouse_name = model_to_warehouse.map(|warehouse| warehouse.name.clone());
    let unit_name = model_unit.map(|unit| unit.name.clone());

    ErpInventoryTransferPageResponse { 
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

        product_name,
        from_warehouse_name,
        to_warehouse_name,
        unit_name
    }
}