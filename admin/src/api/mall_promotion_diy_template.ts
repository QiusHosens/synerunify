import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/mall_promotion_diy_template/create', // 新增
  update: '/erp/mall_promotion_diy_template/update', // 修改
  delete: '/erp/mall_promotion_diy_template/delete', // 删除
  get: '/erp/mall_promotion_diy_template/get', // 单条查询
  list: '/erp/mall_promotion_diy_template/list', // 列表查询
  page: '/erp/mall_promotion_diy_template/page', // 分页查询
}

export interface MallPromotionDiyTemplateRequest {
  id: number; // 装修模板编号
  name: string; // 模板名称
  used: boolean; // 是否使用
  used_time: string; // 使用时间
  remark: string; // 备注
  preview_pic_urls: string; // 预览图
  property: string; // 模板属性，JSON 格式
  }

export interface MallPromotionDiyTemplateResponse {
  id: number; // 装修模板编号
  name: string; // 模板名称
  used: boolean; // 是否使用
  used_time: string; // 使用时间
  remark: string; // 备注
  preview_pic_urls: string; // 预览图
  property: string; // 模板属性，JSON 格式
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallPromotionDiyTemplateQueryCondition extends PaginatedRequest {
  
}

export const createMallPromotionDiyTemplate = (mall_promotion_diy_template: MallPromotionDiyTemplateRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_promotion_diy_template);
}

export const updateMallPromotionDiyTemplate = (mall_promotion_diy_template: MallPromotionDiyTemplateRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_promotion_diy_template);
}

export const deleteMallPromotionDiyTemplate = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallPromotionDiyTemplate = (id: number): Promise<MallPromotionDiyTemplateResponse> => {
  return api.get<MallPromotionDiyTemplateResponse>(`${apis.get}/${id}`);
}

export const listMallPromotionDiyTemplate = (): Promise<Array<MallPromotionDiyTemplateResponse>> => {
  return api.get<Array<MallPromotionDiyTemplateResponse>>(apis.list);
}

export const pageMallPromotionDiyTemplate = (condition: MallPromotionDiyTemplateQueryCondition): Promise<PaginatedResponse<MallPromotionDiyTemplateResponse>> => {
  return api.get<PaginatedResponse<MallPromotionDiyTemplateResponse>>(apis.page, condition);
}
