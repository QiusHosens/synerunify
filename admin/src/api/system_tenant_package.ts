import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/system/system_tenant_package/create', // 新增
  update: '/system/system_tenant_package/update', // 修改
  delete: '/system/system_tenant_package/delete', // 删除
  get: '/system/system_tenant_package/get', // 单条查询
  list: '/system/system_tenant_package/list', // 列表查询
  page: '/system/system_tenant_package/page', // 分页查询
  enable: '/system/system_tenant_package/enable', // 启用
  disable: '/system/system_tenant_package/disable', // 禁用
  update_menu: '/system/system_tenant_package/update_menu', // 修改菜单
}

export interface SystemTenantPackageRequest {
  id: number; // id
  name: string; // 套餐名
  status: number; // 租户状态（0正常 1停用）
  remark: string; // 备注
  menu_ids?: string; // 关联的菜单编号
}

export interface SystemTenantPackageResponse {
  id: number; // id
  name: string; // 套餐名
  status: number; // 租户状态（0正常 1停用）
  remark: string; // 备注
  menu_ids: string; // 关联的菜单编号
  creator: number; // 创建者id
  create_time: string; // 创建时间
  updater: number; // 更新者id
  update_time: string; // 更新时间
}

export interface SystemTenantPackageMenuRequest {
  id: number; // id
  menu_ids?: string; // 关联的菜单编号
}

export interface SystemTenantPackageQueryCondition extends PaginatedRequest {

}

export const createSystemTenantPackage = (system_tenant_package: SystemTenantPackageRequest): Promise<number> => {
  return api.post<number>(apis.create, system_tenant_package);
}

export const updateSystemTenantPackage = (system_tenant_package: SystemTenantPackageRequest): Promise<void> => {
  return api.post<void>(apis.update, system_tenant_package);
}

export const updateSystemTenantPackageMenu = (system_tenant_package: SystemTenantPackageMenuRequest): Promise<void> => {
  return api.post<void>(apis.update_menu, system_tenant_package);
}

export const deleteSystemTenantPackage = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getSystemTenantPackage = (id: number): Promise<SystemTenantPackageResponse> => {
  return api.get<SystemTenantPackageResponse>(`${apis.get}/${id}`);
}

export const listSystemTenantPackage = (): Promise<Array<SystemTenantPackageResponse>> => {
  return api.get<Array<SystemTenantPackageResponse>>(apis.list);
}

export const pageSystemTenantPackage = (condition: SystemTenantPackageQueryCondition): Promise<PaginatedResponse<SystemTenantPackageResponse>> => {
  return api.get<PaginatedResponse<SystemTenantPackageResponse>>(apis.page, condition);
}

export const enableSystemTenantPackage = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableSystemTenantPackage = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}