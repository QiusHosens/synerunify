use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

use crate::response::{erp_inventory_transfer_attachment::ErpInventoryTransferAttachmentBaseResponse, erp_inventory_transfer_detail::ErpInventoryTransferDetailBaseResponse};

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ErpInventoryTransferResponse {
    
    pub id: i64, // 调拨记录ID
    
    pub order_number: i64, // 订单编号
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub transfer_date: NaiveDateTime, // 调拨日期
    
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

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ErpInventoryTransferBaseResponse {
    
    pub id: i64, // 调拨记录ID
    
    pub order_number: i64, // 订单编号
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub transfer_date: NaiveDateTime, // 调拨日期
    
    pub remarks: Option<String>, // 备注

    pub details: Vec<ErpInventoryTransferDetailBaseResponse>, // 调拨列表

    pub attachments: Vec<ErpInventoryTransferAttachmentBaseResponse>, // 调拨附件列表
    
}