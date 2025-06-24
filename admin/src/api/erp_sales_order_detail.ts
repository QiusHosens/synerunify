import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';
import { ErpProductResponse } from './erp_product';

const apis = {
  create: '/erp/erp_sales_order_detail/create', // 新增
  update: '/erp/erp_sales_order_detail/update', // 修改
  delete: '/erp/erp_sales_order_detail/delete', // 删除
  get: '/erp/erp_sales_order_detail/get', // 单条查询
  list: '/erp/erp_sales_order_detail/list', // 列表查询
  page: '/erp/erp_sales_order_detail/page', // 分页查询
}

export interface ErpSalesOrderDetailRequest {
  id?: number; // 订单详情ID
  order_id?: number; // 订单ID
  product_id: number; // 产品ID
  quantity: number; // 数量
  unit_price: number; // 单价
  subtotal: number; // 小计
  tax_rate: number; // 税率,精确到万分位
  remarks: string; // 备注

  product?: ErpProductResponse;
}

export interface ErpSalesOrderDetailResponse {
  id: number; // 订单详情ID
  order_id: number; // 订单ID
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

export interface ErpSalesOrderDetailBaseResponse {
  id: number; // 订单详情ID
  order_id: number; // 订单ID
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

  product_name?: string; // 产品名
  product_barcode?: string; // 条码
  product_unit_name?: string; // 产品单位名
  product?: ErpProductResponse;
}

export interface ErpSalesOrderDetailQueryCondition extends PaginatedRequest {

}

export const createErpSalesOrderDetail = (erp_sales_order_detail: ErpSalesOrderDetailRequest): Promise<number> => {
  return api.post<number>(apis.create, erp_sales_order_detail);
}

export const updateErpSalesOrderDetail = (erp_sales_order_detail: ErpSalesOrderDetailRequest): Promise<void> => {
  return api.post<void>(apis.update, erp_sales_order_detail);
}

export const deleteErpSalesOrderDetail = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getErpSalesOrderDetail = (id: number): Promise<ErpSalesOrderDetailResponse> => {
  return api.get<ErpSalesOrderDetailResponse>(`${apis.get}/${id}`);
}

export const listErpSalesOrderDetail = (): Promise<Array<ErpSalesOrderDetailResponse>> => {
  return api.get<Array<ErpSalesOrderDetailResponse>>(apis.list);
}

export const pageErpSalesOrderDetail = (condition: ErpSalesOrderDetailQueryCondition): Promise<PaginatedResponse<ErpSalesOrderDetailResponse>> => {
  return api.get<PaginatedResponse<ErpSalesOrderDetailResponse>>(apis.page, condition);
}
