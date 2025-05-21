use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateSystemUserRequest {
    
    pub username: String, // 用户账号
    
    pub password: String, // 密码
    
    pub nickname: String, // 用户昵称
    
    pub remark: Option<String>, // 备注
    
    pub email: Option<String>, // 用户邮箱
    
    pub mobile: Option<String>, // 手机号码
    
    pub sex: Option<i8>, // 用户性别
    
    pub status: i8, // 帐号状态（0正常 1停用）
    
    pub department_id: i64, // 部门ID

    pub role_id: i64, // 角色ID

    pub post_ids: Vec<i64>, // 岗位ID列表
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateSystemUserRequest {
    
    pub id: i64, // id
    
    pub nickname: Option<String>, // 用户昵称
    
    pub remark: Option<String>, // 备注
    
    pub email: Option<String>, // 用户邮箱
    
    pub mobile: Option<String>, // 手机号码
    
    pub sex: Option<i8>, // 用户性别
    
    pub status: Option<i8>, // 帐号状态（0正常 1停用）
    
    pub department_id: Option<i64>, // 部门ID

    pub role_id: i64, // 角色ID

    pub post_ids: Vec<i64>, // 岗位ID列表
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct ResetPasswordSystemUserRequest {
    
    pub id: i64, // id
    
    pub password: String, // 密码
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct EditPasswordSystemUserRequest {
    
    pub id: i64, // id
    
    pub old_password: String, // 旧密码

    pub new_password: String, // 新密码
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub department_code: Option<String>,
}