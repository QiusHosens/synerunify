use sea_orm::{Set, NotSet};
use crate::model::system_tenant_package::{self, Model as SystemTenantPackage, ActiveModel as SystemTenantPackageActiveModel};
use system_model::request::system_tenant_package::{CreateSystemTenantPackageRequest, UpdateSystemTenantPackageRequest};
use system_model::response::system_tenant_package::SystemTenantPackageResponse;

pub fn create_request_to_model(request: &CreateSystemTenantPackageRequest) -> SystemTenantPackageActiveModel {
    SystemTenantPackageActiveModel {
        name: Set(request.name.clone()),
            status: Set(request.status.clone()),
            remark: request.remark.as_ref().map_or(NotSet, |remark| Set(Some(remark.clone()))),
            menu_ids: Set(request.menu_ids.clone()),
            ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateSystemTenantPackageRequest, existing: SystemTenantPackage) -> SystemTenantPackageActiveModel {
    let mut active_model: SystemTenantPackageActiveModel = existing.into();
    if let Some(name) = &request.name {
        active_model.name = Set(name.clone());
        }
    if let Some(status) = &request.status {
        active_model.status = Set(status.clone());
        }
    if let Some(remark) = &request.remark {
        active_model.remark = Set(Some(remark.clone()));
        }
    if let Some(menu_ids) = &request.menu_ids {
        active_model.menu_ids = Set(menu_ids.clone());
        }
    active_model
}

pub fn model_to_response(model: SystemTenantPackage) -> SystemTenantPackageResponse {
    SystemTenantPackageResponse {
        id: model.id,
        name: model.name,
        status: model.status,
        remark: model.remark,
        menu_ids: model.menu_ids,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
        
    }
}