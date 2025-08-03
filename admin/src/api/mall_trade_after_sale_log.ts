import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/mall_trade_after_sale_log/create', // 新增
  update: '/erp/mall_trade_after_sale_log/update', // 修改
  delete: '/erp/mall_trade_after_sale_log/delete', // 删除
  get: '/erp/mall_trade_after_sale_log/get', // 单条查询
  list: '/erp/mall_trade_after_sale_log/list', // 列表查询
  page: '/erp/mall_trade_after_sale_log/page', // 分页查询
}

export interface MallTradeAfterSaleLogRequest {
  id: number; // 编号
  user_id: number; // 用户编号
  user_type: number; // 用户类型
  after_sale_id: number; // 售后编号
  before_status: number; // 售后状态（之前）
  after_status: number; // 售后状态（之后）
  operate_type: number; // 操作类型
  content: string; // 操作明细
  }

export interface MallTradeAfterSaleLogResponse {
  id: number; // 编号
  user_id: number; // 用户编号
  user_type: number; // 用户类型
  after_sale_id: number; // 售后编号
  before_status: number; // 售后状态（之前）
  after_status: number; // 售后状态（之后）
  operate_type: number; // 操作类型
  content: string; // 操作明细
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallTradeAfterSaleLogQueryCondition extends PaginatedRequest {
  
}

export const createMallTradeAfterSaleLog = (mall_trade_after_sale_log: MallTradeAfterSaleLogRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_trade_after_sale_log);
}

export const updateMallTradeAfterSaleLog = (mall_trade_after_sale_log: MallTradeAfterSaleLogRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_trade_after_sale_log);
}

export const deleteMallTradeAfterSaleLog = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallTradeAfterSaleLog = (id: number): Promise<MallTradeAfterSaleLogResponse> => {
  return api.get<MallTradeAfterSaleLogResponse>(`${apis.get}/${id}`);
}

export const listMallTradeAfterSaleLog = (): Promise<Array<MallTradeAfterSaleLogResponse>> => {
  return api.get<Array<MallTradeAfterSaleLogResponse>>(apis.list);
}

export const pageMallTradeAfterSaleLog = (condition: MallTradeAfterSaleLogQueryCondition): Promise<PaginatedResponse<MallTradeAfterSaleLogResponse>> => {
  return api.get<PaginatedResponse<MallTradeAfterSaleLogResponse>>(apis.page, condition);
}
