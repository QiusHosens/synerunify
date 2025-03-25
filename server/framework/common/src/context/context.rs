use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UserTenantContext {
    pub(crate) id: i64,  // 用户id
    pub(crate) tenant_id: i64, // 租户id
}

/// 登录用户信息,修改了该信息中的关联内容,都需要清空该缓存,使用户重新登录,以此保证信息的正确性
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LoginUserContext {
    pub id: i64,  // 用户id
    pub nickname: String,  // 用户昵称
    pub tenant_id: i64, // 租户id
    pub department_id: i64, // 部门id
    pub department_code: String, // 部门编码
    pub role_id: i64, // 角色id
    pub permissions: String, // 权限标识列表
}

#[derive(Clone, Debug, Default)]
pub struct RequestContext {
    pub request_url: String, // 请求地址
    pub method: String, // 请求方法
    pub path_params: String, // 请求地址参数
    pub data: String, // 请求数据
    pub ip: String, // ip地址
    pub user_agent: String, // 用户代理
}