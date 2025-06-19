use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};
use common::formatter::string_date_time::StringDateTime;

use crate::response::{erp_purchase_order_attachment::{ErpPurchaseOrderAttachmentBaseResponse, ErpPurchaseOrderAttachmentInfoResponse}, erp_purchase_order_detail::{ErpPurchaseOrderDetailBaseResponse, ErpPurchaseOrderDetailInfoResponse}};

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ErpPurchaseOrderResponse {
    
    pub id: i64, // 采购订单ID
    
    pub order_number: i64, // 订单编号
    
    pub supplier_id: i64, // 供应商ID
    
    pub user_id: i64, // 用户ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub purchase_date: NaiveDateTime, // 采购日期
    
    pub total_amount: i64, // 总金额
    
    pub order_status: i8, // 订单状态
    
    pub discount_rate: Option<i64>, // 优惠率（百分比，1000表示10.00%）
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
    pub deposit: Option<i64>, // 定金
    
    pub remarks: Option<String>, // 备注
    
    pub department_code: String, // 部门编码
    
    pub department_id: i64, // 部门ID
    
    pub creator: Option<i64>, // 创建者ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间
    
}

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ErpPurchaseOrderPageResponse {
    
    pub id: i64, // 采购订单ID
    
    pub order_number: i64, // 订单编号
    
    pub supplier_id: i64, // 供应商ID
    
    pub user_id: i64, // 用户ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub purchase_date: NaiveDateTime, // 采购日期
    
    pub total_amount: i64, // 总金额
    
    pub order_status: i8, // 订单状态
    
    pub discount_rate: Option<i64>, // 优惠率（百分比，1000表示10.00%）
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
    pub deposit: Option<i64>, // 定金
    
    pub remarks: Option<String>, // 备注
    
    pub department_code: String, // 部门编码
    
    pub department_id: i64, // 部门ID
    
    pub creator: Option<i64>, // 创建者ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间

    /****************** 信息 ******************/

    pub supplier_name: Option<String>, // 供应商名

    pub settlement_account_name: Option<String>, // 结算账户名
    
}

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ErpPurchaseOrderBaseResponse {
    
    pub id: i64, // 采购订单ID
    
    pub order_number: i64, // 订单编号
    
    pub supplier_id: i64, // 供应商ID
    
    pub user_id: i64, // 用户ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub purchase_date: NaiveDateTime, // 采购日期
    
    pub total_amount: i64, // 总金额
    
    pub order_status: i8, // 订单状态
    
    pub discount_rate: Option<i64>, // 优惠率（百分比，1000表示10.00%）
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
    pub deposit: Option<i64>, // 定金
    
    pub remarks: Option<String>, // 备注

    pub purchase_products: Vec<ErpPurchaseOrderDetailBaseResponse>, // 采购的产品列表

    pub purchase_attachment: Vec<ErpPurchaseOrderAttachmentBaseResponse>, // 采购的附件列表
    
}

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ErpPurchaseOrderInfoResponse {
    
    pub id: i64, // 采购订单ID
    
    pub order_number: i64, // 订单编号
    
    pub supplier_id: i64, // 供应商ID
    
    pub user_id: i64, // 用户ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub purchase_date: NaiveDateTime, // 采购日期
    
    pub total_amount: i64, // 总金额
    
    pub order_status: i8, // 订单状态
    
    pub discount_rate: Option<i64>, // 优惠率（百分比，1000表示10.00%）
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
    pub deposit: Option<i64>, // 定金
    
    pub remarks: Option<String>, // 备注

    pub department_code: String, // 部门编码
    
    pub department_id: i64, // 部门ID
    
    pub creator: Option<i64>, // 创建者ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间

    /****************** 信息 ******************/

    pub supplier_name: Option<String>, // 供应商名

    pub settlement_account_name: Option<String>, // 结算账户名

    pub purchase_products: Vec<ErpPurchaseOrderDetailInfoResponse>, // 采购的产品列表

    pub purchase_attachment: Vec<ErpPurchaseOrderAttachmentInfoResponse>, // 采购的附件列表
    
}