use sea_orm::{Set, NotSet};
use crate::model::erp_sales_order_details::{self, Model as ErpSalesOrderDetails, ActiveModel as ErpSalesOrderDetailsActiveModel};
use erp_model::request::erp_sales_order_details::{CreateErpSalesOrderDetailsRequest, UpdateErpSalesOrderDetailsRequest};
use erp_model::response::erp_sales_order_details::ErpSalesOrderDetailsResponse;

pub fn create_request_to_model(request: &CreateErpSalesOrderDetailsRequest) -> ErpSalesOrderDetailsActiveModel {
    ErpSalesOrderDetailsActiveModel {
        order_id: request.order_id.as_ref().map_or(NotSet, |order_id| Set(Some(order_id.clone()))),
        product_id: request.product_id.as_ref().map_or(NotSet, |product_id| Set(Some(product_id.clone()))),
        quantity: Set(request.quantity.clone()),
        unit_price: Set(request.unit_price.clone()),
        subtotal: Set(request.subtotal.clone()),
        tax_rate: request.tax_rate.as_ref().map_or(NotSet, |tax_rate| Set(Some(tax_rate.clone()))),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        department_code: Set(request.department_code.clone()),
        department_id: Set(request.department_id.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpSalesOrderDetailsRequest, existing: ErpSalesOrderDetails) -> ErpSalesOrderDetailsActiveModel {
    let mut active_model: ErpSalesOrderDetailsActiveModel = existing.into();
    if let Some(order_id) = &request.order_id { 
        active_model.order_id = Set(Some(order_id.clone()));
    }
    if let Some(product_id) = &request.product_id { 
        active_model.product_id = Set(Some(product_id.clone()));
    }
    if let Some(quantity) = &request.quantity { 
        active_model.quantity = Set(quantity.clone());
    }
    if let Some(unit_price) = &request.unit_price { 
        active_model.unit_price = Set(unit_price.clone());
    }
    if let Some(subtotal) = &request.subtotal { 
        active_model.subtotal = Set(subtotal.clone());
    }
    if let Some(tax_rate) = &request.tax_rate { 
        active_model.tax_rate = Set(Some(tax_rate.clone()));
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

pub fn model_to_response(model: ErpSalesOrderDetails) -> ErpSalesOrderDetailsResponse {
    ErpSalesOrderDetailsResponse { 
        id: model.id,
        order_id: model.order_id,
        product_id: model.product_id,
        quantity: model.quantity,
        unit_price: model.unit_price,
        subtotal: model.subtotal,
        tax_rate: model.tax_rate,
        remarks: model.remarks,
        department_code: model.department_code,
        department_id: model.department_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}