
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpSettlementAccountRequest {
    
    pub name: String, // 账户名称
    
    pub bank_name: Option<String>, // 开户行
    
    pub bank_account: Option<String>, // 银行账号
    
    pub status: i8, // 状态
    
    pub sort_order: i32, // 排序
    
    pub remarks: Option<String>, // 备注
    
    pub department_code: String, // 部门编码
    
    pub department_id: i64, // 部门ID
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpSettlementAccountRequest {
    
    pub id: i64, // 账户ID
    
    pub name: Option<String>, // 账户名称
    
    pub bank_name: Option<String>, // 开户行
    
    pub bank_account: Option<String>, // 银行账号
    
    pub status: Option<i8>, // 状态
    
    pub sort_order: Option<i32>, // 排序
    
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