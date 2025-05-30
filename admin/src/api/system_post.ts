import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/system/system_post/create', // 新增
  update: '/system/system_post/update', // 修改
  delete: '/system/system_post/delete', // 删除
  get: '/system/system_post/get', // 单条查询
  list: '/system/system_post/list', // 列表查询
  page: '/system/system_post/page', // 分页查询
  enable: '/system/system_post/enable', // 启用
  disable: '/system/system_post/disable', // 禁用
}

export interface SystemPostRequest {
  id: number; // id
  code: string; // 职位编码
  name: string; // 职位名称
  sort: number; // 显示顺序
  status: number; // 状态（0正常 1停用）
  remark: string; // 备注
}

export interface SystemPostResponse {
  id: number; // id
  code: string; // 职位编码
  name: string; // 职位名称
  sort: number; // 显示顺序
  status: number; // 状态（0正常 1停用）
  remark: string; // 备注
  creator: number; // 创建者id
  create_time: string; // 创建时间
  updater: number; // 更新者id
  update_time: string; // 更新时间
}

export interface SystemPostQueryCondition extends PaginatedRequest {
  
}

export const createSystemPost = (system_post: SystemPostRequest): Promise<number> => {
  return api.post<number>(apis.create, system_post);
}

export const updateSystemPost = (system_post: SystemPostRequest): Promise<void> => {
  return api.post<void>(apis.update, system_post);
}

export const deleteSystemPost = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getSystemPost = (id: number): Promise<SystemPostResponse> => {
  return api.get<SystemPostResponse>(`${apis.get}/${id}`);
}

export const listSystemPost = (): Promise<Array<SystemPostResponse>> => {
  return api.get<Array<SystemPostResponse>>(apis.list);
}

export const pageSystemPost = (condition: SystemPostQueryCondition): Promise<PaginatedResponse<SystemPostResponse>> => {
  return api.get<PaginatedResponse<SystemPostResponse>>(apis.page, condition);
}

export const enableSystemPost = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableSystemPost = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}