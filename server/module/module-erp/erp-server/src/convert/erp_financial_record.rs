use sea_orm::{Set, NotSet};
use crate::model::erp_financial_record::{self, Model as ErpFinancialRecord, ActiveModel as ErpFinancialRecordActiveModel};
use erp_model::request::erp_financial_record::{CreateErpFinancialRecordRequest, UpdateErpFinancialRecordRequest};
use erp_model::response::erp_financial_record::ErpFinancialRecordResponse;

pub fn create_request_to_model(request: &CreateErpFinancialRecordRequest) -> ErpFinancialRecordActiveModel {
    ErpFinancialRecordActiveModel {
        record_type: Set(request.record_type.clone()),
        amount: Set(request.amount.clone()),
        description: request.description.as_ref().map_or(NotSet, |description| Set(Some(description.clone()))),
        related_order_id: request.related_order_id.as_ref().map_or(NotSet, |related_order_id| Set(Some(related_order_id.clone()))),
        record_date: Set(request.record_date.clone()),
        user_id: request.user_id.as_ref().map_or(NotSet, |user_id| Set(Some(user_id.clone()))),
        department_code: Set(request.department_code.clone()),
        department_id: Set(request.department_id.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpFinancialRecordRequest, existing: ErpFinancialRecord) -> ErpFinancialRecordActiveModel {
    let mut active_model: ErpFinancialRecordActiveModel = existing.into();
    if let Some(record_type) = &request.record_type { 
        active_model.record_type = Set(record_type.clone());
    }
    if let Some(amount) = &request.amount { 
        active_model.amount = Set(amount.clone());
    }
    if let Some(description) = &request.description { 
        active_model.description = Set(Some(description.clone()));
    }
    if let Some(related_order_id) = &request.related_order_id { 
        active_model.related_order_id = Set(Some(related_order_id.clone()));
    }
    if let Some(record_date) = &request.record_date { 
        active_model.record_date = Set(record_date.clone());
    }
    if let Some(user_id) = &request.user_id { 
        active_model.user_id = Set(Some(user_id.clone()));
    }
    if let Some(department_code) = &request.department_code { 
        active_model.department_code = Set(department_code.clone());
    }
    if let Some(department_id) = &request.department_id { 
        active_model.department_id = Set(department_id.clone());
    }
    active_model
}

pub fn model_to_response(model: ErpFinancialRecord) -> ErpFinancialRecordResponse {
    ErpFinancialRecordResponse { 
        id: model.id,
        record_type: model.record_type,
        amount: model.amount,
        description: model.description,
        related_order_id: model.related_order_id,
        record_date: model.record_date,
        user_id: model.user_id,
        department_code: model.department_code,
        department_id: model.department_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}