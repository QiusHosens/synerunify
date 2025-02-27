use serde::{Serialize, Deserialize};
use crate::model::system_tenant_package::{self, SystemTenantPackage, SystemTenantPackageActiveModel};

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateSystemTenantPackageRequest {
    
    pub name: String, // 套餐名
    
    pub status: i8, // 租户状态（0正常 1停用）
    
    pub remark: Option<String>, // 备注
    
    pub menu_ids: String, // 关联的菜单编号
    
}

impl CreateSystemTenantPackageRequest {
    pub fn to_active_model(&self) -> SystemTenantPackageActiveModel {
        SystemTenantPackageActiveModel {
            name: Set(self.name.clone()),
            status: Set(self.status.clone()),
            remark: Set(self.remark.clone()),
            menu_ids: Set(self.menu_ids.clone()),
            ..Default::default()
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateSystemTenantPackageRequest {
    
    pub id: i64, // 套餐编号
    
    pub name: String, // 套餐名
    
    pub status: i8, // 租户状态（0正常 1停用）
    
    pub remark: Option<String>, // 备注
    
    pub menu_ids: String, // 关联的菜单编号
    
}

impl UpdateSystemTenantPackageRequest {
    pub fn to_active_model(&self, existing: SystemTenantPackage) -> SystemTenantPackageActiveModel {
        let mut active_model: SystemTenantPackageActiveModel = existing.into();
        if let Some(name) = &self.name {
            active_model.name = Set(name.clone());
        }
        if let Some(status) = &self.status {
            active_model.status = Set(status.clone());
        }
        if let Some(remark) = &self.remark {
            active_model.remark = Set(remark.clone());
        }
        if let Some(menu_ids) = &self.menu_ids {
            active_model.menu_ids = Set(menu_ids.clone());
        }
        active_model
    }
}