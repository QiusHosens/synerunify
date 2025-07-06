use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};
use common::formatter::string_date_time::StringDateTime;

use crate::response::{erp_outbound_order_attachment::ErpOutboundOrderAttachmentBaseResponse, erp_outbound_order_detail::{ErpOutboundOrderDetailBaseOtherResponse, ErpOutboundOrderDetailBaseSalesResponse}};

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ErpOutboundOrderResponse {
    
    pub id: i64, // 出库订单ID

    pub order_number: i64, // 订单编号
    
    pub sale_id: Option<i64>, // 销售订单ID
    
    pub customer_id: i64, // 客户ID

    pub user_id: i64, // 用户ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub outbound_date: NaiveDateTime, // 出库日期
    
    pub remarks: Option<String>, // 备注
    
    pub discount_rate: Option<i64>, // 优惠率（百分比，1000表示10.00%）
    
    pub other_cost: Option<i64>, // 其他费用
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
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
pub struct ErpOutboundOrderPageSalesResponse {
    
    pub id: i64, // 出库订单ID

    pub order_number: i64, // 订单编号
    
    pub sale_id: Option<i64>, // 销售订单ID
    
    pub customer_id: i64, // 客户ID

    pub user_id: i64, // 用户ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub outbound_date: NaiveDateTime, // 出库日期
    
    pub remarks: Option<String>, // 备注
    
    pub discount_rate: Option<i64>, // 优惠率（百分比，1000表示10.00%）
    
    pub other_cost: Option<i64>, // 其他费用
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
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

    pub sale_order_number: Option<i64>, // 销售订单编号

    pub customer_name: Option<String>, // 客户名

    pub settlement_account_name: Option<String>, // 结算账户名
    
}

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ErpOutboundOrderPageOtherResponse {
    
    pub id: i64, // 出库订单ID

    pub order_number: i64, // 订单编号
    
    pub sale_id: Option<i64>, // 销售订单ID
    
    pub customer_id: i64, // 客户ID

    pub user_id: i64, // 用户ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub outbound_date: NaiveDateTime, // 出库日期
    
    pub remarks: Option<String>, // 备注
    
    pub discount_rate: Option<i64>, // 优惠率（百分比，1000表示10.00%）
    
    pub other_cost: Option<i64>, // 其他费用
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
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
pub struct ErpOutboundOrderBaseSalesResponse {
    
    pub id: i64, // 出库订单ID

    pub order_number: i64, // 订单编号
    
    pub sale_id: Option<i64>, // 销售订单ID
    
    pub customer_id: i64, // 客户ID

    pub user_id: i64, // 用户ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub outbound_date: NaiveDateTime, // 出库日期
    
    pub remarks: Option<String>, // 备注
    
    pub discount_rate: Option<i64>, // 优惠率（百分比，1000表示10.00%）
    
    pub other_cost: Option<i64>, // 其他费用
    
    pub settlement_account_id: Option<i64>, // 结算账户ID

    pub details: Vec<ErpOutboundOrderDetailBaseSalesResponse>, // 出库销售产品仓库列表

    pub attachments: Vec<ErpOutboundOrderAttachmentBaseResponse>, // 出库附件列表
    
}

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ErpOutboundOrderBaseOtherResponse {
    
    pub id: i64, // 出库订单ID

    pub order_number: i64, // 订单编号
    
    pub sale_id: Option<i64>, // 销售订单ID
    
    pub customer_id: i64, // 客户ID

    pub user_id: i64, // 用户ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub outbound_date: NaiveDateTime, // 出库日期
    
    pub remarks: Option<String>, // 备注
    
    pub discount_rate: Option<i64>, // 优惠率（百分比，1000表示10.00%）
    
    pub other_cost: Option<i64>, // 其他费用
    
    pub settlement_account_id: Option<i64>, // 结算账户ID

    pub details: Vec<ErpOutboundOrderDetailBaseOtherResponse>, // 出库销售产品仓库列表

    pub attachments: Vec<ErpOutboundOrderAttachmentBaseResponse>, // 出库附件列表
    
}

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ErpOutboundOrderInfoSalesResponse {
    
    pub id: i64, // 出库订单ID

    pub order_number: i64, // 订单编号
    
    pub sale_id: Option<i64>, // 销售订单ID
    
    pub customer_id: i64, // 客户ID

    pub user_id: i64, // 用户ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub outbound_date: NaiveDateTime, // 出库日期
    
    pub remarks: Option<String>, // 备注
    
    pub discount_rate: Option<i64>, // 优惠率（百分比，1000表示10.00%）
    
    pub other_cost: Option<i64>, // 其他费用
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
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

    pub details: Vec<ErpOutboundOrderDetailBaseSalesResponse>, // 出库销售产品仓库列表

    pub attachments: Vec<ErpOutboundOrderAttachmentBaseResponse>, // 出库附件列表

    /****************** 信息 ******************/

    pub settlement_account_name: Option<String>, // 结算账户名
    
}

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ErpOutboundOrderInfoOtherResponse {
    
    pub id: i64, // 出库订单ID

    pub order_number: i64, // 订单编号
    
    pub sale_id: Option<i64>, // 销售订单ID
    
    pub customer_id: i64, // 客户ID

    pub user_id: i64, // 用户ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub outbound_date: NaiveDateTime, // 出库日期
    
    pub remarks: Option<String>, // 备注
    
    pub discount_rate: Option<i64>, // 优惠率（百分比，1000表示10.00%）
    
    pub other_cost: Option<i64>, // 其他费用
    
    pub settlement_account_id: Option<i64>, // 结算账户ID

    /****************** 信息 ******************/

    pub customer_name: Option<String>, // 客户名

    pub settlement_account_name: Option<String>, // 结算账户名

    pub details: Vec<ErpOutboundOrderDetailBaseOtherResponse>, // 出库销售产品仓库列表

    pub attachments: Vec<ErpOutboundOrderAttachmentBaseResponse>, // 出库附件列表
    
}