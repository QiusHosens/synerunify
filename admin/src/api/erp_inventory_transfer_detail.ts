import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';
import { ErpProductResponse } from './erp_product';

const apis = {
  create: '/erp/erp_inventory_transfer_detail/create', // 新增
  update: '/erp/erp_inventory_transfer_detail/update', // 修改
  delete: '/erp/erp_inventory_transfer_detail/delete', // 删除
  get: '/erp/erp_inventory_transfer_detail/get', // 单条查询
  list: '/erp/erp_inventory_transfer_detail/list', // 列表查询
  page: '/erp/erp_inventory_transfer_detail/page', // 分页查询
}

export interface ErpInventoryTransferDetailRequest {
  id?: number; // ID
  from_warehouse_id: number; // 调出仓库ID
  to_warehouse_id: number; // 调入仓库ID
  product_id: number; // 产品ID
  quantity: number; // 调拨数量
  remarks: string; // 备注

  product?: ErpProductResponse;
}

export interface ErpInventoryTransferDetailResponse {
  id: number; // ID
  order_id: number; // 调拨订单ID
  from_warehouse_id: number; // 调出仓库ID
  to_warehouse_id: number; // 调入仓库ID
  product_id: number; // 产品ID
  quantity: number; // 调拨数量
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
}

export interface ErpInventoryTransferDetailBaseResponse {
  id: number; // ID
  order_id: number; // 调拨订单ID
  from_warehouse_id: number; // 调出仓库ID
  to_warehouse_id: number; // 调入仓库ID
  product_id: number; // 产品ID
  quantity: number; // 调拨数量
  remarks: string; // 备注

  product?: ErpProductResponse;
}

export interface ErpInventoryTransferDetailQueryCondition extends PaginatedRequest {

}

export const createErpInventoryTransferDetail = (erp_inventory_transfer_detail: ErpInventoryTransferDetailRequest): Promise<number> => {
  return api.post<number>(apis.create, erp_inventory_transfer_detail);
}

export const updateErpInventoryTransferDetail = (erp_inventory_transfer_detail: ErpInventoryTransferDetailRequest): Promise<void> => {
  return api.post<void>(apis.update, erp_inventory_transfer_detail);
}

export const deleteErpInventoryTransferDetail = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getErpInventoryTransferDetail = (id: number): Promise<ErpInventoryTransferDetailResponse> => {
  return api.get<ErpInventoryTransferDetailResponse>(`${apis.get}/${id}`);
}

export const listErpInventoryTransferDetail = (): Promise<Array<ErpInventoryTransferDetailResponse>> => {
  return api.get<Array<ErpInventoryTransferDetailResponse>>(apis.list);
}

export const pageErpInventoryTransferDetail = (condition: ErpInventoryTransferDetailQueryCondition): Promise<PaginatedResponse<ErpInventoryTransferDetailResponse>> => {
  return api.get<PaginatedResponse<ErpInventoryTransferDetailResponse>>(apis.page, condition);
}
