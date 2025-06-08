use sea_orm::{Set, NotSet};
use crate::model::erp_outbound_records::{self, Model as ErpOutboundRecords, ActiveModel as ErpOutboundRecordsActiveModel};
use erp_model::request::erp_outbound_records::{CreateErpOutboundRecordsRequest, UpdateErpOutboundRecordsRequest};
use erp_model::response::erp_outbound_records::ErpOutboundRecordsResponse;

pub fn create_request_to_model(request: &CreateErpOutboundRecordsRequest) -> ErpOutboundRecordsActiveModel {
    ErpOutboundRecordsActiveModel {
        order_id: request.order_id.as_ref().map_or(NotSet, |order_id| Set(Some(order_id.clone()))),
        warehouse_id: request.warehouse_id.as_ref().map_or(NotSet, |warehouse_id| Set(Some(warehouse_id.clone()))),
        product_id: request.product_id.as_ref().map_or(NotSet, |product_id| Set(Some(product_id.clone()))),
        quantity: Set(request.quantity.clone()),
        outbound_date: Set(request.outbound_date.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        department_code: Set(request.department_code.clone()),
        department_id: Set(request.department_id.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpOutboundRecordsRequest, existing: ErpOutboundRecords) -> ErpOutboundRecordsActiveModel {
    let mut active_model: ErpOutboundRecordsActiveModel = existing.into();
    if let Some(order_id) = &request.order_id { 
        active_model.order_id = Set(Some(order_id.clone()));
    }
    if let Some(warehouse_id) = &request.warehouse_id { 
        active_model.warehouse_id = Set(Some(warehouse_id.clone()));
    }
    if let Some(product_id) = &request.product_id { 
        active_model.product_id = Set(Some(product_id.clone()));
    }
    if let Some(quantity) = &request.quantity { 
        active_model.quantity = Set(quantity.clone());
    }
    if let Some(outbound_date) = &request.outbound_date { 
        active_model.outbound_date = Set(outbound_date.clone());
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

pub fn model_to_response(model: ErpOutboundRecords) -> ErpOutboundRecordsResponse {
    ErpOutboundRecordsResponse { 
        id: model.id,
        order_id: model.order_id,
        warehouse_id: model.warehouse_id,
        product_id: model.product_id,
        quantity: model.quantity,
        outbound_date: model.outbound_date,
        remarks: model.remarks,
        department_code: model.department_code,
        department_id: model.department_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}