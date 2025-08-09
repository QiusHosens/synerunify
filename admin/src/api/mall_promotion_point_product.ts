import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/mall/mall_promotion_point_product/create', // 新增
  update: '/mall/mall_promotion_point_product/update', // 修改
  delete: '/mall/mall_promotion_point_product/delete', // 删除
  get: '/mall/mall_promotion_point_product/get', // 单条查询
  list: '/mall/mall_promotion_point_product/list', // 列表查询
  page: '/mall/mall_promotion_point_product/page', // 分页查询
}

export interface MallPromotionPointProductRequest {
  id: number; // 积分商城商品编号
  activity_id: number; // 积分商城活动 id
  spu_id: number; // 商品 SPU 编号
  sku_id: number; // 商品 SKU 编号
  count: number; // 可兑换次数
  point: number; // 所需兑换积分
  price: number; // 所需兑换金额，单位：分
  stock: number; // 积分商城商品库存
  activity_status: number; // 积分商城商品状态
  }

export interface MallPromotionPointProductResponse {
  id: number; // 积分商城商品编号
  activity_id: number; // 积分商城活动 id
  spu_id: number; // 商品 SPU 编号
  sku_id: number; // 商品 SKU 编号
  count: number; // 可兑换次数
  point: number; // 所需兑换积分
  price: number; // 所需兑换金额，单位：分
  stock: number; // 积分商城商品库存
  activity_status: number; // 积分商城商品状态
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallPromotionPointProductQueryCondition extends PaginatedRequest {
  
}

export const createMallPromotionPointProduct = (mall_promotion_point_product: MallPromotionPointProductRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_promotion_point_product);
}

export const updateMallPromotionPointProduct = (mall_promotion_point_product: MallPromotionPointProductRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_promotion_point_product);
}

export const deleteMallPromotionPointProduct = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallPromotionPointProduct = (id: number): Promise<MallPromotionPointProductResponse> => {
  return api.get<MallPromotionPointProductResponse>(`${apis.get}/${id}`);
}

export const listMallPromotionPointProduct = (): Promise<Array<MallPromotionPointProductResponse>> => {
  return api.get<Array<MallPromotionPointProductResponse>>(apis.list);
}

export const pageMallPromotionPointProduct = (condition: MallPromotionPointProductQueryCondition): Promise<PaginatedResponse<MallPromotionPointProductResponse>> => {
  return api.get<PaginatedResponse<MallPromotionPointProductResponse>>(apis.page, condition);
}
