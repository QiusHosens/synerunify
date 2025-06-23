use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};
use common::formatter::string_date_time::StringDateTime;

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ErpInboundOrderAttachmentResponse {
    
    pub id: i64, // 入库订单附件ID
    
    pub order_id: i64, // 入库订单ID
    
    pub file_id: i64, // 文件ID
    
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
pub struct ErpInboundOrderAttachmentBaseResponse {
    
    pub id: i64, // 入库订单附件ID
    
    pub file_id: i64, // 文件ID
    
    pub remarks: Option<String>, // 备注

    pub file_name: Option<String>, // 文件名
    
}

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ErpInboundOrderAttachmentInfoResponse {
    
    pub id: i64, // 入库订单附件ID
    
    pub file_id: i64, // 文件ID
    
    pub remarks: Option<String>, // 备注

    pub file_name: Option<String>, // 文件名
    
}