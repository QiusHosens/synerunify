use serde::{Serialize, Deserialize};
use serde_with::{serde_as, DisplayFromStr};
use sea_orm::sea_query::types::NaiveDateTime;
use crate::model::system_user::SystemUser;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemUserResponse {
    
    pub id: i64, // 用户ID
    
    pub username: String, // 用户账号
    
    pub password: String, // 密码
    
    pub nickname: String, // 用户昵称
    
    pub remark: Option<String>, // 备注
    
    pub post_ids: Option<String>, // 职位编号数组
    
    pub email: Option<String>, // 用户邮箱
    
    pub mobile: Option<String>, // 手机号码
    
    pub sex: Option<i8>, // 用户性别
    
    pub avatar: Option<String>, // 头像地址
    
    pub status: i8, // 帐号状态（0正常 1停用）
    
    pub login_ip: Option<String>, // 最后登录IP
    
    #[serde_as(as = "DisplayFromStr")]
    #[serde(with = "serde_with::chrono::naive_datetime")]
    pub login_date: Option<NaiveDateTime>, // 最后登录时间
    
    pub department_code: Option<i64>, // 部门编码
    
    pub department_id: Option<i64>, // 部门ID
    
    pub creator: Option<String>, // 创建者
    
    #[serde_as(as = "DisplayFromStr")]
    #[serde(with = "serde_with::chrono::naive_datetime")]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<String>, // 更新者
    
    #[serde_as(as = "DisplayFromStr")]
    #[serde(with = "serde_with::chrono::naive_datetime")]
    pub update_time: NaiveDateTime, // 更新时间
    
}

impl From<SystemUser> for SystemUserResponse {
    fn from(model: SystemUser) -> Self {
        Self {
            id: model.id,
            username: model.username,
            password: model.password,
            nickname: model.nickname,
            remark: model.remark,
            post_ids: model.post_ids,
            email: model.email,
            mobile: model.mobile,
            sex: model.sex,
            avatar: model.avatar,
            status: model.status,
            login_ip: model.login_ip,
            login_date: model.login_date,
            department_code: model.department_code,
            department_id: model.department_id,
            creator: model.creator,
            create_time: model.create_time,
            updater: model.updater,
            update_time: model.update_time,
            
        }
    }
}