import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';
import { ErpSalesReturnDetailBaseResponse, ErpSalesReturnDetailRequest } from './erp_sales_return_detail';
import { ErpSalesReturnAttachmentBaseResponse, ErpSalesReturnAttachmentRequest } from './erp_sales_return_attachment';

const apis = {
  create: '/erp/erp_sales_return/create', // 新增
  update: '/erp/erp_sales_return/update', // 修改
  delete: '/erp/erp_sales_return/delete', // 删除
  get: '/erp/erp_sales_return/get', // 单条查询
  get_base: '/erp/erp_sales_return/get_base', // 单条查询
  get_info: '/erp/erp_sales_return/get_info', // 单条查询
  list: '/erp/erp_sales_return/list', // 列表查询
  list_customer: '/erp/erp_sales_return/list_customer', // 列表查询
  page: '/erp/erp_sales_return/page', // 分页查询
}

export interface ErpSalesReturnRequest {
  id?: number; // 退货ID
  sales_order_id?: number; // 销售订单ID
  return_date: string; // 退货日期
  total_amount: number; // 总金额
  discount_rate: number; // 优惠率（百分比，1000表示10.00%）
  settlement_account_id: number; // 结算账户ID
  deposit?: number; // 定金
  remarks: string; // 备注

  details: ErpSalesReturnDetailRequest[]; // 入库采购产品仓库列表
  attachments: ErpSalesReturnAttachmentRequest[]; // 入库附件列表
}

export interface ErpSalesReturnResponse {
  id: number; // 退货ID
  order_number: number; // 订单编号
  sales_order_id: number; // 销售订单ID
  customer_id: number; // 客户ID
  return_date: string; // 退货日期
  total_amount: number; // 总金额
  order_status: number; // 订单状态
  discount_rate: number; // 优惠率（百分比，1000表示10.00%）
  settlement_account_id: number; // 结算账户ID
  deposit: number; // 定金
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间

  sales_order_number: number; // 销售订单编号
  customer_name: string; // 客户名
  settlement_account_name: string; // 结算账户

  details: ErpSalesReturnDetailBaseResponse[]; // 产品仓库列表
  attachments: ErpSalesReturnAttachmentBaseResponse[]; // 附件列表
}

export interface ErpSalesReturnQueryCondition extends PaginatedRequest {

}

export const createErpSalesReturn = (erp_sales_return: ErpSalesReturnRequest): Promise<number> => {
  return api.post<number>(apis.create, erp_sales_return);
}

export const updateErpSalesReturn = (erp_sales_return: ErpSalesReturnRequest): Promise<void> => {
  return api.post<void>(apis.update, erp_sales_return);
}

export const deleteErpSalesReturn = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getErpSalesReturn = (id: number): Promise<ErpSalesReturnResponse> => {
  return api.get<ErpSalesReturnResponse>(`${apis.get}/${id}`);
}

export const getBaseErpSalesReturn = (id: number): Promise<ErpSalesReturnResponse> => {
  return api.get<ErpSalesReturnResponse>(`${apis.get_base}/${id}`);
}

export const getInfoErpSalesReturn = (id: number): Promise<ErpSalesReturnResponse> => {
  return api.get<ErpSalesReturnResponse>(`${apis.get_info}/${id}`);
}

export const listErpSalesReturn = (): Promise<Array<ErpSalesReturnResponse>> => {
  return api.get<Array<ErpSalesReturnResponse>>(apis.list);
}

export const listCustomerErpSalesReturn = (customer_id: number): Promise<Array<ErpSalesReturnResponse>> => {
  return api.get<Array<ErpSalesReturnResponse>>(`${apis.list_customer}/${customer_id}`);
}

export const pageErpSalesReturn = (condition: ErpSalesReturnQueryCondition): Promise<PaginatedResponse<ErpSalesReturnResponse>> => {
  return api.get<PaginatedResponse<ErpSalesReturnResponse>>(apis.page, condition);
}
