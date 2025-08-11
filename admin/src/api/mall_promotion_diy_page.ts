import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/mall/mall_promotion_diy_page/create', // 新增
  update: '/mall/mall_promotion_diy_page/update', // 修改
  delete: '/mall/mall_promotion_diy_page/delete', // 删除
  get: '/mall/mall_promotion_diy_page/get', // 单条查询
  list: '/mall/mall_promotion_diy_page/list', // 列表查询
  page: '/mall/mall_promotion_diy_page/page', // 分页查询
}

export interface MallPromotionDiyPageRequest {
  id: number; // 装修页面编号
  template_id: number; // 装修模板编号
  name: string; // 页面名称
  remark: string; // 备注
  preview_file_ids: string; // 预览图id,多个逗号分隔
  property: string; // 页面属性，JSON 格式
  }

export interface MallPromotionDiyPageResponse {
  id: number; // 装修页面编号
  template_id: number; // 装修模板编号
  name: string; // 页面名称
  remark: string; // 备注
  preview_file_ids: string; // 预览图id,多个逗号分隔
  property: string; // 页面属性，JSON 格式
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallPromotionDiyPageQueryCondition extends PaginatedRequest {
  
}

export const createMallPromotionDiyPage = (mall_promotion_diy_page: MallPromotionDiyPageRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_promotion_diy_page);
}

export const updateMallPromotionDiyPage = (mall_promotion_diy_page: MallPromotionDiyPageRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_promotion_diy_page);
}

export const deleteMallPromotionDiyPage = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallPromotionDiyPage = (id: number): Promise<MallPromotionDiyPageResponse> => {
  return api.get<MallPromotionDiyPageResponse>(`${apis.get}/${id}`);
}

export const listMallPromotionDiyPage = (): Promise<Array<MallPromotionDiyPageResponse>> => {
  return api.get<Array<MallPromotionDiyPageResponse>>(apis.list);
}

export const pageMallPromotionDiyPage = (condition: MallPromotionDiyPageQueryCondition): Promise<PaginatedResponse<MallPromotionDiyPageResponse>> => {
  return api.get<PaginatedResponse<MallPromotionDiyPageResponse>>(apis.page, condition);
}
