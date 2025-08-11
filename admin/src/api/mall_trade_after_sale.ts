import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/mall/mall_trade_after_sale/create', // 新增
  update: '/mall/mall_trade_after_sale/update', // 修改
  delete: '/mall/mall_trade_after_sale/delete', // 删除
  get: '/mall/mall_trade_after_sale/get', // 单条查询
  list: '/mall/mall_trade_after_sale/list', // 列表查询
  page: '/mall/mall_trade_after_sale/page', // 分页查询
  enable: '/mall/mall_trade_after_sale/enable', // 启用
  disable: '/mall/mall_trade_after_sale/disable', // 禁用
}

export interface MallTradeAfterSaleRequest {
  id: number; // 售后编号
  no: string; // 售后单号
  type: number; // 售后类型
  status: number; // 售后状态
  way: number; // 售后方式
  user_id: number; // 用户编号
  apply_reason: string; // 申请原因
  apply_description: string; // 补充描述
  apply_file_ids: string; // 补充凭证图片
  order_id: number; // 订单编号
  order_no: string; // 订单流水号
  order_item_id: number; // 订单项编号
  spu_id: number; // 商品 SPU 编号
  spu_name: string; // 商品 SPU 名称
  sku_id: number; // 商品 SKU 编号
  properties: string; // 商品属性数组，JSON 格式
  file_id: number; // 商品图片ID
  count: number; // 购买数量
  audit_time: string; // 审批时间
  audit_user_id: number; // 审批人
  audit_reason: string; // 审批备注
  refund_price: number; // 退款金额，单位：分
  pay_refund_id: number; // 支付退款编号
  refund_time: string; // 退款时间
  logistics_id: number; // 退货物流公司编号
  logistics_no: string; // 退货物流单号
  delivery_time: string; // 退货时间
  receive_time: string; // 收货时间
  receive_reason: string; // 收货备注
  }

export interface MallTradeAfterSaleResponse {
  id: number; // 售后编号
  no: string; // 售后单号
  type: number; // 售后类型
  status: number; // 售后状态
  way: number; // 售后方式
  user_id: number; // 用户编号
  apply_reason: string; // 申请原因
  apply_description: string; // 补充描述
  apply_file_ids: string; // 补充凭证图片
  order_id: number; // 订单编号
  order_no: string; // 订单流水号
  order_item_id: number; // 订单项编号
  spu_id: number; // 商品 SPU 编号
  spu_name: string; // 商品 SPU 名称
  sku_id: number; // 商品 SKU 编号
  properties: string; // 商品属性数组，JSON 格式
  file_id: number; // 商品图片ID
  count: number; // 购买数量
  audit_time: string; // 审批时间
  audit_user_id: number; // 审批人
  audit_reason: string; // 审批备注
  refund_price: number; // 退款金额，单位：分
  pay_refund_id: number; // 支付退款编号
  refund_time: string; // 退款时间
  logistics_id: number; // 退货物流公司编号
  logistics_no: string; // 退货物流单号
  delivery_time: string; // 退货时间
  receive_time: string; // 收货时间
  receive_reason: string; // 收货备注
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallTradeAfterSaleQueryCondition extends PaginatedRequest {
  
}

export const createMallTradeAfterSale = (mall_trade_after_sale: MallTradeAfterSaleRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_trade_after_sale);
}

export const updateMallTradeAfterSale = (mall_trade_after_sale: MallTradeAfterSaleRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_trade_after_sale);
}

export const deleteMallTradeAfterSale = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallTradeAfterSale = (id: number): Promise<MallTradeAfterSaleResponse> => {
  return api.get<MallTradeAfterSaleResponse>(`${apis.get}/${id}`);
}

export const listMallTradeAfterSale = (): Promise<Array<MallTradeAfterSaleResponse>> => {
  return api.get<Array<MallTradeAfterSaleResponse>>(apis.list);
}

export const pageMallTradeAfterSale = (condition: MallTradeAfterSaleQueryCondition): Promise<PaginatedResponse<MallTradeAfterSaleResponse>> => {
  return api.get<PaginatedResponse<MallTradeAfterSaleResponse>>(apis.page, condition);
}

export const enableMallTradeAfterSale = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableMallTradeAfterSale = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}