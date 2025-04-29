import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const dictTypeApis = {
  create: '/system_dict_type/create', // 新增
  update: '/system_dict_type/update', // 修改
  delete: '/system_dict_type/delete', // 删除
  get: '/system_dict_type/get', // 单条查询
  list: '/system_dict_type/list', // 列表查询
  page: '/system_dict_type/page', // 分页查询
}

const dictApis = {
  create: '/system_dict_data/create', // 新增
  update: '/system_dict_data/update', // 修改
  delete: '/system_dict_data/delete', // 删除
  get: '/system_dict_data/get', // 单条查询
  list: '/system_dict_data/list', // 列表查询
  page: '/system_dict_data/page', // 分页查询
}

export interface SystemDictTypeRequest {
  id: number, // id
  name: string, // 字典名称
  type: string, // 字典类型
  remark?: string, // 备注
}

export interface SystemDictTypeResponse {
  id: number, // id
  name: string, // 字典名称
  type: string, // 字典类型
  status: number, // 状态（0正常 1停用）
  remark?: string, // 备注
}

export interface SystemDictDataRequest {
  id: number, // id
  sort: number, // 字典排序
  label: string, // 字典标签
  value: string, // 字典键值
  dict_type: string, // 字典类型
  color_type?: string, // 颜色类型
  css_class?: string, // css 样式
  remark?: string, // 备注
}

export interface SystemDictDataResponse {
  id: number; // id
  sort: number; // 字典排序
  label: string; // 字典标签
  value: string; // 字典键值
  dict_type: string; // 字典类型
  status: number; // 状态（0正常 1停用）
  color_type?: string; // 颜色类型
  css_class?: string; // css 样式
  remark?: string; // 备注
  update_time: string; // 更新时间
  /************** 字典类型字段 *************/
  name: string; // 字典名称
  type: string; // 字典类型
  type_status: number; // 状态（0正常 1停用）
  type_remark?: string; // 备注
}

export interface DictQueryCondition extends PaginatedRequest {
  dict_type?: string;
}

export const createDictType = (menu: SystemDictTypeRequest): Promise<number> => {
  return api.post<number>(dictTypeApis.create, menu);
}

export const updateDictType = (menu: SystemDictTypeRequest): Promise<void> => {
  return api.post<void>(dictTypeApis.update, menu);
}

export const deleteDictType = (id: number): Promise<void> => {
  return api.post<void>(`${dictTypeApis.delete}/${id}`);
}

export const getDictType = (id: number): Promise<SystemDictTypeResponse> => {
  return api.get<SystemDictTypeResponse>(`${dictTypeApis.get}/${id}`);
}

export const listDictType = (): Promise<Array<SystemDictTypeResponse>> => {
  return api.get<Array<SystemDictTypeResponse>>(dictTypeApis.list);
}

export const pageDictType = (condition: DictQueryCondition): Promise<PaginatedResponse<SystemDictTypeResponse>> => {
  return api.get<PaginatedResponse<SystemDictTypeResponse>>(dictTypeApis.page, condition);
}

export const createDict = (menu: SystemDictDataRequest): Promise<number> => {
  return api.post<number>(dictApis.create, menu);
}

export const updateDict = (menu: SystemDictDataRequest): Promise<void> => {
  return api.post<void>(dictApis.update, menu);
}

export const deleteDict = (id: number): Promise<void> => {
  return api.post<void>(`${dictApis.delete}/${id}`);
}

export const getDict = (id: number): Promise<SystemDictDataResponse> => {
  return api.get<SystemDictDataResponse>(`${dictApis.get}/${id}`);
}

export const listDict = (): Promise<Array<SystemDictDataResponse>> => {
  return api.get<Array<SystemDictDataResponse>>(dictApis.list);
}

export const pageDict = (condition: DictQueryCondition): Promise<PaginatedResponse<SystemDictDataResponse>> => {
  return api.get<PaginatedResponse<SystemDictDataResponse>>(dictApis.page, condition);
}