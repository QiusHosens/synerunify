import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/mall/mall_promotion_banner/create', // 新增
  update: '/mall/mall_promotion_banner/update', // 修改
  delete: '/mall/mall_promotion_banner/delete', // 删除
  get: '/mall/mall_promotion_banner/get', // 单条查询
  list: '/mall/mall_promotion_banner/list', // 列表查询
  page: '/mall/mall_promotion_banner/page', // 分页查询
  enable: '/mall/mall_promotion_banner/enable', // 启用
  disable: '/mall/mall_promotion_banner/disable', // 禁用
}

export interface MallPromotionBannerRequest {
  id: number; // Banner 编号
  title: string; // Banner 标题
  pic_url: string; // 图片 URL
  url: string; // 跳转地址
  status: number; // 状态
  sort: number; // 排序
  position: number; // 位置
  memo: string; // 描述
  browse_count: number; // Banner 点击次数
  }

export interface MallPromotionBannerResponse {
  id: number; // Banner 编号
  title: string; // Banner 标题
  pic_url: string; // 图片 URL
  url: string; // 跳转地址
  status: number; // 状态
  sort: number; // 排序
  position: number; // 位置
  memo: string; // 描述
  browse_count: number; // Banner 点击次数
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallPromotionBannerQueryCondition extends PaginatedRequest {
  
}

export const createMallPromotionBanner = (mall_promotion_banner: MallPromotionBannerRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_promotion_banner);
}

export const updateMallPromotionBanner = (mall_promotion_banner: MallPromotionBannerRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_promotion_banner);
}

export const deleteMallPromotionBanner = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallPromotionBanner = (id: number): Promise<MallPromotionBannerResponse> => {
  return api.get<MallPromotionBannerResponse>(`${apis.get}/${id}`);
}

export const listMallPromotionBanner = (): Promise<Array<MallPromotionBannerResponse>> => {
  return api.get<Array<MallPromotionBannerResponse>>(apis.list);
}

export const pageMallPromotionBanner = (condition: MallPromotionBannerQueryCondition): Promise<PaginatedResponse<MallPromotionBannerResponse>> => {
  return api.get<PaginatedResponse<MallPromotionBannerResponse>>(apis.page, condition);
}

export const enableMallPromotionBanner = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableMallPromotionBanner = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}