import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/system_department/create', // 新增
  update: '/system_department/update', // 修改
  delete: '/system_department/delete', // 删除
  get: '/system_department/get', // 单条查询
  list: '/system_department/list', // 列表查询
  page: '/system_department/page', // 分页查询
  enable: '/system_department/enable', // 启用
  disable: '/system_department/disable', // 禁用
}

export interface SystemDepartmentRequest {
  id: number; // id
  code: string; // 部门编码
  name: string; // 部门名称
  parent_id: number; // 父部门id
  sort: number; // 显示顺序
  leader_user_id: number; // 负责人
  phone: string; // 联系电话
  email: string; // 邮箱
  status: number; // 部门状态（0正常 1停用）
  }

export interface SystemDepartmentResponse {
  id: number; // id
  code: string; // 部门编码
  name: string; // 部门名称
  parent_id: number; // 父部门id
  sort: number; // 显示顺序
  leader_user_id: number; // 负责人
  leader_user_name: number; // 负责人昵称
  phone: string; // 联系电话
  email: string; // 邮箱
  status: number; // 部门状态（0正常 1停用）
  creator: number; // 创建者id
  create_time: string; // 创建时间
  updater: number; // 更新者id
  update_time: string; // 更新时间

  hierarchy: string[];
}

export interface SystemDepartmentQueryCondition extends PaginatedRequest {
  
}

export const createSystemDepartment = (system_department: SystemDepartmentRequest): Promise<number> => {
  return api.post<number>(apis.create, system_department);
}

export const updateSystemDepartment = (system_department: SystemDepartmentRequest): Promise<void> => {
  return api.post<void>(apis.update, system_department);
}

export const deleteSystemDepartment = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getSystemDepartment = (id: number): Promise<SystemDepartmentResponse> => {
  return api.get<SystemDepartmentResponse>(`${apis.get}/${id}`);
}

export const listSystemDepartment = (): Promise<Array<SystemDepartmentResponse>> => {
  return api.get<Array<SystemDepartmentResponse>>(apis.list);
}

export const pageSystemDepartment = (condition: SystemDepartmentQueryCondition): Promise<PaginatedResponse<SystemDepartmentResponse>> => {
  return api.get<PaginatedResponse<SystemDepartmentResponse>>(apis.page, condition);
}

export const enableSystemDepartment = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableSystemDepartment = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}