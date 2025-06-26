import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/erp_product_inventory/create', // 新增
  update: '/erp/erp_product_inventory/update', // 修改
  delete: '/erp/erp_product_inventory/delete', // 删除
  get: '/erp/erp_product_inventory/get', // 单条查询
  list: '/erp/erp_product_inventory/list', // 列表查询
  page: '/erp/erp_product_inventory/page', // 分页查询
}

export interface ErpProductInventoryRequest {
  id: number; // 产品库存ID
  product_id: number; // 产品ID
  warehouse_id: number; // 仓库ID
  stock_quantity: number; // 库存数量
}

export interface ErpProductInventoryResponse {
  id: number; // 产品库存ID
  product_id: number; // 产品ID
  warehouse_id: number; // 仓库ID
  stock_quantity: number; // 库存数量
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间

  product_name: string;
  warehouse_name: string;
  unit_name: string;
}

export interface ErpProductInventoryQueryCondition extends PaginatedRequest {

}

export const createErpProductInventory = (erp_product_inventory: ErpProductInventoryRequest): Promise<number> => {
  return api.post<number>(apis.create, erp_product_inventory);
}

export const updateErpProductInventory = (erp_product_inventory: ErpProductInventoryRequest): Promise<void> => {
  return api.post<void>(apis.update, erp_product_inventory);
}

export const deleteErpProductInventory = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getErpProductInventory = (id: number): Promise<ErpProductInventoryResponse> => {
  return api.get<ErpProductInventoryResponse>(`${apis.get}/${id}`);
}

export const listErpProductInventory = (): Promise<Array<ErpProductInventoryResponse>> => {
  return api.get<Array<ErpProductInventoryResponse>>(apis.list);
}

export const pageErpProductInventory = (condition: ErpProductInventoryQueryCondition): Promise<PaginatedResponse<ErpProductInventoryResponse>> => {
  return api.get<PaginatedResponse<ErpProductInventoryResponse>>(apis.page, condition);
}
