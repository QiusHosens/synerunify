use sea_orm::{Set, NotSet};
use crate::model::erp_sales_return_detail::{self, Model as ErpSalesReturnDetail, ActiveModel as ErpSalesReturnDetailActiveModel};
use erp_model::request::erp_sales_return_detail::{CreateErpSalesReturnDetailRequest, UpdateErpSalesReturnDetailRequest};
use erp_model::response::erp_sales_return_detail::{ErpSalesReturnDetailBaseResponse, ErpSalesReturnDetailResponse};

pub fn create_request_to_model(request: &CreateErpSalesReturnDetailRequest) -> ErpSalesReturnDetailActiveModel {
    ErpSalesReturnDetailActiveModel {
        sale_detail_id: Set(request.sale_detail_id.clone()),
        warehouse_id: Set(request.warehouse_id.clone()),
        quantity: Set(request.quantity.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpSalesReturnDetailRequest, existing: ErpSalesReturnDetail) -> ErpSalesReturnDetailActiveModel {
    let mut active_model: ErpSalesReturnDetailActiveModel = existing.into();
    if let sale_detail_id = &request.sale_detail_id { 
        active_model.sale_detail_id = Set(sale_detail_id.clone());
    }
    if let warehouse_id = &request.warehouse_id { 
        active_model.warehouse_id = Set(warehouse_id.clone());
    }
    if let quantity = &request.quantity { 
        active_model.quantity = Set(quantity.clone());
    }
    if let Some(remarks) = &request.remarks { 
        active_model.remarks = Set(Some(remarks.clone()));
    }
    active_model
}

pub fn model_to_response(model: ErpSalesReturnDetail) -> ErpSalesReturnDetailResponse {
    ErpSalesReturnDetailResponse { 
        id: model.id,
        order_id: model.order_id,
        sale_detail_id: model.sale_detail_id,
        warehouse_id: model.warehouse_id,
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

pub fn model_to_base_response(model: ErpSalesReturnDetail) -> ErpSalesReturnDetailBaseResponse {
    ErpSalesReturnDetailBaseResponse { 
        id: model.id,
        sale_detail_id: model.sale_detail_id,
        warehouse_id: model.warehouse_id,
        remarks: model.remarks,
    }
}