import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/mall/mall_promotion_combination_product/create', // 新增
  update: '/mall/mall_promotion_combination_product/update', // 修改
  delete: '/mall/mall_promotion_combination_product/delete', // 删除
  get: '/mall/mall_promotion_combination_product/get', // 单条查询
  list: '/mall/mall_promotion_combination_product/list', // 列表查询
  page: '/mall/mall_promotion_combination_product/page', // 分页查询
  enable: '/mall/mall_promotion_combination_product/enable', // 启用
  disable: '/mall/mall_promotion_combination_product/disable', // 禁用
}

export interface MallPromotionCombinationProductRequest {
  id: number; // 编号
  activity_id: number; // 拼团活动编号
  spu_id: number; // 商品 SPU 编号
  sku_id: number; // 商品 SKU 编号
  status: number; // 状态
  activity_start_time: string; // 活动开始时间点
  activity_end_time: string; // 活动结束时间点
  combination_price: number; // 拼团价格，单位分
  }

export interface MallPromotionCombinationProductResponse {
  id: number; // 编号
  activity_id: number; // 拼团活动编号
  spu_id: number; // 商品 SPU 编号
  sku_id: number; // 商品 SKU 编号
  status: number; // 状态
  activity_start_time: string; // 活动开始时间点
  activity_end_time: string; // 活动结束时间点
  combination_price: number; // 拼团价格，单位分
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallPromotionCombinationProductQueryCondition extends PaginatedRequest {
  
}

export const createMallPromotionCombinationProduct = (mall_promotion_combination_product: MallPromotionCombinationProductRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_promotion_combination_product);
}

export const updateMallPromotionCombinationProduct = (mall_promotion_combination_product: MallPromotionCombinationProductRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_promotion_combination_product);
}

export const deleteMallPromotionCombinationProduct = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallPromotionCombinationProduct = (id: number): Promise<MallPromotionCombinationProductResponse> => {
  return api.get<MallPromotionCombinationProductResponse>(`${apis.get}/${id}`);
}

export const listMallPromotionCombinationProduct = (): Promise<Array<MallPromotionCombinationProductResponse>> => {
  return api.get<Array<MallPromotionCombinationProductResponse>>(apis.list);
}

export const pageMallPromotionCombinationProduct = (condition: MallPromotionCombinationProductQueryCondition): Promise<PaginatedResponse<MallPromotionCombinationProductResponse>> => {
  return api.get<PaginatedResponse<MallPromotionCombinationProductResponse>>(apis.page, condition);
}

export const enableMallPromotionCombinationProduct = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableMallPromotionCombinationProduct = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}