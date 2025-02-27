use serde::{Serialize, Deserialize};
use serde_with::{serde_as, DisplayFromStr};
use sea_orm::sea_query::types::NaiveDateTime;
use crate::model::system_tenant_package::SystemTenantPackage;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemTenantPackageResponse {
    
    pub id: i64, // 套餐编号
    
    pub name: String, // 套餐名
    
    pub status: i8, // 租户状态（0正常 1停用）
    
    pub remark: Option<String>, // 备注
    
    pub menu_ids: String, // 关联的菜单编号
    
    pub creator: String, // 创建者
    
    #[serde_as(as = "DisplayFromStr")]
    #[serde(with = "serde_with::chrono::naive_datetime")]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<String>, // 更新者
    
    #[serde_as(as = "DisplayFromStr")]
    #[serde(with = "serde_with::chrono::naive_datetime")]
    pub update_time: NaiveDateTime, // 更新时间
    
}

impl From<SystemTenantPackage> for SystemTenantPackageResponse {
    fn from(model: SystemTenantPackage) -> Self {
        Self {
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
}