import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/mall/mall_promotion_discount_product/create', // 新增
  update: '/mall/mall_promotion_discount_product/update', // 修改
  delete: '/mall/mall_promotion_discount_product/delete', // 删除
  get: '/mall/mall_promotion_discount_product/get', // 单条查询
  list: '/mall/mall_promotion_discount_product/list', // 列表查询
  page: '/mall/mall_promotion_discount_product/page', // 分页查询
}

export interface MallPromotionDiscountProductRequest {
  id: number; // 编号，主键自增
  activity_id: number; // 活动编号
  spu_id: number; // 商品 SPU 编号
  sku_id: number; // 商品 SKU 编号
  discount_type: number; // 优惠类型     *     * 1-代金卷     * 2-折扣卷
  discount_percent: number; // 折扣百分比
  discount_price: number; // 优惠金额，单位：分
  activity_status: number; // 秒杀商品状态
  activity_name: string; // 活动标题
  activity_start_time: string; // 活动开始时间点
  activity_end_time: string; // 活动结束时间点
  }

export interface MallPromotionDiscountProductResponse {
  id: number; // 编号，主键自增
  activity_id: number; // 活动编号
  spu_id: number; // 商品 SPU 编号
  sku_id: number; // 商品 SKU 编号
  discount_type: number; // 优惠类型     *     * 1-代金卷     * 2-折扣卷
  discount_percent: number; // 折扣百分比
  discount_price: number; // 优惠金额，单位：分
  activity_status: number; // 秒杀商品状态
  activity_name: string; // 活动标题
  activity_start_time: string; // 活动开始时间点
  activity_end_time: string; // 活动结束时间点
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallPromotionDiscountProductQueryCondition extends PaginatedRequest {
  
}

export const createMallPromotionDiscountProduct = (mall_promotion_discount_product: MallPromotionDiscountProductRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_promotion_discount_product);
}

export const updateMallPromotionDiscountProduct = (mall_promotion_discount_product: MallPromotionDiscountProductRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_promotion_discount_product);
}

export const deleteMallPromotionDiscountProduct = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallPromotionDiscountProduct = (id: number): Promise<MallPromotionDiscountProductResponse> => {
  return api.get<MallPromotionDiscountProductResponse>(`${apis.get}/${id}`);
}

export const listMallPromotionDiscountProduct = (): Promise<Array<MallPromotionDiscountProductResponse>> => {
  return api.get<Array<MallPromotionDiscountProductResponse>>(apis.list);
}

export const pageMallPromotionDiscountProduct = (condition: MallPromotionDiscountProductQueryCondition): Promise<PaginatedResponse<MallPromotionDiscountProductResponse>> => {
  return api.get<PaginatedResponse<MallPromotionDiscountProductResponse>>(apis.page, condition);
}
