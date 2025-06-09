import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp_inventory_check/create', // 新增
  update: '/erp_inventory_check/update', // 修改
  delete: '/erp_inventory_check/delete', // 删除
  get: '/erp_inventory_check/get', // 单条查询
  list: '/erp_inventory_check/list', // 列表查询
  page: '/erp_inventory_check/page', // 分页查询
}

export interface ErpInventoryCheckRequest {
  id: number; // 盘点记录ID
  warehouse_id: number; // 仓库ID
  product_id: number; // 产品ID
  checked_quantity: number; // 盘点数量
  check_date: string; // 盘点日期
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
}

export interface ErpInventoryCheckResponse {
  id: number; // 盘点记录ID
  warehouse_id: number; // 仓库ID
  product_id: number; // 产品ID
  checked_quantity: number; // 盘点数量
  check_date: string; // 盘点日期
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
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

export const listErpInventoryCheck = (): Promise<Array<ErpInventoryCheckResponse>> => {
  return api.get<Array<ErpInventoryCheckResponse>>(apis.list);
}

export const pageErpInventoryCheck = (condition: ErpInventoryCheckQueryCondition): Promise<PaginatedResponse<ErpInventoryCheckResponse>> => {
  return api.get<PaginatedResponse<ErpInventoryCheckResponse>>(apis.page, condition);
}
