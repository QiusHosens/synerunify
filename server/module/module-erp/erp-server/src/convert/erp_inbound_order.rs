use sea_orm::{Set, NotSet};
use crate::model::erp_inbound_order::{self, Model as ErpInboundOrder, ActiveModel as ErpInboundOrderActiveModel};
use crate::model::erp_purchase_order::{self, Model as ErpPurchaseOrder};
use crate::model::erp_supplier::{self, Model as ErpSupplier};
use crate::model::erp_settlement_account::{self, Model as ErpSettlementAccount};
use erp_model::request::erp_inbound_order::{CreateErpInboundOrderOtherRequest, CreateErpInboundOrderPurchaseRequest, CreateErpInboundOrderRequest, UpdateErpInboundOrderOtherRequest, UpdateErpInboundOrderPurchaseRequest, UpdateErpInboundOrderRequest};
use erp_model::response::erp_inbound_order::{ErpInboundOrderPageOtherResponse, ErpInboundOrderPagePurchaseResponse, ErpInboundOrderResponse};

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

pub fn create_purchase_request_to_model(request: &CreateErpInboundOrderPurchaseRequest) -> ErpInboundOrderActiveModel {
    ErpInboundOrderActiveModel {
        purchase_id: Set(Some(request.purchase_id.clone())),
        inbound_date: Set(request.inbound_date.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        discount_rate: request.discount_rate.as_ref().map_or(NotSet, |discount_rate| Set(Some(discount_rate.clone()))),
        other_cost: request.other_cost.as_ref().map_or(NotSet, |other_cost| Set(Some(other_cost.clone()))),
        settlement_account_id: request.settlement_account_id.as_ref().map_or(NotSet, |settlement_account_id| Set(Some(settlement_account_id.clone()))),
        ..Default::default()
    }
}

pub fn create_other_request_to_model(request: &CreateErpInboundOrderOtherRequest) -> ErpInboundOrderActiveModel {
    ErpInboundOrderActiveModel {
        supplier_id: Set(request.supplier_id.clone()),
        inbound_date: Set(request.inbound_date.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        discount_rate: request.discount_rate.as_ref().map_or(NotSet, |discount_rate| Set(Some(discount_rate.clone()))),
        other_cost: request.other_cost.as_ref().map_or(NotSet, |other_cost| Set(Some(other_cost.clone()))),
        settlement_account_id: request.settlement_account_id.as_ref().map_or(NotSet, |settlement_account_id| Set(Some(settlement_account_id.clone()))),
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

pub fn update_purchase_request_to_model(request: &UpdateErpInboundOrderPurchaseRequest, existing: ErpInboundOrder) -> ErpInboundOrderActiveModel {
    let mut active_model: ErpInboundOrderActiveModel = existing.into();
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
    active_model
}

pub fn update_other_request_to_model(request: &UpdateErpInboundOrderOtherRequest, existing: ErpInboundOrder) -> ErpInboundOrderActiveModel {
    let mut active_model: ErpInboundOrderActiveModel = existing.into();
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
    active_model
}

pub fn model_to_response(model: ErpInboundOrder) -> ErpInboundOrderResponse {
    ErpInboundOrderResponse { 
        id: model.id,
        order_number: model.order_number,
        purchase_id: model.purchase_id,
        supplier_id: model.supplier_id,
        user_id: model.user_id,
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

pub fn model_to_page_purchase_response(model: ErpInboundOrder, model_purchase: Option<ErpPurchaseOrder>, model_settlement_account: Option<ErpSettlementAccount>) -> ErpInboundOrderPagePurchaseResponse {
    let purchase_order_number = model_purchase.map(|purchase| purchase.order_number.clone());
    let settlement_account_name = model_settlement_account.map(|settlement_account| settlement_account.name.clone());

    ErpInboundOrderPagePurchaseResponse { 
        id: model.id,
        order_number: model.order_number,
        purchase_id: model.purchase_id,
        supplier_id: model.supplier_id,
        user_id: model.user_id,
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

        purchase_order_number,
        supplier_name: None,
        settlement_account_name
    }
}

pub fn model_to_page_other_response(model: ErpInboundOrder, model_supplier: Option<ErpSupplier>, model_settlement_account: Option<ErpSettlementAccount>) -> ErpInboundOrderPageOtherResponse {
    let supplier_name = model_supplier.map(|supplier| supplier.name.clone());
    let settlement_account_name = model_settlement_account.map(|settlement_account| settlement_account.name.clone());

    ErpInboundOrderPageOtherResponse { 
        id: model.id,
        order_number: model.order_number,
        purchase_id: model.purchase_id,
        supplier_id: model.supplier_id,
        user_id: model.user_id,
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

        supplier_name,
        settlement_account_name
    }
}