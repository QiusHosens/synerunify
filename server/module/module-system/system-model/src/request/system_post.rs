use serde::{Serialize, Deserialize};
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug)]
pub struct CreateSystemPostRequest {
    
    pub code: String, // 职位编码
    
    pub name: String, // 职位名称
    
    pub sort: i32, // 显示顺序
    
    pub status: i8, // 状态（0正常 1停用）
    
    pub remark: Option<String>, // 备注
    
}

#[derive(Serialize, Deserialize, Debug)]
pub struct UpdateSystemPostRequest {
    
    pub id: i64, // 职位ID
    
    pub code: String, // 职位编码
    
    pub name: String, // 职位名称
    
    pub sort: i32, // 显示顺序
    
    pub status: i8, // 状态（0正常 1停用）
    
    pub remark: Option<String>, // 备注
    
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PaginatedKeywordRequest {
    pub page: u64,
    pub size: u64,
    pub keyword: Option<String>,
}