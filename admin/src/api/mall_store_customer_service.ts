import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/mall/mall_store_customer_service/create', // 新增
  update: '/mall/mall_store_customer_service/update', // 修改
  delete: '/mall/mall_store_customer_service/delete', // 删除
  get: '/mall/mall_store_customer_service/get', // 单条查询
  list: '/mall/mall_store_customer_service/list', // 列表查询
  page: '/mall/mall_store_customer_service/page', // 分页查询
}

export interface MallStoreCustomerServiceRequest {
  id: number; // 客服编号
  store_id: number; // 店铺编号
  user_id: number; // 用户编号
  name: string; // 店铺名称
  type: number; // 1-在线客服,2-电话,3-QQ,4-微信
  sort: number; // 排序
  }

export interface MallStoreCustomerServiceResponse {
  id: number; // 客服编号
  store_id: number; // 店铺编号
  user_id: number; // 用户编号
  name: string; // 店铺名称
  type: number; // 1-在线客服,2-电话,3-QQ,4-微信
  sort: number; // 排序
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallStoreCustomerServiceQueryCondition extends PaginatedRequest {
  
}

export const createMallStoreCustomerService = (mall_store_customer_service: MallStoreCustomerServiceRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_store_customer_service);
}

export const updateMallStoreCustomerService = (mall_store_customer_service: MallStoreCustomerServiceRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_store_customer_service);
}

export const deleteMallStoreCustomerService = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallStoreCustomerService = (id: number): Promise<MallStoreCustomerServiceResponse> => {
  return api.get<MallStoreCustomerServiceResponse>(`${apis.get}/${id}`);
}

export const listMallStoreCustomerService = (): Promise<Array<MallStoreCustomerServiceResponse>> => {
  return api.get<Array<MallStoreCustomerServiceResponse>>(apis.list);
}

export const pageMallStoreCustomerService = (condition: MallStoreCustomerServiceQueryCondition): Promise<PaginatedResponse<MallStoreCustomerServiceResponse>> => {
  return api.get<PaginatedResponse<MallStoreCustomerServiceResponse>>(apis.page, condition);
}
