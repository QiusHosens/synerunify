use sea_orm::{Set, NotSet};
use crate::model::erp_purchase_order::{self, Model as ErpPurchaseOrder, ActiveModel as ErpPurchaseOrderActiveModel};
use erp_model::request::erp_purchase_order::{CreateErpPurchaseOrderRequest, UpdateErpPurchaseOrderRequest};
use erp_model::response::erp_purchase_order::{ErpPurchaseOrderPageResponse, ErpPurchaseOrderResponse};
use crate::model::erp_supplier::{Model as ErpSupplierModel, ActiveModel as ErpSupplierActiveModel, Entity as ErpSupplierEntity};
use crate::model::erp_settlement_account::{Model as ErpSettlementAccountModel, ActiveModel as ErpSettlementAccountActiveModel, Entity as ErpSettlementAccountEntity};

pub fn create_request_to_model(request: &CreateErpPurchaseOrderRequest) -> ErpPurchaseOrderActiveModel {
    ErpPurchaseOrderActiveModel {
        supplier_id: Set(request.supplier_id.clone()),
        purchase_date: Set(request.purchase_date.clone()),
        total_amount: Set(request.total_amount.clone()),
        discount_rate: request.discount_rate.as_ref().map_or(NotSet, |discount_rate| Set(Some(discount_rate.clone()))),
        settlement_account_id: request.settlement_account_id.as_ref().map_or(NotSet, |settlement_account_id| Set(Some(settlement_account_id.clone()))),
        deposit: request.deposit.as_ref().map_or(NotSet, |deposit| Set(Some(deposit.clone()))),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpPurchaseOrderRequest, existing: ErpPurchaseOrder) -> ErpPurchaseOrderActiveModel {
    let mut active_model: ErpPurchaseOrderActiveModel = existing.into();
    if let Some(supplier_id) = &request.supplier_id { 
        active_model.supplier_id = Set(supplier_id.clone());
    }
    if let Some(purchase_date) = &request.purchase_date { 
        active_model.purchase_date = Set(purchase_date.clone());
    }
    if let Some(total_amount) = &request.total_amount { 
        active_model.total_amount = Set(total_amount.clone());
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

pub fn model_to_response(model: ErpPurchaseOrder) -> ErpPurchaseOrderResponse {
    ErpPurchaseOrderResponse { 
        id: model.id,
        order_number: model.order_number,
        supplier_id: model.supplier_id,
        user_id: model.user_id,
        purchase_date: model.purchase_date,
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

pub fn model_to_page_response(model: ErpPurchaseOrder, model_supplier: Option<ErpSupplierModel>, model_settlement_account: Option<ErpSettlementAccountModel>) -> ErpPurchaseOrderPageResponse {
    let supplier_name = model_supplier.map(|supplier| supplier.name.clone());
    let settlement_account_name = model_settlement_account.map(|settlement_account| settlement_account.name.clone());

    ErpPurchaseOrderPageResponse { 
        id: model.id,
        order_number: model.order_number,
        supplier_id: model.supplier_id,
        user_id: model.user_id,
        purchase_date: model.purchase_date,
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

        supplier_name,
        settlement_account_name,
    }
}