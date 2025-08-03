import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/mall_promotion_point_activity/create', // 新增
  update: '/erp/mall_promotion_point_activity/update', // 修改
  delete: '/erp/mall_promotion_point_activity/delete', // 删除
  get: '/erp/mall_promotion_point_activity/get', // 单条查询
  list: '/erp/mall_promotion_point_activity/list', // 列表查询
  page: '/erp/mall_promotion_point_activity/page', // 分页查询
  enable: '/erp/mall_promotion_point_activity/enable', // 启用
  disable: '/erp/mall_promotion_point_activity/disable', // 禁用
}

export interface MallPromotionPointActivityRequest {
  id: number; // 积分商城活动编号
  spu_id: number; // 商品 SPU ID
  status: number; // 活动状态
  remark: string; // 备注
  sort: number; // 排序
  stock: number; // 积分商城活动库存(剩余库存积分兑换时扣减)
  total_stock: number; // 积分商城活动总库存
  }

export interface MallPromotionPointActivityResponse {
  id: number; // 积分商城活动编号
  spu_id: number; // 商品 SPU ID
  status: number; // 活动状态
  remark: string; // 备注
  sort: number; // 排序
  stock: number; // 积分商城活动库存(剩余库存积分兑换时扣减)
  total_stock: number; // 积分商城活动总库存
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallPromotionPointActivityQueryCondition extends PaginatedRequest {
  
}

export const createMallPromotionPointActivity = (mall_promotion_point_activity: MallPromotionPointActivityRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_promotion_point_activity);
}

export const updateMallPromotionPointActivity = (mall_promotion_point_activity: MallPromotionPointActivityRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_promotion_point_activity);
}

export const deleteMallPromotionPointActivity = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallPromotionPointActivity = (id: number): Promise<MallPromotionPointActivityResponse> => {
  return api.get<MallPromotionPointActivityResponse>(`${apis.get}/${id}`);
}

export const listMallPromotionPointActivity = (): Promise<Array<MallPromotionPointActivityResponse>> => {
  return api.get<Array<MallPromotionPointActivityResponse>>(apis.list);
}

export const pageMallPromotionPointActivity = (condition: MallPromotionPointActivityQueryCondition): Promise<PaginatedResponse<MallPromotionPointActivityResponse>> => {
  return api.get<PaginatedResponse<MallPromotionPointActivityResponse>>(apis.page, condition);
}

export const enableMallPromotionPointActivity = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableMallPromotionPointActivity = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}