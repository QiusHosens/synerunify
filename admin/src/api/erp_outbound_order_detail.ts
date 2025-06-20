import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/erp_outbound_order_detail/create', // 新增
  update: '/erp/erp_outbound_order_detail/update', // 修改
  delete: '/erp/erp_outbound_order_detail/delete', // 删除
  get: '/erp/erp_outbound_order_detail/get', // 单条查询
  list: '/erp/erp_outbound_order_detail/list', // 列表查询
  page: '/erp/erp_outbound_order_detail/page', // 分页查询
}

export interface ErpOutboundOrderDetailRequest {
  id: number; // 出库详情ID
  order_id: number; // 出库订单ID
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
  }

export interface ErpOutboundOrderDetailResponse {
  id: number; // 出库详情ID
  order_id: number; // 出库订单ID
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

export interface ErpOutboundOrderDetailQueryCondition extends PaginatedRequest {
  
}

export const createErpOutboundOrderDetail = (erp_outbound_order_detail: ErpOutboundOrderDetailRequest): Promise<number> => {
  return api.post<number>(apis.create, erp_outbound_order_detail);
}

export const updateErpOutboundOrderDetail = (erp_outbound_order_detail: ErpOutboundOrderDetailRequest): Promise<void> => {
  return api.post<void>(apis.update, erp_outbound_order_detail);
}

export const deleteErpOutboundOrderDetail = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getErpOutboundOrderDetail = (id: number): Promise<ErpOutboundOrderDetailResponse> => {
  return api.get<ErpOutboundOrderDetailResponse>(`${apis.get}/${id}`);
}

export const listErpOutboundOrderDetail = (): Promise<Array<ErpOutboundOrderDetailResponse>> => {
  return api.get<Array<ErpOutboundOrderDetailResponse>>(apis.list);
}

export const pageErpOutboundOrderDetail = (condition: ErpOutboundOrderDetailQueryCondition): Promise<PaginatedResponse<ErpOutboundOrderDetailResponse>> => {
  return api.get<PaginatedResponse<ErpOutboundOrderDetailResponse>>(apis.page, condition);
}
