import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/erp_outbound_order/create', // 新增
  update: '/erp/erp_outbound_order/update', // 修改
  delete: '/erp/erp_outbound_order/delete', // 删除
  get: '/erp/erp_outbound_order/get', // 单条查询
  list: '/erp/erp_outbound_order/list', // 列表查询
  page: '/erp/erp_outbound_order/page', // 分页查询
}

export interface ErpOutboundOrderRequest {
  id: number; // 出库订单ID
  order_number: number; // 订单编号
  sale_id: number; // 销售订单ID
  customer_id: number; // 客户ID
  user_id: number; // 用户ID
  outbound_date: string; // 出库日期
  remarks: string; // 备注
  discount_rate: number; // 优惠率（百分比，1000表示10.00%）
  other_cost: number; // 其他费用
  settlement_account_id: number; // 结算账户ID
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  }

export interface ErpOutboundOrderResponse {
  id: number; // 出库订单ID
  order_number: number; // 订单编号
  sale_id: number; // 销售订单ID
  customer_id: number; // 客户ID
  user_id: number; // 用户ID
  outbound_date: string; // 出库日期
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

export interface ErpOutboundOrderQueryCondition extends PaginatedRequest {
  
}

export const createErpOutboundOrder = (erp_outbound_order: ErpOutboundOrderRequest): Promise<number> => {
  return api.post<number>(apis.create, erp_outbound_order);
}

export const updateErpOutboundOrder = (erp_outbound_order: ErpOutboundOrderRequest): Promise<void> => {
  return api.post<void>(apis.update, erp_outbound_order);
}

export const deleteErpOutboundOrder = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getErpOutboundOrder = (id: number): Promise<ErpOutboundOrderResponse> => {
  return api.get<ErpOutboundOrderResponse>(`${apis.get}/${id}`);
}

export const listErpOutboundOrder = (): Promise<Array<ErpOutboundOrderResponse>> => {
  return api.get<Array<ErpOutboundOrderResponse>>(apis.list);
}

export const pageErpOutboundOrder = (condition: ErpOutboundOrderQueryCondition): Promise<PaginatedResponse<ErpOutboundOrderResponse>> => {
  return api.get<PaginatedResponse<ErpOutboundOrderResponse>>(apis.page, condition);
}
