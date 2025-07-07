use serde::{Deserialize, Serialize};
use crate::utils::type_utils;

/// 登录日志
#[derive(Serialize, Deserialize, Clone, Debug, Default, PartialEq)]
pub struct LoginLogger {

    #[serde(skip_serializing_if = "Option::is_none")]
    pub id: Option<String>, // id

    #[serde(skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>, // 链路追踪编号

    #[serde(skip_serializing_if = "Option::is_none")]
    pub user_id: Option<i64>, // 用户编号

    #[serde(skip_serializing_if = "Option::is_none")]
    pub user_type: Option<i8>, // 用户类型

    #[serde(skip_serializing_if = "String::is_empty")]
    pub username: String, // 用户账号

    #[serde(skip_serializing_if = "String::is_empty")]
    pub result: String, // 登陆结果

    #[serde(skip_serializing_if = "String::is_empty")]
    pub user_ip: String, // 用户 IP

    #[serde(skip_serializing_if = "String::is_empty")]
    pub user_agent: String, // 浏览器 UA

    #[serde(skip_serializing_if = "Option::is_none")]
    pub department_code: Option<String>, // 部门编码

    #[serde(skip_serializing_if = "Option::is_none")]
    pub department_id: Option<i64>, // 部门ID

    #[serde(skip_serializing_if = "Option::is_none")]
    pub operator: Option<i64>, // 操作者id

    #[serde(skip_serializing_if = "Option::is_none")]
    pub operator_nickname: Option<String>, // 操作者昵称

    #[serde(skip_serializing_if = "Option::is_none")]
    pub operate_time: Option<i64>, // 操作时间

    #[serde(skip_serializing_if = "Option::is_none")]
    pub deleted: Option<bool>, // 是否删除

    #[serde(skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<i64>, // 租户编号

}

impl LoginLogger {
    pub fn with_tenant_id(tenant_id: i64) -> Self {
        LoginLogger {
            tenant_id: Some(tenant_id),
            ..Default::default()
        }
    }
}

/// 操作日志
#[derive(Serialize, Deserialize, Clone, Debug, Default, PartialEq)]
pub struct OperationLogger {

    #[serde(skip_serializing_if = "Option::is_none")]
    pub id: Option<String>, // id

    #[serde(skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>, // 链路追踪编号

    #[serde(skip_serializing_if = "Option::is_none")]
    pub user_id: Option<i64>, // 用户编号

    #[serde(skip_serializing_if = "Option::is_none")]
    pub user_type: Option<i8>, // 用户类型

    #[serde(skip_serializing_if = "Option::is_none")]
    pub r#type: Option<String>, // 操作模块类型

    #[serde(skip_serializing_if = "Option::is_none")]
    pub sub_type: Option<String>, // 操作名

    #[serde(skip_serializing_if = "Option::is_none")]
    pub biz_id: Option<i64>, // 操作数据模块编号

    #[serde(skip_serializing_if = "Option::is_none")]
    pub action: Option<String>, // 操作内容

    #[serde(skip_serializing_if = "Option::is_none")]
    pub success: Option<bool>, // 操作结果

    #[serde(skip_serializing_if = "String::is_empty")]
    pub result: String, // 返回结果

    #[serde(skip_serializing_if = "Option::is_none")]
    pub extra: Option<String>, // 拓展字段

    #[serde(skip_serializing_if = "String::is_empty")]
    pub request_method: String, // 请求方法名

    #[serde(skip_serializing_if = "String::is_empty")]
    pub request_url: String, // 请求地址

    #[serde(skip_serializing_if = "String::is_empty")]
    pub user_ip: String, // 用户 IP

    #[serde(skip_serializing_if = "String::is_empty")]
    pub user_agent: String, // 浏览器 UA

    #[serde(skip_serializing_if = "Option::is_none")]
    pub department_code: Option<String>, // 部门编码

    #[serde(skip_serializing_if = "Option::is_none")]
    pub department_id: Option<i64>, // 部门ID

    #[serde(skip_serializing_if = "Option::is_none")]
    pub duration: Option<i64>, // 请求时间

    #[serde(skip_serializing_if = "Option::is_none")]
    pub operator: Option<i64>, // 操作者id

    #[serde(skip_serializing_if = "Option::is_none")]
    pub operator_nickname: Option<String>, // 操作者昵称

    #[serde(skip_serializing_if = "Option::is_none")]
    pub operate_time: Option<i64>, // 操作时间

    #[serde(skip_serializing_if = "Option::is_none")]
    pub deleted: Option<bool>, // 是否删除

    #[serde(skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<i64>, // 租户编号

}

impl OperationLogger {
    pub fn with_tenant_id(tenant_id: i64) -> Self {
        OperationLogger {
            tenant_id: Some(tenant_id),
            ..Default::default()
        }
    }
}