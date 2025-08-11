import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/mall/mall_promotion_article/create', // 新增
  update: '/mall/mall_promotion_article/update', // 修改
  delete: '/mall/mall_promotion_article/delete', // 删除
  get: '/mall/mall_promotion_article/get', // 单条查询
  list: '/mall/mall_promotion_article/list', // 列表查询
  page: '/mall/mall_promotion_article/page', // 分页查询
  enable: '/mall/mall_promotion_article/enable', // 启用
  disable: '/mall/mall_promotion_article/disable', // 禁用
}

export interface MallPromotionArticleRequest {
  id: number; // 文章管理编号
  category_id: number; // 分类编号
  spu_id: number; // 关联商品编号
  title: string; // 文章标题
  author: string; // 文章作者
  file_id: number; // 文章封面图片ID
  introduction: string; // 文章简介
  browse_count: string; // 浏览次数
  sort: number; // 排序
  status: number; // 状态
  recommend_hot: boolean; // 是否热门(小程序)
  recommend_banner: boolean; // 是否轮播图(小程序)
  content: string; // 文章内容
  }

export interface MallPromotionArticleResponse {
  id: number; // 文章管理编号
  category_id: number; // 分类编号
  spu_id: number; // 关联商品编号
  title: string; // 文章标题
  author: string; // 文章作者
  file_id: number; // 文章封面图片ID
  introduction: string; // 文章简介
  browse_count: string; // 浏览次数
  sort: number; // 排序
  status: number; // 状态
  recommend_hot: boolean; // 是否热门(小程序)
  recommend_banner: boolean; // 是否轮播图(小程序)
  content: string; // 文章内容
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallPromotionArticleQueryCondition extends PaginatedRequest {
  
}

export const createMallPromotionArticle = (mall_promotion_article: MallPromotionArticleRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_promotion_article);
}

export const updateMallPromotionArticle = (mall_promotion_article: MallPromotionArticleRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_promotion_article);
}

export const deleteMallPromotionArticle = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallPromotionArticle = (id: number): Promise<MallPromotionArticleResponse> => {
  return api.get<MallPromotionArticleResponse>(`${apis.get}/${id}`);
}

export const listMallPromotionArticle = (): Promise<Array<MallPromotionArticleResponse>> => {
  return api.get<Array<MallPromotionArticleResponse>>(apis.list);
}

export const pageMallPromotionArticle = (condition: MallPromotionArticleQueryCondition): Promise<PaginatedResponse<MallPromotionArticleResponse>> => {
  return api.get<PaginatedResponse<MallPromotionArticleResponse>>(apis.page, condition);
}

export const enableMallPromotionArticle = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableMallPromotionArticle = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}