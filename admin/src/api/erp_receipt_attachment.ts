import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/erp_receipt_attachment/create', // 新增
  update: '/erp/erp_receipt_attachment/update', // 修改
  delete: '/erp/erp_receipt_attachment/delete', // 删除
  get: '/erp/erp_receipt_attachment/get', // 单条查询
  list: '/erp/erp_receipt_attachment/list', // 列表查询
  page: '/erp/erp_receipt_attachment/page', // 分页查询
}

export interface ErpReceiptAttachmentRequest {
  id: number; // 附件ID
  receipt_id: number; // 收款ID
  file_id: number; // 文件ID
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
}

export interface ErpReceiptAttachmentResponse {
  id: number; // 附件ID
  receipt_id: number; // 收款ID
  file_id: number; // 文件ID
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
}

export interface ErpReceiptAttachmentQueryCondition extends PaginatedRequest {

}

export const createErpReceiptAttachment = (erp_receipt_attachment: ErpReceiptAttachmentRequest): Promise<number> => {
  return api.post<number>(apis.create, erp_receipt_attachment);
}

export const updateErpReceiptAttachment = (erp_receipt_attachment: ErpReceiptAttachmentRequest): Promise<void> => {
  return api.post<void>(apis.update, erp_receipt_attachment);
}

export const deleteErpReceiptAttachment = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getErpReceiptAttachment = (id: number): Promise<ErpReceiptAttachmentResponse> => {
  return api.get<ErpReceiptAttachmentResponse>(`${apis.get}/${id}`);
}

export const listErpReceiptAttachment = (): Promise<Array<ErpReceiptAttachmentResponse>> => {
  return api.get<Array<ErpReceiptAttachmentResponse>>(apis.list);
}

export const pageErpReceiptAttachment = (condition: ErpReceiptAttachmentQueryCondition): Promise<PaginatedResponse<ErpReceiptAttachmentResponse>> => {
  return api.get<PaginatedResponse<ErpReceiptAttachmentResponse>>(apis.page, condition);
}
