import { PaginatedRequest, PaginatedResponse } from "@/base/page";
import { api } from "@/utils/request";
import { MallTradeDeliveryExpressTemplateChargeRequest, MallTradeDeliveryExpressTemplateChargeResponse } from "./mall_trade_delivery_express_template_charge";
import { MallTradeDeliveryExpressTemplateFreeRequest, MallTradeDeliveryExpressTemplateFreeResponse } from "./mall_trade_delivery_express_template_free";

const apis = {
  create: "/mall/mall_trade_delivery_express_template/create", // 新增
  update: "/mall/mall_trade_delivery_express_template/update", // 修改
  delete: "/mall/mall_trade_delivery_express_template/delete", // 删除
  get: "/mall/mall_trade_delivery_express_template/get", // 单条查询
  get_base: "/mall/mall_trade_delivery_express_template/get_base", // 单条查询
  list: "/mall/mall_trade_delivery_express_template/list", // 列表查询
  page: "/mall/mall_trade_delivery_express_template/page", // 分页查询
  enable: "/mall/mall_trade_delivery_express_template/enable", // 启用
  disable: "/mall/mall_trade_delivery_express_template/disable", // 禁用
};

export interface MallTradeDeliveryExpressTemplateRequest {
  id: number; // 编号
  name: string; // 模板名称
  charge_mode: number; // 配送计费方式
  sort: number; // 排序
  status: number; // 状态

  charges: MallTradeDeliveryExpressTemplateChargeRequest[]; // 运费列表
  frees: MallTradeDeliveryExpressTemplateFreeRequest[]; // 包邮列表
}

export interface MallTradeDeliveryExpressTemplateResponse {
  id: number; // 编号
  name: string; // 模板名称
  charge_mode: number; // 配送计费方式
  sort: number; // 排序
  status: number; // 状态
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间

  charges: MallTradeDeliveryExpressTemplateChargeResponse[]; // 运费列表
  frees: MallTradeDeliveryExpressTemplateFreeResponse[]; // 包邮列表
}

export interface MallTradeDeliveryExpressTemplateQueryCondition
  extends PaginatedRequest {}

export const createMallTradeDeliveryExpressTemplate = (
  mall_trade_delivery_express_template: MallTradeDeliveryExpressTemplateRequest
): Promise<number> => {
  return api.post<number>(apis.create, mall_trade_delivery_express_template);
};

export const updateMallTradeDeliveryExpressTemplate = (
  mall_trade_delivery_express_template: MallTradeDeliveryExpressTemplateRequest
): Promise<void> => {
  return api.post<void>(apis.update, mall_trade_delivery_express_template);
};

export const deleteMallTradeDeliveryExpressTemplate = (
  id: number
): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
};

export const getMallTradeDeliveryExpressTemplate = (
  id: number
): Promise<MallTradeDeliveryExpressTemplateResponse> => {
  return api.get<MallTradeDeliveryExpressTemplateResponse>(`${apis.get}/${id}`);
};

export const getBaseMallTradeDeliveryExpressTemplate = (
  id: number
): Promise<MallTradeDeliveryExpressTemplateResponse> => {
  return api.get<MallTradeDeliveryExpressTemplateResponse>(`${apis.get_base}/${id}`);
};

export const listMallTradeDeliveryExpressTemplate = (): Promise<
  Array<MallTradeDeliveryExpressTemplateResponse>
> => {
  return api.get<Array<MallTradeDeliveryExpressTemplateResponse>>(apis.list);
};

export const pageMallTradeDeliveryExpressTemplate = (
  condition: MallTradeDeliveryExpressTemplateQueryCondition
): Promise<PaginatedResponse<MallTradeDeliveryExpressTemplateResponse>> => {
  return api.get<PaginatedResponse<MallTradeDeliveryExpressTemplateResponse>>(
    apis.page,
    condition
  );
};

export const enableMallTradeDeliveryExpressTemplate = (
  id: number
): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
};

export const disableMallTradeDeliveryExpressTemplate = (
  id: number
): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
};
