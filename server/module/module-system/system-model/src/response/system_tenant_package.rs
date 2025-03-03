use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

// #[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct SystemTenantPackageResponse {
    
    pub id: i64, // 套餐编号
    
    pub name: String, // 套餐名
    
    pub status: i8, // 租户状态（0正常 1停用）
    
    pub remark: Option<String>, // 备注
    
    pub menu_ids: String, // 关联的菜单编号
    
    pub creator: String, // 创建者
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<String>, // 更新者
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间
    
}