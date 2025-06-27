use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use serde_with::serde_as;
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

use crate::request::{erp_inventory_transfer_attachment::{CreateErpInventoryTransferAttachmentRequest, UpdateErpInventoryTransferAttachmentRequest}, erp_inventory_transfer_detail::{CreateErpInventoryTransferDetailRequest, UpdateErpInventoryTransferDetailRequest}};

#[serde_as]
#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpInventoryTransferRequest {
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub transfer_date: NaiveDateTime, // 调拨日期
    
    pub remarks: Option<String>, // 备注

    pub details: Vec<CreateErpInventoryTransferDetailRequest>, // 调拨列表

    pub attachments: Vec<CreateErpInventoryTransferAttachmentRequest>, // 调拨附件列表
    
}

#[serde_as]
#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpInventoryTransferRequest {
    
    pub id: i64, // 调拨记录ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "Option<common::formatter::string_date_time::StringDateTime>")]
    #[schema(value_type = String, format = Date)]
    pub transfer_date: Option<NaiveDateTime>, // 调拨日期
    
    pub remarks: Option<String>, // 备注

    pub details: Vec<UpdateErpInventoryTransferDetailRequest>, // 调拨列表

    pub attachments: Vec<UpdateErpInventoryTransferAttachmentRequest>, // 调拨附件列表
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}