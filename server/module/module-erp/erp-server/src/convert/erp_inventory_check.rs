use sea_orm::{Set, NotSet};
use crate::model::erp_inventory_check::{self, Model as ErpInventoryCheck, ActiveModel as ErpInventoryCheckActiveModel};
use crate::model::erp_product::{self, Model as ErpProduct};
use crate::model::erp_product_unit::{self, Model as ErpProductUnit};
use crate::model::erp_warehouse::{self, Model as ErpWarehouse};
use erp_model::request::erp_inventory_check::{CreateErpInventoryCheckRequest, UpdateErpInventoryCheckRequest};
use erp_model::response::erp_inventory_check::{ErpInventoryCheckPageResponse, ErpInventoryCheckResponse};

pub fn create_request_to_model(request: &CreateErpInventoryCheckRequest) -> ErpInventoryCheckActiveModel {
    ErpInventoryCheckActiveModel {
        warehouse_id: Set(request.warehouse_id.clone()),
        product_id: Set(request.product_id.clone()),
        checked_quantity: Set(request.checked_quantity.clone()),
        check_date: Set(request.check_date.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpInventoryCheckRequest, existing: ErpInventoryCheck) -> ErpInventoryCheckActiveModel {
    let mut active_model: ErpInventoryCheckActiveModel = existing.into();
    if let Some(warehouse_id) = &request.warehouse_id { 
        active_model.warehouse_id = Set(warehouse_id.clone());
    }
    if let Some(product_id) = &request.product_id { 
        active_model.product_id = Set(product_id.clone());
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
    active_model
}

pub fn model_to_response(model: ErpInventoryCheck) -> ErpInventoryCheckResponse {
    ErpInventoryCheckResponse { 
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

pub fn model_to_page_response(model: ErpInventoryCheck, model_product: Option<ErpProduct>, model_warehouse: Option<ErpWarehouse>, model_unit: Option<ErpProductUnit>) -> ErpInventoryCheckPageResponse {
    let product_name = model_product.map(|product| product.name.clone());
    let warehouse_name = model_warehouse.map(|warehouse| warehouse.name.clone());
    let unit_name = model_unit.map(|unit| unit.name.clone());

    ErpInventoryCheckPageResponse { 
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

        product_name,
        warehouse_name,
        unit_name
    }
}