use sea_orm::{Set, NotSet};
use crate::model::erp_sales_orders::{self, Model as ErpSalesOrders, ActiveModel as ErpSalesOrdersActiveModel};
use erp_model::request::erp_sales_orders::{CreateErpSalesOrdersRequest, UpdateErpSalesOrdersRequest};
use erp_model::response::erp_sales_orders::ErpSalesOrdersResponse;

pub fn create_request_to_model(request: &CreateErpSalesOrdersRequest) -> ErpSalesOrdersActiveModel {
    ErpSalesOrdersActiveModel {
        order_number: Set(request.order_number.clone()),
        customer_id: request.customer_id.as_ref().map_or(NotSet, |customer_id| Set(Some(customer_id.clone()))),
        user_id: request.user_id.as_ref().map_or(NotSet, |user_id| Set(Some(user_id.clone()))),
        order_date: Set(request.order_date.clone()),
        total_amount: Set(request.total_amount.clone()),
        status: Set(request.status.clone()),
        discount_rate: request.discount_rate.as_ref().map_or(NotSet, |discount_rate| Set(Some(discount_rate.clone()))),
        settlement_account_id: request.settlement_account_id.as_ref().map_or(NotSet, |settlement_account_id| Set(Some(settlement_account_id.clone()))),
        deposit: request.deposit.as_ref().map_or(NotSet, |deposit| Set(Some(deposit.clone()))),
        department_code: Set(request.department_code.clone()),
        department_id: Set(request.department_id.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpSalesOrdersRequest, existing: ErpSalesOrders) -> ErpSalesOrdersActiveModel {
    let mut active_model: ErpSalesOrdersActiveModel = existing.into();
    if let Some(order_number) = &request.order_number { 
        active_model.order_number = Set(order_number.clone());
    }
    if let Some(customer_id) = &request.customer_id { 
        active_model.customer_id = Set(Some(customer_id.clone()));
    }
    if let Some(user_id) = &request.user_id { 
        active_model.user_id = Set(Some(user_id.clone()));
    }
    if let Some(order_date) = &request.order_date { 
        active_model.order_date = Set(order_date.clone());
    }
    if let Some(total_amount) = &request.total_amount { 
        active_model.total_amount = Set(total_amount.clone());
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
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
    if let Some(department_code) = &request.department_code { 
        active_model.department_code = Set(department_code.clone());
    }
    if let Some(department_id) = &request.department_id { 
        active_model.department_id = Set(department_id.clone());
    }
    active_model
}

pub fn model_to_response(model: ErpSalesOrders) -> ErpSalesOrdersResponse {
    ErpSalesOrdersResponse { 
        id: model.id,
        order_number: model.order_number,
        customer_id: model.customer_id,
        user_id: model.user_id,
        order_date: model.order_date,
        total_amount: model.total_amount,
        status: model.status,
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