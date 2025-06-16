use sea_orm::{Set, NotSet};
use crate::model::erp_purchase_order_detail::{self, Model as ErpPurchaseOrderDetail, ActiveModel as ErpPurchaseOrderDetailActiveModel};
use erp_model::request::erp_purchase_order_detail::{CreateErpPurchaseOrderDetailRequest, UpdateErpPurchaseOrderDetailRequest};
use erp_model::response::erp_purchase_order_detail::{ErpPurchaseOrderDetailBaseResponse, ErpPurchaseOrderDetailResponse};

pub fn create_request_to_model(request: &CreateErpPurchaseOrderDetailRequest) -> ErpPurchaseOrderDetailActiveModel {
    ErpPurchaseOrderDetailActiveModel {
        product_id: Set(request.product_id.clone()),
        quantity: Set(request.quantity.clone()),
        unit_price: Set(request.unit_price.clone()),
        subtotal: Set(request.subtotal.clone()),
        tax_rate: request.tax_rate.as_ref().map_or(NotSet, |tax_rate| Set(Some(tax_rate.clone()))),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        ..Default::default()
    }
}

pub fn update_add_request_to_model(request: &UpdateErpPurchaseOrderDetailRequest) -> ErpPurchaseOrderDetailActiveModel {
    ErpPurchaseOrderDetailActiveModel {
        product_id: Set(request.product_id.clone()),
        quantity: Set(request.quantity.clone()),
        unit_price: Set(request.unit_price.clone()),
        subtotal: Set(request.subtotal.clone()),
        tax_rate: request.tax_rate.as_ref().map_or(NotSet, |tax_rate| Set(Some(tax_rate.clone()))),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpPurchaseOrderDetailRequest, existing: ErpPurchaseOrderDetail) -> ErpPurchaseOrderDetailActiveModel {
    let mut active_model: ErpPurchaseOrderDetailActiveModel = existing.into();
    if let quantity = &request.quantity { 
        active_model.quantity = Set(quantity.clone());
    }
    if let unit_price = &request.unit_price { 
        active_model.unit_price = Set(unit_price.clone());
    }
    if let subtotal = &request.subtotal { 
        active_model.subtotal = Set(subtotal.clone());
    }
    if let Some(tax_rate) = &request.tax_rate { 
        active_model.tax_rate = Set(Some(tax_rate.clone()));
    }
    if let Some(remarks) = &request.remarks { 
        active_model.remarks = Set(Some(remarks.clone()));
    }
    active_model
}

pub fn model_to_response(model: ErpPurchaseOrderDetail) -> ErpPurchaseOrderDetailResponse {
    ErpPurchaseOrderDetailResponse { 
        id: model.id,
        purchase_id: model.purchase_id,
        product_id: model.product_id,
        quantity: model.quantity,
        unit_price: model.unit_price,
        subtotal: model.subtotal,
        tax_rate: model.tax_rate,
        remarks: model.remarks,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}

pub fn model_to_base_response(model: ErpPurchaseOrderDetail) -> ErpPurchaseOrderDetailBaseResponse {
    ErpPurchaseOrderDetailBaseResponse { 
        id: model.id,
        purchase_id: model.purchase_id,
        product_id: model.product_id,
        quantity: model.quantity,
        unit_price: model.unit_price,
        subtotal: model.subtotal,
        tax_rate: model.tax_rate,
        remarks: model.remarks,
    }
}