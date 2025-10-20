import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_promotion_flash_product/create', // 新增
  'update': '/mall/mall_promotion_flash_product/update', // 修改
  'delete': '/mall/mall_promotion_flash_product/delete', // 删除
  'get': '/mall/mall_promotion_flash_product/get', // 单条查询
  'list': '/mall/mall_promotion_flash_product/list', // 列表查询
  'page': '/mall/mall_promotion_flash_product/page', // 分页查询
};

class MallPromotionFlashProductRequest {
  final int id; // 秒杀参与商品编号
  final int activityId; // 秒杀活动 id
  final String configIds; // 秒杀时段 id 数组
  final int spuId; // 商品 spu_id
  final int skuId; // 商品 sku_id
  final int flashPrice; // 秒杀金额，单位：分
  final int stock; // 秒杀库存
  final int activityStatus; // 秒杀商品状态
  final DateTime activityStartTime; // 活动开始时间点
  final DateTime activityEndTime; // 活动结束时间点
  

  MallPromotionFlashProductRequest({
    required this.id,
    required this.activityId,
    required this.configIds,
    required this.spuId,
    required this.skuId,
    required this.flashPrice,
    required this.stock,
    required this.activityStatus,
    required this.activityStartTime,
    required this.activityEndTime,
    });

  factory MallPromotionFlashProductRequest.fromJson(Map<String, dynamic> json) {
    return MallPromotionFlashProductRequest(
      id: json['id'] as int,
      activityId: json['activity_id'] as int,
      configIds: json['config_ids'] as String,
      spuId: json['spu_id'] as int,
      skuId: json['sku_id'] as int,
      flashPrice: json['flash_price'] as int,
      stock: json['stock'] as int,
      activityStatus: json['activity_status'] as int,
      activityStartTime: json['activity_start_time'] as DateTime,
      activityEndTime: json['activity_end_time'] as DateTime,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'activity_id': activityId,
      'config_ids': configIds,
      'spu_id': spuId,
      'sku_id': skuId,
      'flash_price': flashPrice,
      'stock': stock,
      'activity_status': activityStatus,
      'activity_start_time': activityStartTime,
      'activity_end_time': activityEndTime,
      };
  }
}

class MallPromotionFlashProductQueryCondition extends PaginatedRequest {
  MallPromotionFlashProductQueryCondition({
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

class MallPromotionFlashProductResponse {
  final int id; // 秒杀参与商品编号
  final int activityId; // 秒杀活动 id
  final String configIds; // 秒杀时段 id 数组
  final int spuId; // 商品 spu_id
  final int skuId; // 商品 sku_id
  final int flashPrice; // 秒杀金额，单位：分
  final int stock; // 秒杀库存
  final int activityStatus; // 秒杀商品状态
  final DateTime activityStartTime; // 活动开始时间点
  final DateTime activityEndTime; // 活动结束时间点
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallPromotionFlashProductResponse({
    required this.id,
    required this.activityId,
    required this.configIds,
    required this.spuId,
    required this.skuId,
    required this.flashPrice,
    required this.stock,
    required this.activityStatus,
    required this.activityStartTime,
    required this.activityEndTime,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallPromotionFlashProductResponse.fromJson(Map<String, dynamic> json) {
    return MallPromotionFlashProductResponse(
      id: json['id'] as int,
      activityId: json['activity_id'] as int,
      configIds: json['config_ids'] as String,
      spuId: json['spu_id'] as int,
      skuId: json['sku_id'] as int,
      flashPrice: json['flash_price'] as int,
      stock: json['stock'] as int,
      activityStatus: json['activity_status'] as int,
      activityStartTime: json['activity_start_time'] as DateTime,
      activityEndTime: json['activity_end_time'] as DateTime,
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
      'config_ids': configIds,
      'spu_id': spuId,
      'sku_id': skuId,
      'flash_price': flashPrice,
      'stock': stock,
      'activity_status': activityStatus,
      'activity_start_time': activityStartTime,
      'activity_end_time': activityEndTime,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallPromotionFlashProductService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallPromotionFlashProduct(MallPromotionFlashProductRequest mallPromotionFlashProduct) async {
        return await _httpClient.post<int>(apis['create']!, data: mallPromotionFlashProduct);
    }

    Future<ApiResponse<int>> updateMallPromotionFlashProduct(MallPromotionFlashProductRequest mallPromotionFlashProduct) async {
        return await _httpClient.post<int>(apis['update']!, data: mallPromotionFlashProduct);
    }

    Future<ApiResponse<void>> deleteMallPromotionFlashProduct(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallPromotionFlashProductResponse>> getMallPromotionFlashProduct(int id) async {
        return await _httpClient.get<MallPromotionFlashProductResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallPromotionFlashProductResponse>>> listMallPromotionFlashProduct() async {
        return await _httpClient.get<List<MallPromotionFlashProductResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallPromotionFlashProductResponse>>> pageMallPromotionFlashProduct(MallPromotionFlashProductQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallPromotionFlashProductResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
}