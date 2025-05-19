use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

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