import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/mall_promotion_bargain_record/create', // 新增
  update: '/erp/mall_promotion_bargain_record/update', // 修改
  delete: '/erp/mall_promotion_bargain_record/delete', // 删除
  get: '/erp/mall_promotion_bargain_record/get', // 单条查询
  list: '/erp/mall_promotion_bargain_record/list', // 列表查询
  page: '/erp/mall_promotion_bargain_record/page', // 分页查询
  enable: '/erp/mall_promotion_bargain_record/enable', // 启用
  disable: '/erp/mall_promotion_bargain_record/disable', // 禁用
}

export interface MallPromotionBargainRecordRequest {
  id: number; // 砍价记录编号
  activity_id: number; // 砍价活动名称
  user_id: number; // 用户编号
  spu_id: number; // 商品 SPU 编号
  sku_id: number; // 商品 SKU 编号
  bargain_first_price: number; // 砍价起始价格，单位：分
  bargain_price: number; // 当前砍价，单位：分
  status: number; // 状态
  order_id: number; // 订单编号
  end_time: string; // 结束时间
  }

export interface MallPromotionBargainRecordResponse {
  id: number; // 砍价记录编号
  activity_id: number; // 砍价活动名称
  user_id: number; // 用户编号
  spu_id: number; // 商品 SPU 编号
  sku_id: number; // 商品 SKU 编号
  bargain_first_price: number; // 砍价起始价格，单位：分
  bargain_price: number; // 当前砍价，单位：分
  status: number; // 状态
  order_id: number; // 订单编号
  end_time: string; // 结束时间
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallPromotionBargainRecordQueryCondition extends PaginatedRequest {
  
}

export const createMallPromotionBargainRecord = (mall_promotion_bargain_record: MallPromotionBargainRecordRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_promotion_bargain_record);
}

export const updateMallPromotionBargainRecord = (mall_promotion_bargain_record: MallPromotionBargainRecordRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_promotion_bargain_record);
}

export const deleteMallPromotionBargainRecord = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallPromotionBargainRecord = (id: number): Promise<MallPromotionBargainRecordResponse> => {
  return api.get<MallPromotionBargainRecordResponse>(`${apis.get}/${id}`);
}

export const listMallPromotionBargainRecord = (): Promise<Array<MallPromotionBargainRecordResponse>> => {
  return api.get<Array<MallPromotionBargainRecordResponse>>(apis.list);
}

export const pageMallPromotionBargainRecord = (condition: MallPromotionBargainRecordQueryCondition): Promise<PaginatedResponse<MallPromotionBargainRecordResponse>> => {
  return api.get<PaginatedResponse<MallPromotionBargainRecordResponse>>(apis.page, condition);
}

export const enableMallPromotionBargainRecord = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableMallPromotionBargainRecord = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}