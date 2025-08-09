import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/mall/mall_promotion_seckill_activity/create', // 新增
  update: '/mall/mall_promotion_seckill_activity/update', // 修改
  delete: '/mall/mall_promotion_seckill_activity/delete', // 删除
  get: '/mall/mall_promotion_seckill_activity/get', // 单条查询
  list: '/mall/mall_promotion_seckill_activity/list', // 列表查询
  page: '/mall/mall_promotion_seckill_activity/page', // 分页查询
  enable: '/mall/mall_promotion_seckill_activity/enable', // 启用
  disable: '/mall/mall_promotion_seckill_activity/disable', // 禁用
}

export interface MallPromotionSeckillActivityRequest {
  id: number; // 秒杀活动编号
  spu_id: number; // 秒杀活动商品
  name: string; // 秒杀活动名称
  status: number; // 活动状态
  remark: string; // 备注
  start_time: string; // 活动开始时间
  end_time: string; // 活动结束时间
  sort: number; // 排序
  config_ids: string; // 秒杀时段 id 数组
  total_limit_count: number; // 总限购数量
  single_limit_count: number; // 单次限够数量
  stock: number; // 秒杀库存
  total_stock: number; // 秒杀总库存
  }

export interface MallPromotionSeckillActivityResponse {
  id: number; // 秒杀活动编号
  spu_id: number; // 秒杀活动商品
  name: string; // 秒杀活动名称
  status: number; // 活动状态
  remark: string; // 备注
  start_time: string; // 活动开始时间
  end_time: string; // 活动结束时间
  sort: number; // 排序
  config_ids: string; // 秒杀时段 id 数组
  total_limit_count: number; // 总限购数量
  single_limit_count: number; // 单次限够数量
  stock: number; // 秒杀库存
  total_stock: number; // 秒杀总库存
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallPromotionSeckillActivityQueryCondition extends PaginatedRequest {
  
}

export const createMallPromotionSeckillActivity = (mall_promotion_seckill_activity: MallPromotionSeckillActivityRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_promotion_seckill_activity);
}

export const updateMallPromotionSeckillActivity = (mall_promotion_seckill_activity: MallPromotionSeckillActivityRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_promotion_seckill_activity);
}

export const deleteMallPromotionSeckillActivity = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallPromotionSeckillActivity = (id: number): Promise<MallPromotionSeckillActivityResponse> => {
  return api.get<MallPromotionSeckillActivityResponse>(`${apis.get}/${id}`);
}

export const listMallPromotionSeckillActivity = (): Promise<Array<MallPromotionSeckillActivityResponse>> => {
  return api.get<Array<MallPromotionSeckillActivityResponse>>(apis.list);
}

export const pageMallPromotionSeckillActivity = (condition: MallPromotionSeckillActivityQueryCondition): Promise<PaginatedResponse<MallPromotionSeckillActivityResponse>> => {
  return api.get<PaginatedResponse<MallPromotionSeckillActivityResponse>>(apis.page, condition);
}

export const enableMallPromotionSeckillActivity = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableMallPromotionSeckillActivity = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}