use sea_orm::{Set, NotSet};
use crate::model::erp_supplier::{self, Model as ErpSupplier, ActiveModel as ErpSupplierActiveModel};
use erp_model::request::erp_supplier::{CreateErpSupplierRequest, UpdateErpSupplierRequest};
use erp_model::response::erp_supplier::ErpSupplierResponse;

pub fn create_request_to_model(request: &CreateErpSupplierRequest) -> ErpSupplierActiveModel {
    ErpSupplierActiveModel {
        name: Set(request.name.clone()),
        contact_person: request.contact_person.as_ref().map_or(NotSet, |contact_person| Set(Some(contact_person.clone()))),
        phone: request.phone.as_ref().map_or(NotSet, |phone| Set(Some(phone.clone()))),
        email: request.email.as_ref().map_or(NotSet, |email| Set(Some(email.clone()))),
        address: request.address.as_ref().map_or(NotSet, |address| Set(Some(address.clone()))),
        status: Set(request.status.clone()),
        tax_id: request.tax_id.as_ref().map_or(NotSet, |tax_id| Set(Some(tax_id.clone()))),
        tax_rate: request.tax_rate.as_ref().map_or(NotSet, |tax_rate| Set(Some(tax_rate.clone()))),
        bank_name: request.bank_name.as_ref().map_or(NotSet, |bank_name| Set(Some(bank_name.clone()))),
        bank_account: request.bank_account.as_ref().map_or(NotSet, |bank_account| Set(Some(bank_account.clone()))),
        bank_address: request.bank_address.as_ref().map_or(NotSet, |bank_address| Set(Some(bank_address.clone()))),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        sort: Set(request.sort.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpSupplierRequest, existing: ErpSupplier) -> ErpSupplierActiveModel {
    let mut active_model: ErpSupplierActiveModel = existing.into();
    if let Some(name) = &request.name {
        active_model.name = Set(name.clone());
    }
    if let Some(contact_person) = &request.contact_person { 
        active_model.contact_person = Set(Some(contact_person.clone()));
    }
    if let Some(phone) = &request.phone { 
        active_model.phone = Set(Some(phone.clone()));
    }
    if let Some(email) = &request.email { 
        active_model.email = Set(Some(email.clone()));
    }
    if let Some(address) = &request.address { 
        active_model.address = Set(Some(address.clone()));
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    if let Some(tax_id) = &request.tax_id { 
        active_model.tax_id = Set(Some(tax_id.clone()));
    }
    if let Some(tax_rate) = &request.tax_rate { 
        active_model.tax_rate = Set(Some(tax_rate.clone()));
    }
    if let Some(bank_name) = &request.bank_name { 
        active_model.bank_name = Set(Some(bank_name.clone()));
    }
    if let Some(bank_account) = &request.bank_account { 
        active_model.bank_account = Set(Some(bank_account.clone()));
    }
    if let Some(bank_address) = &request.bank_address { 
        active_model.bank_address = Set(Some(bank_address.clone()));
    }
    if let Some(remarks) = &request.remarks { 
        active_model.remarks = Set(Some(remarks.clone()));
    }
    if let Some(sort) = &request.sort {
        active_model.sort = Set(sort.clone());
    }
    active_model
}

pub fn model_to_response(model: ErpSupplier) -> ErpSupplierResponse {
    ErpSupplierResponse { 
        id: model.id,
        name: model.name,
        contact_person: model.contact_person,
        phone: model.phone,
        email: model.email,
        address: model.address,
        status: model.status,
        tax_id: model.tax_id,
        tax_rate: model.tax_rate,
        bank_name: model.bank_name,
        bank_account: model.bank_account,
        bank_address: model.bank_address,
        remarks: model.remarks,
        sort: model.sort,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}