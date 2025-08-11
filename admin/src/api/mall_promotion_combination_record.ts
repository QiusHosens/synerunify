import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/mall/mall_promotion_combination_record/create', // 新增
  update: '/mall/mall_promotion_combination_record/update', // 修改
  delete: '/mall/mall_promotion_combination_record/delete', // 删除
  get: '/mall/mall_promotion_combination_record/get', // 单条查询
  list: '/mall/mall_promotion_combination_record/list', // 列表查询
  page: '/mall/mall_promotion_combination_record/page', // 分页查询
  enable: '/mall/mall_promotion_combination_record/enable', // 启用
  disable: '/mall/mall_promotion_combination_record/disable', // 禁用
}

export interface MallPromotionCombinationRecordRequest {
  id: number; // 编号
  activity_id: number; // 拼团活动编号
  spu_id: number; // 商品 SPU 编号
  file_id: number; // 商品图片ID
  spu_name: string; // 商品名称
  sku_id: number; // 商品 SKU 编号
  count: number; // 购买的商品数量
  user_id: number; // 用户编号
  nickname: string; // 用户昵称
  avatar: string; // 用户头像
  head_id: number; // 团长编号
  order_id: number; // 订单编号
  user_size: number; // 可参团人数
  user_count: number; // 已参团人数
  virtual_group: boolean; // 是否虚拟拼团
  status: number; // 参与状态：1进行中 2已完成 3未完成
  combination_price: number; // 拼团商品单价，单位分
  expire_time: string; // 过期时间
  start_time: string; // 开始时间 (订单付款后开始的时间)
  end_time: string; // 结束时间（成团时间/失败时间）
  }

export interface MallPromotionCombinationRecordResponse {
  id: number; // 编号
  activity_id: number; // 拼团活动编号
  spu_id: number; // 商品 SPU 编号
  file_id: number; // 商品图片ID
  spu_name: string; // 商品名称
  sku_id: number; // 商品 SKU 编号
  count: number; // 购买的商品数量
  user_id: number; // 用户编号
  nickname: string; // 用户昵称
  avatar: string; // 用户头像
  head_id: number; // 团长编号
  order_id: number; // 订单编号
  user_size: number; // 可参团人数
  user_count: number; // 已参团人数
  virtual_group: boolean; // 是否虚拟拼团
  status: number; // 参与状态：1进行中 2已完成 3未完成
  combination_price: number; // 拼团商品单价，单位分
  expire_time: string; // 过期时间
  start_time: string; // 开始时间 (订单付款后开始的时间)
  end_time: string; // 结束时间（成团时间/失败时间）
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallPromotionCombinationRecordQueryCondition extends PaginatedRequest {
  
}

export const createMallPromotionCombinationRecord = (mall_promotion_combination_record: MallPromotionCombinationRecordRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_promotion_combination_record);
}

export const updateMallPromotionCombinationRecord = (mall_promotion_combination_record: MallPromotionCombinationRecordRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_promotion_combination_record);
}

export const deleteMallPromotionCombinationRecord = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallPromotionCombinationRecord = (id: number): Promise<MallPromotionCombinationRecordResponse> => {
  return api.get<MallPromotionCombinationRecordResponse>(`${apis.get}/${id}`);
}

export const listMallPromotionCombinationRecord = (): Promise<Array<MallPromotionCombinationRecordResponse>> => {
  return api.get<Array<MallPromotionCombinationRecordResponse>>(apis.list);
}

export const pageMallPromotionCombinationRecord = (condition: MallPromotionCombinationRecordQueryCondition): Promise<PaginatedResponse<MallPromotionCombinationRecordResponse>> => {
  return api.get<PaginatedResponse<MallPromotionCombinationRecordResponse>>(apis.page, condition);
}

export const enableMallPromotionCombinationRecord = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableMallPromotionCombinationRecord = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}