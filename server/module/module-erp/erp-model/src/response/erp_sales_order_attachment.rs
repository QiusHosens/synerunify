use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

// #[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ErpSalesOrderAttachmentResponse {
    
    pub id: i64, // 附件ID
    
    pub order_id: i64, // 销售订单ID
    
    pub file_id: i64, // 文件ID
    
    pub remarks: Option<String>, // 备注
    
    pub department_code: String, // 部门编码
    
    pub department_id: i64, // 部门ID
    
    pub creator: Option<i64>, // 创建者ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间
    
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ErpSalesOrderAttachmentBaseResponse {
    
    pub id: i64, // 附件ID
    
    pub order_id: i64, // 销售订单ID
    
    pub file_id: i64, // 文件ID
    
    pub remarks: Option<String>, // 备注
    
}