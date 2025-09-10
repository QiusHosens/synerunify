import { PaginatedRequest, PaginatedResponse } from "@/base/page";
import { UploadFile } from "@/components/CustomizedFileUpload";
import { api } from "@/utils/request";

const apis = {
  create: "/mall/mall_product_sku/create", // 新增
  update: "/mall/mall_product_sku/update", // 修改
  delete: "/mall/mall_product_sku/delete", // 删除
  get: "/mall/mall_product_sku/get", // 单条查询
  list: "/mall/mall_product_sku/list", // 列表查询
  page: "/mall/mall_product_sku/page", // 分页查询
};

export interface PropertyValues {
  propertyId: number,
  propertyName: string,
  valueId: number,
  valueName: string;
}

export interface MallProductSkuRequest {
  id?: number; // 主键
  spu_id?: number; // spu编号
  properties: string; // 属性数组，JSON 格式 [{propertId: , valueId: }, {propertId: , valueId: }]
  price: number; // 商品价格，单位：分
  market_price: number; // 市场价，单位：分
  cost_price: number; // 成本价，单位： 分
  bar_code: string; // SKU 的条形码
  file_id?: number; // 图片ID
  stock: number; // 库存
  weight: number; // 商品重量，单位：kg 千克
  volume: number; // 商品体积，单位：m^3 平米
  first_brokerage_price: number; // 一级分销的佣金，单位：分
  second_brokerage_price: number; // 二级分销的佣金，单位：分

  file?: UploadFile | null;
  property_list?: PropertyValues[]; // 属性数组
  property_title?: string; // 
}

export interface MallProductSkuResponse {
  id?: number; // 主键
  spu_id?: number; // spu编号
  properties: string; // 属性数组，JSON 格式 [{propertId: , valueId: }, {propertId: , valueId: }]
  price: number; // 商品价格，单位：分
  market_price: number; // 市场价，单位：分
  cost_price: number; // 成本价，单位： 分
  bar_code: string; // SKU 的条形码
  file_id?: number; // 图片ID
  stock: number; // 库存
  weight: number; // 商品重量，单位：kg 千克
  volume: number; // 商品体积，单位：m^3 平米
  first_brokerage_price: number; // 一级分销的佣金，单位：分
  second_brokerage_price: number; // 二级分销的佣金，单位：分
  sales_count?: number; // 商品销量
  creator?: number; // 创建者ID
  create_time?: string; // 创建时间
  updater?: number; // 更新者ID
  update_time?: string; // 更新时间

  property_list?: PropertyValues[]; // 属性数组
}

export interface MallProductSkuQueryCondition extends PaginatedRequest {}

export const createMallProductSku = (
  mall_product_sku: MallProductSkuRequest
): Promise<number> => {
  return api.post<number>(apis.create, mall_product_sku);
};

export const updateMallProductSku = (
  mall_product_sku: MallProductSkuRequest
): Promise<void> => {
  return api.post<void>(apis.update, mall_product_sku);
};

export const deleteMallProductSku = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
};

export const getMallProductSku = (
  id: number
): Promise<MallProductSkuResponse> => {
  return api.get<MallProductSkuResponse>(`${apis.get}/${id}`);
};

export const listMallProductSku = (): Promise<
  Array<MallProductSkuResponse>
> => {
  return api.get<Array<MallProductSkuResponse>>(apis.list);
};

export const pageMallProductSku = (
  condition: MallProductSkuQueryCondition
): Promise<PaginatedResponse<MallProductSkuResponse>> => {
  return api.get<PaginatedResponse<MallProductSkuResponse>>(
    apis.page,
    condition
  );
};
