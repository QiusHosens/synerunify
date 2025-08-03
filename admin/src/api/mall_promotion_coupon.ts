import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/mall_promotion_coupon/create', // 新增
  update: '/erp/mall_promotion_coupon/update', // 修改
  delete: '/erp/mall_promotion_coupon/delete', // 删除
  get: '/erp/mall_promotion_coupon/get', // 单条查询
  list: '/erp/mall_promotion_coupon/list', // 列表查询
  page: '/erp/mall_promotion_coupon/page', // 分页查询
  enable: '/erp/mall_promotion_coupon/enable', // 启用
  disable: '/erp/mall_promotion_coupon/disable', // 禁用
}

export interface MallPromotionCouponRequest {
  id: number; // 优惠劵编号
  template_id: number; // 优惠劵模板编号
  name: string; // 优惠劵名
  status: number; // 优惠码状态     *     * 1-未使用     * 2-已使用     * 3-已失效
  user_id: number; // 用户编号
  take_type: number; // 领取类型     *     * 1 - 用户主动领取     * 2 - 后台自动发放
  use_price: number; // 是否设置满多少金额可用，单位：分
  valid_start_time: string; // 生效开始时间
  valid_end_time: string; // 生效结束时间
  product_scope: number; // 商品范围
  product_scope_values: string; // 商品范围编号的数组
  discount_type: number; // 折扣类型
  discount_percent: number; // 折扣百分比
  discount_price: number; // 优惠金额，单位：分
  discount_limit_price: number; // 折扣上限
  use_order_id: number; // 使用订单号
  use_time: string; // 使用时间
  }

export interface MallPromotionCouponResponse {
  id: number; // 优惠劵编号
  template_id: number; // 优惠劵模板编号
  name: string; // 优惠劵名
  status: number; // 优惠码状态     *     * 1-未使用     * 2-已使用     * 3-已失效
  user_id: number; // 用户编号
  take_type: number; // 领取类型     *     * 1 - 用户主动领取     * 2 - 后台自动发放
  use_price: number; // 是否设置满多少金额可用，单位：分
  valid_start_time: string; // 生效开始时间
  valid_end_time: string; // 生效结束时间
  product_scope: number; // 商品范围
  product_scope_values: string; // 商品范围编号的数组
  discount_type: number; // 折扣类型
  discount_percent: number; // 折扣百分比
  discount_price: number; // 优惠金额，单位：分
  discount_limit_price: number; // 折扣上限
  use_order_id: number; // 使用订单号
  use_time: string; // 使用时间
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallPromotionCouponQueryCondition extends PaginatedRequest {
  
}

export const createMallPromotionCoupon = (mall_promotion_coupon: MallPromotionCouponRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_promotion_coupon);
}

export const updateMallPromotionCoupon = (mall_promotion_coupon: MallPromotionCouponRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_promotion_coupon);
}

export const deleteMallPromotionCoupon = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallPromotionCoupon = (id: number): Promise<MallPromotionCouponResponse> => {
  return api.get<MallPromotionCouponResponse>(`${apis.get}/${id}`);
}

export const listMallPromotionCoupon = (): Promise<Array<MallPromotionCouponResponse>> => {
  return api.get<Array<MallPromotionCouponResponse>>(apis.list);
}

export const pageMallPromotionCoupon = (condition: MallPromotionCouponQueryCondition): Promise<PaginatedResponse<MallPromotionCouponResponse>> => {
  return api.get<PaginatedResponse<MallPromotionCouponResponse>>(apis.page, condition);
}

export const enableMallPromotionCoupon = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableMallPromotionCoupon = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}