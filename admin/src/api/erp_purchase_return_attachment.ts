import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/erp_purchase_return_attachment/create', // 新增
  update: '/erp/erp_purchase_return_attachment/update', // 修改
  delete: '/erp/erp_purchase_return_attachment/delete', // 删除
  get: '/erp/erp_purchase_return_attachment/get', // 单条查询
  list: '/erp/erp_purchase_return_attachment/list', // 列表查询
  page: '/erp/erp_purchase_return_attachment/page', // 分页查询
}

export interface ErpPurchaseReturnAttachmentRequest {
  id: number; // 附件ID
  order_id: number; // 退货订单ID
  file_id: number; // 文件ID
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  }

export interface ErpPurchaseReturnAttachmentResponse {
  id: number; // 附件ID
  order_id: number; // 退货订单ID
  file_id: number; // 文件ID
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface ErpPurchaseReturnAttachmentQueryCondition extends PaginatedRequest {
  
}

export const createErpPurchaseReturnAttachment = (erp_purchase_return_attachment: ErpPurchaseReturnAttachmentRequest): Promise<number> => {
  return api.post<number>(apis.create, erp_purchase_return_attachment);
}

export const updateErpPurchaseReturnAttachment = (erp_purchase_return_attachment: ErpPurchaseReturnAttachmentRequest): Promise<void> => {
  return api.post<void>(apis.update, erp_purchase_return_attachment);
}

export const deleteErpPurchaseReturnAttachment = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getErpPurchaseReturnAttachment = (id: number): Promise<ErpPurchaseReturnAttachmentResponse> => {
  return api.get<ErpPurchaseReturnAttachmentResponse>(`${apis.get}/${id}`);
}

export const listErpPurchaseReturnAttachment = (): Promise<Array<ErpPurchaseReturnAttachmentResponse>> => {
  return api.get<Array<ErpPurchaseReturnAttachmentResponse>>(apis.list);
}

export const pageErpPurchaseReturnAttachment = (condition: ErpPurchaseReturnAttachmentQueryCondition): Promise<PaginatedResponse<ErpPurchaseReturnAttachmentResponse>> => {
  return api.get<PaginatedResponse<ErpPurchaseReturnAttachmentResponse>>(apis.page, condition);
}
