use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateSystemTenantRequest {
    
    pub name: String, // 租户名
    
    pub contact_user_id: Option<i64>, // 联系人的用户编号
    
    pub contact_name: String, // 联系人
    
    pub contact_mobile: Option<String>, // 联系手机
    
    pub status: i8, // 租户状态（0正常 1停用）
    
    pub website: Option<String>, // 绑定域名
    
    pub package_id: i64, // 租户套餐编号
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub expire_time: NaiveDateTime, // 过期时间
    
    pub account_count: i32, // 账号数量
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateSystemTenantRequest {
    
    pub id: i64, // 租户编号
    
    pub name: Option<String>, // 租户名
    
    pub contact_user_id: Option<i64>, // 联系人的用户编号
    
    pub contact_name: Option<String>, // 联系人
    
    pub contact_mobile: Option<String>, // 联系手机
    
    pub status: Option<i8>, // 租户状态（0正常 1停用）
    
    pub website: Option<String>, // 绑定域名
    
    pub package_id: Option<i64>, // 租户套餐编号
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub expire_time: Option<NaiveDateTime>, // 过期时间
    
    pub account_count: Option<i32>, // 账号数量
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}