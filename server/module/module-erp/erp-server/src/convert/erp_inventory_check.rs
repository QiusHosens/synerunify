use erp_model::response::erp_inventory_check_attachment::ErpInventoryCheckAttachmentBaseResponse;
use erp_model::response::erp_inventory_check_detail::ErpInventoryCheckDetailBaseResponse;
use sea_orm::{Set, NotSet};
use crate::model::erp_inventory_check::{self, Model as ErpInventoryCheck, ActiveModel as ErpInventoryCheckActiveModel};
use erp_model::request::erp_inventory_check::{CreateErpInventoryCheckRequest, UpdateErpInventoryCheckRequest};
use erp_model::response::erp_inventory_check::{ErpInventoryCheckBaseResponse, ErpInventoryCheckResponse};

pub fn create_request_to_model(request: &CreateErpInventoryCheckRequest) -> ErpInventoryCheckActiveModel {
    ErpInventoryCheckActiveModel {
        check_date: Set(request.check_date.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpInventoryCheckRequest, existing: ErpInventoryCheck) -> ErpInventoryCheckActiveModel {
    let mut active_model: ErpInventoryCheckActiveModel = existing.into();
    if let Some(check_date) = &request.check_date { 
        active_model.check_date = Set(check_date.clone());
    }
    if let Some(remarks) = &request.remarks { 
        active_model.remarks = Set(Some(remarks.clone()));
    }
    active_model
}

pub fn model_to_response(model: ErpInventoryCheck) -> ErpInventoryCheckResponse {
    ErpInventoryCheckResponse { 
        id: model.id,
        order_number: model.order_number,
        check_date: model.check_date,
        remarks: model.remarks,
        department_code: model.department_code,
        department_id: model.department_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}

pub fn model_to_base_response(model: ErpInventoryCheck, details: Vec<ErpInventoryCheckDetailBaseResponse>, attachments: Vec<ErpInventoryCheckAttachmentBaseResponse>) -> ErpInventoryCheckBaseResponse {
    ErpInventoryCheckBaseResponse { 
        id: model.id,
        order_number: model.order_number,
        check_date: model.check_date,
        remarks: model.remarks,

        details,
        attachments,
    }
}