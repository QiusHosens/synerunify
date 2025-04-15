import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/system_menu/create', // 新增
  update: '/system_menu/update', // 修改
  delete: '/system_menu/delete', // 删除
  get: '/system_menu/get', // 单条查询
  list: '/system_menu/list', // 列表查询
  page: '/system_menu/page', // 分页查询
}

export interface SystemMenuRequest {
  id: number; // id
  name: string; // 菜单名称
  permission: string; // 权限标识
  type: number; // 菜单类型
  sort: number; // 显示顺序
  parent_id: number; // 父菜单ID
  path: string; // 路由地址
  icon: string; // 菜单图标
  component: string; // 组件路径
  component_name: string; // 组件名
  status: number; // 菜单状态
  visible: boolean; // 是否可见
  keep_alive: boolean; // 是否缓存
  always_show: boolean; // 是否总是显示
}

export interface SystemMenuResponse {
  id: number; // id
  name: string; // 菜单名称
  permission: string; // 权限标识
  type: number; // 菜单类型
  sort: number; // 显示顺序
  parent_id: number; // 父菜单ID
  path: string; // 路由地址
  icon: string; // 菜单图标
  component: string; // 组件路径
  component_name: string; // 组件名
  status: number; // 菜单状态
  visible: boolean; // 是否可见
  keep_alive: boolean; // 是否缓存
  always_show: boolean; // 是否总是显示

  hierarchy: string[];
}

export interface MenuQueryCondition extends PaginatedRequest {
  
}

export const createMenu = (menu: SystemMenuRequest): Promise<number> => {
  return api.post<number>(apis.create, menu);
}

export const updateMenu = (menu: SystemMenuRequest): Promise<void> => {
  return api.post<void>(apis.update, menu);
}

export const deleteMenu = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMenu = (id: number): Promise<SystemMenuResponse> => {
  return api.get<SystemMenuResponse>(`${apis.get}/${id}`);
}

export const listMenu = (): Promise<Array<SystemMenuResponse>> => {
  return api.get<Array<SystemMenuResponse>>(apis.list);
}

export const pageMenu = (condition: MenuQueryCondition): Promise<PaginatedResponse<SystemMenuResponse>> => {
  return api.get<PaginatedResponse<SystemMenuResponse>>(apis.page, condition);
}