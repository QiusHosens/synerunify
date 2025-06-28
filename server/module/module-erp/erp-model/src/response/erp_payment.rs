use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};
use common::formatter::string_date_time::StringDateTime;

use crate::response::{erp_payment_attachment::ErpPaymentAttachmentBaseResponse, erp_payment_detail::ErpPaymentDetailBaseResponse};

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ErpPaymentResponse {
    
    pub id: i64, // 付款ID

    pub order_number: i64, // 订单编号
    
    pub supplier_id: i64, // 供应商ID
    
    pub user_id: i64, // 关联用户ID
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
    pub amount: i64, // 付款金额
    
    pub discount_amount: Option<i64>, // 优惠金额
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub payment_date: NaiveDateTime, // 付款日期
    
    pub payment_method: Option<String>, // 付款方式 (如 bank_transfer, cash, credit)
    
    pub payment_status: i8, // 状态 (0=pending, 1=completed, 2=cancelled)
    
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
pub struct ErpPaymentPageResponse {
    
    pub id: i64, // 付款ID

    pub order_number: i64, // 订单编号
    
    pub supplier_id: i64, // 供应商ID
    
    pub user_id: i64, // 关联用户ID
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
    pub amount: i64, // 付款金额
    
    pub discount_amount: Option<i64>, // 优惠金额
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub payment_date: NaiveDateTime, // 付款日期
    
    pub payment_method: Option<String>, // 付款方式 (如 bank_transfer, cash, credit)
    
    pub payment_status: i8, // 状态 (0=pending, 1=completed, 2=cancelled)
    
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

    pub supplier_name: Option<String>, // 供应商名

    pub settlement_account_name: Option<String>, // 结算账户名
    
}

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ErpPaymentBaseResponse {
    
    pub id: i64, // 付款ID

    pub order_number: i64, // 订单编号
    
    pub supplier_id: i64, // 供应商ID
    
    pub user_id: i64, // 关联用户ID
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
    pub amount: i64, // 付款金额
    
    pub discount_amount: Option<i64>, // 优惠金额
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub payment_date: NaiveDateTime, // 付款日期
    
    pub payment_method: Option<String>, // 付款方式 (如 bank_transfer, cash, credit)
    
    pub payment_status: i8, // 状态 (0=pending, 1=completed, 2=cancelled)
    
    pub remarks: Option<String>, // 备注

    pub details: Vec<ErpPaymentDetailBaseResponse>, // 付款列表

    pub attachments: Vec<ErpPaymentAttachmentBaseResponse>, // 付款附件列表
    
}

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ErpPaymentInfoResponse {
    
    pub id: i64, // 付款ID

    pub order_number: i64, // 订单编号
    
    pub supplier_id: i64, // 供应商ID
    
    pub user_id: i64, // 关联用户ID
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
    pub amount: i64, // 付款金额
    
    pub discount_amount: Option<i64>, // 优惠金额
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub payment_date: NaiveDateTime, // 付款日期
    
    pub payment_method: Option<String>, // 付款方式 (如 bank_transfer, cash, credit)
    
    pub payment_status: i8, // 状态 (0=pending, 1=completed, 2=cancelled)
    
    pub remarks: Option<String>, // 备注

    pub details: Vec<ErpPaymentDetailBaseResponse>, // 付款列表

    pub attachments: Vec<ErpPaymentAttachmentBaseResponse>, // 付款附件列表

    /****************** 信息 ******************/

    pub supplier_name: Option<String>, // 供应商名

    pub settlement_account_name: Option<String>, // 结算账户名
    
}