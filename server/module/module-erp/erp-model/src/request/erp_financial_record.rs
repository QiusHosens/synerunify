use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpFinancialRecordRequest {
    
    pub record_type: i8, // 记录类型 (0=income, 1=expense)
    
    pub amount: i64, // 金额
    
    pub description: Option<String>, // 描述
    
    pub related_order_id: Option<i64>, // 关联订单ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub record_date: NaiveDateTime, // 记录日期
    
    pub user_id: Option<i64>, // 用户ID
    
    pub department_code: String, // 部门编码
    
    pub department_id: i64, // 部门ID
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpFinancialRecordRequest {
    
    pub id: i64, // 财务记录ID
    
    pub record_type: Option<i8>, // 记录类型 (0=income, 1=expense)
    
    pub amount: Option<i64>, // 金额
    
    pub description: Option<String>, // 描述
    
    pub related_order_id: Option<i64>, // 关联订单ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub record_date: Option<NaiveDateTime>, // 记录日期
    
    pub user_id: Option<i64>, // 用户ID
    
    pub department_code: Option<String>, // 部门编码
    
    pub department_id: Option<i64>, // 部门ID
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}