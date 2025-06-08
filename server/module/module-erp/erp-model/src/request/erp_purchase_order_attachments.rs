
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpPurchaseOrderAttachmentsRequest {
    
    pub purchase_id: Option<i64>, // 采购订单ID
    
    pub file_id: Option<i64>, // 文件ID
    
    pub remarks: Option<String>, // 备注
    
    pub department_code: String, // 部门编码
    
    pub department_id: i64, // 部门ID
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpPurchaseOrderAttachmentsRequest {
    
    pub id: i64, // 附件ID
    
    pub purchase_id: Option<i64>, // 采购订单ID
    
    pub file_id: Option<i64>, // 文件ID
    
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