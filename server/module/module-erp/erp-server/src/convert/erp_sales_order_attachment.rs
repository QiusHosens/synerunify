use sea_orm::{Set, NotSet};
use crate::model::erp_sales_order_attachment::{self, Model as ErpSalesOrderAttachment, ActiveModel as ErpSalesOrderAttachmentActiveModel};
use erp_model::request::erp_sales_order_attachment::{CreateErpSalesOrderAttachmentRequest, UpdateErpSalesOrderAttachmentRequest};
use erp_model::response::erp_sales_order_attachment::{ErpSalesOrderAttachmentBaseResponse, ErpSalesOrderAttachmentResponse};

pub fn create_request_to_model(request: &CreateErpSalesOrderAttachmentRequest) -> ErpSalesOrderAttachmentActiveModel {
    ErpSalesOrderAttachmentActiveModel {
        file_id: Set(request.file_id.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        ..Default::default()
    }
}

pub fn update_add_request_to_model(request: &UpdateErpSalesOrderAttachmentRequest) -> ErpSalesOrderAttachmentActiveModel {
    ErpSalesOrderAttachmentActiveModel {
        file_id: Set(request.file_id.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpSalesOrderAttachmentRequest, existing: ErpSalesOrderAttachment) -> ErpSalesOrderAttachmentActiveModel {
    let mut active_model: ErpSalesOrderAttachmentActiveModel = existing.into();
    if let file_id = &request.file_id { 
        active_model.file_id = Set(file_id.clone());
    }
    if let Some(remarks) = &request.remarks { 
        active_model.remarks = Set(Some(remarks.clone()));
    }
    active_model
}

pub fn model_to_response(model: ErpSalesOrderAttachment) -> ErpSalesOrderAttachmentResponse {
    ErpSalesOrderAttachmentResponse { 
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

pub fn model_to_base_response(model: ErpSalesOrderAttachment) -> ErpSalesOrderAttachmentBaseResponse {
    ErpSalesOrderAttachmentBaseResponse { 
        id: model.id,
        order_id: model.order_id,
        file_id: model.file_id,
        remarks: model.remarks,
    }
}