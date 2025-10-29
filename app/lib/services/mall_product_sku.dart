import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_product_sku/create', // 新增
  'update': '/mall/mall_product_sku/update', // 修改
  'delete': '/mall/mall_product_sku/delete', // 删除
  'get': '/mall/mall_product_sku/get', // 单条查询
  'list': '/mall/mall_product_sku/list', // 列表查询
  'page': '/mall/mall_product_sku/page', // 分页查询
};

class MallProductSkuRequest {
  final int id; // 主键
  final int spuId; // spu编号
  final String? properties; // 属性数组，JSON 格式 [{propertId: , valueId: }, {propertId: , valueId: }]
  final int price; // 商品价格，单位：分
  final int? marketPrice; // 市场价，单位：分
  final int costPrice; // 成本价，单位： 分
  final String? barCode; // SKU 的条形码
  final int fileId; // 图片ID
  final int? stock; // 库存
  final double? weight; // 商品重量，单位：kg 千克
  final double? volume; // 商品体积，单位：m^3 平米
  final int? firstBrokeragePrice; // 一级分销的佣金，单位：分
  final int? secondBrokeragePrice; // 二级分销的佣金，单位：分
  final int? salesCount; // 商品销量
  

  MallProductSkuRequest({
    required this.id,
    required this.spuId,
    this.properties,
    required this.price,
    this.marketPrice,
    required this.costPrice,
    this.barCode,
    required this.fileId,
    this.stock,
    this.weight,
    this.volume,
    this.firstBrokeragePrice,
    this.secondBrokeragePrice,
    this.salesCount,
    });

  factory MallProductSkuRequest.fromJson(Map<String, dynamic> json) {
    return MallProductSkuRequest(
      id: json['id'] as int,
      spuId: json['spu_id'] as int,
      properties: json['properties'] as String?,
      price: json['price'] as int,
      marketPrice: json['market_price'] as int?,
      costPrice: json['cost_price'] as int,
      barCode: json['bar_code'] as String?,
      fileId: json['file_id'] as int,
      stock: json['stock'] as int?,
      weight: json['weight'] as double?,
      volume: json['volume'] as double?,
      firstBrokeragePrice: json['first_brokerage_price'] as int?,
      secondBrokeragePrice: json['second_brokerage_price'] as int?,
      salesCount: json['sales_count'] as int?,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'spu_id': spuId,
      'properties': properties,
      'price': price,
      'market_price': marketPrice,
      'cost_price': costPrice,
      'bar_code': barCode,
      'file_id': fileId,
      'stock': stock,
      'weight': weight,
      'volume': volume,
      'first_brokerage_price': firstBrokeragePrice,
      'second_brokerage_price': secondBrokeragePrice,
      'sales_count': salesCount,
      };
  }
}

class MallProductSkuQueryCondition extends PaginatedRequest {
  MallProductSkuQueryCondition({
    required int page,
    required int size,
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
}

class MallProductSkuResponse {
  final int id; // 主键
  final int spuId; // spu编号
  final String? properties; // 属性数组，JSON 格式 [{propertId: , valueId: }, {propertId: , valueId: }]
  final int price; // 商品价格，单位：分
  final int? marketPrice; // 市场价，单位：分
  final int costPrice; // 成本价，单位： 分
  final String? barCode; // SKU 的条形码
  final int fileId; // 图片ID
  final int? stock; // 库存
  final double? weight; // 商品重量，单位：kg 千克
  final double? volume; // 商品体积，单位：m^3 平米
  final int? firstBrokeragePrice; // 一级分销的佣金，单位：分
  final int? secondBrokeragePrice; // 二级分销的佣金，单位：分
  final int? salesCount; // 商品销量
  // final int? creator; // 创建者ID
  // final DateTime createTime; // 创建时间
  // final int? updater; // 更新者ID
  // final DateTime updateTime; // 更新时间

  MallProductSkuResponse({
    required this.id,
    required this.spuId,
    this.properties,
    required this.price,
    this.marketPrice,
    required this.costPrice,
    this.barCode,
    required this.fileId,
    this.stock,
    this.weight,
    this.volume,
    this.firstBrokeragePrice,
    this.secondBrokeragePrice,
    this.salesCount,
    // this.creator,
    // required this.createTime,
    // this.updater,
    // required this.updateTime,
    });

  factory MallProductSkuResponse.fromJson(Map<String, dynamic> json) {
    return MallProductSkuResponse(
      id: json['id'] as int,
      spuId: json['spu_id'] as int,
      properties: json['properties'] as String?,
      price: json['price'] as int,
      marketPrice: json['market_price'] as int?,
      costPrice: json['cost_price'] as int,
      barCode: json['bar_code'] as String?,
      fileId: json['file_id'] as int,
      stock: json['stock'] as int?,
      weight: json['weight'] as double?,
      volume: json['volume'] as double?,
      firstBrokeragePrice: json['first_brokerage_price'] as int?,
      secondBrokeragePrice: json['second_brokerage_price'] as int?,
      salesCount: json['sales_count'] as int?,
      // creator: json['creator'] as int?,
      // createTime: json['create_time'] as DateTime,
      // updater: json['updater'] as int?,
      // updateTime: json['update_time'] as DateTime,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'spu_id': spuId,
      'properties': properties,
      'price': price,
      'market_price': marketPrice,
      'cost_price': costPrice,
      'bar_code': barCode,
      'file_id': fileId,
      'stock': stock,
      'weight': weight,
      'volume': volume,
      'first_brokerage_price': firstBrokeragePrice,
      'second_brokerage_price': secondBrokeragePrice,
      'sales_count': salesCount,
      // 'creator': creator,
      // 'create_time': createTime,
      // 'updater': updater,
      // 'update_time': updateTime,
      };
  }
}

class MallProductSkuService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallProductSku(MallProductSkuRequest mallProductSku) async {
        return await _httpClient.post<int>(apis['create']!, data: mallProductSku);
    }

    Future<ApiResponse<int>> updateMallProductSku(MallProductSkuRequest mallProductSku) async {
        return await _httpClient.post<int>(apis['update']!, data: mallProductSku);
    }

    Future<ApiResponse<void>> deleteMallProductSku(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallProductSkuResponse>> getMallProductSku(int id) async {
        return await _httpClient.get<MallProductSkuResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallProductSkuResponse>>> listMallProductSku() async {
        return await _httpClient.get<List<MallProductSkuResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallProductSkuResponse>>> pageMallProductSku(MallProductSkuQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallProductSkuResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
}