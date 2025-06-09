import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/erp_supplier/create', // 新增
  update: '/erp/erp_supplier/update', // 修改
  delete: '/erp/erp_supplier/delete', // 删除
  get: '/erp/erp_supplier/get', // 单条查询
  list: '/erp/erp_supplier/list', // 列表查询
  page: '/erp/erp_supplier/page', // 分页查询
  enable: '/erp/erp_supplier/enable', // 启用
  disable: '/erp/erp_supplier/disable', // 禁用
}

export interface ErpSupplierRequest {
  id: number; // 供应商ID
  supplier_name: string; // 供应商名称
  contact_person: string; // 联系人
  phone: string; // 电话
  email: string; // 邮箱
  address: string; // 地址
  status: number; // 状态
  tax_id: string; // 纳税人识别号
  tax_rate: number; // 税率,精确到万分位
  bank_name: string; // 开户行
  bank_account: string; // 银行账号
  bank_address: string; // 开户地址
  remarks: string; // 备注
  sort_order: number; // 排序
  department_code: string; // 部门编码
  department_id: number; // 部门ID
}

export interface ErpSupplierResponse {
  id: number; // 供应商ID
  supplier_name: string; // 供应商名称
  contact_person: string; // 联系人
  phone: string; // 电话
  email: string; // 邮箱
  address: string; // 地址
  status: number; // 状态
  tax_id: string; // 纳税人识别号
  tax_rate: number; // 税率,精确到万分位
  bank_name: string; // 开户行
  bank_account: string; // 银行账号
  bank_address: string; // 开户地址
  remarks: string; // 备注
  sort_order: number; // 排序
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
}

export interface ErpSupplierQueryCondition extends PaginatedRequest {

}

export const createErpSupplier = (erp_supplier: ErpSupplierRequest): Promise<number> => {
  return api.post<number>(apis.create, erp_supplier);
}

export const updateErpSupplier = (erp_supplier: ErpSupplierRequest): Promise<void> => {
  return api.post<void>(apis.update, erp_supplier);
}

export const deleteErpSupplier = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getErpSupplier = (id: number): Promise<ErpSupplierResponse> => {
  return api.get<ErpSupplierResponse>(`${apis.get}/${id}`);
}

export const listErpSupplier = (): Promise<Array<ErpSupplierResponse>> => {
  return api.get<Array<ErpSupplierResponse>>(apis.list);
}

export const pageErpSupplier = (condition: ErpSupplierQueryCondition): Promise<PaginatedResponse<ErpSupplierResponse>> => {
  return api.get<PaginatedResponse<ErpSupplierResponse>>(apis.page, condition);
}

export const enableErpSupplier = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableErpSupplier = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}