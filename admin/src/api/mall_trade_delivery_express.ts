import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/mall/mall_trade_delivery_express/create', // 新增
  update: '/mall/mall_trade_delivery_express/update', // 修改
  delete: '/mall/mall_trade_delivery_express/delete', // 删除
  get: '/mall/mall_trade_delivery_express/get', // 单条查询
  list: '/mall/mall_trade_delivery_express/list', // 列表查询
  page: '/mall/mall_trade_delivery_express/page', // 分页查询
  enable: '/mall/mall_trade_delivery_express/enable', // 启用
  disable: '/mall/mall_trade_delivery_express/disable', // 禁用
}

export interface MallTradeDeliveryExpressRequest {
  id: number; // 编号
  code: string; // 快递公司编码
  name: string; // 快递公司名称
  logo: string; // 快递公司 logo
  sort: number; // 排序
  status: number; // 状态
  }

export interface MallTradeDeliveryExpressResponse {
  id: number; // 编号
  code: string; // 快递公司编码
  name: string; // 快递公司名称
  logo: string; // 快递公司 logo
  sort: number; // 排序
  status: number; // 状态
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallTradeDeliveryExpressQueryCondition extends PaginatedRequest {
  
}

export const createMallTradeDeliveryExpress = (mall_trade_delivery_express: MallTradeDeliveryExpressRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_trade_delivery_express);
}

export const updateMallTradeDeliveryExpress = (mall_trade_delivery_express: MallTradeDeliveryExpressRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_trade_delivery_express);
}

export const deleteMallTradeDeliveryExpress = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallTradeDeliveryExpress = (id: number): Promise<MallTradeDeliveryExpressResponse> => {
  return api.get<MallTradeDeliveryExpressResponse>(`${apis.get}/${id}`);
}

export const listMallTradeDeliveryExpress = (): Promise<Array<MallTradeDeliveryExpressResponse>> => {
  return api.get<Array<MallTradeDeliveryExpressResponse>>(apis.list);
}

export const pageMallTradeDeliveryExpress = (condition: MallTradeDeliveryExpressQueryCondition): Promise<PaginatedResponse<MallTradeDeliveryExpressResponse>> => {
  return api.get<PaginatedResponse<MallTradeDeliveryExpressResponse>>(apis.page, condition);
}

export const enableMallTradeDeliveryExpress = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableMallTradeDeliveryExpress = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}