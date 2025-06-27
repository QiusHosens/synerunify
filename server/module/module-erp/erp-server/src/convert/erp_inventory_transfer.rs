use erp_model::response::erp_inventory_transfer_attachment::ErpInventoryTransferAttachmentBaseResponse;
use erp_model::response::erp_inventory_transfer_detail::ErpInventoryTransferDetailBaseResponse;
use sea_orm::{Set, NotSet};
use crate::model::erp_inventory_transfer::{self, Model as ErpInventoryTransfer, ActiveModel as ErpInventoryTransferActiveModel};
use erp_model::request::erp_inventory_transfer::{CreateErpInventoryTransferRequest, UpdateErpInventoryTransferRequest};
use erp_model::response::erp_inventory_transfer::{ErpInventoryTransferBaseResponse, ErpInventoryTransferResponse};

pub fn create_request_to_model(request: &CreateErpInventoryTransferRequest) -> ErpInventoryTransferActiveModel {
    ErpInventoryTransferActiveModel {
        transfer_date: Set(request.transfer_date.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpInventoryTransferRequest, existing: ErpInventoryTransfer) -> ErpInventoryTransferActiveModel {
    let mut active_model: ErpInventoryTransferActiveModel = existing.into();
    if let Some(transfer_date) = &request.transfer_date { 
        active_model.transfer_date = Set(transfer_date.clone());
    }
    if let Some(remarks) = &request.remarks { 
        active_model.remarks = Set(Some(remarks.clone()));
    }
    active_model
}

pub fn model_to_response(model: ErpInventoryTransfer) -> ErpInventoryTransferResponse {
    ErpInventoryTransferResponse { 
        id: model.id,
        order_number: model.order_number,
        transfer_date: model.transfer_date,
        remarks: model.remarks,
        department_code: model.department_code,
        department_id: model.department_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}

pub fn model_to_base_response(model: ErpInventoryTransfer, details: Vec<ErpInventoryTransferDetailBaseResponse>, attachments: Vec<ErpInventoryTransferAttachmentBaseResponse>) -> ErpInventoryTransferBaseResponse {
    ErpInventoryTransferBaseResponse { 
        id: model.id,
        order_number: model.order_number,
        transfer_date: model.transfer_date,
        remarks: model.remarks,

        details,
        attachments,
    }
}