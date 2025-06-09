import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp_payment_attachment/create', // 新增
  update: '/erp_payment_attachment/update', // 修改
  delete: '/erp_payment_attachment/delete', // 删除
  get: '/erp_payment_attachment/get', // 单条查询
  list: '/erp_payment_attachment/list', // 列表查询
  page: '/erp_payment_attachment/page', // 分页查询
}

export interface ErpPaymentAttachmentRequest {
  id: number; // 附件ID
  payment_id: number; // 付款ID
  file_id: number; // 文件ID
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
}

export interface ErpPaymentAttachmentResponse {
  id: number; // 附件ID
  payment_id: number; // 付款ID
  file_id: number; // 文件ID
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
}

export interface ErpPaymentAttachmentQueryCondition extends PaginatedRequest {

}

export const createErpPaymentAttachment = (erp_payment_attachment: ErpPaymentAttachmentRequest): Promise<number> => {
  return api.post<number>(apis.create, erp_payment_attachment);
}

export const updateErpPaymentAttachment = (erp_payment_attachment: ErpPaymentAttachmentRequest): Promise<void> => {
  return api.post<void>(apis.update, erp_payment_attachment);
}

export const deleteErpPaymentAttachment = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getErpPaymentAttachment = (id: number): Promise<ErpPaymentAttachmentResponse> => {
  return api.get<ErpPaymentAttachmentResponse>(`${apis.get}/${id}`);
}

export const listErpPaymentAttachment = (): Promise<Array<ErpPaymentAttachmentResponse>> => {
  return api.get<Array<ErpPaymentAttachmentResponse>>(apis.list);
}

export const pageErpPaymentAttachment = (condition: ErpPaymentAttachmentQueryCondition): Promise<PaginatedResponse<ErpPaymentAttachmentResponse>> => {
  return api.get<PaginatedResponse<ErpPaymentAttachmentResponse>>(apis.page, condition);
}
