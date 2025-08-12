import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { UploadFile } from '@/components/CustomizedFileUpload';
import { api } from '@/utils/request';

const apis = {
  create: '/mall/mall_product_brand/create', // 新增
  update: '/mall/mall_product_brand/update', // 修改
  delete: '/mall/mall_product_brand/delete', // 删除
  get: '/mall/mall_product_brand/get', // 单条查询
  list: '/mall/mall_product_brand/list', // 列表查询
  page: '/mall/mall_product_brand/page', // 分页查询
  enable: '/mall/mall_product_brand/enable', // 启用
  disable: '/mall/mall_product_brand/disable', // 禁用
}

export interface MallProductBrandRequest {
  id: number; // 品牌编号
  name: string; // 品牌名称
  file_id: number; // 品牌图片ID
  sort: number; // 品牌排序
  description: string; // 品牌描述
  status: number; // 状态

  file?: UploadFile | null;
}

export interface MallProductBrandResponse {
  id: number; // 品牌编号
  name: string; // 品牌名称
  file_id: number; // 品牌图片ID
  sort: number; // 品牌排序
  description: string; // 品牌描述
  status: number; // 状态
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间

  previewUrl?: string; // 图片预览地址
}

export interface MallProductBrandQueryCondition extends PaginatedRequest {

}

export const createMallProductBrand = (mall_product_brand: MallProductBrandRequest): Promise<number> => {
  return api.post<number>(apis.create, mall_product_brand);
}

export const updateMallProductBrand = (mall_product_brand: MallProductBrandRequest): Promise<void> => {
  return api.post<void>(apis.update, mall_product_brand);
}

export const deleteMallProductBrand = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getMallProductBrand = (id: number): Promise<MallProductBrandResponse> => {
  return api.get<MallProductBrandResponse>(`${apis.get}/${id}`);
}

export const listMallProductBrand = (): Promise<Array<MallProductBrandResponse>> => {
  return api.get<Array<MallProductBrandResponse>>(apis.list);
}

export const pageMallProductBrand = (condition: MallProductBrandQueryCondition): Promise<PaginatedResponse<MallProductBrandResponse>> => {
  return api.get<PaginatedResponse<MallProductBrandResponse>>(apis.page, condition);
}

export const enableMallProductBrand = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
}

export const disableMallProductBrand = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
}