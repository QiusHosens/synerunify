import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/mall_trade_delivery_express_template_free/create', // 新增
  update: '/erp/mall_trade_delivery_express_template_free/update', // 修改
  delete: '/erp/mall_trade_delivery_express_template_free/delete', // 删除
  get: '/erp/mall_trade_delivery_express_template_free/get', // 单条查询
  list: '/erp/mall_trade_delivery_express_template_free/list', // 列表查询
  page: '/erp/mall_trade_delivery_express_template_free/page', // 分页查询
}

export interface MallTradeDeliveryExpressTemplateFreeRequest {
  id: number; // 编号
  template_id: number; // 快递运费模板编号
  area_ids: string; // 包邮区域 id
  free_price: number; // 包邮金额，单位：分
  free_count: number; // 包邮件数,
  }

export interface MallTradeDeliveryExpressTemplateFreeResponse {
  id: number; // 编号
  template_id: number; // 快递运费模板编号
  area_ids: string; // 包邮区域 id
  free_price: number; // 包邮金额，单位：分
  free_count: number; // 包邮件数,
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallTradeDeliveryExpressTemplateFreeQueryCondition extends PaginatedRequest {
  
}

export const createMallTradeDeliveryExpressTemplateFree = (mall_trade_delivery_express_template_free: MallTradeDeliveryExpressTemplateFreeRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_trade_delivery_express_template_free);
}

export const updateMallTradeDeliveryExpressTemplateFree = (mall_trade_delivery_express_template_free: MallTradeDeliveryExpressTemplateFreeRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_trade_delivery_express_template_free);
}

export const deleteMallTradeDeliveryExpressTemplateFree = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallTradeDeliveryExpressTemplateFree = (id: number): Promise<MallTradeDeliveryExpressTemplateFreeResponse> => {
  return api.get<MallTradeDeliveryExpressTemplateFreeResponse>(`${apis.get}/${id}`);
}

export const listMallTradeDeliveryExpressTemplateFree = (): Promise<Array<MallTradeDeliveryExpressTemplateFreeResponse>> => {
  return api.get<Array<MallTradeDeliveryExpressTemplateFreeResponse>>(apis.list);
}

export const pageMallTradeDeliveryExpressTemplateFree = (condition: MallTradeDeliveryExpressTemplateFreeQueryCondition): Promise<PaginatedResponse<MallTradeDeliveryExpressTemplateFreeResponse>> => {
  return api.get<PaginatedResponse<MallTradeDeliveryExpressTemplateFreeResponse>>(apis.page, condition);
}
