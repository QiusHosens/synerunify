import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/erp_inventory_record/create', // 新增
  update: '/erp/erp_inventory_record/update', // 修改
  delete: '/erp/erp_inventory_record/delete', // 删除
  get: '/erp/erp_inventory_record/get', // 单条查询
  list: '/erp/erp_inventory_record/list', // 列表查询
  page: '/erp/erp_inventory_record/page', // 分页查询
}

export interface ErpInventoryRecordRequest {
  id: number; // 库存记录ID
  product_id: number; // 产品ID
  warehouse_id: number; // 仓库ID
  quantity: number; // 数量
  record_type: number; // 记录类型 (0=in, 1=out)
  record_date: string; // 记录日期
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
}

export interface ErpInventoryRecordResponse {
  id: number; // 库存记录ID
  product_id: number; // 产品ID
  warehouse_id: number; // 仓库ID
  quantity: number; // 数量
  record_type: number; // 记录类型 (0=in, 1=out)
  record_date: string; // 记录日期
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间

  product_name: string;
  warehouse_name: string;
  unit_name: string;
}

export interface ErpInventoryRecordQueryCondition extends PaginatedRequest {

}

export const createErpInventoryRecord = (erp_inventory_record: ErpInventoryRecordRequest): Promise<number> => {
  return api.post<number>(apis.create, erp_inventory_record);
}

export const updateErpInventoryRecord = (erp_inventory_record: ErpInventoryRecordRequest): Promise<void> => {
  return api.post<void>(apis.update, erp_inventory_record);
}

export const deleteErpInventoryRecord = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getErpInventoryRecord = (id: number): Promise<ErpInventoryRecordResponse> => {
  return api.get<ErpInventoryRecordResponse>(`${apis.get}/${id}`);
}

export const listErpInventoryRecord = (): Promise<Array<ErpInventoryRecordResponse>> => {
  return api.get<Array<ErpInventoryRecordResponse>>(apis.list);
}

export const pageErpInventoryRecord = (condition: ErpInventoryRecordQueryCondition): Promise<PaginatedResponse<ErpInventoryRecordResponse>> => {
  return api.get<PaginatedResponse<ErpInventoryRecordResponse>>(apis.page, condition);
}
