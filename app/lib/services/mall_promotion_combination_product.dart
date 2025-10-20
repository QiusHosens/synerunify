import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_promotion_combination_product/create', // 新增
  'update': '/mall/mall_promotion_combination_product/update', // 修改
  'delete': '/mall/mall_promotion_combination_product/delete', // 删除
  'get': '/mall/mall_promotion_combination_product/get', // 单条查询
  'list': '/mall/mall_promotion_combination_product/list', // 列表查询
  'page': '/mall/mall_promotion_combination_product/page', // 分页查询
  'enable': '/mall/mall_promotion_combination_product/enable', // 启用
  'disable': '/mall/mall_promotion_combination_product/disable', // 禁用
};

class MallPromotionCombinationProductRequest {
  final int id; // 编号
  final int? activityId; // 拼团活动编号
  final int? spuId; // 商品 SPU 编号
  final int? skuId; // 商品 SKU 编号
  final int status; // 状态
  final DateTime activityStartTime; // 活动开始时间点
  final DateTime activityEndTime; // 活动结束时间点
  final int combinationPrice; // 拼团价格，单位分
  

  MallPromotionCombinationProductRequest({
    required this.id,
    this.activityId,
    this.spuId,
    this.skuId,
    required this.status,
    required this.activityStartTime,
    required this.activityEndTime,
    required this.combinationPrice,
    });

  factory MallPromotionCombinationProductRequest.fromJson(Map<String, dynamic> json) {
    return MallPromotionCombinationProductRequest(
      id: json['id'] as int,
      activityId: json['activity_id'] as int?,
      spuId: json['spu_id'] as int?,
      skuId: json['sku_id'] as int?,
      status: json['status'] as int,
      activityStartTime: json['activity_start_time'] as DateTime,
      activityEndTime: json['activity_end_time'] as DateTime,
      combinationPrice: json['combination_price'] as int,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'activity_id': activityId,
      'spu_id': spuId,
      'sku_id': skuId,
      'status': status,
      'activity_start_time': activityStartTime,
      'activity_end_time': activityEndTime,
      'combination_price': combinationPrice,
      };
  }
}

class MallPromotionCombinationProductQueryCondition extends PaginatedRequest {
  MallPromotionCombinationProductQueryCondition({
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

class MallPromotionCombinationProductResponse {
  final int id; // 编号
  final int? activityId; // 拼团活动编号
  final int? spuId; // 商品 SPU 编号
  final int? skuId; // 商品 SKU 编号
  final int status; // 状态
  final DateTime activityStartTime; // 活动开始时间点
  final DateTime activityEndTime; // 活动结束时间点
  final int combinationPrice; // 拼团价格，单位分
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallPromotionCombinationProductResponse({
    required this.id,
    this.activityId,
    this.spuId,
    this.skuId,
    required this.status,
    required this.activityStartTime,
    required this.activityEndTime,
    required this.combinationPrice,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallPromotionCombinationProductResponse.fromJson(Map<String, dynamic> json) {
    return MallPromotionCombinationProductResponse(
      id: json['id'] as int,
      activityId: json['activity_id'] as int?,
      spuId: json['spu_id'] as int?,
      skuId: json['sku_id'] as int?,
      status: json['status'] as int,
      activityStartTime: json['activity_start_time'] as DateTime,
      activityEndTime: json['activity_end_time'] as DateTime,
      combinationPrice: json['combination_price'] as int,
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
      'status': status,
      'activity_start_time': activityStartTime,
      'activity_end_time': activityEndTime,
      'combination_price': combinationPrice,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallPromotionCombinationProductService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallPromotionCombinationProduct(MallPromotionCombinationProductRequest mallPromotionCombinationProduct) async {
        return await _httpClient.post<int>(apis['create']!, data: mallPromotionCombinationProduct);
    }

    Future<ApiResponse<int>> updateMallPromotionCombinationProduct(MallPromotionCombinationProductRequest mallPromotionCombinationProduct) async {
        return await _httpClient.post<int>(apis['update']!, data: mallPromotionCombinationProduct);
    }

    Future<ApiResponse<void>> deleteMallPromotionCombinationProduct(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallPromotionCombinationProductResponse>> getMallPromotionCombinationProduct(int id) async {
        return await _httpClient.get<MallPromotionCombinationProductResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallPromotionCombinationProductResponse>>> listMallPromotionCombinationProduct() async {
        return await _httpClient.get<List<MallPromotionCombinationProductResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallPromotionCombinationProductResponse>>> pageMallPromotionCombinationProduct(MallPromotionCombinationProductQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallPromotionCombinationProductResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
    Future<ApiResponse<void>> enableMallPromotionCombinationProduct(int id) async {
      return await _httpClient.post<void>('${apis['enable']!}/$id');
    }

    Future<ApiResponse<void>> disableMallPromotionCombinationProduct(int id) async {
      return await _httpClient.post<void>('${apis['disable']!}/$id');
    }
}