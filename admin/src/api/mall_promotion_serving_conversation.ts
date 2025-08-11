import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/mall/mall_promotion_serving_conversation/create', // 新增
  update: '/mall/mall_promotion_serving_conversation/update', // 修改
  delete: '/mall/mall_promotion_serving_conversation/delete', // 删除
  get: '/mall/mall_promotion_serving_conversation/get', // 单条查询
  list: '/mall/mall_promotion_serving_conversation/list', // 列表查询
  page: '/mall/mall_promotion_serving_conversation/page', // 分页查询
}

export interface MallPromotionServingConversationRequest {
  id: number; // 编号
  user_id: number; // 会话所属用户
  last_message_time: string; // 最后聊天时间
  last_message_content: string; // 最后聊天内容
  last_message_content_type: number; // 最后发送的消息类型
  admin_pinned: boolean; // 管理端置顶
  user_deleted: boolean; // 用户是否可见
  admin_deleted: boolean; // 管理员是否可见
  admin_unread_message_count: number; // 管理员未读消息数
  }

export interface MallPromotionServingConversationResponse {
  id: number; // 编号
  user_id: number; // 会话所属用户
  last_message_time: string; // 最后聊天时间
  last_message_content: string; // 最后聊天内容
  last_message_content_type: number; // 最后发送的消息类型
  admin_pinned: boolean; // 管理端置顶
  user_deleted: boolean; // 用户是否可见
  admin_deleted: boolean; // 管理员是否可见
  admin_unread_message_count: number; // 管理员未读消息数
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallPromotionServingConversationQueryCondition extends PaginatedRequest {
  
}

export const createMallPromotionServingConversation = (mall_promotion_serving_conversation: MallPromotionServingConversationRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_promotion_serving_conversation);
}

export const updateMallPromotionServingConversation = (mall_promotion_serving_conversation: MallPromotionServingConversationRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_promotion_serving_conversation);
}

export const deleteMallPromotionServingConversation = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallPromotionServingConversation = (id: number): Promise<MallPromotionServingConversationResponse> => {
  return api.get<MallPromotionServingConversationResponse>(`${apis.get}/${id}`);
}

export const listMallPromotionServingConversation = (): Promise<Array<MallPromotionServingConversationResponse>> => {
  return api.get<Array<MallPromotionServingConversationResponse>>(apis.list);
}

export const pageMallPromotionServingConversation = (condition: MallPromotionServingConversationQueryCondition): Promise<PaginatedResponse<MallPromotionServingConversationResponse>> => {
  return api.get<PaginatedResponse<MallPromotionServingConversationResponse>>(apis.page, condition);
}
