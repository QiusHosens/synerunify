import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';
import { MallProductPropertyValueRequest } from './mall_product_property_value';

const apis = {
  create: '/mall/mall_product_property/create', // 新增
  update: '/mall/mall_product_property/update', // 修改
  delete: '/mall/mall_product_property/delete', // 删除
  get: '/mall/mall_product_property/get', // 单条查询
  list: '/mall/mall_product_property/list', // 列表查询
  page: '/mall/mall_product_property/page', // 分页查询
  enable: '/mall/mall_product_property/enable', // 启用
  disable: '/mall/mall_product_property/disable', // 禁用
}

export interface MallProductPropertyRequest {
  id: number; // 编号
  name: string; // 名称
  status: number; // 状态
  remark: string; // 备注

  values: MallProductPropertyValueRequest[]; // 属性值列表
}

export interface MallProductPropertyResponse {
  id: number; // 编号
  name: string; // 名称
  status: number; // 状态
  remark: string; // 备注
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间


}

export interface MallProductPropertyQueryCondition extends PaginatedRequest {

}

export const createMallProductProperty = (mall_product_property: MallProductPropertyRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_product_property);
}

export const updateMallProductProperty = (mall_product_property: MallProductPropertyRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_product_property);
}

export const deleteMallProductProperty = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallProductProperty = (id: number): Promise<MallProductPropertyResponse> => {
  return api.get<MallProductPropertyResponse>(`${apis.get}/${id}`);
}

export const listMallProductProperty = (): Promise<Array<MallProductPropertyResponse>> => {
  return api.get<Array<MallProductPropertyResponse>>(apis.list);
}

export const pageMallProductProperty = (condition: MallProductPropertyQueryCondition): Promise<PaginatedResponse<MallProductPropertyResponse>> => {
  return api.get<PaginatedResponse<MallProductPropertyResponse>>(apis.page, condition);
}

export const enableMallProductProperty = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableMallProductProperty = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}