use serde::{Serialize, Deserialize};
use utoipa::ToSchema;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct LoginLoggerResponse {

    pub id: Option<i64>, // id

    pub trace_id: Option<String>, // 链路追踪编号

    pub user_id: Option<i64>, // 用户编号

    pub user_type: Option<i8>, // 用户类型

    pub username: String, // 用户账号

    pub result: String, // 登陆结果

    pub user_ip: String, // 用户 IP

    pub user_agent: String, // 浏览器 UA

    pub department_code: Option<String>, // 部门编码

    pub department_id: Option<i64>, // 部门ID

    pub operator: Option<i64>, // 操作者id

    pub operator_nickname: Option<String>, // 操作者昵称

    pub operate_time: Option<i64>, // 操作时间

}