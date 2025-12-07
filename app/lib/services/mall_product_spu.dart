import 'package:synerunify/models/base.dart';
import 'package:synerunify/services/mall_product_sku.dart';
import 'package:synerunify/utils/logger.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_product_spu/create', // 新增
  'update': '/mall/mall_product_spu/update', // 修改
  'delete': '/mall/mall_product_spu/delete', // 删除
  'get': '/mall/mall_product_spu/get', // 单条查询
  'list': '/mall/mall_product_spu/list', // 列表查询
  'page': '/mall/mall_product_spu/page', // 分页查询
  'enable': '/mall/mall_product_spu/enable', // 启用
  'disable': '/mall/mall_product_spu/disable', // 禁用

  'page_all': '/mall/mall_product_spu/page_all', // 分页查询
  'get_info_without_user': '/mall/mall_product_spu/get_info_without_user', // 单条查询
};

class MallProductSpuRequest {
  final int id; // 商品 SPU 编号，自增
  final String name; // 商品名称
  final String? keyword; // 关键字
  final String? introduction; // 商品简介
  final String? description; // 商品详情
  final int categoryId; // 商品分类编号
  final int? brandId; // 商品品牌编号
  final int fileId; // 商品封面ID
  final String? sliderFileIds; // 商品轮播图id数组，以逗号分隔最多上传15张
  final int sort; // 排序字段
  final int status; // 商品状态: 0 上架（开启） 1 下架（禁用） -1 回收
  final int? specType; // 规格类型：0 单规格 1 多规格
  final int price; // 商品价格，单位使用：分
  final int? marketPrice; // 市场价，单位使用：分
  final int costPrice; // 成本价，单位： 分
  final int stock; // 库存
  final String deliveryTypes; // 配送方式数组
  final int? deliveryTemplateId; // 物流配置模板编号
  final int giveIntegral; // 赠送积分
  final int? subCommissionType; // 分销类型
  final int? salesCount; // 商品销量
  final int? virtualSalesCount; // 虚拟销量
  final int? browseCount; // 商品点击量

  MallProductSpuRequest({
    required this.id,
    required this.name,
    this.keyword,
    this.introduction,
    this.description,
    required this.categoryId,
    this.brandId,
    required this.fileId,
    this.sliderFileIds,
    required this.sort,
    required this.status,
    this.specType,
    required this.price,
    this.marketPrice,
    required this.costPrice,
    required this.stock,
    required this.deliveryTypes,
    this.deliveryTemplateId,
    required this.giveIntegral,
    this.subCommissionType,
    this.salesCount,
    this.virtualSalesCount,
    this.browseCount,
  });

  factory MallProductSpuRequest.fromJson(Map<String, dynamic> json) {
    return MallProductSpuRequest(
      id: json['id'] as int,
      name: json['name'] as String,
      keyword: json['keyword'] as String?,
      introduction: json['introduction'] as String?,
      description: json['description'] as String?,
      categoryId: json['category_id'] as int,
      brandId: json['brand_id'] as int?,
      fileId: json['file_id'] as int,
      sliderFileIds: json['slider_file_ids'] as String?,
      sort: json['sort'] as int,
      status: json['status'] as int,
      specType: json['spec_type'] as int?,
      price: json['price'] as int,
      marketPrice: json['market_price'] as int?,
      costPrice: json['cost_price'] as int,
      stock: json['stock'] as int,
      deliveryTypes: json['delivery_types'] as String,
      deliveryTemplateId: json['delivery_template_id'] as int?,
      giveIntegral: json['give_integral'] as int,
      subCommissionType: json['sub_commission_type'] as int?,
      salesCount: json['sales_count'] as int?,
      virtualSalesCount: json['virtual_sales_count'] as int?,
      browseCount: json['browse_count'] as int?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'keyword': keyword,
      'introduction': introduction,
      'description': description,
      'category_id': categoryId,
      'brand_id': brandId,
      'file_id': fileId,
      'slider_file_ids': sliderFileIds,
      'sort': sort,
      'status': status,
      'spec_type': specType,
      'price': price,
      'market_price': marketPrice,
      'cost_price': costPrice,
      'stock': stock,
      'delivery_types': deliveryTypes,
      'delivery_template_id': deliveryTemplateId,
      'give_integral': giveIntegral,
      'sub_commission_type': subCommissionType,
      'sales_count': salesCount,
      'virtual_sales_count': virtualSalesCount,
      'browse_count': browseCount,
    };
  }
}

class MallProductSpuQueryCondition extends PaginatedRequest {
  final int? categoryId;

  MallProductSpuQueryCondition({
    required int page,
    required int size,
    this.categoryId,
    String? keyword,
    String? sortField,
    String? sort,
    String? filterField,
    String? filterOperator,
    String? filterValue,
  }) : super(
         page: page,
         size: size,
         keyword: keyword,
         sortField: sortField,
         sort: sort,
         filterField: filterField,
         filterOperator: filterOperator,
         filterValue: filterValue,
       );

  @override
  Map<String, dynamic> toJson() {
    final json = super.toJson();
    if (categoryId != null) {
      json['category_id'] = categoryId;
    }
    return json;
  }
}

class MallProductSpuResponse {
  final int id; // 商品 SPU 编号，自增
  final String name; // 商品名称
  final String? keyword; // 关键字
  final String? introduction; // 商品简介
  final String? description; // 商品详情
  final int categoryId; // 商品分类编号
  final int? brandId; // 商品品牌编号
  final int fileId; // 商品封面ID
  final String? sliderFileIds; // 商品轮播图id数组，以逗号分隔最多上传15张
  final int sort; // 排序字段
  final int status; // 商品状态: 0 上架（开启） 1 下架（禁用） -1 回收
  final int? specType; // 规格类型：0 单规格 1 多规格
  final int price; // 商品价格，单位使用：分
  final int? marketPrice; // 市场价，单位使用：分
  final int costPrice; // 成本价，单位： 分
  final int stock; // 库存
  final String deliveryTypes; // 配送方式数组
  final int? deliveryTemplateId; // 物流配置模板编号
  final int giveIntegral; // 赠送积分
  final int? subCommissionType; // 分销类型
  final int? salesCount; // 商品销量
  final int? virtualSalesCount; // 虚拟销量
  final int? browseCount; // 商品点击量
  // final int? creator; // 创建者ID
  // final String createTime; // 创建时间
  // final int? updater; // 更新者ID
  // final String updateTime; // 更新时间

  final int tenantId; // 租户ID

  final String? brandName; // 品牌名称
  final String? categoryName; // 分类名称
  final String? deliveryTemplateName; // 物流配置模板名称
  final List<MallProductSkuResponse>? skus; // 商品SKU列表
  final int? storeId; //店铺编号

  MallProductSpuResponse({
    required this.id,
    required this.name,
    this.keyword,
    this.introduction,
    this.description,
    required this.categoryId,
    this.brandId,
    required this.fileId,
    this.sliderFileIds,
    required this.sort,
    required this.status,
    this.specType,
    required this.price,
    this.marketPrice,
    required this.costPrice,
    required this.stock,
    required this.deliveryTypes,
    this.deliveryTemplateId,
    required this.giveIntegral,
    this.subCommissionType,
    this.salesCount,
    this.virtualSalesCount,
    this.browseCount,
    required this.tenantId,
    // this.creator,
    // required this.createTime,
    // this.updater,
    // required this.updateTime,
    this.brandName,
    this.categoryName,
    this.deliveryTemplateName,
    this.skus,
    this.storeId,
  });

  factory MallProductSpuResponse.fromJson(Map<String, dynamic> json) {
    return MallProductSpuResponse(
      id: json['id'] as int,
      name: json['name'] as String,
      keyword: json['keyword'] as String?,
      introduction: json['introduction'] as String?,
      description: json['description'] as String?,
      categoryId: json['category_id'] as int,
      brandId: json['brand_id'] as int?,
      fileId: json['file_id'] as int,
      sliderFileIds: json['slider_file_ids'] as String?,
      sort: json['sort'] as int,
      status: json['status'] as int,
      specType: json['spec_type'] as int?,
      price: json['price'] as int,
      marketPrice: json['market_price'] as int?,
      costPrice: json['cost_price'] as int,
      stock: json['stock'] as int,
      deliveryTypes: json['delivery_types'] as String,
      deliveryTemplateId: json['delivery_template_id'] as int?,
      giveIntegral: json['give_integral'] as int,
      subCommissionType: json['sub_commission_type'] as int?,
      salesCount: json['sales_count'] as int?,
      virtualSalesCount: json['virtual_sales_count'] as int?,
      browseCount: json['browse_count'] as int?,
      tenantId: json['tenant_id'] as int,
      // creator: json['creator'] as int?,
      // createTime: json['create_time'] as String,
      // updater: json['updater'] as int?,
      // updateTime: json['update_time'] as String,
      brandName: json['brand_name'] as String?,
      categoryName: json['category_name'] as String?,
      deliveryTemplateName: json['delivery_template_name'] as String?,
      skus: json['skus'] != null ? (json['skus'] as List).map((sku) => MallProductSkuResponse.fromJson(sku)).toList() : null,
      storeId: json['store_id'] as int?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'keyword': keyword,
      'introduction': introduction,
      'description': description,
      'category_id': categoryId,
      'brand_id': brandId,
      'file_id': fileId,
      'slider_file_ids': sliderFileIds,
      'sort': sort,
      'status': status,
      'spec_type': specType,
      'price': price,
      'market_price': marketPrice,
      'cost_price': costPrice,
      'stock': stock,
      'delivery_types': deliveryTypes,
      'delivery_template_id': deliveryTemplateId,
      'give_integral': giveIntegral,
      'sub_commission_type': subCommissionType,
      'sales_count': salesCount,
      'virtual_sales_count': virtualSalesCount,
      'browse_count': browseCount,
      'tenant_id': tenantId,
      // 'creator': creator,
      // 'create_time': createTime,
      // 'updater': updater,
      // 'update_time': updateTime,
      'brand_name': brandName,
      'category_name': categoryName,
      'delivery_template_name': deliveryTemplateName,
      'skus': skus?.map((sku) => sku.toJson()).toList(),
      'store_id': storeId,
    };
  }
}

class MallProductSpuService {
  final HttpClient _httpClient = HttpClient();

  Future<ApiResponse<int>> createMallProductSpu(
    MallProductSpuRequest mallProductSpu,
  ) async {
    return await _httpClient.post<int>(apis['create']!, data: mallProductSpu);
  }

  Future<ApiResponse<int>> updateMallProductSpu(
    MallProductSpuRequest mallProductSpu,
  ) async {
    return await _httpClient.post<int>(apis['update']!, data: mallProductSpu);
  }

  Future<ApiResponse<void>> deleteMallProductSpu(int id) async {
    return await _httpClient.post<void>('${apis['delete']!}/$id');
  }

  Future<ApiResponse<MallProductSpuResponse>> getMallProductSpu(int id) async {
    return await _httpClient.get<MallProductSpuResponse>('${apis['get']!}/$id');
  }

  Future<ApiResponse<MallProductSpuResponse>> getMallProductSpuInfoWithoutUser(int id) async {
    return await _httpClient.get<MallProductSpuResponse>('${apis['get_info_without_user']!}/$id', fromJson: (response) =>MallProductSpuResponse.fromJson(response));
  }

  Future<ApiResponse<List<MallProductSpuResponse>>> listMallProductSpu() async {
    return await _httpClient.get<List<MallProductSpuResponse>>(apis['list']!);
  }

  Future<ApiResponse<PaginatedResponse<MallProductSpuResponse>>>
  pageMallProductSpu(MallProductSpuQueryCondition condition) async {
    return await _httpClient.get<PaginatedResponse<MallProductSpuResponse>>(
      apis['page']!,
      queryParameters: condition.toJson(),
    );
  }

  Future<ApiResponse<PaginatedResponse<MallProductSpuResponse>>>
  pageAllMallProductSpu(MallProductSpuQueryCondition condition) async {
    return await _httpClient.get<PaginatedResponse<MallProductSpuResponse>>(
      apis['page_all']!,
      queryParameters: condition.toJson(),
      fromJson: (response) {
        Logger.info('page all list: ${response}');
        return PaginatedResponse.fromJson(
          response,
          (json) => MallProductSpuResponse.fromJson(json),
        );
      },
    );
  }

  Future<ApiResponse<void>> enableMallProductSpu(int id) async {
    return await _httpClient.post<void>('${apis['enable']!}/$id');
  }

  Future<ApiResponse<void>> disableMallProductSpu(int id) async {
    return await _httpClient.post<void>('${apis['disable']!}/$id');
  }
}
