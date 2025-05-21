import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/system_user_post/create', // 新增
  update: '/system_user_post/update', // 修改
  delete: '/system_user_post/delete', // 删除
  get: '/system_user_post/get', // 单条查询
  list: '/system_user_post/list', // 列表查询
  page: '/system_user_post/page', // 分页查询
  enable: '/system_user_post/enable', // 启用
  disable: '/system_user_post/disable', // 禁用

  get_user: '/system_user_post/get_user', // 查询用户
}

export interface SystemUserPostRequest {
  id: number; // id
  user_id: number; // 用户ID
  post_id: number; // 职位ID
  }

export interface SystemUserPostResponse {
  id: number; // id
  user_id: number; // 用户ID
  post_id: number; // 职位ID
  creator: number; // 创建者id
  create_time: string; // 创建时间
  updater: number; // 更新者id
  update_time: string; // 更新时间
  }

export interface SystemUserPostQueryCondition extends PaginatedRequest {
  
}

export const createSystemUserPost = (system_user_post: SystemUserPostRequest): Promise<number> => {
  return api.post<number>(apis.create, system_user_post);
}

export const updateSystemUserPost = (system_user_post: SystemUserPostRequest): Promise<void> => {
  return api.post<void>(apis.update, system_user_post);
}

export const deleteSystemUserPost = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getSystemUserPost = (id: number): Promise<SystemUserPostResponse> => {
  return api.get<SystemUserPostResponse>(`${apis.get}/${id}`);
}

export const listSystemUserPost = (): Promise<Array<SystemUserPostResponse>> => {
  return api.get<Array<SystemUserPostResponse>>(apis.list);
}

export const pageSystemUserPost = (condition: SystemUserPostQueryCondition): Promise<PaginatedResponse<SystemUserPostResponse>> => {
  return api.get<PaginatedResponse<SystemUserPostResponse>>(apis.page, condition);
}

export const enableSystemUserPost = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableSystemUserPost = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}

export const getSystemUserPostByUser = (user_id: number): Promise<number[]> => {
  return api.get<number[]>(`${apis.get_user}/${user_id}`);
}