import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/system_data_scope_rule/create', // 新增
  update: '/system_data_scope_rule/update', // 修改
  delete: '/system_data_scope_rule/delete', // 删除
  get: '/system_data_scope_rule/get', // 单条查询
  list: '/system_data_scope_rule/list', // 列表查询
  page: '/system_data_scope_rule/page', // 分页查询
}

export interface SystemDataScopeRuleRequest {
  id: number; // id
  type: number; // 规则类型（0系统定义 1自定义）
  name: string; // 规则名称
  field: string; // 规则字段
  condition: string; // 规则条件
  value: string; // 规则值
}

export interface SystemDataScopeRuleResponse {
  id: number; // id
  type: number; // 规则类型（0系统定义 1自定义）
  name: string; // 规则名称
  field: string; // 规则字段
  condition: string; // 规则条件
  value: string; // 规则值
  creator: number; // 创建者id
  create_time: string; // 创建时间
  updater: number; // 更新者id
  update_time: string; // 更新时间
}

export interface SystemDataScopeRuleQueryCondition extends PaginatedRequest {

}

export const createSystemDataScopeRule = (system_data_scope_rule: SystemDataScopeRuleRequest): Promise<number> => {
  return api.post<number>(apis.create, system_data_scope_rule);
}

export const updateSystemDataScopeRule = (system_data_scope_rule: SystemDataScopeRuleRequest): Promise<void> => {
  return api.post<void>(apis.update, system_data_scope_rule);
}

export const deleteSystemDataScopeRule = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getSystemDataScopeRule = (id: number): Promise<SystemDataScopeRuleResponse> => {
  return api.get<SystemDataScopeRuleResponse>(`${apis.get}/${id}`);
}

export const listSystemDataScopeRule = (): Promise<Array<SystemDataScopeRuleResponse>> => {
  return api.get<Array<SystemDataScopeRuleResponse>>(apis.list);
}

export const pageSystemDataScopeRule = (condition: SystemDataScopeRuleQueryCondition): Promise<PaginatedResponse<SystemDataScopeRuleResponse>> => {
  return api.get<PaginatedResponse<SystemDataScopeRuleResponse>>(apis.page, condition);
}