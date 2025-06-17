use sea_orm::{Set, NotSet};
use crate::model::erp_outbound_order_attachment::{self, Model as ErpOutboundOrderAttachment, ActiveModel as ErpOutboundOrderAttachmentActiveModel};
use erp_model::request::erp_outbound_order_attachment::{CreateErpOutboundOrderAttachmentRequest, UpdateErpOutboundOrderAttachmentRequest};
use erp_model::response::erp_outbound_order_attachment::ErpOutboundOrderAttachmentResponse;

pub fn create_request_to_model(request: &CreateErpOutboundOrderAttachmentRequest) -> ErpOutboundOrderAttachmentActiveModel {
    ErpOutboundOrderAttachmentActiveModel {
        order_id: Set(request.order_id.clone()),
        file_id: Set(request.file_id.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        department_code: Set(request.department_code.clone()),
        department_id: Set(request.department_id.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpOutboundOrderAttachmentRequest, existing: ErpOutboundOrderAttachment) -> ErpOutboundOrderAttachmentActiveModel {
    let mut active_model: ErpOutboundOrderAttachmentActiveModel = existing.into();
    if let Some(order_id) = &request.order_id { 
        active_model.order_id = Set(order_id.clone());
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