import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/erp_inbound_order/create', // 新增
  update: '/erp/erp_inbound_order/update', // 修改
  delete: '/erp/erp_inbound_order/delete', // 删除
  get: '/erp/erp_inbound_order/get', // 单条查询
  list: '/erp/erp_inbound_order/list', // 列表查询
  page: '/erp/erp_inbound_order/page', // 分页查询
}

export interface ErpInboundOrderRequest {
  id: number; // 入库订单ID
  order_number: number; // 订单编号
  purchase_id: number; // 采购订单ID
  supplier_id: number; // 供应商ID
  user_id: number; // 用户ID
  inbound_date: string; // 入库日期
  remarks: string; // 备注
  discount_rate: number; // 优惠率（百分比，1000表示10.00%）
  other_cost: number; // 其他费用
  settlement_account_id: number; // 结算账户ID
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  }

export interface ErpInboundOrderResponse {
  id: number; // 入库订单ID
  order_number: number; // 订单编号
  purchase_id: number; // 采购订单ID
  supplier_id: number; // 供应商ID
  user_id: number; // 用户ID
  inbound_date: string; // 入库日期
  remarks: string; // 备注
  discount_rate: number; // 优惠率（百分比，1000表示10.00%）
  other_cost: number; // 其他费用
  settlement_account_id: number; // 结算账户ID
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface ErpInboundOrderQueryCondition extends PaginatedRequest {
  
}

export const createErpInboundOrder = (erp_inbound_order: ErpInboundOrderRequest): Promise<number> => {
  return api.post<number>(apis.create, erp_inbound_order);
}

export const updateErpInboundOrder = (erp_inbound_order: ErpInboundOrderRequest): Promise<void> => {
  return api.post<void>(apis.update, erp_inbound_order);
}

export const deleteErpInboundOrder = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getErpInboundOrder = (id: number): Promise<ErpInboundOrderResponse> => {
  return api.get<ErpInboundOrderResponse>(`${apis.get}/${id}`);
}

export const listErpInboundOrder = (): Promise<Array<ErpInboundOrderResponse>> => {
  return api.get<Array<ErpInboundOrderResponse>>(apis.list);
}

export const pageErpInboundOrder = (condition: ErpInboundOrderQueryCondition): Promise<PaginatedResponse<ErpInboundOrderResponse>> => {
  return api.get<PaginatedResponse<ErpInboundOrderResponse>>(apis.page, condition);
}
