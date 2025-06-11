use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};
use common::formatter::string_date_time::StringDateTime;

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ErpPurchaseOrderResponse {
    
    pub id: i64, // 采购订单ID
    
    pub order_number: String, // 订单编号
    
    pub supplier_name: String, // 供应商名称
    
    // pub user_name: String, // 用户名称
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub purchase_date: NaiveDateTime, // 采购日期
    
    pub total_amount: i64, // 总金额
    
    pub order_status: i8, // 订单状态 (0=pending, 1=completed, 2=cancelled)
    
    pub discount_rate: Option<i64>, // 优惠率（百分比，1000表示10.00%）
    
    pub settlement_account_name: Option<String>, // 结算账户
    
    pub deposit: Option<i64>, // 定金
    
    pub remarks: Option<String>, // 备注
    
    pub department_name: String, // 部门名称
    
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