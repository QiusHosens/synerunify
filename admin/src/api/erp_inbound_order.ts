import { PaginatedRequest, PaginatedResponse } from "@/base/page";
import { api } from "@/utils/request";
import { ErpInboundOrderDetailRequest } from "./erp_inbound_order_detail";
import { ErpInboundOrderAttachmentRequest } from "./erp_inbound_order_attachment";

const apis = {
  create_purchase: "/erp/erp_inbound_order/create_purchase", // 新增采购入库
  create_other: "/erp/erp_inbound_order/create_other", // 新增其他入库
  update_purchase: "/erp/erp_inbound_order/update_purchase", // 修改采购入库
  update_other: "/erp/erp_inbound_order/update_other", // 修改其他入库
  delete: "/erp/erp_inbound_order/delete", // 删除
  get: "/erp/erp_inbound_order/get", // 单条查询
  list: "/erp/erp_inbound_order/list", // 列表查询
  page_purchase: "/erp/erp_inbound_order/page_purchase", // 分页查询采购入库
  page_other: "/erp/erp_inbound_order/page_other", // 分页查询其他入库
};

export interface ErpInboundOrderRequest {
  id?: number; // 入库订单ID
  purchase_id?: number; // 采购订单ID
  supplier_id?: number; // 供应商ID
  inbound_date: string; // 入库日期
  remarks: string; // 备注
  discount_rate: number; // 优惠率（百分比，1000表示10.00%）
  other_cost: number; // 其他费用
  settlement_account_id?: number; // 结算账户ID

  details: ErpInboundOrderDetailRequest[]; // 入库采购产品仓库列表
  attachments: ErpInboundOrderAttachmentRequest[]; // 入库附件列表
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

  purchase_order_number: number; // 采购订单编号
  supplier_name: string; // 供应商
  settlement_account_name: string; // 结算账户
}

export interface ErpInboundOrderQueryCondition extends PaginatedRequest {}

export const createPurchaseErpInboundOrder = (
  erp_inbound_order: ErpInboundOrderRequest
): Promise<number> => {
  return api.post<number>(apis.create_purchase, erp_inbound_order);
};

export const createOtherErpInboundOrder = (
  erp_inbound_order: ErpInboundOrderRequest
): Promise<number> => {
  return api.post<number>(apis.create_other, erp_inbound_order);
};

export const updatePurchaseErpInboundOrder = (
  erp_inbound_order: ErpInboundOrderRequest
): Promise<void> => {
  return api.post<void>(apis.update_purchase, erp_inbound_order);
};

export const updateOtherErpInboundOrder = (
  erp_inbound_order: ErpInboundOrderRequest
): Promise<void> => {
  return api.post<void>(apis.update_other, erp_inbound_order);
};

export const deleteErpInboundOrder = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
};

export const getErpInboundOrder = (
  id: number
): Promise<ErpInboundOrderResponse> => {
  return api.get<ErpInboundOrderResponse>(`${apis.get}/${id}`);
};

export const listErpInboundOrder = (): Promise<
  Array<ErpInboundOrderResponse>
> => {
  return api.get<Array<ErpInboundOrderResponse>>(apis.list);
};

export const pagePurchaseErpInboundOrder = (
  condition: ErpInboundOrderQueryCondition
): Promise<PaginatedResponse<ErpInboundOrderResponse>> => {
  return api.get<PaginatedResponse<ErpInboundOrderResponse>>(
    apis.page_purchase,
    condition
  );
};

export const pageOtherErpInboundOrder = (
  condition: ErpInboundOrderQueryCondition
): Promise<PaginatedResponse<ErpInboundOrderResponse>> => {
  return api.get<PaginatedResponse<ErpInboundOrderResponse>>(
    apis.page_other,
    condition
  );
};
