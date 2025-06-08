use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpInventoryRecordsRequest {
    
    pub product_id: Option<i64>, // 产品ID
    
    pub warehouse_id: Option<i64>, // 仓库ID
    
    pub quantity: i32, // 数量
    
    pub record_type: i8, // 记录类型 (0=in, 1=out)
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub record_date: NaiveDateTime, // 记录日期
    
    pub remarks: Option<String>, // 备注
    
    pub department_code: String, // 部门编码
    
    pub department_id: i64, // 部门ID
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpInventoryRecordsRequest {
    
    pub id: i64, // 库存记录ID
    
    pub product_id: Option<i64>, // 产品ID
    
    pub warehouse_id: Option<i64>, // 仓库ID
    
    pub quantity: Option<i32>, // 数量
    
    pub record_type: Option<i8>, // 记录类型 (0=in, 1=out)
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub record_date: Option<NaiveDateTime>, // 记录日期
    
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