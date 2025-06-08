use sea_orm::{Set, NotSet};
use crate::model::erp_inventory_records::{self, Model as ErpInventoryRecords, ActiveModel as ErpInventoryRecordsActiveModel};
use erp_model::request::erp_inventory_records::{CreateErpInventoryRecordsRequest, UpdateErpInventoryRecordsRequest};
use erp_model::response::erp_inventory_records::ErpInventoryRecordsResponse;

pub fn create_request_to_model(request: &CreateErpInventoryRecordsRequest) -> ErpInventoryRecordsActiveModel {
    ErpInventoryRecordsActiveModel {
        product_id: request.product_id.as_ref().map_or(NotSet, |product_id| Set(Some(product_id.clone()))),
        warehouse_id: request.warehouse_id.as_ref().map_or(NotSet, |warehouse_id| Set(Some(warehouse_id.clone()))),
        quantity: Set(request.quantity.clone()),
        record_type: Set(request.record_type.clone()),
        record_date: Set(request.record_date.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        department_code: Set(request.department_code.clone()),
        department_id: Set(request.department_id.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpInventoryRecordsRequest, existing: ErpInventoryRecords) -> ErpInventoryRecordsActiveModel {
    let mut active_model: ErpInventoryRecordsActiveModel = existing.into();
    if let Some(product_id) = &request.product_id { 
        active_model.product_id = Set(Some(product_id.clone()));
    }
    if let Some(warehouse_id) = &request.warehouse_id { 
        active_model.warehouse_id = Set(Some(warehouse_id.clone()));
    }
    if let Some(quantity) = &request.quantity { 
        active_model.quantity = Set(quantity.clone());
    }
    if let Some(record_type) = &request.record_type { 
        active_model.record_type = Set(record_type.clone());
    }
    if let Some(record_date) = &request.record_date { 
        active_model.record_date = Set(record_date.clone());
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

pub fn model_to_response(model: ErpInventoryRecords) -> ErpInventoryRecordsResponse {
    ErpInventoryRecordsResponse { 
        id: model.id,
        product_id: model.product_id,
        warehouse_id: model.warehouse_id,
        quantity: model.quantity,
        record_type: model.record_type,
        record_date: model.record_date,
        remarks: model.remarks,
        department_code: model.department_code,
        department_id: model.department_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}