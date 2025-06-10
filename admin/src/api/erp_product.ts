import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/erp_product/create', // 新增
  update: '/erp/erp_product/update', // 修改
  delete: '/erp/erp_product/delete', // 删除
  get: '/erp/erp_product/get', // 单条查询
  list: '/erp/erp_product/list', // 列表查询
  page: '/erp/erp_product/page', // 分页查询
  enable: '/erp/erp_product/enable', // 启用
  disable: '/erp/erp_product/disable', // 禁用
}

export interface ErpProductRequest {
  id: number; // 产品ID
  product_code: string; // 产品编码
  name: string; // 产品名称
  category_id?: number; // 产品分类ID
  unit_id?: number; // 产品单位ID
  status: number; // 状态
  barcode: string; // 条码
  specification: string; // 规格
  shelf_life_days: number; // 保质期天数
  weight: number; // 重量,kg,精确到百分位
  purchase_price: number; // 采购价格
  sale_price: number; // 销售价格
  min_price: number; // 最低价格
  stock_quantity: number; // 库存数量
  min_stock: number; // 最低库存
  remarks: string; // 备注
}

export interface ErpProductResponse {
  id: number; // 产品ID
  product_code: string; // 产品编码
  name: string; // 产品名称
  category_id: number; // 产品分类ID
  unit_id: number; // 产品单位ID
  status: number; // 状态
  barcode: string; // 条码
  specification: string; // 规格
  shelf_life_days: number; // 保质期天数
  weight: number; // 重量,kg,精确到百分位
  purchase_price: number; // 采购价格
  sale_price: number; // 销售价格
  min_price: number; // 最低价格
  stock_quantity: number; // 库存数量
  min_stock: number; // 最低库存
  remarks: string; // 备注
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
}

export interface ErpProductQueryCondition extends PaginatedRequest {

}

export const createErpProduct = (erp_product: ErpProductRequest): Promise<number> => {
  return api.post<number>(apis.create, erp_product);
}

export const updateErpProduct = (erp_product: ErpProductRequest): Promise<void> => {
  return api.post<void>(apis.update, erp_product);
}

export const deleteErpProduct = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getErpProduct = (id: number): Promise<ErpProductResponse> => {
  return api.get<ErpProductResponse>(`${apis.get}/${id}`);
}

export const listErpProduct = (): Promise<Array<ErpProductResponse>> => {
  return api.get<Array<ErpProductResponse>>(apis.list);
}

export const pageErpProduct = (condition: ErpProductQueryCondition): Promise<PaginatedResponse<ErpProductResponse>> => {
  return api.get<PaginatedResponse<ErpProductResponse>>(apis.page, condition);
}

export const enableErpProduct = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableErpProduct = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}