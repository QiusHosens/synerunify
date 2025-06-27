use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use serde_with::serde_as;
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

use crate::request::{erp_inventory_check_attachment::{CreateErpInventoryCheckAttachmentRequest, UpdateErpInventoryCheckAttachmentRequest}, erp_inventory_check_detail::{CreateErpInventoryCheckDetailRequest, UpdateErpInventoryCheckDetailRequest}};

#[serde_as]
#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpInventoryCheckRequest {
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub check_date: NaiveDateTime, // 盘点日期
    
    pub remarks: Option<String>, // 备注

    pub details: Vec<CreateErpInventoryCheckDetailRequest>, // 退货采购产品仓库列表

    pub attachments: Vec<CreateErpInventoryCheckAttachmentRequest>, // 退货附件列表
    
}

#[serde_as]
#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpInventoryCheckRequest {
    
    pub id: i64, // 盘点记录ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "Option<common::formatter::string_date_time::StringDateTime>")]
    #[schema(value_type = String, format = Date)]
    pub check_date: Option<NaiveDateTime>, // 盘点日期
    
    pub remarks: Option<String>, // 备注

    pub details: Vec<UpdateErpInventoryCheckDetailRequest>, // 退货采购产品仓库列表

    pub attachments: Vec<UpdateErpInventoryCheckAttachmentRequest>, // 退货附件列表
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}