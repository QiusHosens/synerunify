import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/mall/mall_trade_brokerage_withdraw/create', // 新增
  update: '/mall/mall_trade_brokerage_withdraw/update', // 修改
  delete: '/mall/mall_trade_brokerage_withdraw/delete', // 删除
  get: '/mall/mall_trade_brokerage_withdraw/get', // 单条查询
  list: '/mall/mall_trade_brokerage_withdraw/list', // 列表查询
  page: '/mall/mall_trade_brokerage_withdraw/page', // 分页查询
  enable: '/mall/mall_trade_brokerage_withdraw/enable', // 启用
  disable: '/mall/mall_trade_brokerage_withdraw/disable', // 禁用
}

export interface MallTradeBrokerageWithdrawRequest {
  id: number; // 编号
  user_id: number; // 用户编号
  price: number; // 提现金额
  fee_price: number; // 提现手续费
  total_price: number; // 当前总佣金
  type: number; // 提现类型
  user_name: string; // 真实姓名
  user_account: string; // 账号
  bank_name: string; // 银行名称
  bank_address: string; // 开户地址
  qr_code_url: string; // 收款码
  status: number; // 状态：0-审核中，10-审核通过 20-审核不通过；11 - 提现成功；21-提现失败
  audit_reason: string; // 审核驳回原因
  audit_time: string; // 审核时间
  remark: string; // 备注
  pay_transfer_id: number; // 转账订单编号
  transfer_channel_code: string; // 转账渠道
  transfer_time: string; // 转账支付时间
  transfer_error_msg: string; // 转账错误提示
  }

export interface MallTradeBrokerageWithdrawResponse {
  id: number; // 编号
  user_id: number; // 用户编号
  price: number; // 提现金额
  fee_price: number; // 提现手续费
  total_price: number; // 当前总佣金
  type: number; // 提现类型
  user_name: string; // 真实姓名
  user_account: string; // 账号
  bank_name: string; // 银行名称
  bank_address: string; // 开户地址
  qr_code_url: string; // 收款码
  status: number; // 状态：0-审核中，10-审核通过 20-审核不通过；11 - 提现成功；21-提现失败
  audit_reason: string; // 审核驳回原因
  audit_time: string; // 审核时间
  remark: string; // 备注
  pay_transfer_id: number; // 转账订单编号
  transfer_channel_code: string; // 转账渠道
  transfer_time: string; // 转账支付时间
  transfer_error_msg: string; // 转账错误提示
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallTradeBrokerageWithdrawQueryCondition extends PaginatedRequest {
  
}

export const createMallTradeBrokerageWithdraw = (mall_trade_brokerage_withdraw: MallTradeBrokerageWithdrawRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_trade_brokerage_withdraw);
}

export const updateMallTradeBrokerageWithdraw = (mall_trade_brokerage_withdraw: MallTradeBrokerageWithdrawRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_trade_brokerage_withdraw);
}

export const deleteMallTradeBrokerageWithdraw = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallTradeBrokerageWithdraw = (id: number): Promise<MallTradeBrokerageWithdrawResponse> => {
  return api.get<MallTradeBrokerageWithdrawResponse>(`${apis.get}/${id}`);
}

export const listMallTradeBrokerageWithdraw = (): Promise<Array<MallTradeBrokerageWithdrawResponse>> => {
  return api.get<Array<MallTradeBrokerageWithdrawResponse>>(apis.list);
}

export const pageMallTradeBrokerageWithdraw = (condition: MallTradeBrokerageWithdrawQueryCondition): Promise<PaginatedResponse<MallTradeBrokerageWithdrawResponse>> => {
  return api.get<PaginatedResponse<MallTradeBrokerageWithdrawResponse>>(apis.page, condition);
}

export const enableMallTradeBrokerageWithdraw = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableMallTradeBrokerageWithdraw = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}