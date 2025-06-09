import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/erp_warehouse/create', // 新增
  update: '/erp/erp_warehouse/update', // 修改
  delete: '/erp/erp_warehouse/delete', // 删除
  get: '/erp/erp_warehouse/get', // 单条查询
  list: '/erp/erp_warehouse/list', // 列表查询
  page: '/erp/erp_warehouse/page', // 分页查询
  enable: '/erp/erp_warehouse/enable', // 启用
  disable: '/erp/erp_warehouse/disable', // 禁用
}

export interface ErpWarehouseRequest {
  id: number; // 仓库ID
  name: string; // 仓库名称
  location: string; // 仓库位置
  status: number; // 状态
  sort: number; // 排序
  storage_fee: number; // 仓储费
  handling_fee: number; // 搬运费
  manager: string; // 负责人
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
}

export interface ErpWarehouseResponse {
  id: number; // 仓库ID
  name: string; // 仓库名称
  location: string; // 仓库位置
  status: number; // 状态
  sort: number; // 排序
  storage_fee: number; // 仓储费
  handling_fee: number; // 搬运费
  manager: string; // 负责人
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
}

export interface ErpWarehouseQueryCondition extends PaginatedRequest {

}

export const createErpWarehouse = (erp_warehouse: ErpWarehouseRequest): Promise<number> => {
  return api.post<number>(apis.create, erp_warehouse);
}

export const updateErpWarehouse = (erp_warehouse: ErpWarehouseRequest): Promise<void> => {
  return api.post<void>(apis.update, erp_warehouse);
}

export const deleteErpWarehouse = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getErpWarehouse = (id: number): Promise<ErpWarehouseResponse> => {
  return api.get<ErpWarehouseResponse>(`${apis.get}/${id}`);
}

export const listErpWarehouse = (): Promise<Array<ErpWarehouseResponse>> => {
  return api.get<Array<ErpWarehouseResponse>>(apis.list);
}

export const pageErpWarehouse = (condition: ErpWarehouseQueryCondition): Promise<PaginatedResponse<ErpWarehouseResponse>> => {
  return api.get<PaginatedResponse<ErpWarehouseResponse>>(apis.page, condition);
}

export const enableErpWarehouse = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableErpWarehouse = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}