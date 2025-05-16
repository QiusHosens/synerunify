use sea_orm::{Set, NotSet};
use crate::model::system_tenant::{self, Model as SystemTenant, ActiveModel as SystemTenantActiveModel};
use system_model::request::system_tenant::{CreateSystemTenantRequest, UpdateSystemTenantRequest};
use system_model::response::system_tenant::SystemTenantResponse;

pub fn create_request_to_model(request: &CreateSystemTenantRequest) -> SystemTenantActiveModel {
    SystemTenantActiveModel {
        name: Set(request.name.clone()),
        contact_name: Set(request.contact_name.clone()),
        contact_mobile: request.contact_mobile.as_ref().map_or(NotSet, |contact_mobile| Set(Some(contact_mobile.clone()))),
        status: Set(request.status.clone()),
        website: request.website.as_ref().map_or(NotSet, |website| Set(Some(website.clone()))),
        package_id: Set(request.package_id.clone()),
        expire_time: Set(request.expire_time.clone()),
        account_count: Set(request.account_count.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateSystemTenantRequest, existing: SystemTenant) -> SystemTenantActiveModel {
    let mut active_model: SystemTenantActiveModel = existing.into();
    if let Some(name) = &request.name { 
        active_model.name = Set(name.clone());
    }
    if let Some(contact_name) = &request.contact_name { 
        active_model.contact_name = Set(contact_name.clone());
    }
    if let Some(contact_mobile) = &request.contact_mobile { 
        active_model.contact_mobile = Set(Some(contact_mobile.clone()));
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    if let Some(website) = &request.website { 
        active_model.website = Set(Some(website.clone()));
    }
    if let Some(package_id) = &request.package_id { 
        active_model.package_id = Set(package_id.clone());
    }
    if let Some(expire_time) = &request.expire_time { 
        active_model.expire_time = Set(expire_time.clone());
    }
    if let Some(account_count) = &request.account_count { 
        active_model.account_count = Set(account_count.clone());
    }
    active_model
}

pub fn model_to_response(model: SystemTenant) -> SystemTenantResponse {
    SystemTenantResponse { 
        id: model.id,
        name: model.name,
        contact_user_id: model.contact_user_id,
        contact_name: model.contact_name,
        contact_mobile: model.contact_mobile,
        status: model.status,
        website: model.website,
        package_id: model.package_id,
        expire_time: model.expire_time,
        account_count: model.account_count,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}