use sea_orm::{Set, NotSet};
use crate::model::erp_receipt_attachment::{self, Model as ErpReceiptAttachment, ActiveModel as ErpReceiptAttachmentActiveModel};
use erp_model::request::erp_receipt_attachment::{CreateErpReceiptAttachmentRequest, UpdateErpReceiptAttachmentRequest};
use erp_model::response::erp_receipt_attachment::{ErpReceiptAttachmentBaseResponse, ErpReceiptAttachmentResponse};

pub fn create_request_to_model(request: &CreateErpReceiptAttachmentRequest) -> ErpReceiptAttachmentActiveModel {
    ErpReceiptAttachmentActiveModel {
        file_id: Set(request.file_id.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        ..Default::default()
    }
}

pub fn update_add_request_to_model(request: &UpdateErpReceiptAttachmentRequest) -> ErpReceiptAttachmentActiveModel {
    ErpReceiptAttachmentActiveModel {
        file_id: Set(request.file_id.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpReceiptAttachmentRequest, existing: ErpReceiptAttachment) -> ErpReceiptAttachmentActiveModel {
    let mut active_model: ErpReceiptAttachmentActiveModel = existing.into();
    if let file_id = &request.file_id { 
        active_model.file_id = Set(file_id.clone());
    }
    if let Some(remarks) = &request.remarks { 
        active_model.remarks = Set(Some(remarks.clone()));
    }
    active_model
}

pub fn model_to_response(model: ErpReceiptAttachment) -> ErpReceiptAttachmentResponse {
    ErpReceiptAttachmentResponse { 
        id: model.id,
        receipt_id: model.receipt_id,
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

pub fn model_to_base_response(model: ErpReceiptAttachment, file_name: Option<String>) -> ErpReceiptAttachmentBaseResponse {
    ErpReceiptAttachmentBaseResponse { 
        id: model.id,
        file_id: model.file_id,
        remarks: model.remarks,

        file_name,
    }
}