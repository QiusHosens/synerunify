import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { UploadFile } from '@/components/CustomizedFileUpload';
import { api } from '@/utils/request';

const apis = {
  create: '/mall/mall_store/create', // 新增
  update: '/mall/mall_store/update', // 修改
  delete: '/mall/mall_store/delete', // 删除
  get: '/mall/mall_store/get', // 单条查询
  list: '/mall/mall_store/list', // 列表查询
  page: '/mall/mall_store/page', // 分页查询
  open: '/mall/mall_store/open', // 开始营业
  pause: '/mall/mall_store/pause', // 暂停营业
  accept: '/mall/mall_store/accept', // 审核通过
  reject: '/mall/mall_store/reject', // 审核驳回
  close: '/mall/mall_store/close', // 永久关闭
}

export interface MallStoreRequest {
  id?: number; // 店铺编号
  name: string; // 店铺名称
  short_name: string; // 店铺简称
  file_id: number; // 店铺封面ID
  slider_file_ids: string; // 店铺轮播图id数组，以逗号分隔最多上传15张
  sort: number; // 店铺排序
  slogan: string; // 店铺广告语
  description: string; // 店铺描述
  tags: string; // 店铺标签，逗号分隔，如：正品保障,7天无理由

  file?: UploadFile | null; // 商品封面文件
}

export interface MallStoreResponse {
  id: number; // 店铺编号
  number: string; // 店铺编号（业务唯一，例：S202410080001）
  name: string; // 店铺名称
  short_name: string; // 店铺简称
  file_id: number; // 店铺封面ID
  slider_file_ids: string; // 店铺轮播图id数组，以逗号分隔最多上传15张
  sort: number; // 店铺排序
  slogan: string; // 店铺广告语
  description: string; // 店铺描述
  tags: string; // 店铺标签，逗号分隔，如：正品保障,7天无理由
  status: number; // 状态:0-待审核,1-营业中,2-暂停营业,3-审核驳回,4-永久关闭
  audit_remark: string; // 审核备注
  audit_time: string; // 审核通过时间
  score_desc: number; // 描述相符评分
  score_service: number; // 服务态度评分
  score_delivery: number; // 发货速度评分
  total_sales_amount: number; // 累计销售额
  total_order_count: number; // 累计订单数
  total_goods_count: number; // 商品总数
  total_fans_count: number; // 粉丝数
  is_recommend: number; // 是否平台推荐：0-否,1-是
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间

  previewUrl?: string; // 店铺封面预览地址
  sliderPreviewUrls: string[]; // 店铺轮播图预览地址
}

export interface MallStoreRejectRequest {
  id: number; // 店铺编号
  audit_remark: string; // 审核备注
}

export interface MallStoreQueryCondition extends PaginatedRequest {

}

export const createMallStore = (mall_store: MallStoreRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_store);
}

export const updateMallStore = (mall_store: MallStoreRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_store);
}

export const deleteMallStore = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallStore = (id: number): Promise<MallStoreResponse> => {
  return api.get<MallStoreResponse>(`${apis.get}/${id}`);
}

export const listMallStore = (): Promise<Array<MallStoreResponse>> => {
  return api.get<Array<MallStoreResponse>>(apis.list);
}

export const pageMallStore = (condition: MallStoreQueryCondition): Promise<PaginatedResponse<MallStoreResponse>> => {
  return api.get<PaginatedResponse<MallStoreResponse>>(apis.page, condition);
}

export const openMallStore = (id: number): Promise<void> => {
  return api.post<void>(`${apis.open}/${id}`);
}

export const pauseMallStore = (id: number): Promise<void> => {
  return api.post<void>(`${apis.pause}/${id}`);
}

export const acceptMallStore = (id: number): Promise<void> => {
  return api.post<void>(`${apis.accept}/${id}`);
}

export const rejectMallStore = (mall_store: MallStoreRejectRequest): Promise<void> => {
  return api.post<void>(apis.reject, mall_store);
}

export const closeMallStore = (id: number): Promise<void> => {
  return api.post<void>(`${apis.close}/${id}`);
}