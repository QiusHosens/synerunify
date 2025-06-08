use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpInventoryChecksRequest {
    
    pub warehouse_id: Option<i64>, // 仓库ID
    
    pub product_id: Option<i64>, // 产品ID
    
    pub checked_quantity: i32, // 盘点数量
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub check_date: NaiveDateTime, // 盘点日期
    
    pub remarks: Option<String>, // 备注
    
    pub department_code: String, // 部门编码
    
    pub department_id: i64, // 部门ID
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpInventoryChecksRequest {
    
    pub id: i64, // 盘点记录ID
    
    pub warehouse_id: Option<i64>, // 仓库ID
    
    pub product_id: Option<i64>, // 产品ID
    
    pub checked_quantity: Option<i32>, // 盘点数量
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub check_date: Option<NaiveDateTime>, // 盘点日期
    
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