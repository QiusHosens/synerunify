use sea_orm::{Set, NotSet};
use crate::model::erp_outbound_order_attachment::{self, Model as ErpOutboundOrderAttachment, ActiveModel as ErpOutboundOrderAttachmentActiveModel};
use erp_model::request::erp_outbound_order_attachment::{CreateErpOutboundOrderAttachmentRequest, UpdateErpOutboundOrderAttachmentRequest};
use erp_model::response::erp_outbound_order_attachment::{ErpOutboundOrderAttachmentBaseResponse, ErpOutboundOrderAttachmentResponse};

pub fn create_request_to_model(request: &CreateErpOutboundOrderAttachmentRequest) -> ErpOutboundOrderAttachmentActiveModel {
    ErpOutboundOrderAttachmentActiveModel {
        file_id: Set(request.file_id.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        ..Default::default()
    }
}

pub fn update_add_request_to_model(request: &UpdateErpOutboundOrderAttachmentRequest) -> ErpOutboundOrderAttachmentActiveModel {
    ErpOutboundOrderAttachmentActiveModel {
        file_id: Set(request.file_id.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpOutboundOrderAttachmentRequest, existing: ErpOutboundOrderAttachment) -> ErpOutboundOrderAttachmentActiveModel {
    let mut active_model: ErpOutboundOrderAttachmentActiveModel = existing.into();
    if let file_id = &request.file_id { 
        active_model.file_id = Set(file_id.clone());
    }
    if let Some(remarks) = &request.remarks { 
        active_model.remarks = Set(Some(remarks.clone()));
    }
    active_model
}

pub fn model_to_response(model: ErpOutboundOrderAttachment) -> ErpOutboundOrderAttachmentResponse {
    ErpOutboundOrderAttachmentResponse { 
        id: model.id,
        order_id: model.order_id,
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

pub fn model_to_base_response(model: ErpOutboundOrderAttachment, file_name: Option<String>) -> ErpOutboundOrderAttachmentBaseResponse {
    ErpOutboundOrderAttachmentBaseResponse { 
        id: model.id,
        file_id: model.file_id,
        remarks: model.remarks,

        file_name,
    }
}