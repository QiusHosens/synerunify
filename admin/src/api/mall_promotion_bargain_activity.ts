import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/mall/mall_promotion_bargain_activity/create', // 新增
  update: '/mall/mall_promotion_bargain_activity/update', // 修改
  delete: '/mall/mall_promotion_bargain_activity/delete', // 删除
  get: '/mall/mall_promotion_bargain_activity/get', // 单条查询
  list: '/mall/mall_promotion_bargain_activity/list', // 列表查询
  page: '/mall/mall_promotion_bargain_activity/page', // 分页查询
  enable: '/mall/mall_promotion_bargain_activity/enable', // 启用
  disable: '/mall/mall_promotion_bargain_activity/disable', // 禁用
}

export interface MallPromotionBargainActivityRequest {
  id: number; // 砍价活动编号
  name: string; // 砍价活动名称
  start_time: string; // 活动开始时间
  end_time: string; // 活动结束时间
  status: number; // 状态
  spu_id: number; // 商品 SPU 编号
  sku_id: number; // 商品 SKU 编号
  bargain_first_price: number; // 砍价起始价格，单位分
  bargain_min_price: number; // 砍价底价，单位：分
  stock: number; // 砍价库存
  total_stock: number; // 砍价总库存
  help_max_count: number; // 砍价人数
  bargain_count: number; // 最大帮砍次数
  total_limit_count: number; // 总限购数量
  random_min_price: number; // 用户每次砍价的最小金额，单位：分
  random_max_price: number; // 用户每次砍价的最大金额，单位：分
  }

export interface MallPromotionBargainActivityResponse {
  id: number; // 砍价活动编号
  name: string; // 砍价活动名称
  start_time: string; // 活动开始时间
  end_time: string; // 活动结束时间
  status: number; // 状态
  spu_id: number; // 商品 SPU 编号
  sku_id: number; // 商品 SKU 编号
  bargain_first_price: number; // 砍价起始价格，单位分
  bargain_min_price: number; // 砍价底价，单位：分
  stock: number; // 砍价库存
  total_stock: number; // 砍价总库存
  help_max_count: number; // 砍价人数
  bargain_count: number; // 最大帮砍次数
  total_limit_count: number; // 总限购数量
  random_min_price: number; // 用户每次砍价的最小金额，单位：分
  random_max_price: number; // 用户每次砍价的最大金额，单位：分
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallPromotionBargainActivityQueryCondition extends PaginatedRequest {
  
}

export const createMallPromotionBargainActivity = (mall_promotion_bargain_activity: MallPromotionBargainActivityRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_promotion_bargain_activity);
}

export const updateMallPromotionBargainActivity = (mall_promotion_bargain_activity: MallPromotionBargainActivityRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_promotion_bargain_activity);
}

export const deleteMallPromotionBargainActivity = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallPromotionBargainActivity = (id: number): Promise<MallPromotionBargainActivityResponse> => {
  return api.get<MallPromotionBargainActivityResponse>(`${apis.get}/${id}`);
}

export const listMallPromotionBargainActivity = (): Promise<Array<MallPromotionBargainActivityResponse>> => {
  return api.get<Array<MallPromotionBargainActivityResponse>>(apis.list);
}

export const pageMallPromotionBargainActivity = (condition: MallPromotionBargainActivityQueryCondition): Promise<PaginatedResponse<MallPromotionBargainActivityResponse>> => {
  return api.get<PaginatedResponse<MallPromotionBargainActivityResponse>>(apis.page, condition);
}

export const enableMallPromotionBargainActivity = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableMallPromotionBargainActivity = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}