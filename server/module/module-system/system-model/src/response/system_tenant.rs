use serde::{Serialize, Deserialize};
use serde_with::{serde_as, DisplayFromStr};
use sea_orm::sea_query::types::NaiveDateTime;
use crate::model::system_tenant::SystemTenant;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemTenantResponse {
    
    pub id: i64, // 租户编号
    
    pub name: String, // 租户名
    
    pub contact_user_id: Option<i64>, // 联系人的用户编号
    
    pub contact_name: String, // 联系人
    
    pub contact_mobile: Option<String>, // 联系手机
    
    pub status: i8, // 租户状态（0正常 1停用）
    
    pub website: Option<String>, // 绑定域名
    
    pub package_id: i64, // 租户套餐编号
    
    #[serde_as(as = "DisplayFromStr")]
    #[serde(with = "serde_with::chrono::naive_datetime")]
    pub expire_time: NaiveDateTime, // 过期时间
    
    pub account_count: i32, // 账号数量
    
    pub creator: String, // 创建者
    
    #[serde_as(as = "DisplayFromStr")]
    #[serde(with = "serde_with::chrono::naive_datetime")]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<String>, // 更新者
    
    #[serde_as(as = "DisplayFromStr")]
    #[serde(with = "serde_with::chrono::naive_datetime")]
    pub update_time: NaiveDateTime, // 更新时间
    
}

impl From<SystemTenant> for SystemTenantResponse {
    fn from(model: SystemTenant) -> Self {
        Self {
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
}