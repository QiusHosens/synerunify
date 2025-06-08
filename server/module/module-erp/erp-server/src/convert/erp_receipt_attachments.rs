use sea_orm::{Set, NotSet};
use crate::model::erp_receipt_attachments::{self, Model as ErpReceiptAttachments, ActiveModel as ErpReceiptAttachmentsActiveModel};
use erp_model::request::erp_receipt_attachments::{CreateErpReceiptAttachmentsRequest, UpdateErpReceiptAttachmentsRequest};
use erp_model::response::erp_receipt_attachments::ErpReceiptAttachmentsResponse;

pub fn create_request_to_model(request: &CreateErpReceiptAttachmentsRequest) -> ErpReceiptAttachmentsActiveModel {
    ErpReceiptAttachmentsActiveModel {
        receipt_id: Set(request.receipt_id.clone()),
        file_id: Set(request.file_id.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        department_code: Set(request.department_code.clone()),
        department_id: Set(request.department_id.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpReceiptAttachmentsRequest, existing: ErpReceiptAttachments) -> ErpReceiptAttachmentsActiveModel {
    let mut active_model: ErpReceiptAttachmentsActiveModel = existing.into();
    if let Some(receipt_id) = &request.receipt_id { 
        active_model.receipt_id = Set(receipt_id.clone());
    }
    if let Some(file_id) = &request.file_id { 
        active_model.file_id = Set(file_id.clone());
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

pub fn model_to_response(model: ErpReceiptAttachments) -> ErpReceiptAttachmentsResponse {
    ErpReceiptAttachmentsResponse { 
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