import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/mall_product_statistics/create', // 新增
  update: '/erp/mall_product_statistics/update', // 修改
  delete: '/erp/mall_product_statistics/delete', // 删除
  get: '/erp/mall_product_statistics/get', // 单条查询
  list: '/erp/mall_product_statistics/list', // 列表查询
  page: '/erp/mall_product_statistics/page', // 分页查询
}

export interface MallProductStatisticsRequest {
  id: number; // 编号，主键自增
  time: string; // 统计日期
  spu_id: number; // 商品 SPU 编号
  browse_count: number; // 浏览量
  browse_user_count: number; // 访客量
  favorite_count: number; // 收藏数量
  cart_count: number; // 加购数量
  order_count: number; // 下单件数
  order_pay_count: number; // 支付件数
  order_pay_price: number; // 支付金额，单位：分
  after_sale_count: number; // 退款件数
  after_sale_refund_price: number; // 退款金额，单位：分
  browse_convert_percent: number; // 访客支付转化率（百分比）
  }

export interface MallProductStatisticsResponse {
  id: number; // 编号，主键自增
  time: string; // 统计日期
  spu_id: number; // 商品 SPU 编号
  browse_count: number; // 浏览量
  browse_user_count: number; // 访客量
  favorite_count: number; // 收藏数量
  cart_count: number; // 加购数量
  order_count: number; // 下单件数
  order_pay_count: number; // 支付件数
  order_pay_price: number; // 支付金额，单位：分
  after_sale_count: number; // 退款件数
  after_sale_refund_price: number; // 退款金额，单位：分
  browse_convert_percent: number; // 访客支付转化率（百分比）
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallProductStatisticsQueryCondition extends PaginatedRequest {
  
}

export const createMallProductStatistics = (mall_product_statistics: MallProductStatisticsRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_product_statistics);
}

export const updateMallProductStatistics = (mall_product_statistics: MallProductStatisticsRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_product_statistics);
}

export const deleteMallProductStatistics = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallProductStatistics = (id: number): Promise<MallProductStatisticsResponse> => {
  return api.get<MallProductStatisticsResponse>(`${apis.get}/${id}`);
}

export const listMallProductStatistics = (): Promise<Array<MallProductStatisticsResponse>> => {
  return api.get<Array<MallProductStatisticsResponse>>(apis.list);
}

export const pageMallProductStatistics = (condition: MallProductStatisticsQueryCondition): Promise<PaginatedResponse<MallProductStatisticsResponse>> => {
  return api.get<PaginatedResponse<MallProductStatisticsResponse>>(apis.page, condition);
}
