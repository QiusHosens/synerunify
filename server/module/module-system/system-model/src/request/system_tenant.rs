use serde::{Serialize, Deserialize};
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug)]
pub struct CreateSystemTenantRequest {
    
    pub name: String, // 租户名
    
    pub contact_user_id: Option<i64>, // 联系人的用户编号
    
    pub contact_name: String, // 联系人
    
    pub contact_mobile: Option<String>, // 联系手机
    
    pub status: i8, // 租户状态（0正常 1停用）
    
    pub website: Option<String>, // 绑定域名
    
    pub package_id: i64, // 租户套餐编号
    
    pub expire_time: NaiveDateTime, // 过期时间
    
    pub account_count: i32, // 账号数量
    
}

#[derive(Serialize, Deserialize, Debug)]
pub struct UpdateSystemTenantRequest {
    
    pub id: i64, // 租户编号
    
    pub name: String, // 租户名
    
    pub contact_user_id: Option<i64>, // 联系人的用户编号
    
    pub contact_name: String, // 联系人
    
    pub contact_mobile: Option<String>, // 联系手机
    
    pub status: i8, // 租户状态（0正常 1停用）
    
    pub website: Option<String>, // 绑定域名
    
    pub package_id: i64, // 租户套餐编号
    
    pub expire_time: NaiveDateTime, // 过期时间
    
    pub account_count: i32, // 账号数量
    
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PaginatedKeywordRequest {
    pub page: u64,
    pub size: u64,
    pub keyword: Option<String>,
}