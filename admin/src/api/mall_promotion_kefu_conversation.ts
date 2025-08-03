import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/mall_promotion_kefu_conversation/create', // 新增
  update: '/erp/mall_promotion_kefu_conversation/update', // 修改
  delete: '/erp/mall_promotion_kefu_conversation/delete', // 删除
  get: '/erp/mall_promotion_kefu_conversation/get', // 单条查询
  list: '/erp/mall_promotion_kefu_conversation/list', // 列表查询
  page: '/erp/mall_promotion_kefu_conversation/page', // 分页查询
}

export interface MallPromotionKefuConversationRequest {
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

export interface MallPromotionKefuConversationResponse {
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

export interface MallPromotionKefuConversationQueryCondition extends PaginatedRequest {
  
}

export const createMallPromotionKefuConversation = (mall_promotion_kefu_conversation: MallPromotionKefuConversationRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_promotion_kefu_conversation);
}

export const updateMallPromotionKefuConversation = (mall_promotion_kefu_conversation: MallPromotionKefuConversationRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_promotion_kefu_conversation);
}

export const deleteMallPromotionKefuConversation = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallPromotionKefuConversation = (id: number): Promise<MallPromotionKefuConversationResponse> => {
  return api.get<MallPromotionKefuConversationResponse>(`${apis.get}/${id}`);
}

export const listMallPromotionKefuConversation = (): Promise<Array<MallPromotionKefuConversationResponse>> => {
  return api.get<Array<MallPromotionKefuConversationResponse>>(apis.list);
}

export const pageMallPromotionKefuConversation = (condition: MallPromotionKefuConversationQueryCondition): Promise<PaginatedResponse<MallPromotionKefuConversationResponse>> => {
  return api.get<PaginatedResponse<MallPromotionKefuConversationResponse>>(apis.page, condition);
}
