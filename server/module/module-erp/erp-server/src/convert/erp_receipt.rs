use erp_model::response::erp_receipt_attachment::ErpReceiptAttachmentBaseResponse;
use erp_model::response::erp_receipt_detail::ErpReceiptDetailBaseResponse;
use sea_orm::{Set, NotSet};
use crate::model::erp_receipt::{self, Model as ErpReceipt, ActiveModel as ErpReceiptActiveModel};
use crate::model::erp_customer::{Model as ErpCustomerModel};
use crate::model::erp_settlement_account::{Model as ErpSettlementAccountModel};
use erp_model::request::erp_receipt::{CreateErpReceiptRequest, UpdateErpReceiptRequest};
use erp_model::response::erp_receipt::{ErpReceiptBaseResponse, ErpReceiptInfoResponse, ErpReceiptPageResponse, ErpReceiptResponse};

pub fn create_request_to_model(request: &CreateErpReceiptRequest) -> ErpReceiptActiveModel {
    ErpReceiptActiveModel {
        customer_id: Set(request.customer_id.clone()),
        settlement_account_id: request.settlement_account_id.as_ref().map_or(NotSet, |settlement_account_id| Set(Some(settlement_account_id.clone()))),
        amount: Set(request.amount.clone()),
        discount_amount: request.discount_amount.as_ref().map_or(NotSet, |discount_amount| Set(Some(discount_amount.clone()))),
        receipt_date: Set(request.receipt_date.clone()),
        payment_method: request.payment_method.as_ref().map_or(NotSet, |payment_method| Set(Some(payment_method.clone()))),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpReceiptRequest, existing: ErpReceipt) -> ErpReceiptActiveModel {
    let mut active_model: ErpReceiptActiveModel = existing.into();
    if let Some(customer_id) = &request.customer_id { 
        active_model.customer_id = Set(customer_id.clone());
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
    if let Some(receipt_date) = &request.receipt_date { 
        active_model.receipt_date = Set(receipt_date.clone());
    }
    if let Some(payment_method) = &request.payment_method { 
        active_model.payment_method = Set(Some(payment_method.clone()));
    }
    if let Some(remarks) = &request.remarks { 
        active_model.remarks = Set(Some(remarks.clone()));
    }
    active_model
}

pub fn model_to_response(model: ErpReceipt) -> ErpReceiptResponse {
    ErpReceiptResponse { 
        id: model.id,
        customer_id: model.customer_id,
        user_id: model.user_id,
        settlement_account_id: model.settlement_account_id,
        amount: model.amount,
        discount_amount: model.discount_amount,
        receipt_date: model.receipt_date,
        payment_method: model.payment_method,
        receipt_status: model.receipt_status,
        remarks: model.remarks,
        department_code: model.department_code,
        department_id: model.department_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}

pub fn model_to_page_response(model: ErpReceipt, model_customer: Option<ErpCustomerModel>, model_settlement_account: Option<ErpSettlementAccountModel>) -> ErpReceiptPageResponse {
    let customer_name = model_customer.map(|customer| customer.name.clone());
    let settlement_account_name = model_settlement_account.map(|settlement_account| settlement_account.name.clone());

    ErpReceiptPageResponse { 
        id: model.id,
        customer_id: model.customer_id,
        user_id: model.user_id,
        settlement_account_id: model.settlement_account_id,
        amount: model.amount,
        discount_amount: model.discount_amount,
        receipt_date: model.receipt_date,
        payment_method: model.payment_method,
        receipt_status: model.receipt_status,
        remarks: model.remarks,
        department_code: model.department_code,
        department_id: model.department_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,

        customer_name,
        settlement_account_name,
    }
}

pub fn model_to_base_response(model: ErpReceipt, details: Vec<ErpReceiptDetailBaseResponse>, attachments: Vec<ErpReceiptAttachmentBaseResponse>) -> ErpReceiptBaseResponse {
    ErpReceiptBaseResponse { 
        id: model.id,
        customer_id: model.customer_id,
        user_id: model.user_id,
        settlement_account_id: model.settlement_account_id,
        amount: model.amount,
        discount_amount: model.discount_amount,
        receipt_date: model.receipt_date,
        payment_method: model.payment_method,
        receipt_status: model.receipt_status,
        remarks: model.remarks,

        details,
        attachments,
    }
}

pub fn model_to_info_response(model: ErpReceipt, model_customer: Option<ErpCustomerModel>, model_settlement_account: Option<ErpSettlementAccountModel>, details: Vec<ErpReceiptDetailBaseResponse>, attachments: Vec<ErpReceiptAttachmentBaseResponse>) -> ErpReceiptInfoResponse {
    let customer_name = model_customer.map(|customer| customer.name.clone());
    let settlement_account_name = model_settlement_account.map(|settlement_account| settlement_account.name.clone());

    ErpReceiptInfoResponse { 
        id: model.id,
        customer_id: model.customer_id,
        user_id: model.user_id,
        settlement_account_id: model.settlement_account_id,
        amount: model.amount,
        discount_amount: model.discount_amount,
        receipt_date: model.receipt_date,
        payment_method: model.payment_method,
        receipt_status: model.receipt_status,
        remarks: model.remarks,

        customer_name,
        settlement_account_name,

        details,
        attachments,
    }
}