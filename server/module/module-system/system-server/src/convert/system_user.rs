use sea_orm::{Set, NotSet};
use crate::model::system_user::{self, Model as SystemUser, ActiveModel as SystemUserActiveModel};
use crate::model::system_role::{self, Model as SystemRole, ActiveModel as SystemRoleActiveModel};
use crate::model::system_department::{self, Model as SystemDepartment, ActiveModel as SystemDepartmentActiveModel};
use system_model::request::system_user::{CreateSystemUserRequest, UpdateSystemUserRequest};
use system_model::response::system_user::{SystemUserPageResponse, SystemUserResponse};

pub fn create_request_to_model(request: &CreateSystemUserRequest) -> SystemUserActiveModel {
    SystemUserActiveModel {
        username: Set(request.username.clone()),
        password: Set(request.password.clone()),
        nickname: Set(request.nickname.clone()),
        remark: request.remark.as_ref().map_or(NotSet, |remark| Set(Some(remark.clone()))),
        email: request.email.as_ref().map_or(NotSet, |email| Set(Some(email.clone()))),
        mobile: request.mobile.as_ref().map_or(NotSet, |mobile| Set(Some(mobile.clone()))),
        sex: request.sex.as_ref().map_or(NotSet, |sex| Set(Some(sex.clone()))),
        status: Set(request.status.clone()),
        department_id: Set(request.department_id.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateSystemUserRequest, existing: SystemUser) -> SystemUserActiveModel {
    let mut active_model: SystemUserActiveModel = existing.into();
    if let Some(nickname) = &request.nickname { 
        active_model.nickname = Set(nickname.clone());
    }
    if let Some(remark) = &request.remark { 
        active_model.remark = Set(Some(remark.clone()));
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
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    if let Some(department_id) = &request.department_id { 
        active_model.department_id = Set(department_id.clone());
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

pub fn model_to_page_response(model: SystemUser, model_role: Option<SystemRole>, model_department: Option<SystemDepartment>) -> SystemUserPageResponse {
    let (role_id, role_type, role_name) = match model_role {
        Some(t) => (
            Some(t.id.clone()),
            Some(t.r#type.clone()),
            Some(t.name.clone()),
        ),
        None => (None, None, None),
    };

    let department_name = model_department.map(|department| department.name.clone());

    SystemUserPageResponse { 
        id: model.id,
        username: model.username,
        password: model.password,
        nickname: model.nickname,
        remark: model.remark,
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

        role_id,
        role_type,
        role_name,
        department_name
    }
}