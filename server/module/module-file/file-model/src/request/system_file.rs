
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateSystemFileRequest {
    
    pub file_name: String, // 文件名
    
    pub file_type: Option<String>, // 文件类型
    
    pub file_size: i64, // 文件大小（字节）
    
    pub file_path: String, // 文件存储路径
    
    pub department_code: String, // 部门编码
    
    pub department_id: i64, // 部门ID
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateSystemFileRequest {
    
    pub id: i64, // 文件ID
    
    pub file_name: Option<String>, // 文件名
    
    pub file_type: Option<String>, // 文件类型
    
    pub file_size: Option<i64>, // 文件大小（字节）
    
    pub file_path: Option<String>, // 文件存储路径
    
    pub department_code: Option<String>, // 部门编码
    
    pub department_id: Option<i64>, // 部门ID
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UploadSystemFileRequest {
    
    #[schema(format = Binary, content_media_type = "application/octet-stream")] 
    file: String, 
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}