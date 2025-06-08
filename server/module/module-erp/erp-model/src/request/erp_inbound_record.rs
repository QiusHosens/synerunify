use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpInboundRecordRequest {
    
    pub purchase_id: Option<i64>, // 采购订单ID
    
    pub warehouse_id: Option<i64>, // 仓库ID
    
    pub product_id: Option<i64>, // 产品ID
    
    pub quantity: i32, // 入库数量
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub inbound_date: NaiveDateTime, // 入库日期
    
    pub remarks: Option<String>, // 备注
    
    pub department_code: String, // 部门编码
    
    pub department_id: i64, // 部门ID
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpInboundRecordRequest {
    
    pub id: i64, // 入库记录ID
    
    pub purchase_id: Option<i64>, // 采购订单ID
    
    pub warehouse_id: Option<i64>, // 仓库ID
    
    pub product_id: Option<i64>, // 产品ID
    
    pub quantity: Option<i32>, // 入库数量
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub inbound_date: Option<NaiveDateTime>, // 入库日期
    
    pub remarks: Option<String>, // 备注
    
    pub department_code: Option<String>, // 部门编码
    
    pub department_id: Option<i64>, // 部门ID
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}