import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/erp_customer/create', // 新增
  update: '/erp/erp_customer/update', // 修改
  delete: '/erp/erp_customer/delete', // 删除
  get: '/erp/erp_customer/get', // 单条查询
  list: '/erp/erp_customer/list', // 列表查询
  page: '/erp/erp_customer/page', // 分页查询
  enable: '/erp/erp_customer/enable', // 启用
  disable: '/erp/erp_customer/disable', // 禁用
}

export interface ErpCustomerRequest {
  id: number; // 客户ID
  customer_name: string; // 客户名称
  contact_person: string; // 联系人
  phone: string; // 电话
  email: string; // 邮箱
  address: string; // 地址
  status: number; // 状态
  sort_order: number; // 排序
  tax_id: string; // 纳税人识别号
  tax_rate: number; // 税率,精确到万分位
  bank_name: string; // 开户行
  bank_account: string; // 银行账号
  bank_address: string; // 开户地址
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
}

export interface ErpCustomerResponse {
  id: number; // 客户ID
  customer_name: string; // 客户名称
  contact_person: string; // 联系人
  phone: string; // 电话
  email: string; // 邮箱
  address: string; // 地址
  status: number; // 状态
  sort_order: number; // 排序
  tax_id: string; // 纳税人识别号
  tax_rate: number; // 税率,精确到万分位
  bank_name: string; // 开户行
  bank_account: string; // 银行账号
  bank_address: string; // 开户地址
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
}

export interface ErpCustomerQueryCondition extends PaginatedRequest {

}

export const createErpCustomer = (erp_customer: ErpCustomerRequest): Promise<number> => {
  return api.post<number>(apis.create, erp_customer);
}

export const updateErpCustomer = (erp_customer: ErpCustomerRequest): Promise<void> => {
  return api.post<void>(apis.update, erp_customer);
}

export const deleteErpCustomer = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getErpCustomer = (id: number): Promise<ErpCustomerResponse> => {
  return api.get<ErpCustomerResponse>(`${apis.get}/${id}`);
}

export const listErpCustomer = (): Promise<Array<ErpCustomerResponse>> => {
  return api.get<Array<ErpCustomerResponse>>(apis.list);
}

export const pageErpCustomer = (condition: ErpCustomerQueryCondition): Promise<PaginatedResponse<ErpCustomerResponse>> => {
  return api.get<PaginatedResponse<ErpCustomerResponse>>(apis.page, condition);
}

export const enableErpCustomer = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableErpCustomer = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}