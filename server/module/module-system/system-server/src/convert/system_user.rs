use sea_orm::{Set, NotSet};
use crate::model::system_user::{self, Model as SystemUser, ActiveModel as SystemUserActiveModel};
use system_model::request::system_user::{CreateSystemUserRequest, UpdateSystemUserRequest};
use system_model::response::system_user::SystemUserResponse;

pub fn create_request_to_model(request: &CreateSystemUserRequest) -> SystemUserActiveModel {
    SystemUserActiveModel {
        username: Set(request.username.clone()),
        password: Set(request.password.clone()),
        nickname: Set(request.nickname.clone()),
        remark: request.remark.as_ref().map_or(NotSet, |remark| Set(Some(remark.clone()))),
        post_ids: request.post_ids.as_ref().map_or(NotSet, |post_ids| Set(Some(post_ids.clone()))),
        email: request.email.as_ref().map_or(NotSet, |email| Set(Some(email.clone()))),
        mobile: request.mobile.as_ref().map_or(NotSet, |mobile| Set(Some(mobile.clone()))),
        sex: request.sex.as_ref().map_or(NotSet, |sex| Set(Some(sex.clone()))),
        avatar: request.avatar.as_ref().map_or(NotSet, |avatar| Set(Some(avatar.clone()))),
        status: Set(request.status.clone()),
        login_ip: request.login_ip.as_ref().map_or(NotSet, |login_ip| Set(Some(login_ip.clone()))),
        login_date: request.login_date.as_ref().map_or(NotSet, |login_date| Set(Some(login_date.clone()))),
        department_code: Set(request.department_code.clone()),
        department_id: request.department_id.as_ref().map_or(NotSet, |department_id| Set(Some(department_id.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateSystemUserRequest, existing: SystemUser) -> SystemUserActiveModel {
    let mut active_model: SystemUserActiveModel = existing.into();
    if let Some(username) = &request.username { 
        active_model.username = Set(username.clone());
    }
    if let Some(password) = &request.password { 
        active_model.password = Set(password.clone());
    }
    if let Some(nickname) = &request.nickname { 
        active_model.nickname = Set(nickname.clone());
    }
    if let Some(remark) = &request.remark { 
        active_model.remark = Set(Some(remark.clone()));
    }
    if let Some(post_ids) = &request.post_ids { 
        active_model.post_ids = Set(Some(post_ids.clone()));
    }
    if let Some(email) = &request.email { 
        active_model.email = Set(Some(email.clone()));
    }
    if let Some(mobile) = &request.mobile { 
        active_model.mobile = Set(Some(mobile.clone()));
    }
    if let Some(sex) = &request.sex { 
        active_model.sex = Set(Some(sex.clone()));
    }
    if let Some(avatar) = &request.avatar { 
        active_model.avatar = Set(Some(avatar.clone()));
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    if let Some(login_ip) = &request.login_ip { 
        active_model.login_ip = Set(Some(login_ip.clone()));
    }
    if let Some(login_date) = &request.login_date { 
        active_model.login_date = Set(Some(login_date.clone()));
    }
    if let Some(department_code) = &request.department_code { 
        active_model.department_code = Set(department_code.clone());
    }
    if let Some(department_id) = &request.department_id { 
        active_model.department_id = Set(Some(department_id.clone()));
    }
    active_model
}

pub fn model_to_response(model: SystemUser) -> SystemUserResponse {
    SystemUserResponse { 
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