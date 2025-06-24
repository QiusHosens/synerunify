use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};
use common::formatter::string_date_time::StringDateTime;

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ErpOutboundOrderDetailResponse {
    
    pub id: i64, // 出库详情ID
    
    pub order_id: i64, // 出库订单ID

    pub sale_detail_id: Option<i64>, // 销售订单详情ID
    
    pub warehouse_id: i64, // 仓库ID
    
    pub product_id: i64, // 产品ID
    
    pub quantity: i32, // 数量
    
    pub unit_price: i64, // 单价
    
    pub subtotal: i64, // 小计
    
    pub tax_rate: Option<i32>, // 税率,精确到万分位
    
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
pub struct ErpOutboundOrderDetailBaseSalesResponse {
    
    pub id: i64, // 出库详情ID

    pub sale_detail_id: Option<i64>, // 销售订单详情ID
    
    pub warehouse_id: i64, // 仓库ID
    
    pub remarks: Option<String>, // 备注
    
}

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ErpOutboundOrderDetailBaseOtherResponse {
    
    pub id: i64, // 出库详情ID
    
    pub warehouse_id: i64, // 仓库ID
    
    pub product_id: i64, // 产品ID
    
    pub quantity: i32, // 数量
    
    pub unit_price: i64, // 单价
    
    pub subtotal: i64, // 小计
    
    pub tax_rate: Option<i32>, // 税率,精确到万分位
    
    pub remarks: Option<String>, // 备注
    
}