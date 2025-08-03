import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/mall_product_favorite/create', // 新增
  update: '/erp/mall_product_favorite/update', // 修改
  delete: '/erp/mall_product_favorite/delete', // 删除
  get: '/erp/mall_product_favorite/get', // 单条查询
  list: '/erp/mall_product_favorite/list', // 列表查询
  page: '/erp/mall_product_favorite/page', // 分页查询
}

export interface MallProductFavoriteRequest {
  id: number; // 收藏编号
  user_id: number; // 用户编号
  spu_id: number; // 商品 SPU 编号
  }

export interface MallProductFavoriteResponse {
  id: number; // 收藏编号
  user_id: number; // 用户编号
  spu_id: number; // 商品 SPU 编号
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallProductFavoriteQueryCondition extends PaginatedRequest {
  
}

export const createMallProductFavorite = (mall_product_favorite: MallProductFavoriteRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_product_favorite);
}

export const updateMallProductFavorite = (mall_product_favorite: MallProductFavoriteRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_product_favorite);
}

export const deleteMallProductFavorite = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallProductFavorite = (id: number): Promise<MallProductFavoriteResponse> => {
  return api.get<MallProductFavoriteResponse>(`${apis.get}/${id}`);
}

export const listMallProductFavorite = (): Promise<Array<MallProductFavoriteResponse>> => {
  return api.get<Array<MallProductFavoriteResponse>>(apis.list);
}

export const pageMallProductFavorite = (condition: MallProductFavoriteQueryCondition): Promise<PaginatedResponse<MallProductFavoriteResponse>> => {
  return api.get<PaginatedResponse<MallProductFavoriteResponse>>(apis.page, condition);
}
