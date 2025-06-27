use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ErpInventoryTransferDetailResponse {
    
    pub id: i64, // ID
    
    pub order_id: i64, // 调拨订单ID
    
    pub from_warehouse_id: i64, // 调出仓库ID
    
    pub to_warehouse_id: i64, // 调入仓库ID
    
    pub product_id: i64, // 产品ID
    
    pub quantity: i32, // 调拨数量
    
    pub remarks: Option<String>, // 备注
    
    pub department_code: String, // 部门编码
    
    pub department_id: i64, // 部门ID
    
    pub creator: Option<i64>, // 创建者ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间
    
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ErpInventoryTransferDetailBaseResponse {
    
    pub id: i64, // ID
    
    pub from_warehouse_id: i64, // 调出仓库ID
    
    pub to_warehouse_id: i64, // 调入仓库ID
    
    pub product_id: i64, // 产品ID
    
    pub quantity: i32, // 调拨数量
    
    pub remarks: Option<String>, // 备注
    
}