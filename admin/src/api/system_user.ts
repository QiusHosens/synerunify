import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/system/system_user/create', // 新增
  update: '/system/system_user/update', // 修改
  delete: '/system/system_user/delete', // 删除
  get: '/system/system_user/get', // 单条查询
  list: '/system/system_user/list', // 列表查询
  page: '/system/system_user/page', // 分页查询
  enable: '/system/system_user/enable', // 启用
  disable: '/system/system_user/disable', // 禁用
  list_department_user: '/system/system_user/list_department_user', // 列表查询部门用户
  reset_password: '/system/system_user/reset_password', // 重置密码
  edit_password: '/system/system_user/edit_password', // 修改密码
}

export interface SystemUserRequest {
  id: number; // id
  username?: string; // 用户账号
  password?: string; // 密码
  nickname: string; // 用户昵称
  remark: string; // 备注
  email: string; // 用户邮箱
  mobile: string; // 手机号码
  sex: number; // 用户性别
  status: number; // 帐号状态（0正常 1停用）
  department_id: number; // 部门ID

  role_id: number; // 角色ID
  post_ids: number[]; // 岗位ID列表
}

export interface ResetPasswordSystemUserRequest {
  id: number; // id
  password: string; // 密码
}

export interface EditPasswordSystemUserRequest {
  id: number; // id
  old_password: string; // 旧密码
  new_password: string; // 新密码
}

export interface SystemUserRequest {
  id: number; // id
  username?: string; // 用户账号
  password?: string; // 密码
  nickname: string; // 用户昵称
  remark: string; // 备注
  email: string; // 用户邮箱
  mobile: string; // 手机号码
  sex: number; // 用户性别
  status: number; // 帐号状态（0正常 1停用）
  department_id: number; // 部门ID

  role_id: number; // 角色ID
  post_ids: number[]; // 岗位ID列表
}

export interface SystemUserResponse {
  id: number; // id
  username: string; // 用户账号
  password: string; // 密码
  nickname: string; // 用户昵称
  remark: string; // 备注
  email: string; // 用户邮箱
  mobile: string; // 手机号码
  sex: number; // 用户性别
  avatar: string; // 头像地址
  status: number; // 帐号状态（0正常 1停用）
  login_ip: string; // 最后登录IP
  login_date: string; // 最后登录时间
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  creator: number; // 创建者id
  create_time: string; // 创建时间
  updater: number; // 更新者id
  update_time: string; // 更新时间

  role_id: number; // 角色ID
  role_type?: number; // 角色类型
  role_name?: string; // 角色名称
  department_name?: number; // 部门名称
}

export interface SystemUserBaseResponse {
  id: number; // id
  nickname: string; // 用户昵称
}

export interface SystemUserQueryCondition extends PaginatedRequest {
  department_code?: string; // 部门编码
}

export const createSystemUser = (system_user: SystemUserRequest): Promise<number> => {
  return api.post<number>(apis.create, system_user);
}

export const updateSystemUser = (system_user: SystemUserRequest): Promise<void> => {
  return api.post<void>(apis.update, system_user);
}

export const deleteSystemUser = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getSystemUser = (id: number): Promise<SystemUserResponse> => {
  return api.get<SystemUserResponse>(`${apis.get}/${id}`);
}

export const listSystemUser = (): Promise<Array<SystemUserResponse>> => {
  return api.get<Array<SystemUserResponse>>(apis.list);
}

export const pageSystemUser = (condition: SystemUserQueryCondition): Promise<PaginatedResponse<SystemUserResponse>> => {
  return api.get<PaginatedResponse<SystemUserResponse>>(apis.page, condition);
}

export const enableSystemUser = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableSystemUser = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}

export const listDepartmentSystemUser = (): Promise<Array<SystemUserBaseResponse>> => {
  return api.get<Array<SystemUserBaseResponse>>(apis.list_department_user);
}

export const resetPasswordSystemUser = (system_user: ResetPasswordSystemUserRequest): Promise<void> => {
  return api.post<void>(apis.reset_password, system_user);
}

export const editPasswordSystemUser = (system_user: EditPasswordSystemUserRequest): Promise<void> => {
  return api.post<void>(apis.edit_password, system_user);
}