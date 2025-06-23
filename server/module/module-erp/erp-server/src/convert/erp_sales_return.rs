use erp_model::response::erp_sales_return_attachment::ErpSalesReturnAttachmentBaseResponse;
use erp_model::response::erp_sales_return_detail::ErpSalesReturnDetailBaseResponse;
use sea_orm::{Set, NotSet};
use crate::model::erp_sales_return::{self, Model as ErpSalesReturn, ActiveModel as ErpSalesReturnActiveModel};
use crate::model::erp_sales_order::{self, Model as ErpSalesOrder};
use crate::model::erp_customer::{self, Model as ErpCustomer};
use crate::model::erp_settlement_account::{self, Model as ErpSettlementAccount};
use erp_model::request::erp_sales_return::{CreateErpSalesReturnRequest, UpdateErpSalesReturnRequest};
use erp_model::response::erp_sales_return::{ErpSalesReturnBaseResponse, ErpSalesReturnInfoResponse, ErpSalesReturnPageResponse, ErpSalesReturnResponse};

pub fn create_request_to_model(request: &CreateErpSalesReturnRequest) -> ErpSalesReturnActiveModel {
    ErpSalesReturnActiveModel {
        sales_order_id: Set(request.sales_order_id.clone()),
        return_date: Set(request.return_date.clone()),
        total_amount: Set(request.total_amount.clone()),
        order_status: Set(request.order_status.clone()),
        discount_rate: request.discount_rate.as_ref().map_or(NotSet, |discount_rate| Set(Some(discount_rate.clone()))),
        settlement_account_id: request.settlement_account_id.as_ref().map_or(NotSet, |settlement_account_id| Set(Some(settlement_account_id.clone()))),
        deposit: request.deposit.as_ref().map_or(NotSet, |deposit| Set(Some(deposit.clone()))),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpSalesReturnRequest, existing: ErpSalesReturn) -> ErpSalesReturnActiveModel {
    let mut active_model: ErpSalesReturnActiveModel = existing.into();
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

pub fn model_to_response(model: ErpSalesReturn) -> ErpSalesReturnResponse {
    ErpSalesReturnResponse { 
        id: model.id,
        order_number: model.order_number,
        sales_order_id: model.sales_order_id,
        customer_id: model.customer_id,
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

pub fn model_to_page_response(model: ErpSalesReturn, model_sales: Option<ErpSalesOrder>, model_customer: Option<ErpCustomer>, model_settlement_account: Option<ErpSettlementAccount>) -> ErpSalesReturnPageResponse {
    let sales_order_number = model_sales.map(|sales| sales.order_number.clone());
    let customer_name = model_customer.map(|customer| customer.name.clone());
    let settlement_account_name = model_settlement_account.map(|settlement_account| settlement_account.name.clone());

    ErpSalesReturnPageResponse { 
        id: model.id,
        order_number: model.order_number,
        sales_order_id: model.sales_order_id,
        customer_id: model.customer_id,
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

        sales_order_number,
        customer_name,
        settlement_account_name,
    }
}

pub fn model_to_base_response(model: ErpSalesReturn, details: Vec<ErpSalesReturnDetailBaseResponse>, attachments: Vec<ErpSalesReturnAttachmentBaseResponse>) -> ErpSalesReturnBaseResponse {
    ErpSalesReturnBaseResponse { 
        id: model.id,
        order_number: model.order_number,
        sales_order_id: model.sales_order_id,
        customer_id: model.customer_id,
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

pub fn model_to_info_response(model: ErpSalesReturn, model_settlement_account: Option<ErpSettlementAccount>, details: Vec<ErpSalesReturnDetailBaseResponse>, attachments: Vec<ErpSalesReturnAttachmentBaseResponse>) -> ErpSalesReturnInfoResponse {
    let settlement_account_name = model_settlement_account.map(|settlement_account| settlement_account.name.clone());

    ErpSalesReturnInfoResponse { 
        id: model.id,
        order_number: model.order_number,
        sales_order_id: model.sales_order_id,
        customer_id: model.customer_id,
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