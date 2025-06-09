import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp_product_unit/create', // 新增
  update: '/erp_product_unit/update', // 修改
  delete: '/erp_product_unit/delete', // 删除
  get: '/erp_product_unit/get', // 单条查询
  list: '/erp_product_unit/list', // 列表查询
  page: '/erp_product_unit/page', // 分页查询
  enable: '/erp_product_unit/enable', // 启用
  disable: '/erp_product_unit/disable', // 禁用
}

export interface ErpProductUnitRequest {
  id: number; // 单位ID
  unit_name: string; // 单位名称
  status: number; // 状态
  sort_order: number; // 排序
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
}

export interface ErpProductUnitResponse {
  id: number; // 单位ID
  unit_name: string; // 单位名称
  status: number; // 状态
  sort_order: number; // 排序
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
}

export interface ErpProductUnitQueryCondition extends PaginatedRequest {

}

export const createErpProductUnit = (erp_product_unit: ErpProductUnitRequest): Promise<number> => {
  return api.post<number>(apis.create, erp_product_unit);
}

export const updateErpProductUnit = (erp_product_unit: ErpProductUnitRequest): Promise<void> => {
  return api.post<void>(apis.update, erp_product_unit);
}

export const deleteErpProductUnit = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getErpProductUnit = (id: number): Promise<ErpProductUnitResponse> => {
  return api.get<ErpProductUnitResponse>(`${apis.get}/${id}`);
}

export const listErpProductUnit = (): Promise<Array<ErpProductUnitResponse>> => {
  return api.get<Array<ErpProductUnitResponse>>(apis.list);
}

export const pageErpProductUnit = (condition: ErpProductUnitQueryCondition): Promise<PaginatedResponse<ErpProductUnitResponse>> => {
  return api.get<PaginatedResponse<ErpProductUnitResponse>>(apis.page, condition);
}

export const enableErpProductUnit = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableErpProductUnit = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}