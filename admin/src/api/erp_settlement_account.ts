import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp_settlement_account/create', // 新增
  update: '/erp_settlement_account/update', // 修改
  delete: '/erp_settlement_account/delete', // 删除
  get: '/erp_settlement_account/get', // 单条查询
  list: '/erp_settlement_account/list', // 列表查询
  page: '/erp_settlement_account/page', // 分页查询
  enable: '/erp_settlement_account/enable', // 启用
  disable: '/erp_settlement_account/disable', // 禁用
}

export interface ErpSettlementAccountRequest {
  id: number; // 账户ID
  account_name: string; // 账户名称
  bank_name: string; // 开户行
  bank_account: string; // 银行账号
  status: number; // 状态
  sort_order: number; // 排序
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
}

export interface ErpSettlementAccountResponse {
  id: number; // 账户ID
  account_name: string; // 账户名称
  bank_name: string; // 开户行
  bank_account: string; // 银行账号
  status: number; // 状态
  sort_order: number; // 排序
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
}

export interface ErpSettlementAccountQueryCondition extends PaginatedRequest {

}

export const createErpSettlementAccount = (erp_settlement_account: ErpSettlementAccountRequest): Promise<number> => {
  return api.post<number>(apis.create, erp_settlement_account);
}

export const updateErpSettlementAccount = (erp_settlement_account: ErpSettlementAccountRequest): Promise<void> => {
  return api.post<void>(apis.update, erp_settlement_account);
}

export const deleteErpSettlementAccount = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getErpSettlementAccount = (id: number): Promise<ErpSettlementAccountResponse> => {
  return api.get<ErpSettlementAccountResponse>(`${apis.get}/${id}`);
}

export const listErpSettlementAccount = (): Promise<Array<ErpSettlementAccountResponse>> => {
  return api.get<Array<ErpSettlementAccountResponse>>(apis.list);
}

export const pageErpSettlementAccount = (condition: ErpSettlementAccountQueryCondition): Promise<PaginatedResponse<ErpSettlementAccountResponse>> => {
  return api.get<PaginatedResponse<ErpSettlementAccountResponse>>(apis.page, condition);
}

export const enableErpSettlementAccount = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableErpSettlementAccount = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}