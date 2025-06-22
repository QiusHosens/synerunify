import { PaginatedRequest, PaginatedResponse } from "@/base/page";
import { api } from "@/utils/request";
import { ErpSalesOrderDetailRequest } from "./erp_sales_order_detail";
import { ErpSalesOrderAttachmentRequest } from "./erp_sales_order_attachment";

const apis = {
  create: "/erp/erp_sales_order/create", // 新增
  update: "/erp/erp_sales_order/update", // 修改
  delete: "/erp/erp_sales_order/delete", // 删除
  get: "/erp/erp_sales_order/get", // 单条查询
  list: "/erp/erp_sales_order/list", // 列表查询
  page: "/erp/erp_sales_order/page", // 分页查询
};

export interface ErpSalesOrderRequest {
  id?: number; // 订单ID
  customer_id: number; // 客户ID
  order_date: string; // 订单日期
  total_amount: number; // 总金额
  discount_rate: number; // 优惠率（百分比，1000表示10.00%）
  settlement_account_id: number; // 结算账户ID
  deposit: number; // 定金
  remarks: string;

  details?: ErpSalesOrderDetailRequest[]; // 入库采购产品仓库列表
  attachments: ErpSalesOrderAttachmentRequest[]; // 入库附件列表
}

export interface ErpSalesOrderResponse {
  id: number; // 订单ID
  order_number: string; // 订单编号
  customer_id: number; // 客户ID
  user_id: number; // 用户ID
  order_date: string; // 订单日期
  total_amount: number; // 总金额
  order_status: number; // 订单状态 (0=pending, 1=completed, 2=cancelled)
  discount_rate: number; // 优惠率（百分比，1000表示10.00%）
  settlement_account_id: number; // 结算账户ID
  deposit: number; // 定金
  remarks: string;
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间

  customer_name: string; // 客户名
  settlement_account_name: string; // 结算账户名
}

export interface ErpSalesOrderBaseResponse {
  id: number; // 订单ID
  order_number: string; // 订单编号
  customer_id: number; // 客户ID
  user_id: number; // 用户ID
  order_date: string; // 订单日期
  total_amount: number; // 总金额
  order_status: number; // 订单状态 (0=pending, 1=completed, 2=cancelled)
  discount_rate: number; // 优惠率（百分比，1000表示10.00%）
  settlement_account_id: number; // 结算账户ID
  deposit: number; // 定金
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间

  details?: ErpSalesOrderDetailRequest[]; // 入库采购产品仓库列表
  attachments: ErpSalesOrderAttachmentRequest[]; // 入库附件列表
}

export interface ErpSalesOrderInfoResponse {
  id: number; // 订单ID
  order_number: string; // 订单编号
  customer_id: number; // 客户ID
  user_id: number; // 用户ID
  order_date: string; // 订单日期
  total_amount: number; // 总金额
  order_status: number; // 订单状态 (0=pending, 1=completed, 2=cancelled)
  discount_rate: number; // 优惠率（百分比，1000表示10.00%）
  settlement_account_id: number; // 结算账户ID
  deposit: number; // 定金
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间

  customer_name: string; // 客户名
  settlement_account_name: string; // 结算账户名

  details?: ErpSalesOrderDetailRequest[]; // 入库采购产品仓库列表
  attachments: ErpSalesOrderAttachmentRequest[]; // 入库附件列表
}

export interface ErpSalesOrderQueryCondition extends PaginatedRequest {}

export const createErpSalesOrder = (
  erp_sales_order: ErpSalesOrderRequest
): Promise<number> => {
  return api.post<number>(apis.create, erp_sales_order);
};

export const updateErpSalesOrder = (
  erp_sales_order: ErpSalesOrderRequest
): Promise<void> => {
  return api.post<void>(apis.update, erp_sales_order);
};

export const deleteErpSalesOrder = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
};

export const getErpSalesOrder = (
  id: number
): Promise<ErpSalesOrderResponse> => {
  return api.get<ErpSalesOrderResponse>(`${apis.get}/${id}`);
};

export const listErpSalesOrder = (): Promise<Array<ErpSalesOrderResponse>> => {
  return api.get<Array<ErpSalesOrderResponse>>(apis.list);
};

export const pageErpSalesOrder = (
  condition: ErpSalesOrderQueryCondition
): Promise<PaginatedResponse<ErpSalesOrderResponse>> => {
  return api.get<PaginatedResponse<ErpSalesOrderResponse>>(
    apis.page,
    condition
  );
};
