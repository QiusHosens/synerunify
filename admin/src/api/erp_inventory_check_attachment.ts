import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { UploadFile } from '@/components/CustomizedFileUpload';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/erp_inventory_check_attachment/create', // 新增
  update: '/erp/erp_inventory_check_attachment/update', // 修改
  delete: '/erp/erp_inventory_check_attachment/delete', // 删除
  get: '/erp/erp_inventory_check_attachment/get', // 单条查询
  list: '/erp/erp_inventory_check_attachment/list', // 列表查询
  page: '/erp/erp_inventory_check_attachment/page', // 分页查询
}

export interface ErpInventoryCheckAttachmentRequest {
  id?: number; // 附件ID
  file_id?: number; // 文件ID
  remarks?: string; // 备注

  file?: UploadFile | null;
}

export interface ErpInventoryCheckAttachmentResponse {
  id: number; // ID
  order_id: number; // 盘点订单ID
  file_id: number; // 文件ID
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
}

export interface ErpInventoryCheckAttachmentBaseResponse {
  id: number; // 附件ID
  file_id: number; // 文件ID
  remarks: string; // 备注

  file_name: string; // 文件名
}

export interface ErpInventoryCheckAttachmentQueryCondition extends PaginatedRequest {

}

export const createErpInventoryCheckAttachment = (erp_inventory_check_attachment: ErpInventoryCheckAttachmentRequest): Promise<number> => {
  return api.post<number>(apis.create, erp_inventory_check_attachment);
}

export const updateErpInventoryCheckAttachment = (erp_inventory_check_attachment: ErpInventoryCheckAttachmentRequest): Promise<void> => {
  return api.post<void>(apis.update, erp_inventory_check_attachment);
}

export const deleteErpInventoryCheckAttachment = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getErpInventoryCheckAttachment = (id: number): Promise<ErpInventoryCheckAttachmentResponse> => {
  return api.get<ErpInventoryCheckAttachmentResponse>(`${apis.get}/${id}`);
}

export const listErpInventoryCheckAttachment = (): Promise<Array<ErpInventoryCheckAttachmentResponse>> => {
  return api.get<Array<ErpInventoryCheckAttachmentResponse>>(apis.list);
}

export const pageErpInventoryCheckAttachment = (condition: ErpInventoryCheckAttachmentQueryCondition): Promise<PaginatedResponse<ErpInventoryCheckAttachmentResponse>> => {
  return api.get<PaginatedResponse<ErpInventoryCheckAttachmentResponse>>(apis.page, condition);
}
