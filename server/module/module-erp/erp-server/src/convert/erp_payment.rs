use sea_orm::{Set, NotSet};
use crate::model::erp_payment::{self, Model as ErpPayment, ActiveModel as ErpPaymentActiveModel};
use erp_model::request::erp_payment::{CreateErpPaymentRequest, UpdateErpPaymentRequest};
use erp_model::response::erp_payment::ErpPaymentResponse;

pub fn create_request_to_model(request: &CreateErpPaymentRequest) -> ErpPaymentActiveModel {
    ErpPaymentActiveModel {
        supplier_id: Set(request.supplier_id.clone()),
        user_id: Set(request.user_id.clone()),
        settlement_account_id: request.settlement_account_id.as_ref().map_or(NotSet, |settlement_account_id| Set(Some(settlement_account_id.clone()))),
        amount: Set(request.amount.clone()),
        discount_amount: request.discount_amount.as_ref().map_or(NotSet, |discount_amount| Set(Some(discount_amount.clone()))),
        payment_date: Set(request.payment_date.clone()),
        payment_method: request.payment_method.as_ref().map_or(NotSet, |payment_method| Set(Some(payment_method.clone()))),
        description: request.description.as_ref().map_or(NotSet, |description| Set(Some(description.clone()))),
        payment_status: Set(request.payment_status.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        department_code: Set(request.department_code.clone()),
        department_id: Set(request.department_id.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpPaymentRequest, existing: ErpPayment) -> ErpPaymentActiveModel {
    let mut active_model: ErpPaymentActiveModel = existing.into();
    if let Some(supplier_id) = &request.supplier_id { 
        active_model.supplier_id = Set(supplier_id.clone());
    }
    if let Some(user_id) = &request.user_id { 
        active_model.user_id = Set(user_id.clone());
    }
    if let Some(settlement_account_id) = &request.settlement_account_id { 
        active_model.settlement_account_id = Set(Some(settlement_account_id.clone()));
    }
    if let Some(amount) = &request.amount { 
        active_model.amount = Set(amount.clone());
    }
    if let Some(discount_amount) = &request.discount_amount { 
        active_model.discount_amount = Set(Some(discount_amount.clone()));
    }
    if let Some(payment_date) = &request.payment_date { 
        active_model.payment_date = Set(payment_date.clone());
    }
    if let Some(payment_method) = &request.payment_method { 
        active_model.payment_method = Set(Some(payment_method.clone()));
    }
    if let Some(description) = &request.description { 
        active_model.description = Set(Some(description.clone()));
    }
    if let Some(payment_status) = &request.payment_status { 
        active_model.payment_status = Set(payment_status.clone());
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

pub fn model_to_response(model: ErpPayment) -> ErpPaymentResponse {
    ErpPaymentResponse { 
        id: model.id,
        supplier_id: model.supplier_id,
        user_id: model.user_id,
        settlement_account_id: model.settlement_account_id,
        amount: model.amount,
        discount_amount: model.discount_amount,
        payment_date: model.payment_date,
        payment_method: model.payment_method,
        description: model.description,
        payment_status: model.payment_status,
        remarks: model.remarks,
        department_code: model.department_code,
        department_id: model.department_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}