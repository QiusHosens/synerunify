import { PaginatedRequest, PaginatedResponse } from "@/base/page";
import { api } from "@/utils/request";
import { ErpPaymentDetailBaseResponse, ErpPaymentDetailRequest } from "./erp_payment_detail";
import { ErpPaymentAttachmentBaseResponse, ErpPaymentAttachmentRequest } from "./erp_payment_attachment";

const apis = {
  create: "/erp/erp_payment/create", // 新增
  update: "/erp/erp_payment/update", // 修改
  delete: "/erp/erp_payment/delete", // 删除
  get: "/erp/erp_payment/get", // 单条查询
  get_base: "/erp/erp_payment/get_base", // 单条查询
  get_info: "/erp/erp_payment/get_info", // 单条查询
  list: "/erp/erp_payment/list", // 列表查询
  page: "/erp/erp_payment/page", // 分页查询
};

export interface ErpPaymentRequest {
  id?: number; // 付款ID
  supplier_id: number; // 供应商ID
  settlement_account_id: number; // 结算账户ID
  amount: number; // 付款金额
  discount_amount: number; // 优惠金额
  payment_date: string; // 付款日期
  payment_method: string; // 付款方式 (如 bank_transfer, cash, credit)
  remarks: string; // 备注

  details: ErpPaymentDetailRequest[]; // 付款列表
  attachments: ErpPaymentAttachmentRequest[]; // 付款附件列表
}

export interface ErpPaymentResponse {
  id: number; // 付款ID
  order_number: number; // 订单编号
  supplier_id: number; // 供应商ID
  user_id: number; // 关联用户ID
  settlement_account_id: number; // 结算账户ID
  amount: number; // 付款金额
  discount_amount: number; // 优惠金额
  payment_date: string; // 付款日期
  payment_method: string; // 付款方式 (如 bank_transfer, cash, credit)
  payment_status: number; // 状态 (0=pending, 1=completed, 2=cancelled)
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间

  supplier_name: string; // 供应商名
  settlement_account_name: string; // 结算账户名

  details: ErpPaymentDetailBaseResponse[]; // 付款列表
  attachments: ErpPaymentAttachmentBaseResponse[]; // 付款附件列表
}

export interface ErpPaymentQueryCondition extends PaginatedRequest {}

export const createErpPayment = (
  erp_payment: ErpPaymentRequest
): Promise<number> => {
  return api.post<number>(apis.create, erp_payment);
};

export const updateErpPayment = (
  erp_payment: ErpPaymentRequest
): Promise<void> => {
  return api.post<void>(apis.update, erp_payment);
};

export const deleteErpPayment = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
};

export const getErpPayment = (id: number): Promise<ErpPaymentResponse> => {
  return api.get<ErpPaymentResponse>(`${apis.get}/${id}`);
};

export const getBaseErpPayment = (id: number): Promise<ErpPaymentResponse> => {
  return api.get<ErpPaymentResponse>(`${apis.get_base}/${id}`);
};

export const getInfoErpPayment = (id: number): Promise<ErpPaymentResponse> => {
  return api.get<ErpPaymentResponse>(`${apis.get_info}/${id}`);
};

export const listErpPayment = (): Promise<Array<ErpPaymentResponse>> => {
  return api.get<Array<ErpPaymentResponse>>(apis.list);
};

export const pageErpPayment = (
  condition: ErpPaymentQueryCondition
): Promise<PaginatedResponse<ErpPaymentResponse>> => {
  return api.get<PaginatedResponse<ErpPaymentResponse>>(apis.page, condition);
};
