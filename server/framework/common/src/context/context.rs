use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UserTenantContext {
    pub(crate) id: i64,  // 用户id
    pub(crate) tenant_id: i64, // 租户id
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LoginUserContext {
    pub(crate) id: i64,  // 用户id
    pub(crate) nickname: String,  // 用户昵称
    pub(crate) tenant_id: i64, // 租户id
    pub(crate) department_id: i64, // 部门id
    pub(crate) department_code: String, // 部门编码
    pub(crate) role_id: i64, // 角色id
}