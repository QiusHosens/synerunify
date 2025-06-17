use sea_orm::{Set, NotSet};
use crate::model::erp_inbound_record::{self, Model as ErpInboundRecord, ActiveModel as ErpInboundRecordActiveModel};
use erp_model::request::erp_inbound_record::{CreateErpInboundPurchaseRequest, CreateErpInboundRecordRequest, UpdateErpInboundRecordRequest};
use erp_model::response::erp_inbound_record::ErpInboundRecordResponse;

pub fn create_request_to_model(request: &CreateErpInboundRecordRequest) -> ErpInboundRecordActiveModel {
    ErpInboundRecordActiveModel {
        purchase_id: request.purchase_id.as_ref().map_or(NotSet, |purchase_id| Set(Some(purchase_id.clone()))),
        warehouse_id: Set(request.warehouse_id.clone()),
        product_id: Set(request.product_id.clone()),
        quantity: Set(request.quantity.clone()),
        inbound_date: Set(request.inbound_date.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        department_code: Set(request.department_code.clone()),
        department_id: Set(request.department_id.clone()),
        ..Default::default()
    }
}

pub fn create_purchase_request_to_model(request: &CreateErpInboundPurchaseRequest) -> ErpInboundRecordActiveModel {
    ErpInboundRecordActiveModel {
        purchase_id: Set(Some(request.purchase_id.clone())),
        warehouse_id: Set(request.warehouse_id.clone()),
        inbound_date: Set(request.inbound_date.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpInboundRecordRequest, existing: ErpInboundRecord) -> ErpInboundRecordActiveModel {
    let mut active_model: ErpInboundRecordActiveModel = existing.into();
    if let Some(purchase_id) = &request.purchase_id { 
        active_model.purchase_id = Set(Some(purchase_id.clone()));
    }
    if let Some(warehouse_id) = &request.warehouse_id { 
        active_model.warehouse_id = Set(warehouse_id.clone());
    }
    if let Some(product_id) = &request.product_id { 
        active_model.product_id = Set(product_id.clone());
    }
    if let Some(quantity) = &request.quantity { 
        active_model.quantity = Set(quantity.clone());
    }
    if let Some(inbound_date) = &request.inbound_date { 
        active_model.inbound_date = Set(inbound_date.clone());
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

pub fn model_to_response(model: ErpInboundRecord) -> ErpInboundRecordResponse {
    ErpInboundRecordResponse { 
        id: model.id,
        purchase_id: model.purchase_id,
        warehouse_id: model.warehouse_id,
        product_id: model.product_id,
        quantity: model.quantity,
        inbound_date: model.inbound_date,
        remarks: model.remarks,
        department_code: model.department_code,
        department_id: model.department_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}