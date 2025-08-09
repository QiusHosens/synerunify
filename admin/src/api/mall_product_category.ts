import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/mall/mall_product_category/create', // 新增
  update: '/mall/mall_product_category/update', // 修改
  delete: '/mall/mall_product_category/delete', // 删除
  get: '/mall/mall_product_category/get', // 单条查询
  list: '/mall/mall_product_category/list', // 列表查询
  page: '/mall/mall_product_category/page', // 分页查询
  enable: '/mall/mall_product_category/enable', // 启用
  disable: '/mall/mall_product_category/disable', // 禁用
}

export interface MallProductCategoryRequest {
  id: number; // 分类编号
  parent_id: number; // 父分类编号
  name: string; // 分类名称
  pic_url: string; // 移动端分类图
  sort: number; // 分类排序
  status: number; // 状态
  }

export interface MallProductCategoryResponse {
  id: number; // 分类编号
  parent_id: number; // 父分类编号
  name: string; // 分类名称
  pic_url: string; // 移动端分类图
  sort: number; // 分类排序
  status: number; // 状态
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallProductCategoryQueryCondition extends PaginatedRequest {
  
}

export const createMallProductCategory = (mall_product_category: MallProductCategoryRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_product_category);
}

export const updateMallProductCategory = (mall_product_category: MallProductCategoryRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_product_category);
}

export const deleteMallProductCategory = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallProductCategory = (id: number): Promise<MallProductCategoryResponse> => {
  return api.get<MallProductCategoryResponse>(`${apis.get}/${id}`);
}

export const listMallProductCategory = (): Promise<Array<MallProductCategoryResponse>> => {
  return api.get<Array<MallProductCategoryResponse>>(apis.list);
}

export const pageMallProductCategory = (condition: MallProductCategoryQueryCondition): Promise<PaginatedResponse<MallProductCategoryResponse>> => {
  return api.get<PaginatedResponse<MallProductCategoryResponse>>(apis.page, condition);
}

export const enableMallProductCategory = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableMallProductCategory = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}