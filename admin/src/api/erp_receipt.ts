import { PaginatedRequest, PaginatedResponse } from "@/base/page";
import { api } from "@/utils/request";
import { ErpReceiptDetailBaseResponse, ErpReceiptDetailRequest } from "./erp_receipt_detail";
import { ErpReceiptAttachmentBaseResponse, ErpReceiptAttachmentRequest } from "./erp_receipt_attachment";

const apis = {
  create: "/erp/erp_receipt/create", // 新增
  update: "/erp/erp_receipt/update", // 修改
  delete: "/erp/erp_receipt/delete", // 删除
  get: "/erp/erp_receipt/get", // 单条查询
  get_base: "/erp/erp_receipt/get_base", // 单条查询
  get_info: "/erp/erp_receipt/get_info", // 单条查询
  list: "/erp/erp_receipt/list", // 列表查询
  page: "/erp/erp_receipt/page", // 分页查询
};

export interface ErpReceiptRequest {
  id?: number; // 收款ID
  customer_id: number; // 客户ID
  settlement_account_id: number; // 结算账户ID
  amount: number; // 收款金额
  discount_amount: number; // 优惠金额
  receipt_date: string; // 收款日期
  payment_method: string; // 收款方式 (如 bank_transfer, cash, credit)
  remarks: string; // 备注

  details: ErpReceiptDetailRequest[]; // 收款列表
  attachments: ErpReceiptAttachmentRequest[]; // 收款附件列表
}

export interface ErpReceiptResponse {
  id: number; // 收款ID
  order_number: number; // 订单编号
  customer_id: number; // 客户ID
  user_id: number; // 关联用户ID
  settlement_account_id: number; // 结算账户ID
  amount: number; // 收款金额
  discount_amount: number; // 优惠金额
  receipt_date: string; // 收款日期
  payment_method: string; // 收款方式 (如 bank_transfer, cash, credit)
  receipt_status: number; // 状态 (0=pending, 1=completed, 2=cancelled)
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间

  customer_name: string; // 客户名
  settlement_account_name: string; // 结算账户名

  details: ErpReceiptDetailBaseResponse[]; // 收款列表
  attachments: ErpReceiptAttachmentBaseResponse[]; // 收款附件列表
}

export interface ErpReceiptQueryCondition extends PaginatedRequest {}

export const createErpReceipt = (
  erp_receipt: ErpReceiptRequest
): Promise<number> => {
  return api.post<number>(apis.create, erp_receipt);
};

export const updateErpReceipt = (
  erp_receipt: ErpReceiptRequest
): Promise<void> => {
  return api.post<void>(apis.update, erp_receipt);
};

export const deleteErpReceipt = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
};

export const getErpReceipt = (id: number): Promise<ErpReceiptResponse> => {
  return api.get<ErpReceiptResponse>(`${apis.get}/${id}`);
};

export const getBaseErpReceipt = (id: number): Promise<ErpReceiptResponse> => {
  return api.get<ErpReceiptResponse>(`${apis.get_base}/${id}`);
};

export const getInfoErpReceipt = (id: number): Promise<ErpReceiptResponse> => {
  return api.get<ErpReceiptResponse>(`${apis.get_info}/${id}`);
};

export const listErpReceipt = (): Promise<Array<ErpReceiptResponse>> => {
  return api.get<Array<ErpReceiptResponse>>(apis.list);
};

export const pageErpReceipt = (
  condition: ErpReceiptQueryCondition
): Promise<PaginatedResponse<ErpReceiptResponse>> => {
  return api.get<PaginatedResponse<ErpReceiptResponse>>(apis.page, condition);
};
