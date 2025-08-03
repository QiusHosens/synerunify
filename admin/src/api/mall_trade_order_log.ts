import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/mall_trade_order_log/create', // 新增
  update: '/erp/mall_trade_order_log/update', // 修改
  delete: '/erp/mall_trade_order_log/delete', // 删除
  get: '/erp/mall_trade_order_log/get', // 单条查询
  list: '/erp/mall_trade_order_log/list', // 列表查询
  page: '/erp/mall_trade_order_log/page', // 分页查询
}

export interface MallTradeOrderLogRequest {
  id: number; // 日志主键
  user_id: number; // 用户编号
  user_type: number; // 用户类型
  order_id: number; // 订单号
  before_status: number; // 操作前状态
  after_status: number; // 操作后状态
  operate_type: number; // 操作类型
  content: string; // 操作内容
  }

export interface MallTradeOrderLogResponse {
  id: number; // 日志主键
  user_id: number; // 用户编号
  user_type: number; // 用户类型
  order_id: number; // 订单号
  before_status: number; // 操作前状态
  after_status: number; // 操作后状态
  operate_type: number; // 操作类型
  content: string; // 操作内容
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallTradeOrderLogQueryCondition extends PaginatedRequest {
  
}

export const createMallTradeOrderLog = (mall_trade_order_log: MallTradeOrderLogRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_trade_order_log);
}

export const updateMallTradeOrderLog = (mall_trade_order_log: MallTradeOrderLogRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_trade_order_log);
}

export const deleteMallTradeOrderLog = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallTradeOrderLog = (id: number): Promise<MallTradeOrderLogResponse> => {
  return api.get<MallTradeOrderLogResponse>(`${apis.get}/${id}`);
}

export const listMallTradeOrderLog = (): Promise<Array<MallTradeOrderLogResponse>> => {
  return api.get<Array<MallTradeOrderLogResponse>>(apis.list);
}

export const pageMallTradeOrderLog = (condition: MallTradeOrderLogQueryCondition): Promise<PaginatedResponse<MallTradeOrderLogResponse>> => {
  return api.get<PaginatedResponse<MallTradeOrderLogResponse>>(apis.page, condition);
}
