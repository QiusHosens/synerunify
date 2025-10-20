import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_promotion_discount_product/create', // 新增
  'update': '/mall/mall_promotion_discount_product/update', // 修改
  'delete': '/mall/mall_promotion_discount_product/delete', // 删除
  'get': '/mall/mall_promotion_discount_product/get', // 单条查询
  'list': '/mall/mall_promotion_discount_product/list', // 列表查询
  'page': '/mall/mall_promotion_discount_product/page', // 分页查询
};

class MallPromotionDiscountProductRequest {
  final int id; // 编号，主键自增
  final int activityId; // 活动编号
  final int spuId; // 商品 SPU 编号
  final int skuId; // 商品 SKU 编号
  final int discountType; // 优惠类型     *     * 1-代金卷     * 2-折扣卷
  final int? discountPercent; // 折扣百分比
  final int? discountPrice; // 优惠金额，单位：分
  final int activityStatus; // 秒杀商品状态
  final String activityName; // 活动标题
  final DateTime activityStartTime; // 活动开始时间点
  final DateTime activityEndTime; // 活动结束时间点
  

  MallPromotionDiscountProductRequest({
    required this.id,
    required this.activityId,
    required this.spuId,
    required this.skuId,
    required this.discountType,
    this.discountPercent,
    this.discountPrice,
    required this.activityStatus,
    required this.activityName,
    required this.activityStartTime,
    required this.activityEndTime,
    });

  factory MallPromotionDiscountProductRequest.fromJson(Map<String, dynamic> json) {
    return MallPromotionDiscountProductRequest(
      id: json['id'] as int,
      activityId: json['activity_id'] as int,
      spuId: json['spu_id'] as int,
      skuId: json['sku_id'] as int,
      discountType: json['discount_type'] as int,
      discountPercent: json['discount_percent'] as int?,
      discountPrice: json['discount_price'] as int?,
      activityStatus: json['activity_status'] as int,
      activityName: json['activity_name'] as String,
      activityStartTime: json['activity_start_time'] as DateTime,
      activityEndTime: json['activity_end_time'] as DateTime,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'activity_id': activityId,
      'spu_id': spuId,
      'sku_id': skuId,
      'discount_type': discountType,
      'discount_percent': discountPercent,
      'discount_price': discountPrice,
      'activity_status': activityStatus,
      'activity_name': activityName,
      'activity_start_time': activityStartTime,
      'activity_end_time': activityEndTime,
      };
  }
}

class MallPromotionDiscountProductQueryCondition extends PaginatedRequest {
  MallPromotionDiscountProductQueryCondition({
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

class MallPromotionDiscountProductResponse {
  final int id; // 编号，主键自增
  final int activityId; // 活动编号
  final int spuId; // 商品 SPU 编号
  final int skuId; // 商品 SKU 编号
  final int discountType; // 优惠类型     *     * 1-代金卷     * 2-折扣卷
  final int? discountPercent; // 折扣百分比
  final int? discountPrice; // 优惠金额，单位：分
  final int activityStatus; // 秒杀商品状态
  final String activityName; // 活动标题
  final DateTime activityStartTime; // 活动开始时间点
  final DateTime activityEndTime; // 活动结束时间点
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallPromotionDiscountProductResponse({
    required this.id,
    required this.activityId,
    required this.spuId,
    required this.skuId,
    required this.discountType,
    this.discountPercent,
    this.discountPrice,
    required this.activityStatus,
    required this.activityName,
    required this.activityStartTime,
    required this.activityEndTime,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallPromotionDiscountProductResponse.fromJson(Map<String, dynamic> json) {
    return MallPromotionDiscountProductResponse(
      id: json['id'] as int,
      activityId: json['activity_id'] as int,
      spuId: json['spu_id'] as int,
      skuId: json['sku_id'] as int,
      discountType: json['discount_type'] as int,
      discountPercent: json['discount_percent'] as int?,
      discountPrice: json['discount_price'] as int?,
      activityStatus: json['activity_status'] as int,
      activityName: json['activity_name'] as String,
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
      'spu_id': spuId,
      'sku_id': skuId,
      'discount_type': discountType,
      'discount_percent': discountPercent,
      'discount_price': discountPrice,
      'activity_status': activityStatus,
      'activity_name': activityName,
      'activity_start_time': activityStartTime,
      'activity_end_time': activityEndTime,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallPromotionDiscountProductService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallPromotionDiscountProduct(MallPromotionDiscountProductRequest mallPromotionDiscountProduct) async {
        return await _httpClient.post<int>(apis['create']!, data: mallPromotionDiscountProduct);
    }

    Future<ApiResponse<int>> updateMallPromotionDiscountProduct(MallPromotionDiscountProductRequest mallPromotionDiscountProduct) async {
        return await _httpClient.post<int>(apis['update']!, data: mallPromotionDiscountProduct);
    }

    Future<ApiResponse<void>> deleteMallPromotionDiscountProduct(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallPromotionDiscountProductResponse>> getMallPromotionDiscountProduct(int id) async {
        return await _httpClient.get<MallPromotionDiscountProductResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallPromotionDiscountProductResponse>>> listMallPromotionDiscountProduct() async {
        return await _httpClient.get<List<MallPromotionDiscountProductResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallPromotionDiscountProductResponse>>> pageMallPromotionDiscountProduct(MallPromotionDiscountProductQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallPromotionDiscountProductResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
}