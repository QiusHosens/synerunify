import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_promotion_point_product/create', // 新增
  'update': '/mall/mall_promotion_point_product/update', // 修改
  'delete': '/mall/mall_promotion_point_product/delete', // 删除
  'get': '/mall/mall_promotion_point_product/get', // 单条查询
  'list': '/mall/mall_promotion_point_product/list', // 列表查询
  'page': '/mall/mall_promotion_point_product/page', // 分页查询
};

class MallPromotionPointProductRequest {
  final int id; // 积分商城商品编号
  final int activityId; // 积分商城活动 id
  final int spuId; // 商品 SPU 编号
  final int skuId; // 商品 SKU 编号
  final int count; // 可兑换次数
  final int point; // 所需兑换积分
  final int price; // 所需兑换金额，单位：分
  final int stock; // 积分商城商品库存
  final int activityStatus; // 积分商城商品状态
  

  MallPromotionPointProductRequest({
    required this.id,
    required this.activityId,
    required this.spuId,
    required this.skuId,
    required this.count,
    required this.point,
    required this.price,
    required this.stock,
    required this.activityStatus,
    });

  factory MallPromotionPointProductRequest.fromJson(Map<String, dynamic> json) {
    return MallPromotionPointProductRequest(
      id: json['id'] as int,
      activityId: json['activity_id'] as int,
      spuId: json['spu_id'] as int,
      skuId: json['sku_id'] as int,
      count: json['count'] as int,
      point: json['point'] as int,
      price: json['price'] as int,
      stock: json['stock'] as int,
      activityStatus: json['activity_status'] as int,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'activity_id': activityId,
      'spu_id': spuId,
      'sku_id': skuId,
      'count': count,
      'point': point,
      'price': price,
      'stock': stock,
      'activity_status': activityStatus,
      };
  }
}

class MallPromotionPointProductQueryCondition extends PaginatedRequest {
  MallPromotionPointProductQueryCondition({
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

class MallPromotionPointProductResponse {
  final int id; // 积分商城商品编号
  final int activityId; // 积分商城活动 id
  final int spuId; // 商品 SPU 编号
  final int skuId; // 商品 SKU 编号
  final int count; // 可兑换次数
  final int point; // 所需兑换积分
  final int price; // 所需兑换金额，单位：分
  final int stock; // 积分商城商品库存
  final int activityStatus; // 积分商城商品状态
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallPromotionPointProductResponse({
    required this.id,
    required this.activityId,
    required this.spuId,
    required this.skuId,
    required this.count,
    required this.point,
    required this.price,
    required this.stock,
    required this.activityStatus,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallPromotionPointProductResponse.fromJson(Map<String, dynamic> json) {
    return MallPromotionPointProductResponse(
      id: json['id'] as int,
      activityId: json['activity_id'] as int,
      spuId: json['spu_id'] as int,
      skuId: json['sku_id'] as int,
      count: json['count'] as int,
      point: json['point'] as int,
      price: json['price'] as int,
      stock: json['stock'] as int,
      activityStatus: json['activity_status'] as int,
      creator: json['creator'] as int?,
      createTime: json['create_time'] as DateTime,
      updater: json['updater'] as int?,
      updateTime: json['update_time'] as DateTime,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'activity_id': activityId,
      'spu_id': spuId,
      'sku_id': skuId,
      'count': count,
      'point': point,
      'price': price,
      'stock': stock,
      'activity_status': activityStatus,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallPromotionPointProductService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallPromotionPointProduct(MallPromotionPointProductRequest mallPromotionPointProduct) async {
        return await _httpClient.post<int>(apis['create']!, data: mallPromotionPointProduct);
    }

    Future<ApiResponse<int>> updateMallPromotionPointProduct(MallPromotionPointProductRequest mallPromotionPointProduct) async {
        return await _httpClient.post<int>(apis['update']!, data: mallPromotionPointProduct);
    }

    Future<ApiResponse<void>> deleteMallPromotionPointProduct(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallPromotionPointProductResponse>> getMallPromotionPointProduct(int id) async {
        return await _httpClient.get<MallPromotionPointProductResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallPromotionPointProductResponse>>> listMallPromotionPointProduct() async {
        return await _httpClient.get<List<MallPromotionPointProductResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallPromotionPointProductResponse>>> pageMallPromotionPointProduct(MallPromotionPointProductQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallPromotionPointProductResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
}