import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/mall/mall_trade_brokerage_record/create', // 新增
  update: '/mall/mall_trade_brokerage_record/update', // 修改
  delete: '/mall/mall_trade_brokerage_record/delete', // 删除
  get: '/mall/mall_trade_brokerage_record/get', // 单条查询
  list: '/mall/mall_trade_brokerage_record/list', // 列表查询
  page: '/mall/mall_trade_brokerage_record/page', // 分页查询
  enable: '/mall/mall_trade_brokerage_record/enable', // 启用
  disable: '/mall/mall_trade_brokerage_record/disable', // 禁用
}

export interface MallTradeBrokerageRecordRequest {
  id: number; // 编号
  user_id: number; // 用户编号
  biz_id: string; // 业务编号
  biz_type: number; // 业务类型：1-订单，2-提现
  title: string; // 标题
  price: number; // 金额
  total_price: number; // 当前总佣金
  description: string; // 说明
  status: number; // 状态：0-待结算，1-已结算，2-已取消
  frozen_days: number; // 冻结时间（天）
  unfreeze_time: string; // 解冻时间
  source_user_level: number; // 来源用户等级
  source_user_id: number; // 来源用户编号
  }

export interface MallTradeBrokerageRecordResponse {
  id: number; // 编号
  user_id: number; // 用户编号
  biz_id: string; // 业务编号
  biz_type: number; // 业务类型：1-订单，2-提现
  title: string; // 标题
  price: number; // 金额
  total_price: number; // 当前总佣金
  description: string; // 说明
  status: number; // 状态：0-待结算，1-已结算，2-已取消
  frozen_days: number; // 冻结时间（天）
  unfreeze_time: string; // 解冻时间
  source_user_level: number; // 来源用户等级
  source_user_id: number; // 来源用户编号
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallTradeBrokerageRecordQueryCondition extends PaginatedRequest {
  
}

export const createMallTradeBrokerageRecord = (mall_trade_brokerage_record: MallTradeBrokerageRecordRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_trade_brokerage_record);
}

export const updateMallTradeBrokerageRecord = (mall_trade_brokerage_record: MallTradeBrokerageRecordRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_trade_brokerage_record);
}

export const deleteMallTradeBrokerageRecord = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallTradeBrokerageRecord = (id: number): Promise<MallTradeBrokerageRecordResponse> => {
  return api.get<MallTradeBrokerageRecordResponse>(`${apis.get}/${id}`);
}

export const listMallTradeBrokerageRecord = (): Promise<Array<MallTradeBrokerageRecordResponse>> => {
  return api.get<Array<MallTradeBrokerageRecordResponse>>(apis.list);
}

export const pageMallTradeBrokerageRecord = (condition: MallTradeBrokerageRecordQueryCondition): Promise<PaginatedResponse<MallTradeBrokerageRecordResponse>> => {
  return api.get<PaginatedResponse<MallTradeBrokerageRecordResponse>>(apis.page, condition);
}

export const enableMallTradeBrokerageRecord = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableMallTradeBrokerageRecord = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}