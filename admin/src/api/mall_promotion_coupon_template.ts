import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/mall_promotion_coupon_template/create', // 新增
  update: '/erp/mall_promotion_coupon_template/update', // 修改
  delete: '/erp/mall_promotion_coupon_template/delete', // 删除
  get: '/erp/mall_promotion_coupon_template/get', // 单条查询
  list: '/erp/mall_promotion_coupon_template/list', // 列表查询
  page: '/erp/mall_promotion_coupon_template/page', // 分页查询
  enable: '/erp/mall_promotion_coupon_template/enable', // 启用
  disable: '/erp/mall_promotion_coupon_template/disable', // 禁用
}

export interface MallPromotionCouponTemplateRequest {
  id: number; // 模板编号，自增唯一。
  name: string; // 优惠劵名
  description: string; // 优惠劵描述
  status: number; // 状态
  total_count: number; // 发放数量, -1 - 则表示不限制
  take_limit_count: number; // 每人限领个数, -1 - 则表示不限制
  take_type: number; // 领取方式
  use_price: number; // 是否设置满多少金额可用，单位：分
  product_scope: number; // 商品范围
  product_scope_values: string; // 商品范围编号的数组
  validity_type: number; // 生效日期类型
  valid_start_time: string; // 固定日期-生效开始时间
  valid_end_time: string; // 固定日期-生效结束时间
  fixed_start_term: number; // 领取日期-开始天数
  fixed_end_term: number; // 领取日期-结束天数
  discount_type: number; // 优惠类型：1-代金卷；2-折扣卷
  discount_percent: number; // 折扣百分比
  discount_price: number; // 优惠金额，单位：分
  discount_limit_price: number; // 折扣上限，仅在 discount_type 等于 2 时生效
  take_count: number; // 领取优惠券的数量
  use_count: number; // 使用优惠券的次数
  }

export interface MallPromotionCouponTemplateResponse {
  id: number; // 模板编号，自增唯一。
  name: string; // 优惠劵名
  description: string; // 优惠劵描述
  status: number; // 状态
  total_count: number; // 发放数量, -1 - 则表示不限制
  take_limit_count: number; // 每人限领个数, -1 - 则表示不限制
  take_type: number; // 领取方式
  use_price: number; // 是否设置满多少金额可用，单位：分
  product_scope: number; // 商品范围
  product_scope_values: string; // 商品范围编号的数组
  validity_type: number; // 生效日期类型
  valid_start_time: string; // 固定日期-生效开始时间
  valid_end_time: string; // 固定日期-生效结束时间
  fixed_start_term: number; // 领取日期-开始天数
  fixed_end_term: number; // 领取日期-结束天数
  discount_type: number; // 优惠类型：1-代金卷；2-折扣卷
  discount_percent: number; // 折扣百分比
  discount_price: number; // 优惠金额，单位：分
  discount_limit_price: number; // 折扣上限，仅在 discount_type 等于 2 时生效
  take_count: number; // 领取优惠券的数量
  use_count: number; // 使用优惠券的次数
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallPromotionCouponTemplateQueryCondition extends PaginatedRequest {
  
}

export const createMallPromotionCouponTemplate = (mall_promotion_coupon_template: MallPromotionCouponTemplateRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_promotion_coupon_template);
}

export const updateMallPromotionCouponTemplate = (mall_promotion_coupon_template: MallPromotionCouponTemplateRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_promotion_coupon_template);
}

export const deleteMallPromotionCouponTemplate = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallPromotionCouponTemplate = (id: number): Promise<MallPromotionCouponTemplateResponse> => {
  return api.get<MallPromotionCouponTemplateResponse>(`${apis.get}/${id}`);
}

export const listMallPromotionCouponTemplate = (): Promise<Array<MallPromotionCouponTemplateResponse>> => {
  return api.get<Array<MallPromotionCouponTemplateResponse>>(apis.list);
}

export const pageMallPromotionCouponTemplate = (condition: MallPromotionCouponTemplateQueryCondition): Promise<PaginatedResponse<MallPromotionCouponTemplateResponse>> => {
  return api.get<PaginatedResponse<MallPromotionCouponTemplateResponse>>(apis.page, condition);
}

export const enableMallPromotionCouponTemplate = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableMallPromotionCouponTemplate = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}