use sea_orm::{Set, NotSet};
use crate::model::erp_payment_details::{self, Model as ErpPaymentDetails, ActiveModel as ErpPaymentDetailsActiveModel};
use erp_model::request::erp_payment_details::{CreateErpPaymentDetailsRequest, UpdateErpPaymentDetailsRequest};
use erp_model::response::erp_payment_details::ErpPaymentDetailsResponse;

pub fn create_request_to_model(request: &CreateErpPaymentDetailsRequest) -> ErpPaymentDetailsActiveModel {
    ErpPaymentDetailsActiveModel {
        payment_id: Set(request.payment_id.clone()),
        purchase_order_id: request.purchase_order_id.as_ref().map_or(NotSet, |purchase_order_id| Set(Some(purchase_order_id.clone()))),
        purchase_return_id: request.purchase_return_id.as_ref().map_or(NotSet, |purchase_return_id| Set(Some(purchase_return_id.clone()))),
        amount: Set(request.amount.clone()),
        description: request.description.as_ref().map_or(NotSet, |description| Set(Some(description.clone()))),
        department_code: Set(request.department_code.clone()),
        department_id: Set(request.department_id.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpPaymentDetailsRequest, existing: ErpPaymentDetails) -> ErpPaymentDetailsActiveModel {
    let mut active_model: ErpPaymentDetailsActiveModel = existing.into();
    if let Some(payment_id) = &request.payment_id { 
        active_model.payment_id = Set(payment_id.clone());
    }
    if let Some(purchase_order_id) = &request.purchase_order_id { 
        active_model.purchase_order_id = Set(Some(purchase_order_id.clone()));
    }
    if let Some(purchase_return_id) = &request.purchase_return_id { 
        active_model.purchase_return_id = Set(Some(purchase_return_id.clone()));
    }
    if let Some(amount) = &request.amount { 
        active_model.amount = Set(amount.clone());
    }
    if let Some(description) = &request.description { 
        active_model.description = Set(Some(description.clone()));
    }
    if let Some(department_code) = &request.department_code { 
        active_model.department_code = Set(department_code.clone());
    }
    if let Some(department_id) = &request.department_id { 
        active_model.department_id = Set(department_id.clone());
    }
    active_model
}

pub fn model_to_response(model: ErpPaymentDetails) -> ErpPaymentDetailsResponse {
    ErpPaymentDetailsResponse { 
        id: model.id,
        payment_id: model.payment_id,
        purchase_order_id: model.purchase_order_id,
        purchase_return_id: model.purchase_return_id,
        amount: model.amount,
        description: model.description,
        department_code: model.department_code,
        department_id: model.department_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}