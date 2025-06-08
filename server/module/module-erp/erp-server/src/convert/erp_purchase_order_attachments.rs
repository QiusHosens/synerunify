use sea_orm::{Set, NotSet};
use crate::model::erp_purchase_order_attachments::{self, Model as ErpPurchaseOrderAttachments, ActiveModel as ErpPurchaseOrderAttachmentsActiveModel};
use erp_model::request::erp_purchase_order_attachments::{CreateErpPurchaseOrderAttachmentsRequest, UpdateErpPurchaseOrderAttachmentsRequest};
use erp_model::response::erp_purchase_order_attachments::ErpPurchaseOrderAttachmentsResponse;

pub fn create_request_to_model(request: &CreateErpPurchaseOrderAttachmentsRequest) -> ErpPurchaseOrderAttachmentsActiveModel {
    ErpPurchaseOrderAttachmentsActiveModel {
        purchase_id: request.purchase_id.as_ref().map_or(NotSet, |purchase_id| Set(Some(purchase_id.clone()))),
        file_id: request.file_id.as_ref().map_or(NotSet, |file_id| Set(Some(file_id.clone()))),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        department_code: Set(request.department_code.clone()),
        department_id: Set(request.department_id.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpPurchaseOrderAttachmentsRequest, existing: ErpPurchaseOrderAttachments) -> ErpPurchaseOrderAttachmentsActiveModel {
    let mut active_model: ErpPurchaseOrderAttachmentsActiveModel = existing.into();
    if let Some(purchase_id) = &request.purchase_id { 
        active_model.purchase_id = Set(Some(purchase_id.clone()));
    }
    if let Some(file_id) = &request.file_id { 
        active_model.file_id = Set(Some(file_id.clone()));
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

pub fn model_to_response(model: ErpPurchaseOrderAttachments) -> ErpPurchaseOrderAttachmentsResponse {
    ErpPurchaseOrderAttachmentsResponse { 
        id: model.id,
        purchase_id: model.purchase_id,
        file_id: model.file_id,
        remarks: model.remarks,
        department_code: model.department_code,
        department_id: model.department_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}