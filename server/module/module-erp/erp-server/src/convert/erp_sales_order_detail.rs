use sea_orm::{Set, NotSet};
use crate::model::erp_sales_order_detail::{self, Model as ErpSalesOrderDetail, ActiveModel as ErpSalesOrderDetailActiveModel};
use crate::model::erp_product::{self, Model as ErpProduct};
use crate::model::erp_product_unit::{self, Model as ErpProductUnit};
use erp_model::request::erp_sales_order_detail::{CreateErpSalesOrderDetailRequest, UpdateErpSalesOrderDetailRequest};
use erp_model::response::erp_sales_order_detail::{ErpSalesOrderDetailBaseResponse, ErpSalesOrderDetailInfoResponse, ErpSalesOrderDetailResponse};

pub fn create_request_to_model(request: &CreateErpSalesOrderDetailRequest) -> ErpSalesOrderDetailActiveModel {
    ErpSalesOrderDetailActiveModel {
        product_id: Set(request.product_id.clone()),
        quantity: Set(request.quantity.clone()),
        unit_price: Set(request.unit_price.clone()),
        subtotal: Set(request.subtotal.clone()),
        tax_rate: request.tax_rate.as_ref().map_or(NotSet, |tax_rate| Set(Some(tax_rate.clone()))),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        ..Default::default()
    }
}

pub fn update_add_request_to_model(request: &UpdateErpSalesOrderDetailRequest) -> ErpSalesOrderDetailActiveModel {
    ErpSalesOrderDetailActiveModel {
        product_id: Set(request.product_id.clone()),
        quantity: Set(request.quantity.clone()),
        unit_price: Set(request.unit_price.clone()),
        subtotal: Set(request.subtotal.clone()),
        tax_rate: request.tax_rate.as_ref().map_or(NotSet, |tax_rate| Set(Some(tax_rate.clone()))),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpSalesOrderDetailRequest, existing: ErpSalesOrderDetail) -> ErpSalesOrderDetailActiveModel {
    let mut active_model: ErpSalesOrderDetailActiveModel = existing.into();
    if let product_id = &request.product_id { 
        active_model.product_id = Set(product_id.clone());
    }
    if let quantity = &request.quantity { 
        active_model.quantity = Set(quantity.clone());
    }
    if let unit_price = &request.unit_price { 
        active_model.unit_price = Set(unit_price.clone());
    }
    if let subtotal = &request.subtotal { 
        active_model.subtotal = Set(subtotal.clone());
    }
    if let Some(tax_rate) = &request.tax_rate { 
        active_model.tax_rate = Set(Some(tax_rate.clone()));
    }
    if let Some(remarks) = &request.remarks { 
        active_model.remarks = Set(Some(remarks.clone()));
    }
    active_model
}

pub fn model_to_response(model: ErpSalesOrderDetail) -> ErpSalesOrderDetailResponse {
    ErpSalesOrderDetailResponse { 
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

pub fn model_to_base_response(model: ErpSalesOrderDetail) -> ErpSalesOrderDetailBaseResponse {
    ErpSalesOrderDetailBaseResponse { 
        id: model.id,
        order_id: model.order_id,
        product_id: model.product_id,
        quantity: model.quantity,
        unit_price: model.unit_price,
        subtotal: model.subtotal,
        tax_rate: model.tax_rate,
        remarks: model.remarks,
    }
}

pub fn model_to_info_response(model: ErpSalesOrderDetail, model_product: Option<ErpProduct>, model_unit: Option<ErpProductUnit>) -> ErpSalesOrderDetailInfoResponse {
    let (product_name, product_barcode) = match model_product {
        Some(p) => (
            Some(p.name.clone()),
            p.barcode.clone(),
        ),
        None => (None, None),
    };

    let product_unit_name = model_unit.map(|unit| unit.name.clone());

    ErpSalesOrderDetailInfoResponse { 
        id: model.id,
        order_id: model.order_id,
        product_id: model.product_id,
        quantity: model.quantity,
        unit_price: model.unit_price,
        subtotal: model.subtotal,
        tax_rate: model.tax_rate,
        remarks: model.remarks,

        product_name,
        product_barcode,
        product_unit_name,
    }
}