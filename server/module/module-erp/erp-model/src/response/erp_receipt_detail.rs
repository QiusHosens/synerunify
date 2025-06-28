use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};
use common::formatter::string_date_time::StringDateTime;

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ErpReceiptDetailResponse {
    
    pub id: i64, // 收款详情ID
    
    pub receipt_id: i64, // 收款ID
    
    pub sales_order_id: Option<i64>, // 销售订单ID
    
    pub sales_return_id: Option<i64>, // 销售退货ID
    
    pub amount: i64, // 金额
    
    pub remarks: Option<String>, // 描述
    
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
pub struct ErpReceiptDetailBaseResponse {
    
    pub id: i64, // 收款详情ID
    
    pub sales_order_id: Option<i64>, // 销售订单ID
    
    pub sales_return_id: Option<i64>, // 销售退货ID
    
    pub amount: i64, // 金额
    
    pub remarks: Option<String>, // 描述
    
}