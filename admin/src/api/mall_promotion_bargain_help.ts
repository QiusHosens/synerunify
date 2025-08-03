import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/mall_promotion_bargain_help/create', // 新增
  update: '/erp/mall_promotion_bargain_help/update', // 修改
  delete: '/erp/mall_promotion_bargain_help/delete', // 删除
  get: '/erp/mall_promotion_bargain_help/get', // 单条查询
  list: '/erp/mall_promotion_bargain_help/list', // 列表查询
  page: '/erp/mall_promotion_bargain_help/page', // 分页查询
}

export interface MallPromotionBargainHelpRequest {
  id: number; // 砍价助力编号
  user_id: number; // 用户编号
  activity_id: number; // 砍价活动名称
  record_id: number; // 砍价记录编号
  reduce_price: number; // 减少砍价，单位：分
  }

export interface MallPromotionBargainHelpResponse {
  id: number; // 砍价助力编号
  user_id: number; // 用户编号
  activity_id: number; // 砍价活动名称
  record_id: number; // 砍价记录编号
  reduce_price: number; // 减少砍价，单位：分
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallPromotionBargainHelpQueryCondition extends PaginatedRequest {
  
}

export const createMallPromotionBargainHelp = (mall_promotion_bargain_help: MallPromotionBargainHelpRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_promotion_bargain_help);
}

export const updateMallPromotionBargainHelp = (mall_promotion_bargain_help: MallPromotionBargainHelpRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_promotion_bargain_help);
}

export const deleteMallPromotionBargainHelp = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallPromotionBargainHelp = (id: number): Promise<MallPromotionBargainHelpResponse> => {
  return api.get<MallPromotionBargainHelpResponse>(`${apis.get}/${id}`);
}

export const listMallPromotionBargainHelp = (): Promise<Array<MallPromotionBargainHelpResponse>> => {
  return api.get<Array<MallPromotionBargainHelpResponse>>(apis.list);
}

export const pageMallPromotionBargainHelp = (condition: MallPromotionBargainHelpQueryCondition): Promise<PaginatedResponse<MallPromotionBargainHelpResponse>> => {
  return api.get<PaginatedResponse<MallPromotionBargainHelpResponse>>(apis.page, condition);
}
