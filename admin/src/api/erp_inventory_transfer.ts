import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';
import { ErpInventoryTransferDetailBaseResponse, ErpInventoryTransferDetailRequest } from './erp_inventory_transfer_detail';
import { ErpInventoryTransferAttachmentBaseResponse, ErpInventoryTransferAttachmentRequest } from './erp_inventory_transfer_attachment';

const apis = {
  create: '/erp/erp_inventory_transfer/create', // 新增
  update: '/erp/erp_inventory_transfer/update', // 修改
  delete: '/erp/erp_inventory_transfer/delete', // 删除
  get: '/erp/erp_inventory_transfer/get', // 单条查询
  get_base: '/erp/erp_inventory_transfer/get_base', // 单条查询
  list: '/erp/erp_inventory_transfer/list', // 列表查询
  page: '/erp/erp_inventory_transfer/page', // 分页查询
}

export interface ErpInventoryTransferRequest {
  id?: number; // 调拨记录ID
  transfer_date: string; // 调拨日期
  remarks: string; // 备注

  details: ErpInventoryTransferDetailRequest[]; // 调拨列表
  attachments: ErpInventoryTransferAttachmentRequest[]; // 调拨附件列表
}

export interface ErpInventoryTransferResponse {
  id: number; // 调拨记录ID
  order_number: number; // 订单编号
  transfer_date: string; // 调拨日期
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
}

export interface ErpInventoryTransferBaseResponse {
  id: number; // 调拨记录ID
  order_number: number; // 订单编号
  transfer_date: string; // 调拨日期
  remarks: string; // 备注

  details: ErpInventoryTransferDetailBaseResponse[]; // 调拨列表
  attachments: ErpInventoryTransferAttachmentBaseResponse[]; // 调拨附件列表
}

export interface ErpInventoryTransferQueryCondition extends PaginatedRequest {

}

export const createErpInventoryTransfer = (erp_inventory_transfer: ErpInventoryTransferRequest): Promise<number> => {
  return api.post<number>(apis.create, erp_inventory_transfer);
}

export const updateErpInventoryTransfer = (erp_inventory_transfer: ErpInventoryTransferRequest): Promise<void> => {
  return api.post<void>(apis.update, erp_inventory_transfer);
}

export const deleteErpInventoryTransfer = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getErpInventoryTransfer = (id: number): Promise<ErpInventoryTransferResponse> => {
  return api.get<ErpInventoryTransferResponse>(`${apis.get}/${id}`);
}

export const getBaseErpInventoryTransfer = (id: number): Promise<ErpInventoryTransferBaseResponse> => {
  return api.get<ErpInventoryTransferBaseResponse>(`${apis.get_base}/${id}`);
}

export const listErpInventoryTransfer = (): Promise<Array<ErpInventoryTransferResponse>> => {
  return api.get<Array<ErpInventoryTransferResponse>>(apis.list);
}

export const pageErpInventoryTransfer = (condition: ErpInventoryTransferQueryCondition): Promise<PaginatedResponse<ErpInventoryTransferResponse>> => {
  return api.get<PaginatedResponse<ErpInventoryTransferResponse>>(apis.page, condition);
}
