use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UserTenantContext {
    pub(crate) id: i64,  // 用户id
    pub(crate) tenant_id: i64, // 租户id
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LoginUserContext {
    pub id: i64,  // 用户id
    pub nickname: String,  // 用户昵称
    pub tenant_id: i64, // 租户id
    pub department_id: i64, // 部门id
    pub department_code: String, // 部门编码
    pub role_id: i64, // 角色id
}