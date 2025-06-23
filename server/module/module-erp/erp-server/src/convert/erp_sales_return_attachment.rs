use sea_orm::{Set, NotSet};
use crate::model::erp_sales_return_attachment::{self, Model as ErpSalesReturnAttachment, ActiveModel as ErpSalesReturnAttachmentActiveModel};
use erp_model::request::erp_sales_return_attachment::{CreateErpSalesReturnAttachmentRequest, UpdateErpSalesReturnAttachmentRequest};
use erp_model::response::erp_sales_return_attachment::{ErpSalesReturnAttachmentBaseResponse, ErpSalesReturnAttachmentResponse};

pub fn create_request_to_model(request: &CreateErpSalesReturnAttachmentRequest) -> ErpSalesReturnAttachmentActiveModel {
    ErpSalesReturnAttachmentActiveModel {
        file_id: Set(request.file_id.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpSalesReturnAttachmentRequest, existing: ErpSalesReturnAttachment) -> ErpSalesReturnAttachmentActiveModel {
    let mut active_model: ErpSalesReturnAttachmentActiveModel = existing.into();
    if let Some(file_id) = &request.file_id { 
        active_model.file_id = Set(file_id.clone());
    }
    if let Some(remarks) = &request.remarks { 
        active_model.remarks = Set(Some(remarks.clone()));
    }
    active_model
}

pub fn model_to_response(model: ErpSalesReturnAttachment) -> ErpSalesReturnAttachmentResponse {
    ErpSalesReturnAttachmentResponse { 
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

pub fn model_to_base_response(model: ErpSalesReturnAttachment, file_name: Option<String>) -> ErpSalesReturnAttachmentBaseResponse {
    ErpSalesReturnAttachmentBaseResponse { 
        id: model.id,
        file_id: model.file_id,
        remarks: model.remarks,

        file_name,
    }
}