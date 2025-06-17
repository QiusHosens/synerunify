use sea_orm::{Set, NotSet};
use crate::model::erp_inbound_order::{self, Model as ErpInboundOrder, ActiveModel as ErpInboundOrderActiveModel};
use erp_model::request::erp_inbound_order::{CreateErpInboundOrderRequest, UpdateErpInboundOrderRequest};
use erp_model::response::erp_inbound_order::ErpInboundOrderResponse;

pub fn create_request_to_model(request: &CreateErpInboundOrderRequest) -> ErpInboundOrderActiveModel {
    ErpInboundOrderActiveModel {
        purchase_id: request.purchase_id.as_ref().map_or(NotSet, |purchase_id| Set(Some(purchase_id.clone()))),
        supplier_id: Set(request.supplier_id.clone()),
        inbound_date: Set(request.inbound_date.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        discount_rate: request.discount_rate.as_ref().map_or(NotSet, |discount_rate| Set(Some(discount_rate.clone()))),
        other_cost: request.other_cost.as_ref().map_or(NotSet, |other_cost| Set(Some(other_cost.clone()))),
        settlement_account_id: request.settlement_account_id.as_ref().map_or(NotSet, |settlement_account_id| Set(Some(settlement_account_id.clone()))),
        department_code: Set(request.department_code.clone()),
        department_id: Set(request.department_id.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpInboundOrderRequest, existing: ErpInboundOrder) -> ErpInboundOrderActiveModel {
    let mut active_model: ErpInboundOrderActiveModel = existing.into();
    if let Some(purchase_id) = &request.purchase_id { 
        active_model.purchase_id = Set(Some(purchase_id.clone()));
    }
    if let Some(supplier_id) = &request.supplier_id { 
        active_model.supplier_id = Set(supplier_id.clone());
    }
    if let Some(inbound_date) = &request.inbound_date { 
        active_model.inbound_date = Set(inbound_date.clone());
    }
    if let Some(remarks) = &request.remarks { 
        active_model.remarks = Set(Some(remarks.clone()));
    }
    if let Some(discount_rate) = &request.discount_rate { 
        active_model.discount_rate = Set(Some(discount_rate.clone()));
    }
    if let Some(other_cost) = &request.other_cost { 
        active_model.other_cost = Set(Some(other_cost.clone()));
    }
    if let Some(settlement_account_id) = &request.settlement_account_id { 
        active_model.settlement_account_id = Set(Some(settlement_account_id.clone()));
    }
    if let Some(department_code) = &request.department_code { 
        active_model.department_code = Set(department_code.clone());
    }
    if let Some(department_id) = &request.department_id { 
        active_model.department_id = Set(department_id.clone());
    }
    active_model
}

pub fn model_to_response(model: ErpInboundOrder) -> ErpInboundOrderResponse {
    ErpInboundOrderResponse { 
        id: model.id,
        purchase_id: model.purchase_id,
        supplier_id: model.supplier_id,
        inbound_date: model.inbound_date,
        remarks: model.remarks,
        discount_rate: model.discount_rate,
        other_cost: model.other_cost,
        settlement_account_id: model.settlement_account_id,
        department_code: model.department_code,
        department_id: model.department_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}