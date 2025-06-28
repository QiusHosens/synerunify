use sea_orm::{Set, NotSet};
use crate::model::erp_payment_detail::{self, Model as ErpPaymentDetail, ActiveModel as ErpPaymentDetailActiveModel};
use erp_model::request::erp_payment_detail::{CreateErpPaymentDetailRequest, UpdateErpPaymentDetailRequest};
use erp_model::response::erp_payment_detail::{ErpPaymentDetailBaseResponse, ErpPaymentDetailResponse};

pub fn create_request_to_model(request: &CreateErpPaymentDetailRequest) -> ErpPaymentDetailActiveModel {
    ErpPaymentDetailActiveModel {
        purchase_order_id: request.purchase_order_id.as_ref().map_or(NotSet, |purchase_order_id| Set(Some(purchase_order_id.clone()))),
        purchase_return_id: request.purchase_return_id.as_ref().map_or(NotSet, |purchase_return_id| Set(Some(purchase_return_id.clone()))),
        amount: Set(request.amount.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        ..Default::default()
    }
}

pub fn update_add_request_to_model(request: &UpdateErpPaymentDetailRequest) -> ErpPaymentDetailActiveModel {
    ErpPaymentDetailActiveModel {
        purchase_order_id: request.purchase_order_id.as_ref().map_or(NotSet, |purchase_order_id| Set(Some(purchase_order_id.clone()))),
        purchase_return_id: request.purchase_return_id.as_ref().map_or(NotSet, |purchase_return_id| Set(Some(purchase_return_id.clone()))),
        amount: Set(request.amount.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpPaymentDetailRequest, existing: ErpPaymentDetail) -> ErpPaymentDetailActiveModel {
    let mut active_model: ErpPaymentDetailActiveModel = existing.into();
    if let Some(purchase_order_id) = &request.purchase_order_id { 
        active_model.purchase_order_id = Set(Some(purchase_order_id.clone()));
    }
    if let Some(purchase_return_id) = &request.purchase_return_id { 
        active_model.purchase_return_id = Set(Some(purchase_return_id.clone()));
    }
    if let amount = &request.amount { 
        active_model.amount = Set(amount.clone());
    }
    if let Some(remarks) = &request.remarks { 
        active_model.remarks = Set(Some(remarks.clone()));
    }
    active_model
}

pub fn model_to_response(model: ErpPaymentDetail) -> ErpPaymentDetailResponse {
    ErpPaymentDetailResponse { 
        id: model.id,
        payment_id: model.payment_id,
        purchase_order_id: model.purchase_order_id,
        purchase_return_id: model.purchase_return_id,
        amount: model.amount,
        remarks: model.remarks,
        department_code: model.department_code,
        department_id: model.department_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}

pub fn model_to_base_response(model: ErpPaymentDetail) -> ErpPaymentDetailBaseResponse {
    ErpPaymentDetailBaseResponse { 
        id: model.id,
        purchase_order_id: model.purchase_order_id,
        purchase_return_id: model.purchase_return_id,
        amount: model.amount,
        remarks: model.remarks,
    }
}