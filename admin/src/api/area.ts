import { api } from '@/utils/request';

const apis = {
  tree: '/system/system_area/tree', // 获取区域树
  get: '/system/system_area/get', // 获取区域
  path: '/system/system_area/path', // 获取区域路径
}

export interface AreaResponse {
  id: number, // 区域ID
  name: string, // 区域名称
  area_type: number, // 区域类型
  parent_id: number, // 父级区域ID
  children: AreaResponse[], // 子区域列表
}

export interface AreaPathResponse {
  id: number, // 区域ID
  name: string, // 区域名称
  path: string, // 完整路径
}

export const getAreaTree = (): Promise<AreaResponse[]> => {
  return api.get<AreaResponse[]>(apis.tree);
}

export const getAreaById = (id: number): Promise<AreaResponse> => {
  return api.get<AreaResponse>(`${apis.get}/${id}`);
}

export const getAreaPath = (id: number): Promise<void> => {
  return api.get<void>(`${apis.path}/${id}`);
}