import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/mall/mall_trade_delivery_express_template_charge/create', // 新增
  update: '/mall/mall_trade_delivery_express_template_charge/update', // 修改
  delete: '/mall/mall_trade_delivery_express_template_charge/delete', // 删除
  get: '/mall/mall_trade_delivery_express_template_charge/get', // 单条查询
  list: '/mall/mall_trade_delivery_express_template_charge/list', // 列表查询
  page: '/mall/mall_trade_delivery_express_template_charge/page', // 分页查询
}

export interface MallTradeDeliveryExpressTemplateChargeRequest {
  id: number; // 编号，自增
  template_id: number; // 快递运费模板编号
  area_ids: string; // 配送区域 id
  charge_mode: number; // 配送计费方式
  start_count: number; // 首件数量
  start_price: number; // 起步价，单位：分
  extra_count: number; // 续件数量
  extra_price: number; // 额外价，单位：分
}

export interface MallTradeDeliveryExpressTemplateChargeResponse {
  id: number; // 编号，自增
  template_id: number; // 快递运费模板编号
  area_ids: string; // 配送区域 id
  charge_mode: number; // 配送计费方式
  start_count: number; // 首件数量
  start_price: number; // 起步价，单位：分
  extra_count: number; // 续件数量
  extra_price: number; // 额外价，单位：分
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
}

export interface MallTradeDeliveryExpressTemplateChargeQueryCondition extends PaginatedRequest {

}

export const createMallTradeDeliveryExpressTemplateCharge = (mall_trade_delivery_express_template_charge: MallTradeDeliveryExpressTemplateChargeRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_trade_delivery_express_template_charge);
}

export const updateMallTradeDeliveryExpressTemplateCharge = (mall_trade_delivery_express_template_charge: MallTradeDeliveryExpressTemplateChargeRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_trade_delivery_express_template_charge);
}

export const deleteMallTradeDeliveryExpressTemplateCharge = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallTradeDeliveryExpressTemplateCharge = (id: number): Promise<MallTradeDeliveryExpressTemplateChargeResponse> => {
  return api.get<MallTradeDeliveryExpressTemplateChargeResponse>(`${apis.get}/${id}`);
}

export const listMallTradeDeliveryExpressTemplateCharge = (): Promise<Array<MallTradeDeliveryExpressTemplateChargeResponse>> => {
  return api.get<Array<MallTradeDeliveryExpressTemplateChargeResponse>>(apis.list);
}

export const pageMallTradeDeliveryExpressTemplateCharge = (condition: MallTradeDeliveryExpressTemplateChargeQueryCondition): Promise<PaginatedResponse<MallTradeDeliveryExpressTemplateChargeResponse>> => {
  return api.get<PaginatedResponse<MallTradeDeliveryExpressTemplateChargeResponse>>(apis.page, condition);
}
