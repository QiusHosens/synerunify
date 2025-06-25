import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';
import { ErpOutboundOrderDetailBaseResponse, ErpOutboundOrderDetailRequest } from './erp_outbound_order_detail';
import { ErpOutboundOrderAttachmentBaseResponse, ErpOutboundOrderAttachmentRequest } from './erp_outbound_order_attachment';

const apis = {
  create_sale: '/erp/erp_outbound_order/create_sale', // 新增
  create_other: '/erp/erp_outbound_order/create_other', // 新增
  update_sale: '/erp/erp_outbound_order/update_sale', // 修改
  update_other: '/erp/erp_outbound_order/update_other', // 修改
  delete: '/erp/erp_outbound_order/delete', // 删除
  get: '/erp/erp_outbound_order/get', // 单条查询
  get_base_sales: '/erp/erp_outbound_order/get_base_sales', // 单条查询
  get_base_other: '/erp/erp_outbound_order/get_base_other', // 单条查询
  get_info_sales: '/erp/erp_outbound_order/get_info_sales', // 单条查询
  list: '/erp/erp_outbound_order/list', // 列表查询
  page_sales: '/erp/erp_outbound_order/page_sales', // 分页查询
  page_other: '/erp/erp_outbound_order/page_other', // 分页查询
}

export interface ErpOutboundOrderRequest {
  id?: number; // 出库订单ID
  sale_id?: number; // 销售订单ID
  customer_id?: number; // 客户ID
  outbound_date: string; // 出库日期
  remarks: string; // 备注
  discount_rate: number; // 优惠率（百分比，1000表示10.00%）
  other_cost: number; // 其他费用
  settlement_account_id?: number; // 结算账户ID

  details?: ErpOutboundOrderDetailRequest[]; // 入库采购产品仓库列表
  attachments: ErpOutboundOrderAttachmentRequest[]; // 入库附件列表
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

  sales_order_number: number; // 销售订单编号
  customer_name: string; // 客户名
  settlement_account_name: string; // 结算账户

  details?: ErpOutboundOrderDetailBaseResponse[]; // 入库采购产品仓库列表
  attachments: ErpOutboundOrderAttachmentBaseResponse[]; // 入库附件列表
}

export interface ErpOutboundOrderQueryCondition extends PaginatedRequest {

}

export const createSaleErpOutboundOrder = (erp_outbound_order: ErpOutboundOrderRequest): Promise<number> => {
  return api.post<number>(apis.create_sale, erp_outbound_order);
}

export const createOtherErpOutboundOrder = (erp_outbound_order: ErpOutboundOrderRequest): Promise<number> => {
  return api.post<number>(apis.create_other, erp_outbound_order);
}

export const updateSaleErpOutboundOrder = (erp_outbound_order: ErpOutboundOrderRequest): Promise<void> => {
  return api.post<void>(apis.update_sale, erp_outbound_order);
}

export const updateOtherErpOutboundOrder = (erp_outbound_order: ErpOutboundOrderRequest): Promise<void> => {
  return api.post<void>(apis.update_other, erp_outbound_order);
}

export const deleteErpOutboundOrder = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getErpOutboundOrder = (id: number): Promise<ErpOutboundOrderResponse> => {
  return api.get<ErpOutboundOrderResponse>(`${apis.get}/${id}`);
}

export const getBaseSaleErpOutboundOrder = (id: number): Promise<ErpOutboundOrderResponse> => {
  return api.get<ErpOutboundOrderResponse>(`${apis.get_base_sales}/${id}`);
}

export const getBaseOtherErpOutboundOrder = (id: number): Promise<ErpOutboundOrderResponse> => {
  return api.get<ErpOutboundOrderResponse>(`${apis.get_base_other}/${id}`);
}

export const getInfoSaleErpOutboundOrder = (id: number): Promise<ErpOutboundOrderResponse> => {
  return api.get<ErpOutboundOrderResponse>(`${apis.get_info_sales}/${id}`);
}

export const listErpOutboundOrder = (): Promise<Array<ErpOutboundOrderResponse>> => {
  return api.get<Array<ErpOutboundOrderResponse>>(apis.list);
}

export const pageSaleErpOutboundOrder = (condition: ErpOutboundOrderQueryCondition): Promise<PaginatedResponse<ErpOutboundOrderResponse>> => {
  return api.get<PaginatedResponse<ErpOutboundOrderResponse>>(apis.page_sales, condition);
}

export const pageOtherErpOutboundOrder = (condition: ErpOutboundOrderQueryCondition): Promise<PaginatedResponse<ErpOutboundOrderResponse>> => {
  return api.get<PaginatedResponse<ErpOutboundOrderResponse>>(apis.page_other, condition);
}