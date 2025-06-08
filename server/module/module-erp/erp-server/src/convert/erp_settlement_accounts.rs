use sea_orm::{Set, NotSet};
use crate::model::erp_settlement_accounts::{self, Model as ErpSettlementAccounts, ActiveModel as ErpSettlementAccountsActiveModel};
use erp_model::request::erp_settlement_accounts::{CreateErpSettlementAccountsRequest, UpdateErpSettlementAccountsRequest};
use erp_model::response::erp_settlement_accounts::ErpSettlementAccountsResponse;

pub fn create_request_to_model(request: &CreateErpSettlementAccountsRequest) -> ErpSettlementAccountsActiveModel {
    ErpSettlementAccountsActiveModel {
        account_name: Set(request.account_name.clone()),
        bank_name: request.bank_name.as_ref().map_or(NotSet, |bank_name| Set(Some(bank_name.clone()))),
        bank_account: request.bank_account.as_ref().map_or(NotSet, |bank_account| Set(Some(bank_account.clone()))),
        status: Set(request.status.clone()),
        sort_order: Set(request.sort_order.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        department_code: Set(request.department_code.clone()),
        department_id: Set(request.department_id.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpSettlementAccountsRequest, existing: ErpSettlementAccounts) -> ErpSettlementAccountsActiveModel {
    let mut active_model: ErpSettlementAccountsActiveModel = existing.into();
    if let Some(account_name) = &request.account_name { 
        active_model.account_name = Set(account_name.clone());
    }
    if let Some(bank_name) = &request.bank_name { 
        active_model.bank_name = Set(Some(bank_name.clone()));
    }
    if let Some(bank_account) = &request.bank_account { 
        active_model.bank_account = Set(Some(bank_account.clone()));
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    if let Some(sort_order) = &request.sort_order { 
        active_model.sort_order = Set(sort_order.clone());
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

pub fn model_to_response(model: ErpSettlementAccounts) -> ErpSettlementAccountsResponse {
    ErpSettlementAccountsResponse { 
        id: model.id,
        account_name: model.account_name,
        bank_name: model.bank_name,
        bank_account: model.bank_account,
        status: model.status,
        sort_order: model.sort_order,
        remarks: model.remarks,
        department_code: model.department_code,
        department_id: model.department_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}