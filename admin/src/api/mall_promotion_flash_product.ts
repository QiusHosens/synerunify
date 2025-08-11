import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/mall/mall_promotion_flash_product/create', // 新增
  update: '/mall/mall_promotion_flash_product/update', // 修改
  delete: '/mall/mall_promotion_flash_product/delete', // 删除
  get: '/mall/mall_promotion_flash_product/get', // 单条查询
  list: '/mall/mall_promotion_flash_product/list', // 列表查询
  page: '/mall/mall_promotion_flash_product/page', // 分页查询
}

export interface MallPromotionFlashProductRequest {
  id: number; // 秒杀参与商品编号
  activity_id: number; // 秒杀活动 id
  config_ids: string; // 秒杀时段 id 数组
  spu_id: number; // 商品 spu_id
  sku_id: number; // 商品 sku_id
  flash_price: number; // 秒杀金额，单位：分
  stock: number; // 秒杀库存
  activity_status: number; // 秒杀商品状态
  activity_start_time: string; // 活动开始时间点
  activity_end_time: string; // 活动结束时间点
  }

export interface MallPromotionFlashProductResponse {
  id: number; // 秒杀参与商品编号
  activity_id: number; // 秒杀活动 id
  config_ids: string; // 秒杀时段 id 数组
  spu_id: number; // 商品 spu_id
  sku_id: number; // 商品 sku_id
  flash_price: number; // 秒杀金额，单位：分
  stock: number; // 秒杀库存
  activity_status: number; // 秒杀商品状态
  activity_start_time: string; // 活动开始时间点
  activity_end_time: string; // 活动结束时间点
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallPromotionFlashProductQueryCondition extends PaginatedRequest {
  
}

export const createMallPromotionFlashProduct = (mall_promotion_flash_product: MallPromotionFlashProductRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_promotion_flash_product);
}

export const updateMallPromotionFlashProduct = (mall_promotion_flash_product: MallPromotionFlashProductRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_promotion_flash_product);
}

export const deleteMallPromotionFlashProduct = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallPromotionFlashProduct = (id: number): Promise<MallPromotionFlashProductResponse> => {
  return api.get<MallPromotionFlashProductResponse>(`${apis.get}/${id}`);
}

export const listMallPromotionFlashProduct = (): Promise<Array<MallPromotionFlashProductResponse>> => {
  return api.get<Array<MallPromotionFlashProductResponse>>(apis.list);
}

export const pageMallPromotionFlashProduct = (condition: MallPromotionFlashProductQueryCondition): Promise<PaginatedResponse<MallPromotionFlashProductResponse>> => {
  return api.get<PaginatedResponse<MallPromotionFlashProductResponse>>(apis.page, condition);
}
