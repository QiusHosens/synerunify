import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/mall_trade_cart/create', // 新增
  update: '/erp/mall_trade_cart/update', // 修改
  delete: '/erp/mall_trade_cart/delete', // 删除
  get: '/erp/mall_trade_cart/get', // 单条查询
  list: '/erp/mall_trade_cart/list', // 列表查询
  page: '/erp/mall_trade_cart/page', // 分页查询
}

export interface MallTradeCartRequest {
  id: number; // 编号，唯一自增。
  user_id: number; // 用户编号
  spu_id: number; // 商品 SPU 编号
  sku_id: number; // 商品 SKU 编号
  count: number; // 商品购买数量
  selected: boolean; // 是否选中
  }

export interface MallTradeCartResponse {
  id: number; // 编号，唯一自增。
  user_id: number; // 用户编号
  spu_id: number; // 商品 SPU 编号
  sku_id: number; // 商品 SKU 编号
  count: number; // 商品购买数量
  selected: boolean; // 是否选中
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallTradeCartQueryCondition extends PaginatedRequest {
  
}

export const createMallTradeCart = (mall_trade_cart: MallTradeCartRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_trade_cart);
}

export const updateMallTradeCart = (mall_trade_cart: MallTradeCartRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_trade_cart);
}

export const deleteMallTradeCart = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallTradeCart = (id: number): Promise<MallTradeCartResponse> => {
  return api.get<MallTradeCartResponse>(`${apis.get}/${id}`);
}

export const listMallTradeCart = (): Promise<Array<MallTradeCartResponse>> => {
  return api.get<Array<MallTradeCartResponse>>(apis.list);
}

export const pageMallTradeCart = (condition: MallTradeCartQueryCondition): Promise<PaginatedResponse<MallTradeCartResponse>> => {
  return api.get<PaginatedResponse<MallTradeCartResponse>>(apis.page, condition);
}
