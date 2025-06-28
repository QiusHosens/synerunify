import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';
import { ErpPurchaseOrderDetailBaseResponse, ErpPurchaseOrderDetailInfoResponse, ErpPurchaseOrderDetailRequest } from './erp_purchase_order_detail';
import { ErpPurchaseOrderAttachmentBaseResponse, ErpPurchaseOrderAttachmentInfoResponse, ErpPurchaseOrderAttachmentRequest } from './erp_purchase_order_attachment';

const apis = {
  create: '/erp/erp_purchase_order/create', // 新增
  update: '/erp/erp_purchase_order/update', // 修改
  delete: '/erp/erp_purchase_order/delete', // 删除
  get: '/erp/erp_purchase_order/get', // 单条查询
  list: '/erp/erp_purchase_order/list', // 列表查询
  list_supplier: '/erp/erp_purchase_order/list_supplier', // 列表查询
  page: '/erp/erp_purchase_order/page', // 分页查询
  get_detail: '/erp/erp_purchase_order/get_detail', // 单条查询订单详情
  get_info: '/erp/erp_purchase_order/get_info', // 单条查询订单所有信息
  received: '/erp/erp_purchase_order/received', // 已收货
  cancel: '/erp/erp_purchase_order/cancel', // 取消订单
  page_received: '/erp/erp_purchase_order/page_received', // 分页查询待入库
}

export interface ErpPurchaseOrderRequest {
  id?: number; // 采购订单ID
  supplier_id: number; // 供应商ID
  purchase_date: string; // 采购日期
  total_amount: number; // 总金额
  discount_rate?: number; // 优惠率（百分比，1000表示10.00%）
  settlement_account_id?: number; // 结算账户ID
  deposit?: number; // 定金
  remarks?: string; // 备注

  purchase_products: ErpPurchaseOrderDetailRequest[]; // 采购的产品列表
  purchase_attachment: ErpPurchaseOrderAttachmentRequest[]; // 采购的附件列表
}

export interface ErpPurchaseOrderResponse {
  id: number; // 采购订单ID
  order_number: string; // 订单编号
  supplier_id: number; // 供应商ID
  user_id: number; // 用户ID
  purchase_date: string; // 采购日期
  total_amount: number; // 总金额
  order_status: number; // 订单状态 (0=pending, 1=completed, 2=cancelled)
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

  supplier_name: string; // 供应商名
  settlement_account_name: string; // 结算账户名
}

export interface ErpPurchaseOrderBaseResponse {
  id: number; // 采购订单ID
  order_number: string; // 订单编号
  supplier_id: number; // 供应商ID
  user_id: number; // 用户ID
  purchase_date: string; // 采购日期
  total_amount: number; // 总金额
  order_status: number; // 订单状态 (0=pending, 1=completed, 2=cancelled)
  discount_rate: number; // 优惠率（百分比，1000表示10.00%）
  settlement_account_id: number; // 结算账户ID
  deposit: number; // 定金
  remarks: string; // 备注

  purchase_products: ErpPurchaseOrderDetailBaseResponse[]; // 采购的产品列表
  purchase_attachment: ErpPurchaseOrderAttachmentBaseResponse[]; // 采购的附件列表
}

export interface ErpPurchaseOrderInfoResponse {
  id: number; // 采购订单ID
  order_number: string; // 订单编号
  supplier_id: number; // 供应商ID
  user_id: number; // 用户ID
  purchase_date: string; // 采购日期
  total_amount: number; // 总金额
  order_status: number; // 订单状态 (0=pending, 1=completed, 2=cancelled)
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

  supplier_name: string; // 供应商名
  settlement_account_name: string; // 结算账户名
  purchase_products: ErpPurchaseOrderDetailInfoResponse[]; // 采购的产品列表
  purchase_attachment: ErpPurchaseOrderAttachmentInfoResponse[]; // 采购的附件列表
}

export interface ErpPurchaseOrderQueryCondition extends PaginatedRequest {

}

export const createErpPurchaseOrder = (erp_purchase_order: ErpPurchaseOrderRequest): Promise<number> => {
  return api.post<number>(apis.create, erp_purchase_order);
}

export const updateErpPurchaseOrder = (erp_purchase_order: ErpPurchaseOrderRequest): Promise<void> => {
  return api.post<void>(apis.update, erp_purchase_order);
}

export const deleteErpPurchaseOrder = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getErpPurchaseOrder = (id: number): Promise<ErpPurchaseOrderResponse> => {
  return api.get<ErpPurchaseOrderResponse>(`${apis.get}/${id}`);
}

export const listErpPurchaseOrder = (): Promise<Array<ErpPurchaseOrderResponse>> => {
  return api.get<Array<ErpPurchaseOrderResponse>>(apis.list);
}

export const pageErpPurchaseOrder = (condition: ErpPurchaseOrderQueryCondition): Promise<PaginatedResponse<ErpPurchaseOrderResponse>> => {
  return api.get<PaginatedResponse<ErpPurchaseOrderResponse>>(apis.page, condition);
}

export const getErpPurchaseOrderBase = (id: number): Promise<ErpPurchaseOrderBaseResponse> => {
  return api.get<ErpPurchaseOrderBaseResponse>(`${apis.get_detail}/${id}`);
}

export const getErpPurchaseOrderInfo = (id: number): Promise<ErpPurchaseOrderInfoResponse> => {
  return api.get<ErpPurchaseOrderInfoResponse>(`${apis.get_info}/${id}`);
}

export const receivedErpPurchaseOrder = (id: number): Promise<void> => {
  return api.post<void>(`${apis.received}/${id}`);
}

export const cancelErpPurchaseOrder = (id: number): Promise<void> => {
  return api.post<void>(`${apis.cancel}/${id}`);
}

export const pageReceivedErpPurchaseOrder = (condition: ErpPurchaseOrderQueryCondition): Promise<PaginatedResponse<ErpPurchaseOrderResponse>> => {
  return api.get<PaginatedResponse<ErpPurchaseOrderResponse>>(apis.page_received, condition);
}

export const listSupplierErpPurchaseOrder = (supplier_id: number): Promise<Array<ErpPurchaseOrderResponse>> => {
  return api.get<Array<ErpPurchaseOrderResponse>>(`${apis.list_supplier}/${supplier_id}`);
}
