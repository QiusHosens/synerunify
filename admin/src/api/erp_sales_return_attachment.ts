import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/erp_sales_return_attachment/create', // 新增
  update: '/erp/erp_sales_return_attachment/update', // 修改
  delete: '/erp/erp_sales_return_attachment/delete', // 删除
  get: '/erp/erp_sales_return_attachment/get', // 单条查询
  list: '/erp/erp_sales_return_attachment/list', // 列表查询
  page: '/erp/erp_sales_return_attachment/page', // 分页查询
}

export interface ErpSalesReturnAttachmentRequest {
  id: number; // 附件ID
  order_id: number; // 退货订单ID
  file_id: number; // 文件ID
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  }

export interface ErpSalesReturnAttachmentResponse {
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

export interface ErpSalesReturnAttachmentQueryCondition extends PaginatedRequest {
  
}

export const createErpSalesReturnAttachment = (erp_sales_return_attachment: ErpSalesReturnAttachmentRequest): Promise<number> => {
  return api.post<number>(apis.create, erp_sales_return_attachment);
}

export const updateErpSalesReturnAttachment = (erp_sales_return_attachment: ErpSalesReturnAttachmentRequest): Promise<void> => {
  return api.post<void>(apis.update, erp_sales_return_attachment);
}

export const deleteErpSalesReturnAttachment = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getErpSalesReturnAttachment = (id: number): Promise<ErpSalesReturnAttachmentResponse> => {
  return api.get<ErpSalesReturnAttachmentResponse>(`${apis.get}/${id}`);
}

export const listErpSalesReturnAttachment = (): Promise<Array<ErpSalesReturnAttachmentResponse>> => {
  return api.get<Array<ErpSalesReturnAttachmentResponse>>(apis.list);
}

export const pageErpSalesReturnAttachment = (condition: ErpSalesReturnAttachmentQueryCondition): Promise<PaginatedResponse<ErpSalesReturnAttachmentResponse>> => {
  return api.get<PaginatedResponse<ErpSalesReturnAttachmentResponse>>(apis.page, condition);
}
