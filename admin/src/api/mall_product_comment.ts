import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/mall/mall_product_comment/create', // 新增
  update: '/mall/mall_product_comment/update', // 修改
  delete: '/mall/mall_product_comment/delete', // 删除
  get: '/mall/mall_product_comment/get', // 单条查询
  list: '/mall/mall_product_comment/list', // 列表查询
  page: '/mall/mall_product_comment/page', // 分页查询
}

export interface MallProductCommentRequest {
  id: number; // 评论编号，主键自增
  user_id: number; // 评价人的用户编号，关联 MemberUserDO 的 id 编号
  user_nickname: string; // 评价人名称
  user_avatar: string; // 评价人头像
  anonymous: boolean; // 是否匿名
  order_id: number; // 交易订单编号，关联 TradeOrderDO 的 id 编号
  order_item_id: number; // 交易订单项编号，关联 TradeOrderItemDO 的 id 编号
  spu_id: number; // 商品 SPU 编号，关联 ProductSpuDO 的 id
  spu_name: string; // 商品 SPU 名称
  sku_id: number; // 商品 SKU 编号，关联 ProductSkuDO 的 id 编号
  sku_pic_url: string; // 图片地址
  sku_properties: string; // 属性数组，JSON 格式 [{propertId: , valueId: }, {propertId: , valueId: }]
  visible: boolean; // 是否可见，true:显示false:隐藏
  scores: number; // 评分星级1-5分
  description_scores: number; // 描述星级 1-5 星
  benefit_scores: number; // 服务星级 1-5 星
  content: string; // 评论内容
  pic_urls: string; // 评论图片地址数组
  reply_status: boolean; // 商家是否回复
  reply_user_id: number; // 回复管理员编号，关联 AdminUserDO 的 id 编号
  reply_content: string; // 商家回复内容
  reply_time: string; // 商家回复时间
  }

export interface MallProductCommentResponse {
  id: number; // 评论编号，主键自增
  user_id: number; // 评价人的用户编号，关联 MemberUserDO 的 id 编号
  user_nickname: string; // 评价人名称
  user_avatar: string; // 评价人头像
  anonymous: boolean; // 是否匿名
  order_id: number; // 交易订单编号，关联 TradeOrderDO 的 id 编号
  order_item_id: number; // 交易订单项编号，关联 TradeOrderItemDO 的 id 编号
  spu_id: number; // 商品 SPU 编号，关联 ProductSpuDO 的 id
  spu_name: string; // 商品 SPU 名称
  sku_id: number; // 商品 SKU 编号，关联 ProductSkuDO 的 id 编号
  sku_pic_url: string; // 图片地址
  sku_properties: string; // 属性数组，JSON 格式 [{propertId: , valueId: }, {propertId: , valueId: }]
  visible: boolean; // 是否可见，true:显示false:隐藏
  scores: number; // 评分星级1-5分
  description_scores: number; // 描述星级 1-5 星
  benefit_scores: number; // 服务星级 1-5 星
  content: string; // 评论内容
  pic_urls: string; // 评论图片地址数组
  reply_status: boolean; // 商家是否回复
  reply_user_id: number; // 回复管理员编号，关联 AdminUserDO 的 id 编号
  reply_content: string; // 商家回复内容
  reply_time: string; // 商家回复时间
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  }

export interface MallProductCommentQueryCondition extends PaginatedRequest {
  
}

export const createMallProductComment = (mall_product_comment: MallProductCommentRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_product_comment);
}

export const updateMallProductComment = (mall_product_comment: MallProductCommentRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_product_comment);
}

export const deleteMallProductComment = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallProductComment = (id: number): Promise<MallProductCommentResponse> => {
  return api.get<MallProductCommentResponse>(`${apis.get}/${id}`);
}

export const listMallProductComment = (): Promise<Array<MallProductCommentResponse>> => {
  return api.get<Array<MallProductCommentResponse>>(apis.list);
}

export const pageMallProductComment = (condition: MallProductCommentQueryCondition): Promise<PaginatedResponse<MallProductCommentResponse>> => {
  return api.get<PaginatedResponse<MallProductCommentResponse>>(apis.page, condition);
}
