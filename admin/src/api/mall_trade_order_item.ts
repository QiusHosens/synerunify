import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/mall_trade_order_item/create', // 新增
  update: '/erp/mall_trade_order_item/update', // 修改
  delete: '/erp/mall_trade_order_item/delete', // 删除
  get: '/erp/mall_trade_order_item/get', // 单条查询
  list: '/erp/mall_trade_order_item/list', // 列表查询
  page: '/erp/mall_trade_order_item/page', // 分页查询
}

export interface MallTradeOrderItemRequest {
  id: number; // 订单项编号
  user_id: number; // 用户编号
  order_id: number; // 订单编号
  cart_id: number; // 购物车项编号
  spu_id: number; // 商品 SPU 编号
  spu_name: string; // 商品 SPU 名称
  sku_id: number; // 商品 SKU 编号
  properties: string; // 商品属性数组，JSON 格式
  pic_url: string; // 商品图片
  count: number; // 购买数量
  comment_status: boolean; // 是否评价
  price: number; // 商品原价（单），单位：分
  discount_price: number; // 商品级优惠（总），单位：分
  delivery_price: number; // 运费金额，单位：分
  adjust_price: number; // 订单调价（总），单位：分
  pay_price: number; // 子订单实付金额（总），不算主订单分摊金额，单位：分
  coupon_price: number; // 优惠劵减免金额，单位：分
  point_price: number; // 积分抵扣的金额
  use_point: number; // 使用的积分
  give_point: number; // 赠送的积分
  vip_price: number; // VIP 减免金额，单位：分
  after_sale_id: number; // 售后订单编号
  after_sale_status: number; // 售后状态
  }

export interface MallTradeOrderItemResponse {
  id: number; // 订单项编号
  user_id: number; // 用户编号
  order_id: number; // 订单编号
  cart_id: number; // 购物车项编号
  spu_id: number; // 商品 SPU 编号
  spu_name: string; // 商品 SPU 名称
  sku_id: number; // 商品 SKU 编号
  properties: string; // 商品属性数组，JSON 格式
  pic_url: string; // 商品图片
  count: number; // 购买数量
  comment_status: boolean; // 是否评价
  price: number; // 商品原价（单），单位：分
  discount_price: number; // 商品级优惠（总），单位：分
  delivery_price: number; // 运费金额，单位：分
  adjust_price: number; // 订单调价（总），单位：分
  pay_price: number; // 子订单实付金额（总），不算主订单分摊金额，单位：分
  coupon_price: number; // 优惠劵减免金额，单位：分
  point_price: number; // 积分抵扣的金额
  use_point: number; // 使用的积分
  give_point: number; // 赠送的积分
  vip_price: number; // VIP 减免金额，单位：分
  after_sale_id: number; // 售后订单编号
  after_sale_status: number; // 售后状态
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallTradeOrderItemQueryCondition extends PaginatedRequest {
  
}

export const createMallTradeOrderItem = (mall_trade_order_item: MallTradeOrderItemRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_trade_order_item);
}

export const updateMallTradeOrderItem = (mall_trade_order_item: MallTradeOrderItemRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_trade_order_item);
}

export const deleteMallTradeOrderItem = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallTradeOrderItem = (id: number): Promise<MallTradeOrderItemResponse> => {
  return api.get<MallTradeOrderItemResponse>(`${apis.get}/${id}`);
}

export const listMallTradeOrderItem = (): Promise<Array<MallTradeOrderItemResponse>> => {
  return api.get<Array<MallTradeOrderItemResponse>>(apis.list);
}

export const pageMallTradeOrderItem = (condition: MallTradeOrderItemQueryCondition): Promise<PaginatedResponse<MallTradeOrderItemResponse>> => {
  return api.get<PaginatedResponse<MallTradeOrderItemResponse>>(apis.page, condition);
}
