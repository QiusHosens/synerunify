use sea_orm::{Set, NotSet};
use crate::model::erp_inbound_order_attachment::{self, Model as ErpInboundOrderAttachment, ActiveModel as ErpInboundOrderAttachmentActiveModel};
use erp_model::request::erp_inbound_order_attachment::{CreateErpInboundOrderAttachmentRequest, UpdateErpInboundOrderAttachmentRequest};
use erp_model::response::erp_inbound_order_attachment::ErpInboundOrderAttachmentResponse;

pub fn create_request_to_model(request: &CreateErpInboundOrderAttachmentRequest) -> ErpInboundOrderAttachmentActiveModel {
    ErpInboundOrderAttachmentActiveModel {
        file_id: Set(request.file_id.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpInboundOrderAttachmentRequest, existing: ErpInboundOrderAttachment) -> ErpInboundOrderAttachmentActiveModel {
    let mut active_model: ErpInboundOrderAttachmentActiveModel = existing.into();
    if let Some(file_id) = &request.file_id { 
        active_model.file_id = Set(file_id.clone());
    }
    if let Some(remarks) = &request.remarks { 
        active_model.remarks = Set(Some(remarks.clone()));
    }
    active_model
}

pub fn model_to_response(model: ErpInboundOrderAttachment) -> ErpInboundOrderAttachmentResponse {
    ErpInboundOrderAttachmentResponse { 
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