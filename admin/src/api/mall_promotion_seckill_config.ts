import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/mall/mall_promotion_seckill_config/create', // 新增
  update: '/mall/mall_promotion_seckill_config/update', // 修改
  delete: '/mall/mall_promotion_seckill_config/delete', // 删除
  get: '/mall/mall_promotion_seckill_config/get', // 单条查询
  list: '/mall/mall_promotion_seckill_config/list', // 列表查询
  page: '/mall/mall_promotion_seckill_config/page', // 分页查询
  enable: '/mall/mall_promotion_seckill_config/enable', // 启用
  disable: '/mall/mall_promotion_seckill_config/disable', // 禁用
}

export interface MallPromotionSeckillConfigRequest {
  id: number; // 编号
  name: string; // 秒杀时段名称
  start_time: string; // 开始时间点
  end_time: string; // 结束时间点
  slider_pic_urls: string; // 秒杀主图
  status: number; // 活动状态
  }

export interface MallPromotionSeckillConfigResponse {
  id: number; // 编号
  name: string; // 秒杀时段名称
  start_time: string; // 开始时间点
  end_time: string; // 结束时间点
  slider_pic_urls: string; // 秒杀主图
  status: number; // 活动状态
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallPromotionSeckillConfigQueryCondition extends PaginatedRequest {
  
}

export const createMallPromotionSeckillConfig = (mall_promotion_seckill_config: MallPromotionSeckillConfigRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_promotion_seckill_config);
}

export const updateMallPromotionSeckillConfig = (mall_promotion_seckill_config: MallPromotionSeckillConfigRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_promotion_seckill_config);
}

export const deleteMallPromotionSeckillConfig = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallPromotionSeckillConfig = (id: number): Promise<MallPromotionSeckillConfigResponse> => {
  return api.get<MallPromotionSeckillConfigResponse>(`${apis.get}/${id}`);
}

export const listMallPromotionSeckillConfig = (): Promise<Array<MallPromotionSeckillConfigResponse>> => {
  return api.get<Array<MallPromotionSeckillConfigResponse>>(apis.list);
}

export const pageMallPromotionSeckillConfig = (condition: MallPromotionSeckillConfigQueryCondition): Promise<PaginatedResponse<MallPromotionSeckillConfigResponse>> => {
  return api.get<PaginatedResponse<MallPromotionSeckillConfigResponse>>(apis.page, condition);
}

export const enableMallPromotionSeckillConfig = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableMallPromotionSeckillConfig = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}