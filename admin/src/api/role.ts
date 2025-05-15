import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/system_role/create', // 新增
  update: '/system_role/update', // 修改
  delete: '/system_role/delete', // 删除
  get: '/system_role/get', // 单条查询
  list: '/system_role/list', // 列表查询
  page: '/system_role/page', // 分页查询
  enable: '/system_role/enable', // 启用
  disable: '/system_role/disable', // 禁用
}

const roleMenuApis = {
  getRoleMenu: 'system_role_menu/get_role_menu', // 获取角色菜单列表
  updateRoleMenu: 'system_role_menu/update', // 更新角色菜单列表
}

export interface SystemRoleRequest {
  id: number; // id
  type: number; // 角色类型
  name: string; // 角色名称
  code: string; // 角色权限字符串
  status: number; // 角色状态（0正常 1停用）
  sort: number; // 显示顺序
  data_scope_rule_id?: number; // 数据权限规则id
  data_scope_department_ids?: string; // 数据范围(指定部门数组)
  remark: string; // 备注
}

export interface SystemRoleResponse {
  id: number; // id
  type: number; // 角色类型
  name: string; // 角色名称
  code: string; // 角色权限字符串
  status: number; // 角色状态（0正常 1停用）
  sort: number; // 显示顺序
  data_scope_rule_id: number; // 数据权限规则id
  data_scope_department_ids: string; // 数据范围(指定部门数组)
  remark: string; // 备注
  creator: number; // 创建者id
  create_time: string; // 创建时间
  updater: number; // 更新者id
  update_time: string; // 更新时间
}

export interface SystemRoleMenuRequest {
  role_id: number; // 角色ID
  menu_id_list: number[]; // 菜单ID列表
}

export interface SystemRoleQueryCondition extends PaginatedRequest {

}

export const createSystemRole = (system_role: SystemRoleRequest): Promise<number> => {
  return api.post<number>(apis.create, system_role);
}

export const updateSystemRole = (system_role: SystemRoleRequest): Promise<void> => {
  return api.post<void>(apis.update, system_role);
}

export const deleteSystemRole = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getSystemRole = (id: number): Promise<SystemRoleResponse> => {
  return api.get<SystemRoleResponse>(`${apis.get}/${id}`);
}

export const listSystemRole = (): Promise<Array<SystemRoleResponse>> => {
  return api.get<Array<SystemRoleResponse>>(apis.list);
}

export const pageSystemRole = (condition: SystemRoleQueryCondition): Promise<PaginatedResponse<SystemRoleResponse>> => {
  return api.get<PaginatedResponse<SystemRoleResponse>>(apis.page, condition);
}

export const enableSystemRole = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableSystemRole = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}

export const getRoleMenu = (id: number): Promise<number[]> => {
  return api.post<number[]>(`${roleMenuApis.getRoleMenu}/${id}`);
}

export const updateRoleMenu = (roleMenu: SystemRoleMenuRequest): Promise<void> => {
  return api.post<void>(roleMenuApis.updateRoleMenu, roleMenu);
}