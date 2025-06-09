import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp_sales_order_attachment/create', // 新增
  update: '/erp_sales_order_attachment/update', // 修改
  delete: '/erp_sales_order_attachment/delete', // 删除
  get: '/erp_sales_order_attachment/get', // 单条查询
  list: '/erp_sales_order_attachment/list', // 列表查询
  page: '/erp_sales_order_attachment/page', // 分页查询
}

export interface ErpSalesOrderAttachmentRequest {
  id: number; // 附件ID
  order_id: number; // 销售订单ID
  file_id: number; // 文件ID
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
}

export interface ErpSalesOrderAttachmentResponse {
  id: number; // 附件ID
  order_id: number; // 销售订单ID
  file_id: number; // 文件ID
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
}

export interface ErpSalesOrderAttachmentQueryCondition extends PaginatedRequest {

}

export const createErpSalesOrderAttachment = (erp_sales_order_attachment: ErpSalesOrderAttachmentRequest): Promise<number> => {
  return api.post<number>(apis.create, erp_sales_order_attachment);
}

export const updateErpSalesOrderAttachment = (erp_sales_order_attachment: ErpSalesOrderAttachmentRequest): Promise<void> => {
  return api.post<void>(apis.update, erp_sales_order_attachment);
}

export const deleteErpSalesOrderAttachment = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getErpSalesOrderAttachment = (id: number): Promise<ErpSalesOrderAttachmentResponse> => {
  return api.get<ErpSalesOrderAttachmentResponse>(`${apis.get}/${id}`);
}

export const listErpSalesOrderAttachment = (): Promise<Array<ErpSalesOrderAttachmentResponse>> => {
  return api.get<Array<ErpSalesOrderAttachmentResponse>>(apis.list);
}

export const pageErpSalesOrderAttachment = (condition: ErpSalesOrderAttachmentQueryCondition): Promise<PaginatedResponse<ErpSalesOrderAttachmentResponse>> => {
  return api.get<PaginatedResponse<ErpSalesOrderAttachmentResponse>>(apis.page, condition);
}
