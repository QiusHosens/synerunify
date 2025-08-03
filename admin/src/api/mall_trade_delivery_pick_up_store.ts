import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/mall_trade_delivery_pick_up_store/create', // 新增
  update: '/erp/mall_trade_delivery_pick_up_store/update', // 修改
  delete: '/erp/mall_trade_delivery_pick_up_store/delete', // 删除
  get: '/erp/mall_trade_delivery_pick_up_store/get', // 单条查询
  list: '/erp/mall_trade_delivery_pick_up_store/list', // 列表查询
  page: '/erp/mall_trade_delivery_pick_up_store/page', // 分页查询
  enable: '/erp/mall_trade_delivery_pick_up_store/enable', // 启用
  disable: '/erp/mall_trade_delivery_pick_up_store/disable', // 禁用
}

export interface MallTradeDeliveryPickUpStoreRequest {
  id: number; // 编号
  name: string; // 门店名称
  introduction: string; // 门店简介
  phone: string; // 门店手机
  area_id: number; // 区域编号
  detail_address: string; // 门店详细地址
  logo: string; // 门店 logo
  opening_time: string; // 营业开始时间
  closing_time: string; // 营业结束时间
  latitude: number; // 纬度
  longitude: number; // 经度
  verify_user_ids: string; // 核销用户编号数组
  status: number; // 门店状态
  }

export interface MallTradeDeliveryPickUpStoreResponse {
  id: number; // 编号
  name: string; // 门店名称
  introduction: string; // 门店简介
  phone: string; // 门店手机
  area_id: number; // 区域编号
  detail_address: string; // 门店详细地址
  logo: string; // 门店 logo
  opening_time: string; // 营业开始时间
  closing_time: string; // 营业结束时间
  latitude: number; // 纬度
  longitude: number; // 经度
  verify_user_ids: string; // 核销用户编号数组
  status: number; // 门店状态
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallTradeDeliveryPickUpStoreQueryCondition extends PaginatedRequest {
  
}

export const createMallTradeDeliveryPickUpStore = (mall_trade_delivery_pick_up_store: MallTradeDeliveryPickUpStoreRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_trade_delivery_pick_up_store);
}

export const updateMallTradeDeliveryPickUpStore = (mall_trade_delivery_pick_up_store: MallTradeDeliveryPickUpStoreRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_trade_delivery_pick_up_store);
}

export const deleteMallTradeDeliveryPickUpStore = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallTradeDeliveryPickUpStore = (id: number): Promise<MallTradeDeliveryPickUpStoreResponse> => {
  return api.get<MallTradeDeliveryPickUpStoreResponse>(`${apis.get}/${id}`);
}

export const listMallTradeDeliveryPickUpStore = (): Promise<Array<MallTradeDeliveryPickUpStoreResponse>> => {
  return api.get<Array<MallTradeDeliveryPickUpStoreResponse>>(apis.list);
}

export const pageMallTradeDeliveryPickUpStore = (condition: MallTradeDeliveryPickUpStoreQueryCondition): Promise<PaginatedResponse<MallTradeDeliveryPickUpStoreResponse>> => {
  return api.get<PaginatedResponse<MallTradeDeliveryPickUpStoreResponse>>(apis.page, condition);
}

export const enableMallTradeDeliveryPickUpStore = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableMallTradeDeliveryPickUpStore = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}