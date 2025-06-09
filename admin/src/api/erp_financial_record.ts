import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp_financial_record/create', // 新增
  update: '/erp_financial_record/update', // 修改
  delete: '/erp_financial_record/delete', // 删除
  get: '/erp_financial_record/get', // 单条查询
  list: '/erp_financial_record/list', // 列表查询
  page: '/erp_financial_record/page', // 分页查询
}

export interface ErpFinancialRecordRequest {
  id: number; // 财务记录ID
  record_type: number; // 记录类型 (0=income, 1=expense)
  amount: number; // 金额
  description: string; // 描述
  related_order_id: number; // 关联订单ID
  record_date: string; // 记录日期
  user_id: number; // 用户ID
  department_code: string; // 部门编码
  department_id: number; // 部门ID
}

export interface ErpFinancialRecordResponse {
  id: number; // 财务记录ID
  record_type: number; // 记录类型 (0=income, 1=expense)
  amount: number; // 金额
  description: string; // 描述
  related_order_id: number; // 关联订单ID
  record_date: string; // 记录日期
  user_id: number; // 用户ID
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
}

export interface ErpFinancialRecordQueryCondition extends PaginatedRequest {

}

export const createErpFinancialRecord = (erp_financial_record: ErpFinancialRecordRequest): Promise<number> => {
  return api.post<number>(apis.create, erp_financial_record);
}

export const updateErpFinancialRecord = (erp_financial_record: ErpFinancialRecordRequest): Promise<void> => {
  return api.post<void>(apis.update, erp_financial_record);
}

export const deleteErpFinancialRecord = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getErpFinancialRecord = (id: number): Promise<ErpFinancialRecordResponse> => {
  return api.get<ErpFinancialRecordResponse>(`${apis.get}/${id}`);
}

export const listErpFinancialRecord = (): Promise<Array<ErpFinancialRecordResponse>> => {
  return api.get<Array<ErpFinancialRecordResponse>>(apis.list);
}

export const pageErpFinancialRecord = (condition: ErpFinancialRecordQueryCondition): Promise<PaginatedResponse<ErpFinancialRecordResponse>> => {
  return api.get<PaginatedResponse<ErpFinancialRecordResponse>>(apis.page, condition);
}
