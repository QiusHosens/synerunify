import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/mall_trade_order/create', // 新增
  update: '/erp/mall_trade_order/update', // 修改
  delete: '/erp/mall_trade_order/delete', // 删除
  get: '/erp/mall_trade_order/get', // 单条查询
  list: '/erp/mall_trade_order/list', // 列表查询
  page: '/erp/mall_trade_order/page', // 分页查询
  enable: '/erp/mall_trade_order/enable', // 启用
  disable: '/erp/mall_trade_order/disable', // 禁用
}

export interface MallTradeOrderRequest {
  id: number; // 订单编号
  no: string; // 订单流水号
  type: number; // 订单类型
  terminal: number; // 订单来源终端
  user_id: number; // 用户编号
  user_ip: string; // 用户 IP
  user_remark: string; // 用户备注
  status: number; // 订单状态
  product_count: number; // 购买的商品数量
  cancel_type: number; // 取消类型
  remark: string; // 商家备注
  comment_status: boolean; // 是否评价
  brokerage_user_id: number; // 推广人编号
  pay_order_id: number; // 支付订单编号
  pay_status: boolean; // 是否已支付：[0:未支付 1:已经支付过]
  pay_time: string; // 订单支付时间
  pay_channel_code: string; // 支付成功的支付渠道
  finish_time: string; // 订单完成时间
  cancel_time: string; // 订单取消时间
  total_price: number; // 商品原价（总），单位：分
  discount_price: number; // 订单优惠（总），单位：分
  delivery_price: number; // 运费金额，单位：分
  adjust_price: number; // 订单调价（总），单位：分
  pay_price: number; // 应付金额（总），单位：分
  delivery_type: number; // 配送类型
  logistics_id: number; // 发货物流公司编号
  logistics_no: string; // 物流公司单号
  delivery_time: string; // 发货时间
  receive_time: string; // 收货时间
  receiver_name: string; // 收件人名称
  receiver_mobile: string; // 收件人手机
  receiver_area_id: number; // 收件人地区编号
  receiver_detail_address: string; // 收件人详细地址
  pick_up_store_id: number; // 自提门店编号
  pick_up_verify_code: string; // 自提核销码
  refund_status: number; // 售后状态
  refund_price: number; // 退款金额，单位：分
  coupon_id: number; // 优惠劵编号
  coupon_price: number; // 优惠劵减免金额，单位：分
  use_point: number; // 使用的积分
  point_price: number; // 积分抵扣的金额
  give_point: number; // 赠送的积分
  refund_point: number; // 退还的使用的积分
  vip_price: number; // VIP 减免金额，单位：分
  give_coupon_template_counts: string; // 赠送的优惠劵
  give_coupon_ids: string; // 赠送的优惠劵编号
  seckill_activity_id: number; // 秒杀活动编号
  bargain_activity_id: number; // 砍价活动编号
  bargain_record_id: number; // 砍价记录编号
  combination_activity_id: number; // 拼团活动编号
  combination_head_id: number; // 拼团团长编号
  combination_record_id: number; // 拼团记录编号
  point_activity_id: number; // 积分活动编号
  }

export interface MallTradeOrderResponse {
  id: number; // 订单编号
  no: string; // 订单流水号
  type: number; // 订单类型
  terminal: number; // 订单来源终端
  user_id: number; // 用户编号
  user_ip: string; // 用户 IP
  user_remark: string; // 用户备注
  status: number; // 订单状态
  product_count: number; // 购买的商品数量
  cancel_type: number; // 取消类型
  remark: string; // 商家备注
  comment_status: boolean; // 是否评价
  brokerage_user_id: number; // 推广人编号
  pay_order_id: number; // 支付订单编号
  pay_status: boolean; // 是否已支付：[0:未支付 1:已经支付过]
  pay_time: string; // 订单支付时间
  pay_channel_code: string; // 支付成功的支付渠道
  finish_time: string; // 订单完成时间
  cancel_time: string; // 订单取消时间
  total_price: number; // 商品原价（总），单位：分
  discount_price: number; // 订单优惠（总），单位：分
  delivery_price: number; // 运费金额，单位：分
  adjust_price: number; // 订单调价（总），单位：分
  pay_price: number; // 应付金额（总），单位：分
  delivery_type: number; // 配送类型
  logistics_id: number; // 发货物流公司编号
  logistics_no: string; // 物流公司单号
  delivery_time: string; // 发货时间
  receive_time: string; // 收货时间
  receiver_name: string; // 收件人名称
  receiver_mobile: string; // 收件人手机
  receiver_area_id: number; // 收件人地区编号
  receiver_detail_address: string; // 收件人详细地址
  pick_up_store_id: number; // 自提门店编号
  pick_up_verify_code: string; // 自提核销码
  refund_status: number; // 售后状态
  refund_price: number; // 退款金额，单位：分
  coupon_id: number; // 优惠劵编号
  coupon_price: number; // 优惠劵减免金额，单位：分
  use_point: number; // 使用的积分
  point_price: number; // 积分抵扣的金额
  give_point: number; // 赠送的积分
  refund_point: number; // 退还的使用的积分
  vip_price: number; // VIP 减免金额，单位：分
  give_coupon_template_counts: string; // 赠送的优惠劵
  give_coupon_ids: string; // 赠送的优惠劵编号
  seckill_activity_id: number; // 秒杀活动编号
  bargain_activity_id: number; // 砍价活动编号
  bargain_record_id: number; // 砍价记录编号
  combination_activity_id: number; // 拼团活动编号
  combination_head_id: number; // 拼团团长编号
  combination_record_id: number; // 拼团记录编号
  point_activity_id: number; // 积分活动编号
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallTradeOrderQueryCondition extends PaginatedRequest {
  
}

export const createMallTradeOrder = (mall_trade_order: MallTradeOrderRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_trade_order);
}

export const updateMallTradeOrder = (mall_trade_order: MallTradeOrderRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_trade_order);
}

export const deleteMallTradeOrder = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallTradeOrder = (id: number): Promise<MallTradeOrderResponse> => {
  return api.get<MallTradeOrderResponse>(`${apis.get}/${id}`);
}

export const listMallTradeOrder = (): Promise<Array<MallTradeOrderResponse>> => {
  return api.get<Array<MallTradeOrderResponse>>(apis.list);
}

export const pageMallTradeOrder = (condition: MallTradeOrderQueryCondition): Promise<PaginatedResponse<MallTradeOrderResponse>> => {
  return api.get<PaginatedResponse<MallTradeOrderResponse>>(apis.page, condition);
}

export const enableMallTradeOrder = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableMallTradeOrder = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}