
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpOutboundOrderAttachmentRequest {
    
    pub file_id: i64, // 文件ID
    
    pub remarks: Option<String>, // 备注
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpOutboundOrderAttachmentRequest {
    
    pub id: Option<i64>, // 出库订单附件ID,修改有,新增无
    
    pub file_id: i64, // 文件ID
    
    pub remarks: Option<String>, // 备注
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}