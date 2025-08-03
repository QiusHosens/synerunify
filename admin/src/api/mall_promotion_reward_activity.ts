import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/mall_promotion_reward_activity/create', // 新增
  update: '/erp/mall_promotion_reward_activity/update', // 修改
  delete: '/erp/mall_promotion_reward_activity/delete', // 删除
  get: '/erp/mall_promotion_reward_activity/get', // 单条查询
  list: '/erp/mall_promotion_reward_activity/list', // 列表查询
  page: '/erp/mall_promotion_reward_activity/page', // 分页查询
  enable: '/erp/mall_promotion_reward_activity/enable', // 启用
  disable: '/erp/mall_promotion_reward_activity/disable', // 禁用
}

export interface MallPromotionRewardActivityRequest {
  id: number; // 活动编号
  name: string; // 活动标题
  status: number; // 活动状态
  start_time: string; // 开始时间
  end_time: string; // 结束时间
  remark: string; // 备注
  condition_type: number; // 条件类型
  product_scope: number; // 商品范围
  product_scope_values: string; // 商品范围编号的数组
  rules: string; // 优惠规则的数组
  }

export interface MallPromotionRewardActivityResponse {
  id: number; // 活动编号
  name: string; // 活动标题
  status: number; // 活动状态
  start_time: string; // 开始时间
  end_time: string; // 结束时间
  remark: string; // 备注
  condition_type: number; // 条件类型
  product_scope: number; // 商品范围
  product_scope_values: string; // 商品范围编号的数组
  rules: string; // 优惠规则的数组
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallPromotionRewardActivityQueryCondition extends PaginatedRequest {
  
}

export const createMallPromotionRewardActivity = (mall_promotion_reward_activity: MallPromotionRewardActivityRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_promotion_reward_activity);
}

export const updateMallPromotionRewardActivity = (mall_promotion_reward_activity: MallPromotionRewardActivityRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_promotion_reward_activity);
}

export const deleteMallPromotionRewardActivity = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallPromotionRewardActivity = (id: number): Promise<MallPromotionRewardActivityResponse> => {
  return api.get<MallPromotionRewardActivityResponse>(`${apis.get}/${id}`);
}

export const listMallPromotionRewardActivity = (): Promise<Array<MallPromotionRewardActivityResponse>> => {
  return api.get<Array<MallPromotionRewardActivityResponse>>(apis.list);
}

export const pageMallPromotionRewardActivity = (condition: MallPromotionRewardActivityQueryCondition): Promise<PaginatedResponse<MallPromotionRewardActivityResponse>> => {
  return api.get<PaginatedResponse<MallPromotionRewardActivityResponse>>(apis.page, condition);
}

export const enableMallPromotionRewardActivity = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableMallPromotionRewardActivity = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}