import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/mall/mall_promotion_flash_config/create', // 新增
  update: '/mall/mall_promotion_flash_config/update', // 修改
  delete: '/mall/mall_promotion_flash_config/delete', // 删除
  get: '/mall/mall_promotion_flash_config/get', // 单条查询
  list: '/mall/mall_promotion_flash_config/list', // 列表查询
  page: '/mall/mall_promotion_flash_config/page', // 分页查询
  enable: '/mall/mall_promotion_flash_config/enable', // 启用
  disable: '/mall/mall_promotion_flash_config/disable', // 禁用
}

export interface MallPromotionFlashConfigRequest {
  id: number; // 编号
  name: string; // 秒杀时段名称
  start_time: string; // 开始时间点
  end_time: string; // 结束时间点
  slider_file_ids: string; // 秒杀主图
  status: number; // 活动状态
  }

export interface MallPromotionFlashConfigResponse {
  id: number; // 编号
  name: string; // 秒杀时段名称
  start_time: string; // 开始时间点
  end_time: string; // 结束时间点
  slider_file_ids: string; // 秒杀主图
  status: number; // 活动状态
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallPromotionFlashConfigQueryCondition extends PaginatedRequest {
  
}

export const createMallPromotionFlashConfig = (mall_promotion_flash_config: MallPromotionFlashConfigRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_promotion_flash_config);
}

export const updateMallPromotionFlashConfig = (mall_promotion_flash_config: MallPromotionFlashConfigRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_promotion_flash_config);
}

export const deleteMallPromotionFlashConfig = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallPromotionFlashConfig = (id: number): Promise<MallPromotionFlashConfigResponse> => {
  return api.get<MallPromotionFlashConfigResponse>(`${apis.get}/${id}`);
}

export const listMallPromotionFlashConfig = (): Promise<Array<MallPromotionFlashConfigResponse>> => {
  return api.get<Array<MallPromotionFlashConfigResponse>>(apis.list);
}

export const pageMallPromotionFlashConfig = (condition: MallPromotionFlashConfigQueryCondition): Promise<PaginatedResponse<MallPromotionFlashConfigResponse>> => {
  return api.get<PaginatedResponse<MallPromotionFlashConfigResponse>>(apis.page, condition);
}

export const enableMallPromotionFlashConfig = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableMallPromotionFlashConfig = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}