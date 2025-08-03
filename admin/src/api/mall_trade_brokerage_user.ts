import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/mall_trade_brokerage_user/create', // 新增
  update: '/erp/mall_trade_brokerage_user/update', // 修改
  delete: '/erp/mall_trade_brokerage_user/delete', // 删除
  get: '/erp/mall_trade_brokerage_user/get', // 单条查询
  list: '/erp/mall_trade_brokerage_user/list', // 列表查询
  page: '/erp/mall_trade_brokerage_user/page', // 分页查询
}

export interface MallTradeBrokerageUserRequest {
  id: number; // 用户编号
  bind_user_id: number; // 推广员编号
  bind_user_time: string; // 推广员绑定时间
  brokerage_enabled: boolean; // 是否成为推广员
  brokerage_time: string; // 成为分销员时间
  brokerage_price: number; // 可用佣金
  frozen_price: number; // 冻结佣金
  }

export interface MallTradeBrokerageUserResponse {
  id: number; // 用户编号
  bind_user_id: number; // 推广员编号
  bind_user_time: string; // 推广员绑定时间
  brokerage_enabled: boolean; // 是否成为推广员
  brokerage_time: string; // 成为分销员时间
  brokerage_price: number; // 可用佣金
  frozen_price: number; // 冻结佣金
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallTradeBrokerageUserQueryCondition extends PaginatedRequest {
  
}

export const createMallTradeBrokerageUser = (mall_trade_brokerage_user: MallTradeBrokerageUserRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_trade_brokerage_user);
}

export const updateMallTradeBrokerageUser = (mall_trade_brokerage_user: MallTradeBrokerageUserRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_trade_brokerage_user);
}

export const deleteMallTradeBrokerageUser = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallTradeBrokerageUser = (id: number): Promise<MallTradeBrokerageUserResponse> => {
  return api.get<MallTradeBrokerageUserResponse>(`${apis.get}/${id}`);
}

export const listMallTradeBrokerageUser = (): Promise<Array<MallTradeBrokerageUserResponse>> => {
  return api.get<Array<MallTradeBrokerageUserResponse>>(apis.list);
}

export const pageMallTradeBrokerageUser = (condition: MallTradeBrokerageUserQueryCondition): Promise<PaginatedResponse<MallTradeBrokerageUserResponse>> => {
  return api.get<PaginatedResponse<MallTradeBrokerageUserResponse>>(apis.page, condition);
}
