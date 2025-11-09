import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/mall/mall_store_notice/create', // 新增
  update: '/mall/mall_store_notice/update', // 修改
  delete: '/mall/mall_store_notice/delete', // 删除
  get: '/mall/mall_store_notice/get', // 单条查询
  list: '/mall/mall_store_notice/list', // 列表查询
  page: '/mall/mall_store_notice/page', // 分页查询
}

export interface MallStoreNoticeRequest {
  id: number; // 公告编号
  store_id: number; // 店铺编号
  title: string; // 公告标题
  content: string; // 公告内容
  top: number; // 是否置顶:0-置顶,1-不置顶
  }

export interface MallStoreNoticeResponse {
  id: number; // 公告编号
  store_id: number; // 店铺编号
  title: string; // 公告标题
  content: string; // 公告内容
  top: number; // 是否置顶:0-置顶,1-不置顶
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallStoreNoticeQueryCondition extends PaginatedRequest {
  
}

export const createMallStoreNotice = (mall_store_notice: MallStoreNoticeRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_store_notice);
}

export const updateMallStoreNotice = (mall_store_notice: MallStoreNoticeRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_store_notice);
}

export const deleteMallStoreNotice = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallStoreNotice = (id: number): Promise<MallStoreNoticeResponse> => {
  return api.get<MallStoreNoticeResponse>(`${apis.get}/${id}`);
}

export const listMallStoreNotice = (): Promise<Array<MallStoreNoticeResponse>> => {
  return api.get<Array<MallStoreNoticeResponse>>(apis.list);
}

export const pageMallStoreNotice = (condition: MallStoreNoticeQueryCondition): Promise<PaginatedResponse<MallStoreNoticeResponse>> => {
  return api.get<PaginatedResponse<MallStoreNoticeResponse>>(apis.page, condition);
}
