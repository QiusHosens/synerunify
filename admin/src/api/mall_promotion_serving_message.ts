import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/mall/mall_promotion_serving_message/create', // 新增
  update: '/mall/mall_promotion_serving_message/update', // 修改
  delete: '/mall/mall_promotion_serving_message/delete', // 删除
  get: '/mall/mall_promotion_serving_message/get', // 单条查询
  list: '/mall/mall_promotion_serving_message/list', // 列表查询
  page: '/mall/mall_promotion_serving_message/page', // 分页查询
}

export interface MallPromotionServingMessageRequest {
  id: number; // 编号
  conversation_id: number; // 会话编号
  sender_id: number; // 发送人编号
  sender_type: number; // 发送人类型
  receiver_id: number; // 接收人编号
  receiver_type: number; // 接收人类型
  content_type: number; // 消息类型
  content: string; // 消息
  read_status: boolean; // 是否已读
  }

export interface MallPromotionServingMessageResponse {
  id: number; // 编号
  conversation_id: number; // 会话编号
  sender_id: number; // 发送人编号
  sender_type: number; // 发送人类型
  receiver_id: number; // 接收人编号
  receiver_type: number; // 接收人类型
  content_type: number; // 消息类型
  content: string; // 消息
  read_status: boolean; // 是否已读
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallPromotionServingMessageQueryCondition extends PaginatedRequest {
  
}

export const createMallPromotionServingMessage = (mall_promotion_serving_message: MallPromotionServingMessageRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_promotion_serving_message);
}

export const updateMallPromotionServingMessage = (mall_promotion_serving_message: MallPromotionServingMessageRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_promotion_serving_message);
}

export const deleteMallPromotionServingMessage = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallPromotionServingMessage = (id: number): Promise<MallPromotionServingMessageResponse> => {
  return api.get<MallPromotionServingMessageResponse>(`${apis.get}/${id}`);
}

export const listMallPromotionServingMessage = (): Promise<Array<MallPromotionServingMessageResponse>> => {
  return api.get<Array<MallPromotionServingMessageResponse>>(apis.list);
}

export const pageMallPromotionServingMessage = (condition: MallPromotionServingMessageQueryCondition): Promise<PaginatedResponse<MallPromotionServingMessageResponse>> => {
  return api.get<PaginatedResponse<MallPromotionServingMessageResponse>>(apis.page, condition);
}
