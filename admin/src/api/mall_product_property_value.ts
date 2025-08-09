import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/mall/mall_product_property_value/create', // 新增
  update: '/mall/mall_product_property_value/update', // 修改
  delete: '/mall/mall_product_property_value/delete', // 删除
  get: '/mall/mall_product_property_value/get', // 单条查询
  list: '/mall/mall_product_property_value/list', // 列表查询
  page: '/mall/mall_product_property_value/page', // 分页查询
  enable: '/mall/mall_product_property_value/enable', // 启用
  disable: '/mall/mall_product_property_value/disable', // 禁用
}

export interface MallProductPropertyValueRequest {
  id: number; // 编号
  property_id: number; // 属性项的编号
  name: string; // 名称
  status: number; // 状态
  remark: string; // 备注
  }

export interface MallProductPropertyValueResponse {
  id: number; // 编号
  property_id: number; // 属性项的编号
  name: string; // 名称
  status: number; // 状态
  remark: string; // 备注
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallProductPropertyValueQueryCondition extends PaginatedRequest {
  
}

export const createMallProductPropertyValue = (mall_product_property_value: MallProductPropertyValueRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_product_property_value);
}

export const updateMallProductPropertyValue = (mall_product_property_value: MallProductPropertyValueRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_product_property_value);
}

export const deleteMallProductPropertyValue = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallProductPropertyValue = (id: number): Promise<MallProductPropertyValueResponse> => {
  return api.get<MallProductPropertyValueResponse>(`${apis.get}/${id}`);
}

export const listMallProductPropertyValue = (): Promise<Array<MallProductPropertyValueResponse>> => {
  return api.get<Array<MallProductPropertyValueResponse>>(apis.list);
}

export const pageMallProductPropertyValue = (condition: MallProductPropertyValueQueryCondition): Promise<PaginatedResponse<MallProductPropertyValueResponse>> => {
  return api.get<PaginatedResponse<MallProductPropertyValueResponse>>(apis.page, condition);
}

export const enableMallProductPropertyValue = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableMallProductPropertyValue = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}