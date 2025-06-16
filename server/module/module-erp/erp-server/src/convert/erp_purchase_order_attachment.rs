use sea_orm::{Set, NotSet};
use crate::model::erp_purchase_order_attachment::{self, Model as ErpPurchaseOrderAttachment, ActiveModel as ErpPurchaseOrderAttachmentActiveModel};
use erp_model::request::erp_purchase_order_attachment::{CreateErpPurchaseOrderAttachmentRequest, UpdateErpPurchaseOrderAttachmentRequest};
use erp_model::response::erp_purchase_order_attachment::{ErpPurchaseOrderAttachmentBaseResponse, ErpPurchaseOrderAttachmentResponse};

pub fn create_request_to_model(request: &CreateErpPurchaseOrderAttachmentRequest) -> ErpPurchaseOrderAttachmentActiveModel {
    ErpPurchaseOrderAttachmentActiveModel {
        file_id: Set(request.file_id.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        ..Default::default()
    }
}

pub fn update_add_request_to_model(request: &UpdateErpPurchaseOrderAttachmentRequest) -> ErpPurchaseOrderAttachmentActiveModel {
    ErpPurchaseOrderAttachmentActiveModel {
        file_id: Set(request.file_id.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpPurchaseOrderAttachmentRequest, existing: ErpPurchaseOrderAttachment) -> ErpPurchaseOrderAttachmentActiveModel {
    let mut active_model: ErpPurchaseOrderAttachmentActiveModel = existing.into();
    if let file_id = &request.file_id { 
        active_model.file_id = Set(file_id.clone());
    }
    if let Some(remarks) = &request.remarks { 
        active_model.remarks = Set(Some(remarks.clone()));
    }
    active_model
}

pub fn model_to_response(model: ErpPurchaseOrderAttachment) -> ErpPurchaseOrderAttachmentResponse {
    ErpPurchaseOrderAttachmentResponse { 
        id: model.id,
        purchase_id: model.purchase_id,
        file_id: model.file_id,
        remarks: model.remarks,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}

pub fn model_to_base_response(model: ErpPurchaseOrderAttachment) -> ErpPurchaseOrderAttachmentBaseResponse {
    ErpPurchaseOrderAttachmentBaseResponse { 
        id: model.id,
        purchase_id: model.purchase_id,
        file_id: model.file_id,
        remarks: model.remarks,
    }
}