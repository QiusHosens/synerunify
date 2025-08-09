import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/mall/mall_trade_config/create', // 新增
  update: '/mall/mall_trade_config/update', // 修改
  delete: '/mall/mall_trade_config/delete', // 删除
  get: '/mall/mall_trade_config/get', // 单条查询
  list: '/mall/mall_trade_config/list', // 列表查询
  page: '/mall/mall_trade_config/page', // 分页查询
}

export interface MallTradeConfigRequest {
  id: number; // 自增主键
  after_sale_refund_reasons: string; // 售后退款理由
  after_sale_return_reasons: string; // 售后退货理由
  delivery_express_free_enabled: boolean; // 是否启用全场包邮
  delivery_express_free_price: number; // 全场包邮的最小金额，单位：分
  delivery_pick_up_enabled: boolean; // 是否开启自提
  brokerage_enabled: boolean; // 是否启用分佣
  brokerage_enabled_condition: number; // 分佣模式：1-人人分销 2-指定分销
  brokerage_bind_mode: number; // 分销关系绑定模式: 1-没有推广人，2-新用户, 3-扫码覆盖
  brokerage_poster_urls: string; // 分销海报图地址数组
  brokerage_first_percent: number; // 一级返佣比例
  brokerage_second_percent: number; // 二级返佣比例
  brokerage_withdraw_min_price: number; // 用户提现最低金额
  brokerage_withdraw_fee_percent: number; // 提现手续费百分比
  brokerage_frozen_days: number; // 佣金冻结时间(天)
  brokerage_withdraw_types: string; // 提现方式：1-钱包；2-银行卡；3-微信；4-支付宝
  }

export interface MallTradeConfigResponse {
  id: number; // 自增主键
  after_sale_refund_reasons: string; // 售后退款理由
  after_sale_return_reasons: string; // 售后退货理由
  delivery_express_free_enabled: boolean; // 是否启用全场包邮
  delivery_express_free_price: number; // 全场包邮的最小金额，单位：分
  delivery_pick_up_enabled: boolean; // 是否开启自提
  brokerage_enabled: boolean; // 是否启用分佣
  brokerage_enabled_condition: number; // 分佣模式：1-人人分销 2-指定分销
  brokerage_bind_mode: number; // 分销关系绑定模式: 1-没有推广人，2-新用户, 3-扫码覆盖
  brokerage_poster_urls: string; // 分销海报图地址数组
  brokerage_first_percent: number; // 一级返佣比例
  brokerage_second_percent: number; // 二级返佣比例
  brokerage_withdraw_min_price: number; // 用户提现最低金额
  brokerage_withdraw_fee_percent: number; // 提现手续费百分比
  brokerage_frozen_days: number; // 佣金冻结时间(天)
  brokerage_withdraw_types: string; // 提现方式：1-钱包；2-银行卡；3-微信；4-支付宝
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallTradeConfigQueryCondition extends PaginatedRequest {
  
}

export const createMallTradeConfig = (mall_trade_config: MallTradeConfigRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_trade_config);
}

export const updateMallTradeConfig = (mall_trade_config: MallTradeConfigRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_trade_config);
}

export const deleteMallTradeConfig = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallTradeConfig = (id: number): Promise<MallTradeConfigResponse> => {
  return api.get<MallTradeConfigResponse>(`${apis.get}/${id}`);
}

export const listMallTradeConfig = (): Promise<Array<MallTradeConfigResponse>> => {
  return api.get<Array<MallTradeConfigResponse>>(apis.list);
}

export const pageMallTradeConfig = (condition: MallTradeConfigQueryCondition): Promise<PaginatedResponse<MallTradeConfigResponse>> => {
  return api.get<PaginatedResponse<MallTradeConfigResponse>>(apis.page, condition);
}
