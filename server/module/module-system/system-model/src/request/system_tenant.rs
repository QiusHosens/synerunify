use serde::{Serialize, Deserialize};
use crate::model::system_tenant::{self, SystemTenant, SystemTenantActiveModel};

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateSystemTenantRequest {
    
    pub name: String, // 租户名
    
    pub contact_user_id: Option<i64>, // 联系人的用户编号
    
    pub contact_name: String, // 联系人
    
    pub contact_mobile: Option<String>, // 联系手机
    
    pub status: i8, // 租户状态（0正常 1停用）
    
    pub website: Option<String>, // 绑定域名
    
    pub package_id: i64, // 租户套餐编号
    
    pub expire_time: NaiveDateTime, // 过期时间
    
    pub account_count: i32, // 账号数量
    
}

impl CreateSystemTenantRequest {
    pub fn to_active_model(&self) -> SystemTenantActiveModel {
        SystemTenantActiveModel {
            name: Set(self.name.clone()),
            contact_user_id: Set(self.contact_user_id.clone()),
            contact_name: Set(self.contact_name.clone()),
            contact_mobile: Set(self.contact_mobile.clone()),
            status: Set(self.status.clone()),
            website: Set(self.website.clone()),
            package_id: Set(self.package_id.clone()),
            expire_time: Set(self.expire_time.clone()),
            account_count: Set(self.account_count.clone()),
            ..Default::default()
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateSystemTenantRequest {
    
    pub id: i64, // 租户编号
    
    pub name: String, // 租户名
    
    pub contact_user_id: Option<i64>, // 联系人的用户编号
    
    pub contact_name: String, // 联系人
    
    pub contact_mobile: Option<String>, // 联系手机
    
    pub status: i8, // 租户状态（0正常 1停用）
    
    pub website: Option<String>, // 绑定域名
    
    pub package_id: i64, // 租户套餐编号
    
    pub expire_time: NaiveDateTime, // 过期时间
    
    pub account_count: i32, // 账号数量
    
}

impl UpdateSystemTenantRequest {
    pub fn to_active_model(&self, existing: SystemTenant) -> SystemTenantActiveModel {
        let mut active_model: SystemTenantActiveModel = existing.into();
        if let Some(name) = &self.name {
            active_model.name = Set(name.clone());
        }
        if let Some(contact_user_id) = &self.contact_user_id {
            active_model.contact_user_id = Set(contact_user_id.clone());
        }
        if let Some(contact_name) = &self.contact_name {
            active_model.contact_name = Set(contact_name.clone());
        }
        if let Some(contact_mobile) = &self.contact_mobile {
            active_model.contact_mobile = Set(contact_mobile.clone());
        }
        if let Some(status) = &self.status {
            active_model.status = Set(status.clone());
        }
        if let Some(website) = &self.website {
            active_model.website = Set(website.clone());
        }
        if let Some(package_id) = &self.package_id {
            active_model.package_id = Set(package_id.clone());
        }
        if let Some(expire_time) = &self.expire_time {
            active_model.expire_time = Set(expire_time.clone());
        }
        if let Some(account_count) = &self.account_count {
            active_model.account_count = Set(account_count.clone());
        }
        active_model
    }
}