use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};
use common::formatter::string_date_time::StringDateTime;

// #[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct SystemUserResponse {
    
    pub id: i64, // id
    
    pub username: String, // 用户账号
    
    pub password: String, // 密码
    
    pub nickname: String, // 用户昵称
    
    pub remark: Option<String>, // 备注
    
    pub email: Option<String>, // 用户邮箱
    
    pub mobile: Option<String>, // 手机号码
    
    pub sex: Option<i8>, // 用户性别
    
    pub avatar: Option<String>, // 头像地址
    
    pub status: i8, // 帐号状态（0正常 1停用）
    
    pub login_ip: Option<String>, // 最后登录IP
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub login_date: Option<NaiveDateTime>, // 最后登录时间
    
    pub department_code: String, // 部门编码
    
    pub department_id: i64, // 部门ID
    
    pub creator: Option<i64>, // 创建者id
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者id
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间
    
}

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct SystemUserPageResponse {
    
    pub id: i64, // id
    
    pub username: String, // 用户账号
    
    pub password: String, // 密码
    
    pub nickname: String, // 用户昵称
    
    pub remark: Option<String>, // 备注
    
    pub email: Option<String>, // 用户邮箱
    
    pub mobile: Option<String>, // 手机号码
    
    pub sex: Option<i8>, // 用户性别
    
    pub avatar: Option<String>, // 头像地址
    
    pub status: i8, // 帐号状态（0正常 1停用）
    
    pub login_ip: Option<String>, // 最后登录IP
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "Option<StringDateTime>")]
    #[schema(value_type = String, format = Date)]
    pub login_date: Option<NaiveDateTime>, // 最后登录时间
    
    pub department_code: String, // 部门编码
    
    pub department_id: i64, // 部门ID
    
    pub creator: Option<i64>, // 创建者id
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者id
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间

    /****************** 角色信息 ******************/

    pub role_type: Option<i8>, // 角色类型
    
    pub role_name: Option<String>, // 角色名称

    pub department_name: Option<String>, // 部门名称
    
}