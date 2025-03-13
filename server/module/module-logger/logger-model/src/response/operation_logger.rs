use serde::{Serialize, Deserialize};
use utoipa::ToSchema;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct OperationLoggerResponse {

    pub id: Option<String>, // id

    pub trace_id: String, // 链路追踪编号

    pub user_id: Option<i64>, // 用户编号

    pub user_type: Option<i8>, // 用户类型

    pub r#type: String, // 操作模块类型

    pub sub_type: String, // 操作名

    pub biz_id: i64, // 操作数据模块编号

    pub action: String, // 操作内容

    pub success: bool, // 操作结果

    pub extra: String, // 拓展字段

    pub request_method: String, // 请求方法名

    pub request_url: String, // 请求地址

    pub user_ip: String, // 用户 IP

    pub user_agent: String, // 浏览器 UA

    pub department_code: Option<String>, // 部门编码

    pub department_id: Option<i64>, // 部门ID

    pub operator: Option<i64>, // 操作者id

    pub operator_nickname: Option<String>, // 操作者昵称

    pub operate_time: i64, // 操作时间

}