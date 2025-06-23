use sea_orm::{Set, NotSet};
use crate::model::erp_purchase_return_detail::{self, Model as ErpPurchaseReturnDetail, ActiveModel as ErpPurchaseReturnDetailActiveModel};
use erp_model::request::erp_purchase_return_detail::{CreateErpPurchaseReturnDetailRequest, UpdateErpPurchaseReturnDetailRequest};
use erp_model::response::erp_purchase_return_detail::ErpPurchaseReturnDetailResponse;

pub fn create_request_to_model(request: &CreateErpPurchaseReturnDetailRequest) -> ErpPurchaseReturnDetailActiveModel {
    ErpPurchaseReturnDetailActiveModel {
        purchase_detail_id: Set(request.purchase_detail_id.clone()),
        warehouse_id: Set(request.warehouse_id.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpPurchaseReturnDetailRequest, existing: ErpPurchaseReturnDetail) -> ErpPurchaseReturnDetailActiveModel {
    let mut active_model: ErpPurchaseReturnDetailActiveModel = existing.into();
    if let Some(purchase_detail_id) = &request.purchase_detail_id { 
        active_model.purchase_detail_id = Set(purchase_detail_id.clone());
    }
    if let Some(warehouse_id) = &request.warehouse_id { 
        active_model.warehouse_id = Set(warehouse_id.clone());
    }
    if let Some(remarks) = &request.remarks { 
        active_model.remarks = Set(Some(remarks.clone()));
    }
    active_model
}

pub fn model_to_response(model: ErpPurchaseReturnDetail) -> ErpPurchaseReturnDetailResponse {
    ErpPurchaseReturnDetailResponse { 
        id: model.id,
        order_id: model.order_id,
        purchase_detail_id: model.purchase_detail_id,
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