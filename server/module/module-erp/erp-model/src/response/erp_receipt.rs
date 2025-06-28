use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};
use common::formatter::string_date_time::StringDateTime;

use crate::response::{erp_receipt_attachment::ErpReceiptAttachmentBaseResponse, erp_receipt_detail::ErpReceiptDetailBaseResponse};

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ErpReceiptResponse {
    
    pub id: i64, // 收款ID
    
    pub customer_id: i64, // 客户ID
    
    pub user_id: i64, // 关联用户ID
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
    pub amount: i64, // 收款金额
    
    pub discount_amount: Option<i64>, // 优惠金额
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub receipt_date: NaiveDateTime, // 收款日期
    
    pub payment_method: Option<String>, // 收款方式 (如 bank_transfer, cash, credit)
    
    pub receipt_status: i8, // 状态 (0=pending, 1=completed, 2=cancelled)
    
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
pub struct ErpReceiptPageResponse {
    
    pub id: i64, // 收款ID
    
    pub customer_id: i64, // 客户ID
    
    pub user_id: i64, // 关联用户ID
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
    pub amount: i64, // 收款金额
    
    pub discount_amount: Option<i64>, // 优惠金额
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub receipt_date: NaiveDateTime, // 收款日期
    
    pub payment_method: Option<String>, // 收款方式 (如 bank_transfer, cash, credit)
    
    pub receipt_status: i8, // 状态 (0=pending, 1=completed, 2=cancelled)
    
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

    /****************** 信息 ******************/

    pub customer_name: Option<String>, // 客户名

    pub settlement_account_name: Option<String>, // 结算账户名
    
}

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ErpReceiptBaseResponse {
    
    pub id: i64, // 收款ID
    
    pub customer_id: i64, // 客户ID
    
    pub user_id: i64, // 关联用户ID
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
    pub amount: i64, // 收款金额
    
    pub discount_amount: Option<i64>, // 优惠金额
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub receipt_date: NaiveDateTime, // 收款日期
    
    pub payment_method: Option<String>, // 收款方式 (如 bank_transfer, cash, credit)
    
    pub receipt_status: i8, // 状态 (0=pending, 1=completed, 2=cancelled)
    
    pub remarks: Option<String>, // 备注

    pub details: Vec<ErpReceiptDetailBaseResponse>, // 收款列表

    pub attachments: Vec<ErpReceiptAttachmentBaseResponse>, // 收款附件列表
    
}

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ErpReceiptInfoResponse {
    
    pub id: i64, // 收款ID
    
    pub customer_id: i64, // 客户ID
    
    pub user_id: i64, // 关联用户ID
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
    pub amount: i64, // 收款金额
    
    pub discount_amount: Option<i64>, // 优惠金额
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub receipt_date: NaiveDateTime, // 收款日期
    
    pub payment_method: Option<String>, // 收款方式 (如 bank_transfer, cash, credit)
    
    pub receipt_status: i8, // 状态 (0=pending, 1=completed, 2=cancelled)
    
    pub remarks: Option<String>, // 备注

    pub details: Vec<ErpReceiptDetailBaseResponse>, // 收款列表

    pub attachments: Vec<ErpReceiptAttachmentBaseResponse>, // 收款附件列表

    /****************** 信息 ******************/

    pub customer_name: Option<String>, // 客户名

    pub settlement_account_name: Option<String>, // 结算账户名
    
}