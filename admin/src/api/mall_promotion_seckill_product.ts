import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/mall_promotion_seckill_product/create', // 新增
  update: '/erp/mall_promotion_seckill_product/update', // 修改
  delete: '/erp/mall_promotion_seckill_product/delete', // 删除
  get: '/erp/mall_promotion_seckill_product/get', // 单条查询
  list: '/erp/mall_promotion_seckill_product/list', // 列表查询
  page: '/erp/mall_promotion_seckill_product/page', // 分页查询
}

export interface MallPromotionSeckillProductRequest {
  id: number; // 秒杀参与商品编号
  activity_id: number; // 秒杀活动 id
  config_ids: string; // 秒杀时段 id 数组
  spu_id: number; // 商品 spu_id
  sku_id: number; // 商品 sku_id
  seckill_price: number; // 秒杀金额，单位：分
  stock: number; // 秒杀库存
  activity_status: number; // 秒杀商品状态
  activity_start_time: string; // 活动开始时间点
  activity_end_time: string; // 活动结束时间点
  }

export interface MallPromotionSeckillProductResponse {
  id: number; // 秒杀参与商品编号
  activity_id: number; // 秒杀活动 id
  config_ids: string; // 秒杀时段 id 数组
  spu_id: number; // 商品 spu_id
  sku_id: number; // 商品 sku_id
  seckill_price: number; // 秒杀金额，单位：分
  stock: number; // 秒杀库存
  activity_status: number; // 秒杀商品状态
  activity_start_time: string; // 活动开始时间点
  activity_end_time: string; // 活动结束时间点
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallPromotionSeckillProductQueryCondition extends PaginatedRequest {
  
}

export const createMallPromotionSeckillProduct = (mall_promotion_seckill_product: MallPromotionSeckillProductRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_promotion_seckill_product);
}

export const updateMallPromotionSeckillProduct = (mall_promotion_seckill_product: MallPromotionSeckillProductRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_promotion_seckill_product);
}

export const deleteMallPromotionSeckillProduct = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallPromotionSeckillProduct = (id: number): Promise<MallPromotionSeckillProductResponse> => {
  return api.get<MallPromotionSeckillProductResponse>(`${apis.get}/${id}`);
}

export const listMallPromotionSeckillProduct = (): Promise<Array<MallPromotionSeckillProductResponse>> => {
  return api.get<Array<MallPromotionSeckillProductResponse>>(apis.list);
}

export const pageMallPromotionSeckillProduct = (condition: MallPromotionSeckillProductQueryCondition): Promise<PaginatedResponse<MallPromotionSeckillProductResponse>> => {
  return api.get<PaginatedResponse<MallPromotionSeckillProductResponse>>(apis.page, condition);
}
