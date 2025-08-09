import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/mall/mall_promotion_combination_activity/create', // 新增
  update: '/mall/mall_promotion_combination_activity/update', // 修改
  delete: '/mall/mall_promotion_combination_activity/delete', // 删除
  get: '/mall/mall_promotion_combination_activity/get', // 单条查询
  list: '/mall/mall_promotion_combination_activity/list', // 列表查询
  page: '/mall/mall_promotion_combination_activity/page', // 分页查询
  enable: '/mall/mall_promotion_combination_activity/enable', // 启用
  disable: '/mall/mall_promotion_combination_activity/disable', // 禁用
}

export interface MallPromotionCombinationActivityRequest {
  id: number; // 活动编号
  name: string; // 拼团名称
  spu_id: number; // 商品 SPU ID
  total_limit_count: number; // 总限购数量
  single_limit_count: number; // 单次限购数量
  start_time: string; // 开始时间
  end_time: string; // 结束时间
  user_size: number; // 购买人数
  virtual_group: number; // 虚拟成团
  status: number; // 状态
  limit_duration: number; // 限制时长（小时）
  }

export interface MallPromotionCombinationActivityResponse {
  id: number; // 活动编号
  name: string; // 拼团名称
  spu_id: number; // 商品 SPU ID
  total_limit_count: number; // 总限购数量
  single_limit_count: number; // 单次限购数量
  start_time: string; // 开始时间
  end_time: string; // 结束时间
  user_size: number; // 购买人数
  virtual_group: number; // 虚拟成团
  status: number; // 状态
  limit_duration: number; // 限制时长（小时）
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallPromotionCombinationActivityQueryCondition extends PaginatedRequest {
  
}

export const createMallPromotionCombinationActivity = (mall_promotion_combination_activity: MallPromotionCombinationActivityRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_promotion_combination_activity);
}

export const updateMallPromotionCombinationActivity = (mall_promotion_combination_activity: MallPromotionCombinationActivityRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_promotion_combination_activity);
}

export const deleteMallPromotionCombinationActivity = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallPromotionCombinationActivity = (id: number): Promise<MallPromotionCombinationActivityResponse> => {
  return api.get<MallPromotionCombinationActivityResponse>(`${apis.get}/${id}`);
}

export const listMallPromotionCombinationActivity = (): Promise<Array<MallPromotionCombinationActivityResponse>> => {
  return api.get<Array<MallPromotionCombinationActivityResponse>>(apis.list);
}

export const pageMallPromotionCombinationActivity = (condition: MallPromotionCombinationActivityQueryCondition): Promise<PaginatedResponse<MallPromotionCombinationActivityResponse>> => {
  return api.get<PaginatedResponse<MallPromotionCombinationActivityResponse>>(apis.page, condition);
}

export const enableMallPromotionCombinationActivity = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableMallPromotionCombinationActivity = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}