import { PaginatedRequest, PaginatedResponse } from "@/base/page";
import { api } from "@/utils/request";

const apis = {
  page_login: "/logger/login_logger/page", // 分页查询
  page_operation: "/logger/operation_logger/page", // 分页查询
};

export interface LoginLoggerResponse {
  id: string; // id
  trace_id: string; // 链路追踪编号
  user_id: number; // 用户编号
  user_type: number; // 用户类型
  username: string; // 用户账号
  result: string; // 登陆结果
  user_ip: string; // 用户 IP
  user_agent: string; // 浏览器 UA
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  operator: number; // 操作者id
  operator_nickname: string; // 操作者昵称
  operate_time: number; // 操作时间
}

export interface OperationLoggerResponse {
  id: string; // id
  trace_id: string; // 链路追踪编号
  user_id: number; // 用户编号
  user_type: number; // 用户类型
  type: string; // 操作模块类型
  sub_type: string; // 操作名
  biz_id: number; // 操作数据模块编号
  action: string; // 操作内容
  success: boolean; // 操作结果
  extra: string; // 拓展字段
  request_method: string; // 请求方法名
  request_url: string; // 请求地址
  user_ip: string; // 用户 IP
  user_agent: string; // 浏览器 UA
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  operator: number; // 操作者id
  operator_nickname: string; // 操作者昵称
  operate_time: number; // 操作时间
}

export interface LoggerQueryCondition extends PaginatedRequest {

}

export const pageLoginLogger = (condition: LoggerQueryCondition): Promise<PaginatedResponse<LoginLoggerResponse>> => {
  return api.get<PaginatedResponse<LoginLoggerResponse>>(apis.page_login, condition);
}

export const pageOperationLogger = (condition: LoggerQueryCondition): Promise<PaginatedResponse<OperationLoggerResponse>> => {
  return api.get<PaginatedResponse<OperationLoggerResponse>>(apis.page_operation, condition);
}