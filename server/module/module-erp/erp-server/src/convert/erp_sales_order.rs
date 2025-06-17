use erp_model::response::erp_sales_order_attachment::ErpSalesOrderAttachmentBaseResponse;
use erp_model::response::erp_sales_order_detail::ErpSalesOrderDetailBaseResponse;
use sea_orm::{Set, NotSet};
use crate::model::erp_sales_order::{self, Model as ErpSalesOrder, ActiveModel as ErpSalesOrderActiveModel};
use crate::model::erp_customer::{Model as ErpCustomerModel};
use crate::model::erp_settlement_account::{Model as ErpSettlementAccountModel};
use erp_model::request::erp_sales_order::{CreateErpSalesOrderRequest, UpdateErpSalesOrderRequest};
use erp_model::response::erp_sales_order::{ErpSalesOrderBaseResponse, ErpSalesOrderPageResponse, ErpSalesOrderResponse};

pub fn create_request_to_model(request: &CreateErpSalesOrderRequest) -> ErpSalesOrderActiveModel {
    ErpSalesOrderActiveModel {
        customer_id: Set(request.customer_id.clone()),
        order_date: Set(request.order_date.clone()),
        total_amount: Set(request.total_amount.clone()),
        discount_rate: request.discount_rate.as_ref().map_or(NotSet, |discount_rate| Set(Some(discount_rate.clone()))),
        settlement_account_id: request.settlement_account_id.as_ref().map_or(NotSet, |settlement_account_id| Set(Some(settlement_account_id.clone()))),
        deposit: request.deposit.as_ref().map_or(NotSet, |deposit| Set(Some(deposit.clone()))),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpSalesOrderRequest, existing: ErpSalesOrder) -> ErpSalesOrderActiveModel {
    let mut active_model: ErpSalesOrderActiveModel = existing.into();
    if let Some(customer_id) = &request.customer_id { 
        active_model.customer_id = Set(customer_id.clone());
    }
    if let Some(order_date) = &request.order_date { 
        active_model.order_date = Set(order_date.clone());
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
    active_model
}

pub fn model_to_response(model: ErpSalesOrder) -> ErpSalesOrderResponse {
    ErpSalesOrderResponse { 
        id: model.id,
        order_number: model.order_number,
        customer_id: model.customer_id,
        user_id: model.user_id,
        order_date: model.order_date,
        total_amount: model.total_amount,
        order_status: model.order_status,
        discount_rate: model.discount_rate,
        settlement_account_id: model.settlement_account_id,
        deposit: model.deposit,
        department_code: model.department_code,
        department_id: model.department_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}

pub fn model_to_page_response(model: ErpSalesOrder, model_customer: Option<ErpCustomerModel>, model_settlement_account: Option<ErpSettlementAccountModel>) -> ErpSalesOrderPageResponse {
    let customer_name = model_customer.map(|customer| customer.name.clone());
    let settlement_account_name = model_settlement_account.map(|settlement_account| settlement_account.name.clone());

    ErpSalesOrderPageResponse { 
        id: model.id,
        order_number: model.order_number,
        customer_id: model.customer_id,
        user_id: model.user_id,
        order_date: model.order_date,
        total_amount: model.total_amount,
        order_status: model.order_status,
        discount_rate: model.discount_rate,
        settlement_account_id: model.settlement_account_id,
        deposit: model.deposit,
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

pub fn model_to_base_response(model: ErpSalesOrder, details: Vec<ErpSalesOrderDetailBaseResponse>, attachments: Vec<ErpSalesOrderAttachmentBaseResponse>) -> ErpSalesOrderBaseResponse {
    ErpSalesOrderBaseResponse { 
        id: model.id,
        order_number: model.order_number,
        customer_id: model.customer_id,
        user_id: model.user_id,
        order_date: model.order_date,
        total_amount: model.total_amount,
        order_status: model.order_status,
        discount_rate: model.discount_rate,
        settlement_account_id: model.settlement_account_id,
        deposit: model.deposit,

        sale_products: details,
        sale_attachment: attachments,
    }
}