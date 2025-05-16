import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/system_tenant/create', // 新增
  update: '/system_tenant/update', // 修改
  delete: '/system_tenant/delete', // 删除
  get: '/system_tenant/get', // 单条查询
  list: '/system_tenant/list', // 列表查询
  page: '/system_tenant/page', // 分页查询
  enable: '/system_tenant/enable', // 启用
  disable: '/system_tenant/disable', // 禁用
}

export interface SystemTenantRequest {
  id: number; // id
  name: string; // 租户名
  contact_user_id: number; // 联系人的用户编号
  contact_name: string; // 联系人
  contact_mobile: string; // 联系手机
  username: string; // 租户管理员用户账号
  password: string; // 租户管理员密码
  nickname: string; // 租户管理员用户昵称
  status: number; // 租户状态（0正常 1停用）
  website: string; // 绑定域名
  package_id: number; // 租户套餐编号
  expire_time: string; // 过期时间
  account_count: number; // 账号数量
}

export interface SystemTenantResponse {
  id: number; // id
  name: string; // 租户名
  contact_user_id: number; // 联系人的用户编号
  contact_name: string; // 联系人
  contact_mobile: string; // 联系手机
  status: number; // 租户状态（0正常 1停用）
  website: string; // 绑定域名
  package_id: number; // 租户套餐编号
  expire_time: string; // 过期时间
  account_count: number; // 账号数量
  creator: number; // 创建者id
  create_time: string; // 创建时间
  updater: number; // 更新者id
  update_time: string; // 更新时间

  package_name: number; // 租户套餐名
}

export interface SystemTenantQueryCondition extends PaginatedRequest {

}

export const createSystemTenant = (system_tenant: SystemTenantRequest): Promise<number> => {
  return api.post<number>(apis.create, system_tenant);
}

export const updateSystemTenant = (system_tenant: SystemTenantRequest): Promise<void> => {
  return api.post<void>(apis.update, system_tenant);
}

export const deleteSystemTenant = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getSystemTenant = (id: number): Promise<SystemTenantResponse> => {
  return api.get<SystemTenantResponse>(`${apis.get}/${id}`);
}

export const listSystemTenant = (): Promise<Array<SystemTenantResponse>> => {
  return api.get<Array<SystemTenantResponse>>(apis.list);
}

export const pageSystemTenant = (condition: SystemTenantQueryCondition): Promise<PaginatedResponse<SystemTenantResponse>> => {
  return api.get<PaginatedResponse<SystemTenantResponse>>(apis.page, condition);
}

export const enableSystemTenant = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableSystemTenant = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}