use sea_orm::{Set, NotSet};
use crate::model::erp_sales_returns::{self, Model as ErpSalesReturns, ActiveModel as ErpSalesReturnsActiveModel};
use erp_model::request::erp_sales_returns::{CreateErpSalesReturnsRequest, UpdateErpSalesReturnsRequest};
use erp_model::response::erp_sales_returns::ErpSalesReturnsResponse;

pub fn create_request_to_model(request: &CreateErpSalesReturnsRequest) -> ErpSalesReturnsActiveModel {
    ErpSalesReturnsActiveModel {
        sales_order_id: request.sales_order_id.as_ref().map_or(NotSet, |sales_order_id| Set(Some(sales_order_id.clone()))),
        customer_id: request.customer_id.as_ref().map_or(NotSet, |customer_id| Set(Some(customer_id.clone()))),
        warehouse_id: request.warehouse_id.as_ref().map_or(NotSet, |warehouse_id| Set(Some(warehouse_id.clone()))),
        return_date: Set(request.return_date.clone()),
        total_amount: Set(request.total_amount.clone()),
        status: Set(request.status.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        department_code: Set(request.department_code.clone()),
        department_id: Set(request.department_id.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpSalesReturnsRequest, existing: ErpSalesReturns) -> ErpSalesReturnsActiveModel {
    let mut active_model: ErpSalesReturnsActiveModel = existing.into();
    if let Some(sales_order_id) = &request.sales_order_id { 
        active_model.sales_order_id = Set(Some(sales_order_id.clone()));
    }
    if let Some(customer_id) = &request.customer_id { 
        active_model.customer_id = Set(Some(customer_id.clone()));
    }
    if let Some(warehouse_id) = &request.warehouse_id { 
        active_model.warehouse_id = Set(Some(warehouse_id.clone()));
    }
    if let Some(return_date) = &request.return_date { 
        active_model.return_date = Set(return_date.clone());
    }
    if let Some(total_amount) = &request.total_amount { 
        active_model.total_amount = Set(total_amount.clone());
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
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

pub fn model_to_response(model: ErpSalesReturns) -> ErpSalesReturnsResponse {
    ErpSalesReturnsResponse { 
        id: model.id,
        sales_order_id: model.sales_order_id,
        customer_id: model.customer_id,
        warehouse_id: model.warehouse_id,
        return_date: model.return_date,
        total_amount: model.total_amount,
        status: model.status,
        remarks: model.remarks,
        department_code: model.department_code,
        department_id: model.department_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}