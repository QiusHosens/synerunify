import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/mall_promotion_kefu_message/create', // 新增
  update: '/erp/mall_promotion_kefu_message/update', // 修改
  delete: '/erp/mall_promotion_kefu_message/delete', // 删除
  get: '/erp/mall_promotion_kefu_message/get', // 单条查询
  list: '/erp/mall_promotion_kefu_message/list', // 列表查询
  page: '/erp/mall_promotion_kefu_message/page', // 分页查询
}

export interface MallPromotionKefuMessageRequest {
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

export interface MallPromotionKefuMessageResponse {
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

export interface MallPromotionKefuMessageQueryCondition extends PaginatedRequest {
  
}

export const createMallPromotionKefuMessage = (mall_promotion_kefu_message: MallPromotionKefuMessageRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_promotion_kefu_message);
}

export const updateMallPromotionKefuMessage = (mall_promotion_kefu_message: MallPromotionKefuMessageRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_promotion_kefu_message);
}

export const deleteMallPromotionKefuMessage = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallPromotionKefuMessage = (id: number): Promise<MallPromotionKefuMessageResponse> => {
  return api.get<MallPromotionKefuMessageResponse>(`${apis.get}/${id}`);
}

export const listMallPromotionKefuMessage = (): Promise<Array<MallPromotionKefuMessageResponse>> => {
  return api.get<Array<MallPromotionKefuMessageResponse>>(apis.list);
}

export const pageMallPromotionKefuMessage = (condition: MallPromotionKefuMessageQueryCondition): Promise<PaginatedResponse<MallPromotionKefuMessageResponse>> => {
  return api.get<PaginatedResponse<MallPromotionKefuMessageResponse>>(apis.page, condition);
}
