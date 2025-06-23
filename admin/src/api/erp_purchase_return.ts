import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/erp_purchase_return/create', // 新增
  update: '/erp/erp_purchase_return/update', // 修改
  delete: '/erp/erp_purchase_return/delete', // 删除
  get: '/erp/erp_purchase_return/get', // 单条查询
  list: '/erp/erp_purchase_return/list', // 列表查询
  page: '/erp/erp_purchase_return/page', // 分页查询
}

export interface ErpPurchaseReturnRequest {
  id: number; // 退货ID
  order_number: number; // 订单编号
  purchase_order_id: number; // 采购订单ID
  supplier_id: number; // 供应商ID
  return_date: string; // 退货日期
  total_amount: number; // 总金额
  order_status: number; // 订单状态
  discount_rate: number; // 优惠率（百分比，1000表示10.00%）
  settlement_account_id: number; // 结算账户ID
  deposit: number; // 定金
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  }

export interface ErpPurchaseReturnResponse {
  id: number; // 退货ID
  order_number: number; // 订单编号
  purchase_order_id: number; // 采购订单ID
  supplier_id: number; // 供应商ID
  return_date: string; // 退货日期
  total_amount: number; // 总金额
  order_status: number; // 订单状态
  discount_rate: number; // 优惠率（百分比，1000表示10.00%）
  settlement_account_id: number; // 结算账户ID
  deposit: number; // 定金
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface ErpPurchaseReturnQueryCondition extends PaginatedRequest {
  
}

export const createErpPurchaseReturn = (erp_purchase_return: ErpPurchaseReturnRequest): Promise<number> => {
  return api.post<number>(apis.create, erp_purchase_return);
}

export const updateErpPurchaseReturn = (erp_purchase_return: ErpPurchaseReturnRequest): Promise<void> => {
  return api.post<void>(apis.update, erp_purchase_return);
}

export const deleteErpPurchaseReturn = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getErpPurchaseReturn = (id: number): Promise<ErpPurchaseReturnResponse> => {
  return api.get<ErpPurchaseReturnResponse>(`${apis.get}/${id}`);
}

export const listErpPurchaseReturn = (): Promise<Array<ErpPurchaseReturnResponse>> => {
  return api.get<Array<ErpPurchaseReturnResponse>>(apis.list);
}

export const pageErpPurchaseReturn = (condition: ErpPurchaseReturnQueryCondition): Promise<PaginatedResponse<ErpPurchaseReturnResponse>> => {
  return api.get<PaginatedResponse<ErpPurchaseReturnResponse>>(apis.page, condition);
}
