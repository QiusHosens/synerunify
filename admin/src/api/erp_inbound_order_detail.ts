import { PaginatedRequest, PaginatedResponse } from "@/base/page";
import { api } from "@/utils/request";
import { ErpProductResponse } from "./erp_product";

const apis = {
  create: "/erp/erp_inbound_order_detail/create", // 新增
  update: "/erp/erp_inbound_order_detail/update", // 修改
  delete: "/erp/erp_inbound_order_detail/delete", // 删除
  get: "/erp/erp_inbound_order_detail/get", // 单条查询
  list: "/erp/erp_inbound_order_detail/list", // 列表查询
  page: "/erp/erp_inbound_order_detail/page", // 分页查询
};

export interface ErpInboundOrderDetailRequest {
  id?: number; // 入库详情ID
  order_id?: number; // 入库订单ID
  purchase_detail_id?: number; // 采购订单详情ID
  warehouse_id: number; // 仓库ID
  product_id?: number; // 产品ID
  quantity?: number; // 数量
  unit_price?: number; // 单价
  subtotal?: number; // 小计
  tax_rate?: number; // 税率,精确到万分位
  remarks?: string; // 备注

  product?: ErpProductResponse;
}

export interface ErpInboundOrderDetailResponse {
  id: number; // 入库详情ID
  order_id: number; // 入库订单ID
  purchase_detail_id: number; // 采购订单详情ID
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
}

export interface ErpInboundOrderDetailBaseResponse {
  id: number; // 入库详情ID
  order_id: number; // 入库订单ID
  purchase_detail_id: number; // 采购订单详情ID
  warehouse_id: number; // 仓库ID
  product_id: number; // 产品ID
  quantity: number; // 数量
  unit_price: number; // 单价
  subtotal: number; // 小计
  tax_rate: number; // 税率,精确到万分位
  remarks: string; // 备注

  product?: ErpProductResponse;
}

export interface ErpInboundOrderDetailQueryCondition extends PaginatedRequest {}

export const createErpInboundOrderDetail = (
  erp_inbound_order_detail: ErpInboundOrderDetailRequest
): Promise<number> => {
  return api.post<number>(apis.create, erp_inbound_order_detail);
};

export const updateErpInboundOrderDetail = (
  erp_inbound_order_detail: ErpInboundOrderDetailRequest
): Promise<void> => {
  return api.post<void>(apis.update, erp_inbound_order_detail);
};

export const deleteErpInboundOrderDetail = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
};

export const getErpInboundOrderDetail = (
  id: number
): Promise<ErpInboundOrderDetailResponse> => {
  return api.get<ErpInboundOrderDetailResponse>(`${apis.get}/${id}`);
};

export const listErpInboundOrderDetail = (): Promise<
  Array<ErpInboundOrderDetailResponse>
> => {
  return api.get<Array<ErpInboundOrderDetailResponse>>(apis.list);
};

export const pageErpInboundOrderDetail = (
  condition: ErpInboundOrderDetailQueryCondition
): Promise<PaginatedResponse<ErpInboundOrderDetailResponse>> => {
  return api.get<PaginatedResponse<ErpInboundOrderDetailResponse>>(
    apis.page,
    condition
  );
};
