use erp_model::response::erp_purchase_return_attachment::ErpPurchaseReturnAttachmentBaseResponse;
use erp_model::response::erp_purchase_return_detail::ErpPurchaseReturnDetailBaseResponse;
use sea_orm::{Set, NotSet};
use crate::model::erp_purchase_return::{self, Model as ErpPurchaseReturn, ActiveModel as ErpPurchaseReturnActiveModel};
use crate::model::erp_purchase_order::{self, Model as ErpPurchaseOrder};
use crate::model::erp_supplier::{self, Model as ErpSupplier};
use crate::model::erp_settlement_account::{self, Model as ErpSettlementAccount};
use erp_model::request::erp_purchase_return::{CreateErpPurchaseReturnRequest, UpdateErpPurchaseReturnRequest};
use erp_model::response::erp_purchase_return::{ErpPurchaseReturnBaseResponse, ErpPurchaseReturnInfoResponse, ErpPurchaseReturnPageResponse, ErpPurchaseReturnResponse};

pub fn create_request_to_model(request: &CreateErpPurchaseReturnRequest) -> ErpPurchaseReturnActiveModel {
    ErpPurchaseReturnActiveModel {
        purchase_order_id: Set(request.purchase_order_id.clone()),
        return_date: Set(request.return_date.clone()),
        total_amount: Set(request.total_amount.clone()),
        discount_rate: request.discount_rate.as_ref().map_or(NotSet, |discount_rate| Set(Some(discount_rate.clone()))),
        settlement_account_id: request.settlement_account_id.as_ref().map_or(NotSet, |settlement_account_id| Set(Some(settlement_account_id.clone()))),
        deposit: request.deposit.as_ref().map_or(NotSet, |deposit| Set(Some(deposit.clone()))),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpPurchaseReturnRequest, existing: ErpPurchaseReturn) -> ErpPurchaseReturnActiveModel {
    let mut active_model: ErpPurchaseReturnActiveModel = existing.into();
    if let Some(return_date) = &request.return_date { 
        active_model.return_date = Set(return_date.clone());
    }
    if let Some(total_amount) = &request.total_amount { 
        active_model.total_amount = Set(total_amount.clone());
    }
    if let Some(order_status) = &request.order_status { 
        active_model.order_status = Set(order_status.clone());
    }
    if let Some(discount_rate) = &request.discount_rate { 
        active_model.discount_rate = Set(Some(discount_rate.clone()));
    }
    if let Some(settlement_account_id) = &request.settlement_account_id { 
        active_model.settlement_account_id = Set(Some(settlement_account_id.clone()));
    }
    if let Some(deposit) = &request.deposit { 
        active_model.deposit = Set(Some(deposit.clone()));
    }
    if let Some(remarks) = &request.remarks { 
        active_model.remarks = Set(Some(remarks.clone()));
    }
    active_model
}

pub fn model_to_response(model: ErpPurchaseReturn) -> ErpPurchaseReturnResponse {
    ErpPurchaseReturnResponse { 
        id: model.id,
        order_number: model.order_number,
        purchase_order_id: model.purchase_order_id,
        supplier_id: model.supplier_id,
        return_date: model.return_date,
        total_amount: model.total_amount,
        order_status: model.order_status,
        discount_rate: model.discount_rate,
        settlement_account_id: model.settlement_account_id,
        deposit: model.deposit,
        remarks: model.remarks,
        department_code: model.department_code,
        department_id: model.department_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}

pub fn model_to_page_response(model: ErpPurchaseReturn, model_purchase: Option<ErpPurchaseOrder>, model_supplier: Option<ErpSupplier>, model_settlement_account: Option<ErpSettlementAccount>) -> ErpPurchaseReturnPageResponse {
    let purchase_order_number = model_purchase.map(|purchase| purchase.order_number.clone());
    let supplier_name = model_supplier.map(|supplier| supplier.name.clone());
    let settlement_account_name = model_settlement_account.map(|settlement_account| settlement_account.name.clone());

    ErpPurchaseReturnPageResponse { 
        id: model.id,
        order_number: model.order_number,
        purchase_order_id: model.purchase_order_id,
        supplier_id: model.supplier_id,
        return_date: model.return_date,
        total_amount: model.total_amount,
        order_status: model.order_status,
        discount_rate: model.discount_rate,
        settlement_account_id: model.settlement_account_id,
        deposit: model.deposit,
        remarks: model.remarks,
        department_code: model.department_code,
        department_id: model.department_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,

        purchase_order_number,
        supplier_name,
        settlement_account_name
    }
}

pub fn model_to_base_response(model: ErpPurchaseReturn, details: Vec<ErpPurchaseReturnDetailBaseResponse>, attachments: Vec<ErpPurchaseReturnAttachmentBaseResponse>) -> ErpPurchaseReturnBaseResponse {
    ErpPurchaseReturnBaseResponse { 
        id: model.id,
        order_number: model.order_number,
        purchase_order_id: model.purchase_order_id,
        supplier_id: model.supplier_id,
        return_date: model.return_date,
        total_amount: model.total_amount,
        order_status: model.order_status,
        discount_rate: model.discount_rate,
        settlement_account_id: model.settlement_account_id,
        deposit: model.deposit,
        remarks: model.remarks,

        details,
        attachments,
    }
}

pub fn model_to_info_response(model: ErpPurchaseReturn, model_settlement_account: Option<ErpSettlementAccount>, details: Vec<ErpPurchaseReturnDetailBaseResponse>, attachments: Vec<ErpPurchaseReturnAttachmentBaseResponse>) -> ErpPurchaseReturnInfoResponse {
    let settlement_account_name = model_settlement_account.map(|settlement_account| settlement_account.name.clone());

    ErpPurchaseReturnInfoResponse { 
        id: model.id,
        order_number: model.order_number,
        purchase_order_id: model.purchase_order_id,
        supplier_id: model.supplier_id,
        return_date: model.return_date,
        total_amount: model.total_amount,
        order_status: model.order_status,
        discount_rate: model.discount_rate,
        settlement_account_id: model.settlement_account_id,
        deposit: model.deposit,
        remarks: model.remarks,

        details,
        attachments,
        settlement_account_name
    }
}