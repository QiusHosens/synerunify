import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';
import { ErpProductResponse } from './erp_product';

const apis = {
  create: '/erp/erp_purchase_order_detail/create', // 新增
  update: '/erp/erp_purchase_order_detail/update', // 修改
  delete: '/erp/erp_purchase_order_detail/delete', // 删除
  get: '/erp/erp_purchase_order_detail/get', // 单条查询
  list: '/erp/erp_purchase_order_detail/list', // 列表查询
  page: '/erp/erp_purchase_order_detail/page', // 分页查询
}

export interface ErpPurchaseOrderDetailRequest {
  id?: number; // 采购订单详情ID
  purchase_id?: number; // 采购订单ID
  product_id: number; // 产品ID
  quantity: number; // 数量
  unit_price: number; // 单价
  subtotal: number; // 小计
  tax_rate: number; // 税率,精确到万分位
  remarks: string; // 备注
}

export interface ErpPurchaseOrderDetailModel {
  no: number; // 序号
  product_id?: number; // 产品ID
  product?: ErpProductResponse; // 产品
  quantity: number; // 数量
  unit_price?: number; // 单价
  tax_rate?: number; // 税率,精确到万分位
  remarks: string; // 备注
}

export interface ErpPurchaseOrderDetailResponse {
  id: number; // 采购订单详情ID
  purchase_id: number; // 采购订单ID
  product_id: number; // 产品ID
  quantity: number; // 数量
  unit_price: number; // 单价
  subtotal: number; // 小计
  tax_rate: number; // 税率,精确到万分位
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
}

export interface ErpPurchaseOrderDetailQueryCondition extends PaginatedRequest {

}

export const createErpPurchaseOrderDetail = (erp_purchase_order_detail: ErpPurchaseOrderDetailRequest): Promise<number> => {
  return api.post<number>(apis.create, erp_purchase_order_detail);
}

export const updateErpPurchaseOrderDetail = (erp_purchase_order_detail: ErpPurchaseOrderDetailRequest): Promise<void> => {
  return api.post<void>(apis.update, erp_purchase_order_detail);
}

export const deleteErpPurchaseOrderDetail = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getErpPurchaseOrderDetail = (id: number): Promise<ErpPurchaseOrderDetailResponse> => {
  return api.get<ErpPurchaseOrderDetailResponse>(`${apis.get}/${id}`);
}

export const listErpPurchaseOrderDetail = (): Promise<Array<ErpPurchaseOrderDetailResponse>> => {
  return api.get<Array<ErpPurchaseOrderDetailResponse>>(apis.list);
}

export const pageErpPurchaseOrderDetail = (condition: ErpPurchaseOrderDetailQueryCondition): Promise<PaginatedResponse<ErpPurchaseOrderDetailResponse>> => {
  return api.get<PaginatedResponse<ErpPurchaseOrderDetailResponse>>(apis.page, condition);
}
