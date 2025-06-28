import { PaginatedRequest, PaginatedResponse } from "@/base/page";
import { api } from "@/utils/request";

const apis = {
  create: "/erp/erp_payment_detail/create", // 新增
  update: "/erp/erp_payment_detail/update", // 修改
  delete: "/erp/erp_payment_detail/delete", // 删除
  get: "/erp/erp_payment_detail/get", // 单条查询
  list: "/erp/erp_payment_detail/list", // 列表查询
  page: "/erp/erp_payment_detail/page", // 分页查询
};

export interface ErpPaymentDetailRequest {
  id?: number; // 付款详情ID
  purchase_order_id?: number; // 采购订单ID
  purchase_return_id?: number; // 采购退货ID
  amount: number; // 金额
  remarks: string; // 备注

  type?: number; // 0为采购订单入库,1为采购退货
}

export interface ErpPaymentDetailResponse {
  id: number; // 付款详情ID
  payment_id: number; // 付款ID
  purchase_order_id: number; // 采购订单ID
  purchase_return_id: number; // 采购退货ID
  amount: number; // 金额
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
}

export interface ErpPaymentDetailBaseResponse {
  id: number; // 付款详情ID
  purchase_order_id: number; // 采购订单ID
  purchase_return_id: number; // 采购退货ID
  amount: number; // 金额
  remarks: string; // 备注

  type?: number; // 0为采购订单入库,1为采购退货
}

export interface ErpPaymentDetailQueryCondition extends PaginatedRequest {}

export const createErpPaymentDetail = (
  erp_payment_detail: ErpPaymentDetailRequest
): Promise<number> => {
  return api.post<number>(apis.create, erp_payment_detail);
};

export const updateErpPaymentDetail = (
  erp_payment_detail: ErpPaymentDetailRequest
): Promise<void> => {
  return api.post<void>(apis.update, erp_payment_detail);
};

export const deleteErpPaymentDetail = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
};

export const getErpPaymentDetail = (
  id: number
): Promise<ErpPaymentDetailResponse> => {
  return api.get<ErpPaymentDetailResponse>(`${apis.get}/${id}`);
};

export const listErpPaymentDetail = (): Promise<
  Array<ErpPaymentDetailResponse>
> => {
  return api.get<Array<ErpPaymentDetailResponse>>(apis.list);
};

export const pageErpPaymentDetail = (
  condition: ErpPaymentDetailQueryCondition
): Promise<PaginatedResponse<ErpPaymentDetailResponse>> => {
  return api.get<PaginatedResponse<ErpPaymentDetailResponse>>(
    apis.page,
    condition
  );
};
