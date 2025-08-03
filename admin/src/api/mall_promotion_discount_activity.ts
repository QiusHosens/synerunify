import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/mall_promotion_discount_activity/create', // 新增
  update: '/erp/mall_promotion_discount_activity/update', // 修改
  delete: '/erp/mall_promotion_discount_activity/delete', // 删除
  get: '/erp/mall_promotion_discount_activity/get', // 单条查询
  list: '/erp/mall_promotion_discount_activity/list', // 列表查询
  page: '/erp/mall_promotion_discount_activity/page', // 分页查询
  enable: '/erp/mall_promotion_discount_activity/enable', // 启用
  disable: '/erp/mall_promotion_discount_activity/disable', // 禁用
}

export interface MallPromotionDiscountActivityRequest {
  id: number; // 活动编号
  name: string; // 活动标题
  status: number; // 活动状态
  start_time: string; // 开始时间
  end_time: string; // 结束时间
  remark: string; // 备注
  }

export interface MallPromotionDiscountActivityResponse {
  id: number; // 活动编号
  name: string; // 活动标题
  status: number; // 活动状态
  start_time: string; // 开始时间
  end_time: string; // 结束时间
  remark: string; // 备注
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallPromotionDiscountActivityQueryCondition extends PaginatedRequest {
  
}

export const createMallPromotionDiscountActivity = (mall_promotion_discount_activity: MallPromotionDiscountActivityRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_promotion_discount_activity);
}

export const updateMallPromotionDiscountActivity = (mall_promotion_discount_activity: MallPromotionDiscountActivityRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_promotion_discount_activity);
}

export const deleteMallPromotionDiscountActivity = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallPromotionDiscountActivity = (id: number): Promise<MallPromotionDiscountActivityResponse> => {
  return api.get<MallPromotionDiscountActivityResponse>(`${apis.get}/${id}`);
}

export const listMallPromotionDiscountActivity = (): Promise<Array<MallPromotionDiscountActivityResponse>> => {
  return api.get<Array<MallPromotionDiscountActivityResponse>>(apis.list);
}

export const pageMallPromotionDiscountActivity = (condition: MallPromotionDiscountActivityQueryCondition): Promise<PaginatedResponse<MallPromotionDiscountActivityResponse>> => {
  return api.get<PaginatedResponse<MallPromotionDiscountActivityResponse>>(apis.page, condition);
}

export const enableMallPromotionDiscountActivity = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableMallPromotionDiscountActivity = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}