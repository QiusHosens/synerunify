import { PaginatedRequest, PaginatedResponse } from "@/base/page";
import { UploadFile } from "@/components/CustomizedFileUpload";
import { api } from "@/utils/request";
import {
  MallProductSkuRequest,
  MallProductSkuResponse,
} from "./mall_product_sku";

const apis = {
  create: "/mall/mall_product_spu/create", // 新增
  update: "/mall/mall_product_spu/update", // 修改
  delete: "/mall/mall_product_spu/delete", // 删除
  get: "/mall/mall_product_spu/get", // 单条查询
  get_base: "/mall/mall_product_spu/get_base", // 单条查询
  get_info: "/mall/mall_product_spu/get_info", // 单条查询
  list: "/mall/mall_product_spu/list", // 列表查询
  page: "/mall/mall_product_spu/page", // 分页查询
  enable: "/mall/mall_product_spu/enable", // 启用
  disable: "/mall/mall_product_spu/disable", // 禁用
  publish: "/mall/mall_product_spu/publish", // 上架
  unpublish: "/mall/mall_product_spu/unpublish", // 下架
};

export interface MallProductSpuRequest {
  id?: number; // 商品 SPU 编号，自增
  name: string; // 商品名称
  keyword: string; // 关键字
  introduction: string; // 商品简介
  description: string; // 商品详情
  category_id: number; // 商品分类编号
  brand_id: number; // 商品品牌编号
  file_id: number; // 商品封面ID
  slider_file_ids: string; // 商品轮播图id数组，以逗号分隔最多上传15张
  sort: number; // 排序字段
  status: number; // 商品状态: 0 上架（开启） 1 下架（禁用） -1 回收
  spec_type: number; // 规格类型：0 单规格 1 多规格
  price: number; // 商品价格，单位使用：分
  market_price: number; // 市场价，单位使用：分
  cost_price: number; // 成本价，单位： 分
  stock: number; // 库存
  delivery_types: string; // 配送方式数组
  delivery_template_id?: number; // 物流配置模板编号
  give_integral: number; // 赠送积分
  sub_commission_type: number; // 分销类型
  virtual_sales_count: number; // 虚拟销量
  skus: MallProductSkuRequest[]; // sku列表

  file?: UploadFile | null; // 商品封面文件
}

export interface MallProductSpuPublishRequest {
  id?: number; // 商品 SPU 编号，自增
  store_ids: number[]; // 店铺编号数组
}

export interface MallProductSpuResponse {
  id: number; // 商品 SPU 编号，自增
  name: string; // 商品名称
  keyword: string; // 关键字
  introduction: string; // 商品简介
  description: string; // 商品详情
  category_id: number; // 商品分类编号
  brand_id: number; // 商品品牌编号
  file_id: number; // 商品封面ID
  slider_file_ids: string; // 商品轮播图id数组，以逗号分隔最多上传15张
  sort: number; // 排序字段
  status: number; // 商品状态: 0 上架（开启） 1 下架（禁用） -1 回收
  spec_type: number; // 规格类型：0 单规格 1 多规格
  price: number; // 商品价格，单位使用：分
  market_price: number; // 市场价，单位使用：分
  cost_price: number; // 成本价，单位： 分
  stock: number; // 库存
  delivery_types: string; // 配送方式数组
  delivery_template_id: number; // 物流配置模板编号
  give_integral: number; // 赠送积分
  sub_commission_type: number; // 分销类型
  sales_count: number; // 商品销量
  virtual_sales_count: number; // 虚拟销量
  browse_count: number; // 商品点击量
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
  skus: MallProductSkuResponse[]; // sku列表

  category_name?: string; // 商品分类名称
  brand_name?: string; // 商品品牌名称
  delivery_template_name?: string; // 物流配置模板名称

  previewUrl?: string; // 商品封面预览地址
  sliderPreviewUrls: string[]; // 商品轮播图预览地址
}

export interface MallProductSpuQueryCondition extends PaginatedRequest {}

export const createMallProductSpu = (
  mall_product_spu: MallProductSpuRequest
): Promise<number> => {
  return api.post<number>(apis.create, mall_product_spu);
};

export const updateMallProductSpu = (
  mall_product_spu: MallProductSpuRequest
): Promise<void> => {
  return api.post<void>(apis.update, mall_product_spu);
};

export const deleteMallProductSpu = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
};

export const getMallProductSpu = (
  id: number
): Promise<MallProductSpuResponse> => {
  return api.get<MallProductSpuResponse>(`${apis.get}/${id}`);
};

export const getBaseMallProductSpu = (
  id: number
): Promise<MallProductSpuResponse> => {
  return api.get<MallProductSpuResponse>(`${apis.get_base}/${id}`);
};

export const getInfoMallProductSpu = (
  id: number
): Promise<MallProductSpuResponse> => {
  return api.get<MallProductSpuResponse>(`${apis.get_info}/${id}`);
};

export const listMallProductSpu = (): Promise<
  Array<MallProductSpuResponse>
> => {
  return api.get<Array<MallProductSpuResponse>>(apis.list);
};

export const pageMallProductSpu = (
  condition: MallProductSpuQueryCondition
): Promise<PaginatedResponse<MallProductSpuResponse>> => {
  return api.get<PaginatedResponse<MallProductSpuResponse>>(
    apis.page,
    condition
  );
};

export const enableMallProductSpu = (id: number): Promise<void> => {
  return api.post<void>(`${apis.enable}/${id}`);
};

export const disableMallProductSpu = (id: number): Promise<void> => {
  return api.post<void>(`${apis.disable}/${id}`);
};

export const publishMallProductSpu = (
  mall_product_spu: MallProductSpuPublishRequest
): Promise<void> => {
  return api.post<void>(apis.publish, mall_product_spu);
};

export const unpublishMallProductSpu = (
  mall_product_spu: MallProductSpuPublishRequest
): Promise<void> => {
  return api.post<void>(apis.unpublish, mall_product_spu);
};
