import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { UploadFile } from '@/components/CustomizedFileUpload';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/erp_inventory_transfer_attachment/create', // 新增
  update: '/erp/erp_inventory_transfer_attachment/update', // 修改
  delete: '/erp/erp_inventory_transfer_attachment/delete', // 删除
  get: '/erp/erp_inventory_transfer_attachment/get', // 单条查询
  list: '/erp/erp_inventory_transfer_attachment/list', // 列表查询
  page: '/erp/erp_inventory_transfer_attachment/page', // 分页查询
}

export interface ErpInventoryTransferAttachmentRequest {
  id?: number; // 附件ID
  file_id?: number; // 文件ID
  remarks?: string; // 备注

  file?: UploadFile | null;
}

export interface ErpInventoryTransferAttachmentResponse {
  id: number; // ID
  order_id: number; // 调拨订单ID
  file_id: number; // 文件ID
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
}

export interface ErpInventoryTransferAttachmentBaseResponse {
  id: number; // 附件ID
  file_id: number; // 文件ID
  remarks: string; // 备注

  file_name: string; // 文件名
}

export interface ErpInventoryTransferAttachmentQueryCondition extends PaginatedRequest {

}

export const createErpInventoryTransferAttachment = (erp_inventory_transfer_attachment: ErpInventoryTransferAttachmentRequest): Promise<number> => {
  return api.post<number>(apis.create, erp_inventory_transfer_attachment);
}

export const updateErpInventoryTransferAttachment = (erp_inventory_transfer_attachment: ErpInventoryTransferAttachmentRequest): Promise<void> => {
  return api.post<void>(apis.update, erp_inventory_transfer_attachment);
}

export const deleteErpInventoryTransferAttachment = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getErpInventoryTransferAttachment = (id: number): Promise<ErpInventoryTransferAttachmentResponse> => {
  return api.get<ErpInventoryTransferAttachmentResponse>(`${apis.get}/${id}`);
}

export const listErpInventoryTransferAttachment = (): Promise<Array<ErpInventoryTransferAttachmentResponse>> => {
  return api.get<Array<ErpInventoryTransferAttachmentResponse>>(apis.list);
}

export const pageErpInventoryTransferAttachment = (condition: ErpInventoryTransferAttachmentQueryCondition): Promise<PaginatedResponse<ErpInventoryTransferAttachmentResponse>> => {
  return api.get<PaginatedResponse<ErpInventoryTransferAttachmentResponse>>(apis.page, condition);
}
