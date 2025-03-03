
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateSystemPostRequest {
    
    pub code: String, // 职位编码
    
    pub name: String, // 职位名称
    
    pub sort: i32, // 显示顺序
    
    pub status: i8, // 状态（0正常 1停用）
    
    pub remark: Option<String>, // 备注
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateSystemPostRequest {
    
    pub id: i64, // 职位ID
    
    pub code: Option<String>, // 职位编码
    
    pub name: Option<String>, // 职位名称
    
    pub sort: Option<i32>, // 显示顺序
    
    pub status: Option<i8>, // 状态（0正常 1停用）
    
    pub remark: Option<String>, // 备注
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}