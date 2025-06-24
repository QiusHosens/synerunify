use sea_orm::{Set, NotSet};
use crate::model::erp_inventory_record::{self, Model as ErpInventoryRecord, ActiveModel as ErpInventoryRecordActiveModel};
use crate::model::erp_product::{self, Model as ErpProduct};
use crate::model::erp_product_unit::{self, Model as ErpProductUnit};
use crate::model::erp_warehouse::{self, Model as ErpWarehouse};
use erp_model::request::erp_inventory_record::{CreateErpInventoryRecordRequest, ErpInventoryRecordInRequest, ErpInventoryRecordOutRequest, UpdateErpInventoryRecordRequest};
use erp_model::response::erp_inventory_record::{ErpInventoryRecordPageResponse, ErpInventoryRecordResponse};

pub fn create_request_to_model(request: &CreateErpInventoryRecordRequest) -> ErpInventoryRecordActiveModel {
    ErpInventoryRecordActiveModel {
        product_id: Set(request.product_id.clone()),
        warehouse_id: Set(request.warehouse_id.clone()),
        quantity: Set(request.quantity.clone()),
        record_type: Set(request.record_type.clone()),
        record_date: Set(request.record_date.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        department_code: Set(request.department_code.clone()),
        department_id: Set(request.department_id.clone()),
        ..Default::default()
    }
}

pub fn create_in_request_to_model(request: &ErpInventoryRecordInRequest) -> ErpInventoryRecordActiveModel {
    ErpInventoryRecordActiveModel {
        product_id: Set(request.product_id.clone()),
        warehouse_id: Set(request.warehouse_id.clone()),
        quantity: Set(request.quantity.clone()),
        record_date: Set(request.record_date.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        ..Default::default()
    }
}

pub fn create_out_request_to_model(request: &ErpInventoryRecordOutRequest) -> ErpInventoryRecordActiveModel {
    ErpInventoryRecordActiveModel {
        product_id: Set(request.product_id.clone()),
        warehouse_id: Set(request.warehouse_id.clone()),
        quantity: Set(request.quantity.clone()),
        record_date: Set(request.record_date.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpInventoryRecordRequest, existing: ErpInventoryRecord) -> ErpInventoryRecordActiveModel {
    let mut active_model: ErpInventoryRecordActiveModel = existing.into();
    if let Some(product_id) = &request.product_id { 
        active_model.product_id = Set(product_id.clone());
    }
    if let Some(warehouse_id) = &request.warehouse_id { 
        active_model.warehouse_id = Set(warehouse_id.clone());
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

pub fn model_to_response(model: ErpInventoryRecord) -> ErpInventoryRecordResponse {
    ErpInventoryRecordResponse { 
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

pub fn model_to_page_response(model: ErpInventoryRecord, model_product: Option<ErpProduct>, model_warehouse: Option<ErpWarehouse>, model_unit: Option<ErpProductUnit>) -> ErpInventoryRecordPageResponse {
    let product_name = model_product.map(|product| product.name.clone());
    let warehouse_name = model_warehouse.map(|warehouse| warehouse.name.clone());
    let unit_name = model_unit.map(|unit| unit.name.clone());

    ErpInventoryRecordPageResponse { 
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

        product_name,
        warehouse_name,
        unit_name
    }
}