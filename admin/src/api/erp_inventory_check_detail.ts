import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';
import { ErpProductResponse } from './erp_product';

const apis = {
  create: '/erp/erp_inventory_check_detail/create', // 新增
  update: '/erp/erp_inventory_check_detail/update', // 修改
  delete: '/erp/erp_inventory_check_detail/delete', // 删除
  get: '/erp/erp_inventory_check_detail/get', // 单条查询
  list: '/erp/erp_inventory_check_detail/list', // 列表查询
  page: '/erp/erp_inventory_check_detail/page', // 分页查询
}

export interface ErpInventoryCheckDetailRequest {
  id?: number; // ID
  warehouse_id: number; // 仓库ID
  product_id: number; // 产品ID
  checked_quantity: number; // 盘点数量
  remarks?: string; // 备注

  product?: ErpProductResponse;
}

export interface ErpInventoryCheckDetailResponse {
  id: number; // ID
  order_id: number; // 盘点订单ID
  warehouse_id: number; // 仓库ID
  product_id: number; // 产品ID
  checked_quantity: number; // 盘点数量
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
}

export interface ErpInventoryCheckDetailBaseResponse {
  id: number; // ID
  order_id: number; // 盘点订单ID
  warehouse_id: number; // 仓库ID
  product_id: number; // 产品ID
  checked_quantity: number; // 盘点数量
  remarks: string; // 备注

  product?: ErpProductResponse;
}

export interface ErpInventoryCheckDetailQueryCondition extends PaginatedRequest {

}

export const createErpInventoryCheckDetail = (erp_inventory_check_detail: ErpInventoryCheckDetailRequest): Promise<number> => {
  return api.post<number>(apis.create, erp_inventory_check_detail);
}

export const updateErpInventoryCheckDetail = (erp_inventory_check_detail: ErpInventoryCheckDetailRequest): Promise<void> => {
  return api.post<void>(apis.update, erp_inventory_check_detail);
}

export const deleteErpInventoryCheckDetail = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getErpInventoryCheckDetail = (id: number): Promise<ErpInventoryCheckDetailResponse> => {
  return api.get<ErpInventoryCheckDetailResponse>(`${apis.get}/${id}`);
}

export const listErpInventoryCheckDetail = (): Promise<Array<ErpInventoryCheckDetailResponse>> => {
  return api.get<Array<ErpInventoryCheckDetailResponse>>(apis.list);
}

export const pageErpInventoryCheckDetail = (condition: ErpInventoryCheckDetailQueryCondition): Promise<PaginatedResponse<ErpInventoryCheckDetailResponse>> => {
  return api.get<PaginatedResponse<ErpInventoryCheckDetailResponse>>(apis.page, condition);
}
