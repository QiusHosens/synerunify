import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/mall/mall_promotion_article_category/create', // 新增
  update: '/mall/mall_promotion_article_category/update', // 修改
  delete: '/mall/mall_promotion_article_category/delete', // 删除
  get: '/mall/mall_promotion_article_category/get', // 单条查询
  list: '/mall/mall_promotion_article_category/list', // 列表查询
  page: '/mall/mall_promotion_article_category/page', // 分页查询
  enable: '/mall/mall_promotion_article_category/enable', // 启用
  disable: '/mall/mall_promotion_article_category/disable', // 禁用
}

export interface MallPromotionArticleCategoryRequest {
  id: number; // 文章分类编号
  name: string; // 分类名称
  file_id: number; // 图标ID
  status: number; // 状态
  sort: number; // 排序
  }

export interface MallPromotionArticleCategoryResponse {
  id: number; // 文章分类编号
  name: string; // 分类名称
  file_id: number; // 图标ID
  status: number; // 状态
  sort: number; // 排序
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallPromotionArticleCategoryQueryCondition extends PaginatedRequest {
  
}

export const createMallPromotionArticleCategory = (mall_promotion_article_category: MallPromotionArticleCategoryRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_promotion_article_category);
}

export const updateMallPromotionArticleCategory = (mall_promotion_article_category: MallPromotionArticleCategoryRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_promotion_article_category);
}

export const deleteMallPromotionArticleCategory = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallPromotionArticleCategory = (id: number): Promise<MallPromotionArticleCategoryResponse> => {
  return api.get<MallPromotionArticleCategoryResponse>(`${apis.get}/${id}`);
}

export const listMallPromotionArticleCategory = (): Promise<Array<MallPromotionArticleCategoryResponse>> => {
  return api.get<Array<MallPromotionArticleCategoryResponse>>(apis.list);
}

export const pageMallPromotionArticleCategory = (condition: MallPromotionArticleCategoryQueryCondition): Promise<PaginatedResponse<MallPromotionArticleCategoryResponse>> => {
  return api.get<PaginatedResponse<MallPromotionArticleCategoryResponse>>(apis.page, condition);
}

export const enableMallPromotionArticleCategory = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableMallPromotionArticleCategory = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}