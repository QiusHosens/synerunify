use sea_orm::{Set, NotSet};
use crate::model::erp_receipt_detail::{self, Model as ErpReceiptDetail, ActiveModel as ErpReceiptDetailActiveModel};
use erp_model::request::erp_receipt_detail::{CreateErpReceiptDetailRequest, UpdateErpReceiptDetailRequest};
use erp_model::response::erp_receipt_detail::{ErpReceiptDetailBaseResponse, ErpReceiptDetailResponse};

pub fn create_request_to_model(request: &CreateErpReceiptDetailRequest) -> ErpReceiptDetailActiveModel {
    ErpReceiptDetailActiveModel {
        sales_order_id: request.sales_order_id.as_ref().map_or(NotSet, |sales_order_id| Set(Some(sales_order_id.clone()))),
        sales_return_id: request.sales_return_id.as_ref().map_or(NotSet, |sales_return_id| Set(Some(sales_return_id.clone()))),
        amount: Set(request.amount.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        ..Default::default()
    }
}

pub fn update_add_request_to_model(request: &UpdateErpReceiptDetailRequest) -> ErpReceiptDetailActiveModel {
    ErpReceiptDetailActiveModel {
        sales_order_id: request.sales_order_id.as_ref().map_or(NotSet, |sales_order_id| Set(Some(sales_order_id.clone()))),
        sales_return_id: request.sales_return_id.as_ref().map_or(NotSet, |sales_return_id| Set(Some(sales_return_id.clone()))),
        amount: Set(request.amount.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpReceiptDetailRequest, existing: ErpReceiptDetail) -> ErpReceiptDetailActiveModel {
    let mut active_model: ErpReceiptDetailActiveModel = existing.into();
    if let Some(sales_order_id) = &request.sales_order_id { 
        active_model.sales_order_id = Set(Some(sales_order_id.clone()));
    }
    if let Some(sales_return_id) = &request.sales_return_id { 
        active_model.sales_return_id = Set(Some(sales_return_id.clone()));
    }
    if let amount = &request.amount { 
        active_model.amount = Set(amount.clone());
    }
    if let Some(remarks) = &request.remarks { 
        active_model.remarks = Set(Some(remarks.clone()));
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
        remarks: model.remarks,
        department_code: model.department_code,
        department_id: model.department_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}

pub fn model_to_base_response(model: ErpReceiptDetail) -> ErpReceiptDetailBaseResponse {
    ErpReceiptDetailBaseResponse { 
        id: model.id,
        sales_order_id: model.sales_order_id,
        sales_return_id: model.sales_return_id,
        amount: model.amount,
        remarks: model.remarks,
    }
}