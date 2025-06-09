import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/erp_product_category/create', // 新增
  update: '/erp/erp_product_category/update', // 修改
  delete: '/erp/erp_product_category/delete', // 删除
  get: '/erp/erp_product_category/get', // 单条查询
  list: '/erp/erp_product_category/list', // 列表查询
  page: '/erp/erp_product_category/page', // 分页查询
  enable: '/erp/erp_product_category/enable', // 启用
  disable: '/erp/erp_product_category/disable', // 禁用
}

export interface ErpProductCategoryRequest {
  id: number; // 分类ID
  code: string; // 分类编码
  name: string; // 分类名称
  parent_id: number; // 父分类ID
  status: number; // 状态
  sort_order: number; // 排序
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
}

export interface ErpProductCategoryResponse {
  id: number; // 分类ID
  code: string; // 分类编码
  name: string; // 分类名称
  parent_id: number; // 父分类ID
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

export interface ErpProductCategoryQueryCondition extends PaginatedRequest {

}

export const createErpProductCategory = (erp_product_category: ErpProductCategoryRequest): Promise<number> => {
  return api.post<number>(apis.create, erp_product_category);
}

export const updateErpProductCategory = (erp_product_category: ErpProductCategoryRequest): Promise<void> => {
  return api.post<void>(apis.update, erp_product_category);
}

export const deleteErpProductCategory = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getErpProductCategory = (id: number): Promise<ErpProductCategoryResponse> => {
  return api.get<ErpProductCategoryResponse>(`${apis.get}/${id}`);
}

export const listErpProductCategory = (): Promise<Array<ErpProductCategoryResponse>> => {
  return api.get<Array<ErpProductCategoryResponse>>(apis.list);
}

export const pageErpProductCategory = (condition: ErpProductCategoryQueryCondition): Promise<PaginatedResponse<ErpProductCategoryResponse>> => {
  return api.get<PaginatedResponse<ErpProductCategoryResponse>>(apis.page, condition);
}

export const enableErpProductCategory = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableErpProductCategory = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}