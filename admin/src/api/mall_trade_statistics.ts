import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/mall/mall_trade_statistics/create', // 新增
  update: '/mall/mall_trade_statistics/update', // 修改
  delete: '/mall/mall_trade_statistics/delete', // 删除
  get: '/mall/mall_trade_statistics/get', // 单条查询
  list: '/mall/mall_trade_statistics/list', // 列表查询
  page: '/mall/mall_trade_statistics/page', // 分页查询
}

export interface MallTradeStatisticsRequest {
  id: number; // 编号，主键自增
  time: string; // 统计日期
  order_create_count: number; // 创建订单数
  order_pay_count: number; // 支付订单商品数
  order_pay_price: number; // 总支付金额，单位：分
  after_sale_count: number; // 退款订单数
  after_sale_refund_price: number; // 总退款金额，单位：分
  brokerage_settlement_price: number; // 佣金金额（已结算），单位：分
  wallet_pay_price: number; // 总支付金额（余额），单位：分
  recharge_pay_count: number; // 充值订单数
  recharge_pay_price: number; // 充值金额，单位：分
  recharge_refund_count: number; // 充值退款订单数
  recharge_refund_price: number; // 充值退款金额，单位：分
  }

export interface MallTradeStatisticsResponse {
  id: number; // 编号，主键自增
  time: string; // 统计日期
  order_create_count: number; // 创建订单数
  order_pay_count: number; // 支付订单商品数
  order_pay_price: number; // 总支付金额，单位：分
  after_sale_count: number; // 退款订单数
  after_sale_refund_price: number; // 总退款金额，单位：分
  brokerage_settlement_price: number; // 佣金金额（已结算），单位：分
  wallet_pay_price: number; // 总支付金额（余额），单位：分
  recharge_pay_count: number; // 充值订单数
  recharge_pay_price: number; // 充值金额，单位：分
  recharge_refund_count: number; // 充值退款订单数
  recharge_refund_price: number; // 充值退款金额，单位：分
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallTradeStatisticsQueryCondition extends PaginatedRequest {
  
}

export const createMallTradeStatistics = (mall_trade_statistics: MallTradeStatisticsRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_trade_statistics);
}

export const updateMallTradeStatistics = (mall_trade_statistics: MallTradeStatisticsRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_trade_statistics);
}

export const deleteMallTradeStatistics = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallTradeStatistics = (id: number): Promise<MallTradeStatisticsResponse> => {
  return api.get<MallTradeStatisticsResponse>(`${apis.get}/${id}`);
}

export const listMallTradeStatistics = (): Promise<Array<MallTradeStatisticsResponse>> => {
  return api.get<Array<MallTradeStatisticsResponse>>(apis.list);
}

export const pageMallTradeStatistics = (condition: MallTradeStatisticsQueryCondition): Promise<PaginatedResponse<MallTradeStatisticsResponse>> => {
  return api.get<PaginatedResponse<MallTradeStatisticsResponse>>(apis.page, condition);
}
