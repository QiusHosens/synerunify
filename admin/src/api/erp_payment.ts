import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/erp_payment/create', // 新增
  update: '/erp/erp_payment/update', // 修改
  delete: '/erp/erp_payment/delete', // 删除
  get: '/erp/erp_payment/get', // 单条查询
  list: '/erp/erp_payment/list', // 列表查询
  page: '/erp/erp_payment/page', // 分页查询
}

export interface ErpPaymentRequest {
  id: number; // 付款ID
  purchase_order_id: number; // 采购订单ID
  supplier_id: number; // 供应商ID
  user_id: number; // 关联用户ID
  settlement_account_id: number; // 结算账户ID
  amount: number; // 付款金额
  discount_amount: number; // 优惠金额
  payment_date: string; // 付款日期
  payment_method: string; // 付款方式 (如 bank_transfer, cash, credit)
  description: string; // 描述
  payment_status: number; // 状态 (0=pending, 1=completed, 2=cancelled)
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
}

export interface ErpPaymentResponse {
  id: number; // 付款ID
  purchase_order_id: number; // 采购订单ID
  supplier_id: number; // 供应商ID
  user_id: number; // 关联用户ID
  settlement_account_id: number; // 结算账户ID
  amount: number; // 付款金额
  discount_amount: number; // 优惠金额
  payment_date: string; // 付款日期
  payment_method: string; // 付款方式 (如 bank_transfer, cash, credit)
  description: string; // 描述
  payment_status: number; // 状态 (0=pending, 1=completed, 2=cancelled)
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
}

export interface ErpPaymentQueryCondition extends PaginatedRequest {

}

export const createErpPayment = (erp_payment: ErpPaymentRequest): Promise<number> => {
  return api.post<number>(apis.create, erp_payment);
}

export const updateErpPayment = (erp_payment: ErpPaymentRequest): Promise<void> => {
  return api.post<void>(apis.update, erp_payment);
}

export const deleteErpPayment = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getErpPayment = (id: number): Promise<ErpPaymentResponse> => {
  return api.get<ErpPaymentResponse>(`${apis.get}/${id}`);
}

export const listErpPayment = (): Promise<Array<ErpPaymentResponse>> => {
  return api.get<Array<ErpPaymentResponse>>(apis.list);
}

export const pageErpPayment = (condition: ErpPaymentQueryCondition): Promise<PaginatedResponse<ErpPaymentResponse>> => {
  return api.get<PaginatedResponse<ErpPaymentResponse>>(apis.page, condition);
}
