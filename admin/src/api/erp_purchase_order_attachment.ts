import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp_purchase_order_attachment/create', // 新增
  update: '/erp_purchase_order_attachment/update', // 修改
  delete: '/erp_purchase_order_attachment/delete', // 删除
  get: '/erp_purchase_order_attachment/get', // 单条查询
  list: '/erp_purchase_order_attachment/list', // 列表查询
  page: '/erp_purchase_order_attachment/page', // 分页查询
}

export interface ErpPurchaseOrderAttachmentRequest {
  id: number; // 附件ID
  purchase_id: number; // 采购订单ID
  file_id: number; // 文件ID
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
}

export interface ErpPurchaseOrderAttachmentResponse {
  id: number; // 附件ID
  purchase_id: number; // 采购订单ID
  file_id: number; // 文件ID
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
}

export interface ErpPurchaseOrderAttachmentQueryCondition extends PaginatedRequest {

}

export const createErpPurchaseOrderAttachment = (erp_purchase_order_attachment: ErpPurchaseOrderAttachmentRequest): Promise<number> => {
  return api.post<number>(apis.create, erp_purchase_order_attachment);
}

export const updateErpPurchaseOrderAttachment = (erp_purchase_order_attachment: ErpPurchaseOrderAttachmentRequest): Promise<void> => {
  return api.post<void>(apis.update, erp_purchase_order_attachment);
}

export const deleteErpPurchaseOrderAttachment = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getErpPurchaseOrderAttachment = (id: number): Promise<ErpPurchaseOrderAttachmentResponse> => {
  return api.get<ErpPurchaseOrderAttachmentResponse>(`${apis.get}/${id}`);
}

export const listErpPurchaseOrderAttachment = (): Promise<Array<ErpPurchaseOrderAttachmentResponse>> => {
  return api.get<Array<ErpPurchaseOrderAttachmentResponse>>(apis.list);
}

export const pageErpPurchaseOrderAttachment = (condition: ErpPurchaseOrderAttachmentQueryCondition): Promise<PaginatedResponse<ErpPurchaseOrderAttachmentResponse>> => {
  return api.get<PaginatedResponse<ErpPurchaseOrderAttachmentResponse>>(apis.page, condition);
}
