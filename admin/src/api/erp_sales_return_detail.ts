import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/erp_sales_return_detail/create', // 新增
  update: '/erp/erp_sales_return_detail/update', // 修改
  delete: '/erp/erp_sales_return_detail/delete', // 删除
  get: '/erp/erp_sales_return_detail/get', // 单条查询
  list: '/erp/erp_sales_return_detail/list', // 列表查询
  page: '/erp/erp_sales_return_detail/page', // 分页查询
}

export interface ErpSalesReturnDetailRequest {
  id: number; // 退货详情ID
  sale_detail_id: number; // 销售订单详情ID
  warehouse_id: number; // 仓库ID
  product_id?: number; // 产品ID
  quantity: number; // 数量
  unit_price?: number; // 单价
  subtotal?: number; // 小计
  tax_rate?: number; // 税率,精确到万分位
  remarks?: string; // 备注
}

export interface ErpSalesReturnDetailResponse {
  id: number; // 退货详情ID
  order_id: number; // 退货订单ID
  sale_detail_id: number; // 销售订单详情ID
  warehouse_id: number; // 仓库ID
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

export interface ErpSalesReturnDetailBaseResponse {
  id: number; // 退货详情ID
  sale_detail_id: number; // 销售订单详情ID
  warehouse_id: number; // 仓库ID
  product_id: number; // 产品ID
  quantity: number; // 数量
  unit_price: number; // 单价
  subtotal: number; // 小计
  tax_rate: number; // 税率,精确到万分位
  remarks: string; // 备注
}

export interface ErpSalesReturnDetailQueryCondition extends PaginatedRequest {

}

export const createErpSalesReturnDetail = (erp_sales_return_detail: ErpSalesReturnDetailRequest): Promise<number> => {
  return api.post<number>(apis.create, erp_sales_return_detail);
}

export const updateErpSalesReturnDetail = (erp_sales_return_detail: ErpSalesReturnDetailRequest): Promise<void> => {
  return api.post<void>(apis.update, erp_sales_return_detail);
}

export const deleteErpSalesReturnDetail = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getErpSalesReturnDetail = (id: number): Promise<ErpSalesReturnDetailResponse> => {
  return api.get<ErpSalesReturnDetailResponse>(`${apis.get}/${id}`);
}

export const listErpSalesReturnDetail = (): Promise<Array<ErpSalesReturnDetailResponse>> => {
  return api.get<Array<ErpSalesReturnDetailResponse>>(apis.list);
}

export const pageErpSalesReturnDetail = (condition: ErpSalesReturnDetailQueryCondition): Promise<PaginatedResponse<ErpSalesReturnDetailResponse>> => {
  return api.get<PaginatedResponse<ErpSalesReturnDetailResponse>>(apis.page, condition);
}
