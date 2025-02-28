use serde::{Serialize, Deserialize};
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug)]
pub struct CreateSystemTenantPackageRequest {
    
    pub name: String, // 套餐名
    
    pub status: i8, // 租户状态（0正常 1停用）
    
    pub remark: Option<String>, // 备注
    
    pub menu_ids: String, // 关联的菜单编号
    
}

#[derive(Serialize, Deserialize, Debug)]
pub struct UpdateSystemTenantPackageRequest {
    
    pub id: i64, // 套餐编号
    
    pub name: String, // 套餐名
    
    pub status: i8, // 租户状态（0正常 1停用）
    
    pub remark: Option<String>, // 备注
    
    pub menu_ids: String, // 关联的菜单编号
    
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PaginatedKeywordRequest {
    pub page: u64,
    pub size: u64,
    pub keyword: Option<String>,
}