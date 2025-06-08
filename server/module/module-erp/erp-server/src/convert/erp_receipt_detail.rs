use sea_orm::{Set, NotSet};
use crate::model::erp_receipt_detail::{self, Model as ErpReceiptDetail, ActiveModel as ErpReceiptDetailActiveModel};
use erp_model::request::erp_receipt_detail::{CreateErpReceiptDetailRequest, UpdateErpReceiptDetailRequest};
use erp_model::response::erp_receipt_detail::ErpReceiptDetailResponse;

pub fn create_request_to_model(request: &CreateErpReceiptDetailRequest) -> ErpReceiptDetailActiveModel {
    ErpReceiptDetailActiveModel {
        receipt_id: Set(request.receipt_id.clone()),
        sales_order_id: request.sales_order_id.as_ref().map_or(NotSet, |sales_order_id| Set(Some(sales_order_id.clone()))),
        sales_return_id: request.sales_return_id.as_ref().map_or(NotSet, |sales_return_id| Set(Some(sales_return_id.clone()))),
        amount: Set(request.amount.clone()),
        description: request.description.as_ref().map_or(NotSet, |description| Set(Some(description.clone()))),
        department_code: Set(request.department_code.clone()),
        department_id: Set(request.department_id.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpReceiptDetailRequest, existing: ErpReceiptDetail) -> ErpReceiptDetailActiveModel {
    let mut active_model: ErpReceiptDetailActiveModel = existing.into();
    if let Some(receipt_id) = &request.receipt_id { 
        active_model.receipt_id = Set(receipt_id.clone());
    }
    if let Some(sales_order_id) = &request.sales_order_id { 
        active_model.sales_order_id = Set(Some(sales_order_id.clone()));
    }
    if let Some(sales_return_id) = &request.sales_return_id { 
        active_model.sales_return_id = Set(Some(sales_return_id.clone()));
    }
    if let Some(amount) = &request.amount { 
        active_model.amount = Set(amount.clone());
    }
    if let Some(description) = &request.description { 
        active_model.description = Set(Some(description.clone()));
    }
    if let Some(department_code) = &request.department_code { 
        active_model.department_code = Set(department_code.clone());
    }
    if let Some(department_id) = &request.department_id { 
        active_model.department_id = Set(department_id.clone());
    }
    active_model
}

pub fn model_to_response(model: ErpReceiptDetail) -> ErpReceiptDetailResponse {
    ErpReceiptDetailResponse { 
        id: model.id,
        receipt_id: model.receipt_id,
        sales_order_id: model.sales_order_id,
        sales_return_id: model.sales_return_id,
        amount: model.amount,
        description: model.description,
        department_code: model.department_code,
        department_id: model.department_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}