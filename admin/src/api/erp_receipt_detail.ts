import { PaginatedRequest, PaginatedResponse } from "@/base/page";
import { api } from "@/utils/request";

const apis = {
  create: "/erp/erp_receipt_detail/create", // 新增
  update: "/erp/erp_receipt_detail/update", // 修改
  delete: "/erp/erp_receipt_detail/delete", // 删除
  get: "/erp/erp_receipt_detail/get", // 单条查询
  list: "/erp/erp_receipt_detail/list", // 列表查询
  page: "/erp/erp_receipt_detail/page", // 分页查询
};

export interface ErpReceiptDetailRequest {
  id?: number; // 收款详情ID
  sales_order_id: number; // 销售订单ID
  sales_return_id: number; // 销售退货ID
  amount: number; // 金额
  remarks: string; // 备注
}

export interface ErpReceiptDetailResponse {
  id: number; // 收款详情ID
  receipt_id: number; // 收款ID
  sales_order_id: number; // 销售订单ID
  sales_return_id: number; // 销售退货ID
  amount: number; // 金额
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
}

export interface ErpReceiptDetailBaseResponse {
  id: number; // 收款详情ID
  sales_order_id: number; // 销售订单ID
  sales_return_id: number; // 销售退货ID
  amount: number; // 金额
  remarks: string; // 备注
}

export interface ErpReceiptDetailQueryCondition extends PaginatedRequest {}

export const createErpReceiptDetail = (
  erp_receipt_detail: ErpReceiptDetailRequest
): Promise<number> => {
  return api.post<number>(apis.create, erp_receipt_detail);
};

export const updateErpReceiptDetail = (
  erp_receipt_detail: ErpReceiptDetailRequest
): Promise<void> => {
  return api.post<void>(apis.update, erp_receipt_detail);
};

export const deleteErpReceiptDetail = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
};

export const getErpReceiptDetail = (
  id: number
): Promise<ErpReceiptDetailResponse> => {
  return api.get<ErpReceiptDetailResponse>(`${apis.get}/${id}`);
};

export const listErpReceiptDetail = (): Promise<
  Array<ErpReceiptDetailResponse>
> => {
  return api.get<Array<ErpReceiptDetailResponse>>(apis.list);
};

export const pageErpReceiptDetail = (
  condition: ErpReceiptDetailQueryCondition
): Promise<PaginatedResponse<ErpReceiptDetailResponse>> => {
  return api.get<PaginatedResponse<ErpReceiptDetailResponse>>(
    apis.page,
    condition
  );
};
