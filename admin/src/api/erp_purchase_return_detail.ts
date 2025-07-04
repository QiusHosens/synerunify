import { PaginatedRequest, PaginatedResponse } from "@/base/page";
import { api } from "@/utils/request";

const apis = {
  create: "/erp/erp_purchase_return_detail/create", // 新增
  update: "/erp/erp_purchase_return_detail/update", // 修改
  delete: "/erp/erp_purchase_return_detail/delete", // 删除
  get: "/erp/erp_purchase_return_detail/get", // 单条查询
  list: "/erp/erp_purchase_return_detail/list", // 列表查询
  page: "/erp/erp_purchase_return_detail/page", // 分页查询
};

export interface ErpPurchaseReturnDetailRequest {
  id: number; // 退货详情ID
  purchase_detail_id: number; // 采购订单详情ID
  warehouse_id: number; // 仓库ID
  product_id?: number; // 产品ID
  quantity: number; // 数量
  unit_price?: number; // 单价
  subtotal?: number; // 小计
  tax_rate?: number; // 税率,精确到万分位
  remarks?: string; // 备注
}

export interface ErpPurchaseReturnDetailResponse {
  id: number; // 退货详情ID
  order_id: number; // 退货订单ID
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
  updater: number; // 更新者ID
  update_time: string; // 更新时间
}

export interface ErpPurchaseReturnDetailBaseResponse {
  id: number; // 退货详情ID
  purchase_detail_id: number; // 采购订单详情ID
  warehouse_id: number; // 仓库ID
  product_id: number; // 产品ID
  quantity: number; // 数量
  unit_price: number; // 单价
  subtotal: number; // 小计
  tax_rate: number; // 税率,精确到万分位
  remarks: string; // 备注
}

export interface ErpPurchaseReturnDetailQueryCondition
  extends PaginatedRequest {}

export const createErpPurchaseReturnDetail = (
  erp_purchase_return_detail: ErpPurchaseReturnDetailRequest
): Promise<number> => {
  return api.post<number>(apis.create, erp_purchase_return_detail);
};

export const updateErpPurchaseReturnDetail = (
  erp_purchase_return_detail: ErpPurchaseReturnDetailRequest
): Promise<void> => {
  return api.post<void>(apis.update, erp_purchase_return_detail);
};

export const deleteErpPurchaseReturnDetail = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
};

export const getErpPurchaseReturnDetail = (
  id: number
): Promise<ErpPurchaseReturnDetailResponse> => {
  return api.get<ErpPurchaseReturnDetailResponse>(`${apis.get}/${id}`);
};

export const listErpPurchaseReturnDetail = (): Promise<
  Array<ErpPurchaseReturnDetailResponse>
> => {
  return api.get<Array<ErpPurchaseReturnDetailResponse>>(apis.list);
};

export const pageErpPurchaseReturnDetail = (
  condition: ErpPurchaseReturnDetailQueryCondition
): Promise<PaginatedResponse<ErpPurchaseReturnDetailResponse>> => {
  return api.get<PaginatedResponse<ErpPurchaseReturnDetailResponse>>(
    apis.page,
    condition
  );
};
