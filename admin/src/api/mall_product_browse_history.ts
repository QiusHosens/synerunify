import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/mall/mall_product_browse_history/create', // 新增
  update: '/mall/mall_product_browse_history/update', // 修改
  delete: '/mall/mall_product_browse_history/delete', // 删除
  get: '/mall/mall_product_browse_history/get', // 单条查询
  list: '/mall/mall_product_browse_history/list', // 列表查询
  page: '/mall/mall_product_browse_history/page', // 分页查询
}

export interface MallProductBrowseHistoryRequest {
  id: number; // 记录编号
  user_id: number; // 用户编号
  spu_id: number; // 商品 SPU 编号
  user_deleted: boolean; // 用户是否删除
  }

export interface MallProductBrowseHistoryResponse {
  id: number; // 记录编号
  user_id: number; // 用户编号
  spu_id: number; // 商品 SPU 编号
  user_deleted: boolean; // 用户是否删除
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallProductBrowseHistoryQueryCondition extends PaginatedRequest {
  
}

export const createMallProductBrowseHistory = (mall_product_browse_history: MallProductBrowseHistoryRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_product_browse_history);
}

export const updateMallProductBrowseHistory = (mall_product_browse_history: MallProductBrowseHistoryRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_product_browse_history);
}

export const deleteMallProductBrowseHistory = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallProductBrowseHistory = (id: number): Promise<MallProductBrowseHistoryResponse> => {
  return api.get<MallProductBrowseHistoryResponse>(`${apis.get}/${id}`);
}

export const listMallProductBrowseHistory = (): Promise<Array<MallProductBrowseHistoryResponse>> => {
  return api.get<Array<MallProductBrowseHistoryResponse>>(apis.list);
}

export const pageMallProductBrowseHistory = (condition: MallProductBrowseHistoryQueryCondition): Promise<PaginatedResponse<MallProductBrowseHistoryResponse>> => {
  return api.get<PaginatedResponse<MallProductBrowseHistoryResponse>>(apis.page, condition);
}
