use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};
use common::formatter::string_date_time::StringDateTime;

use crate::response::{erp_inbound_order_attachment::ErpInboundOrderAttachmentBaseResponse, erp_inbound_order_detail::{ErpInboundOrderDetailBaseOtherResponse, ErpInboundOrderDetailBasePurchaseResponse}};

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ErpInboundOrderResponse {
    
    pub id: i64, // 入库订单ID

    pub order_number: i64, // 订单编号
    
    pub purchase_id: Option<i64>, // 采购订单ID
    
    pub supplier_id: i64, // 供应商ID

    pub user_id: i64, // 用户ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub inbound_date: NaiveDateTime, // 入库日期
    
    pub remarks: Option<String>, // 备注
    
    pub discount_rate: Option<i64>, // 优惠率（百分比，1000表示10.00%）
    
    pub other_cost: Option<i64>, // 其他费用
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
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
pub struct ErpInboundOrderPagePurchaseResponse {
    
    pub id: i64, // 入库订单ID

    pub order_number: i64, // 订单编号
    
    pub purchase_id: Option<i64>, // 采购订单ID
    
    pub supplier_id: i64, // 供应商ID

    pub user_id: i64, // 用户ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub inbound_date: NaiveDateTime, // 入库日期
    
    pub remarks: Option<String>, // 备注
    
    pub discount_rate: Option<i64>, // 优惠率（百分比，1000表示10.00%）
    
    pub other_cost: Option<i64>, // 其他费用
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
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

    pub purchase_order_number: Option<i64>, // 采购订单编号

    pub supplier_name: Option<String>, // 供应商名

    pub settlement_account_name: Option<String>, // 结算账户名
    
}

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ErpInboundOrderPageOtherResponse {
    
    pub id: i64, // 入库订单ID

    pub order_number: i64, // 订单编号
    
    pub purchase_id: Option<i64>, // 采购订单ID
    
    pub supplier_id: i64, // 供应商ID

    pub user_id: i64, // 用户ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub inbound_date: NaiveDateTime, // 入库日期
    
    pub remarks: Option<String>, // 备注
    
    pub discount_rate: Option<i64>, // 优惠率（百分比，1000表示10.00%）
    
    pub other_cost: Option<i64>, // 其他费用
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
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
pub struct ErpInboundOrderBasePurchaseResponse {
    
    pub id: i64, // 入库订单ID

    pub order_number: i64, // 订单编号
    
    pub purchase_id: Option<i64>, // 采购订单ID
    
    pub supplier_id: i64, // 供应商ID

    pub user_id: i64, // 用户ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub inbound_date: NaiveDateTime, // 入库日期
    
    pub remarks: Option<String>, // 备注
    
    pub discount_rate: Option<i64>, // 优惠率（百分比，1000表示10.00%）
    
    pub other_cost: Option<i64>, // 其他费用
    
    pub settlement_account_id: Option<i64>, // 结算账户ID

    pub details: Vec<ErpInboundOrderDetailBasePurchaseResponse>, // 入库采购产品仓库列表

    pub attachments: Vec<ErpInboundOrderAttachmentBaseResponse>, // 入库附件列表
    
}

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ErpInboundOrderBaseOtherResponse {
    
    pub id: i64, // 入库订单ID

    pub order_number: i64, // 订单编号
    
    pub purchase_id: Option<i64>, // 采购订单ID
    
    pub supplier_id: i64, // 供应商ID

    pub user_id: i64, // 用户ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub inbound_date: NaiveDateTime, // 入库日期
    
    pub remarks: Option<String>, // 备注
    
    pub discount_rate: Option<i64>, // 优惠率（百分比，1000表示10.00%）
    
    pub other_cost: Option<i64>, // 其他费用
    
    pub settlement_account_id: Option<i64>, // 结算账户ID

    pub details: Vec<ErpInboundOrderDetailBaseOtherResponse>, // 入库采购产品仓库列表

    pub attachments: Vec<ErpInboundOrderAttachmentBaseResponse>, // 入库附件列表
    
}