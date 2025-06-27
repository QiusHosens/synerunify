import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';
import { ErpInventoryCheckDetailBaseResponse, ErpInventoryCheckDetailRequest } from './erp_inventory_check_detail';
import { ErpInventoryCheckAttachmentBaseResponse, ErpInventoryCheckAttachmentRequest } from './erp_inventory_check_attachment';

const apis = {
  create: '/erp/erp_inventory_check/create', // 新增
  update: '/erp/erp_inventory_check/update', // 修改
  delete: '/erp/erp_inventory_check/delete', // 删除
  get: '/erp/erp_inventory_check/get', // 单条查询
  get_base: '/erp/erp_inventory_check/get_base', // 单条查询
  list: '/erp/erp_inventory_check/list', // 列表查询
  page: '/erp/erp_inventory_check/page', // 分页查询
}

export interface ErpInventoryCheckRequest {
  id?: number; // 盘点记录ID
  check_date: string; // 盘点日期
  remarks: string; // 备注

  details: ErpInventoryCheckDetailRequest[]; // 盘点列表
  attachments: ErpInventoryCheckAttachmentRequest[]; // 盘点附件列表
}

export interface ErpInventoryCheckResponse {
  id: number; // 盘点记录ID
  order_number: number; // 订单编号
  check_date: string; // 盘点日期
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
}

export interface ErpInventoryCheckBaseResponse {
  id: number; // 盘点记录ID
  order_number: number; // 订单编号
  check_date: string; // 盘点日期
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间

  details: ErpInventoryCheckDetailBaseResponse[]; // 盘点列表
  attachments: ErpInventoryCheckAttachmentBaseResponse[]; // 盘点附件列表
}

export interface ErpInventoryCheckQueryCondition extends PaginatedRequest {

}

export const createErpInventoryCheck = (erp_inventory_check: ErpInventoryCheckRequest): Promise<number> => {
  return api.post<number>(apis.create, erp_inventory_check);
}

export const updateErpInventoryCheck = (erp_inventory_check: ErpInventoryCheckRequest): Promise<void> => {
  return api.post<void>(apis.update, erp_inventory_check);
}

export const deleteErpInventoryCheck = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getErpInventoryCheck = (id: number): Promise<ErpInventoryCheckResponse> => {
  return api.get<ErpInventoryCheckResponse>(`${apis.get}/${id}`);
}

export const getBaseErpInventoryCheck = (id: number): Promise<ErpInventoryCheckBaseResponse> => {
  return api.get<ErpInventoryCheckBaseResponse>(`${apis.get_base}/${id}`);
}

export const listErpInventoryCheck = (): Promise<Array<ErpInventoryCheckResponse>> => {
  return api.get<Array<ErpInventoryCheckResponse>>(apis.list);
}

export const pageErpInventoryCheck = (condition: ErpInventoryCheckQueryCondition): Promise<PaginatedResponse<ErpInventoryCheckResponse>> => {
  return api.get<PaginatedResponse<ErpInventoryCheckResponse>>(apis.page, condition);
}
