use serde::{Serialize, Deserialize};
use crate::model::system_user::{self, SystemUser, SystemUserActiveModel};

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateSystemUserRequest {
    
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
    
    pub login_date: Option<NaiveDateTime>, // 最后登录时间
    
    pub department_code: Option<i64>, // 部门编码
    
    pub department_id: Option<i64>, // 部门ID
    
}

impl CreateSystemUserRequest {
    pub fn to_active_model(&self) -> SystemUserActiveModel {
        SystemUserActiveModel {
            username: Set(self.username.clone()),
            password: Set(self.password.clone()),
            nickname: Set(self.nickname.clone()),
            remark: Set(self.remark.clone()),
            post_ids: Set(self.post_ids.clone()),
            email: Set(self.email.clone()),
            mobile: Set(self.mobile.clone()),
            sex: Set(self.sex.clone()),
            avatar: Set(self.avatar.clone()),
            status: Set(self.status.clone()),
            login_ip: Set(self.login_ip.clone()),
            login_date: Set(self.login_date.clone()),
            department_code: Set(self.department_code.clone()),
            department_id: Set(self.department_id.clone()),
            ..Default::default()
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateSystemUserRequest {
    
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
    
    pub login_date: Option<NaiveDateTime>, // 最后登录时间
    
    pub department_code: Option<i64>, // 部门编码
    
    pub department_id: Option<i64>, // 部门ID
    
}

impl UpdateSystemUserRequest {
    pub fn to_active_model(&self, existing: SystemUser) -> SystemUserActiveModel {
        let mut active_model: SystemUserActiveModel = existing.into();
        if let Some(username) = &self.username {
            active_model.username = Set(username.clone());
        }
        if let Some(password) = &self.password {
            active_model.password = Set(password.clone());
        }
        if let Some(nickname) = &self.nickname {
            active_model.nickname = Set(nickname.clone());
        }
        if let Some(remark) = &self.remark {
            active_model.remark = Set(remark.clone());
        }
        if let Some(post_ids) = &self.post_ids {
            active_model.post_ids = Set(post_ids.clone());
        }
        if let Some(email) = &self.email {
            active_model.email = Set(email.clone());
        }
        if let Some(mobile) = &self.mobile {
            active_model.mobile = Set(mobile.clone());
        }
        if let Some(sex) = &self.sex {
            active_model.sex = Set(sex.clone());
        }
        if let Some(avatar) = &self.avatar {
            active_model.avatar = Set(avatar.clone());
        }
        if let Some(status) = &self.status {
            active_model.status = Set(status.clone());
        }
        if let Some(login_ip) = &self.login_ip {
            active_model.login_ip = Set(login_ip.clone());
        }
        if let Some(login_date) = &self.login_date {
            active_model.login_date = Set(login_date.clone());
        }
        if let Some(department_code) = &self.department_code {
            active_model.department_code = Set(department_code.clone());
        }
        if let Some(department_id) = &self.department_id {
            active_model.department_id = Set(department_id.clone());
        }
        active_model
    }
}