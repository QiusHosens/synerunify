import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_promotion_coupon/create', // 新增
  'update': '/mall/mall_promotion_coupon/update', // 修改
  'delete': '/mall/mall_promotion_coupon/delete', // 删除
  'get': '/mall/mall_promotion_coupon/get', // 单条查询
  'list': '/mall/mall_promotion_coupon/list', // 列表查询
  'page': '/mall/mall_promotion_coupon/page', // 分页查询
  'enable': '/mall/mall_promotion_coupon/enable', // 启用
  'disable': '/mall/mall_promotion_coupon/disable', // 禁用
};

class MallPromotionCouponRequest {
  final int id; // 优惠劵编号
  final int templateId; // 优惠劵模板编号
  final String name; // 优惠劵名
  final int status; // 优惠码状态     *     * 1-未使用     * 2-已使用     * 3-已失效
  final int userId; // 用户编号
  final int takeType; // 领取类型     *     * 1 - 用户主动领取     * 2 - 后台自动发放
  final int usePrice; // 是否设置满多少金额可用，单位：分
  final DateTime validStartTime; // 生效开始时间
  final DateTime validEndTime; // 生效结束时间
  final int productScope; // 商品范围
  final String? productScopeValues; // 商品范围编号的数组
  final int discountType; // 折扣类型
  final int? discountPercent; // 折扣百分比
  final int? discountPrice; // 优惠金额，单位：分
  final int? discountLimitPrice; // 折扣上限
  final int? useOrderId; // 使用订单号
  final DateTime? useTime; // 使用时间
  

  MallPromotionCouponRequest({
    required this.id,
    required this.templateId,
    required this.name,
    required this.status,
    required this.userId,
    required this.takeType,
    required this.usePrice,
    required this.validStartTime,
    required this.validEndTime,
    required this.productScope,
    this.productScopeValues,
    required this.discountType,
    this.discountPercent,
    this.discountPrice,
    this.discountLimitPrice,
    this.useOrderId,
    this.useTime,
    });

  factory MallPromotionCouponRequest.fromJson(Map<String, dynamic> json) {
    return MallPromotionCouponRequest(
      id: json['id'] as int,
      templateId: json['template_id'] as int,
      name: json['name'] as String,
      status: json['status'] as int,
      userId: json['user_id'] as int,
      takeType: json['take_type'] as int,
      usePrice: json['use_price'] as int,
      validStartTime: json['valid_start_time'] as DateTime,
      validEndTime: json['valid_end_time'] as DateTime,
      productScope: json['product_scope'] as int,
      productScopeValues: json['product_scope_values'] as String?,
      discountType: json['discount_type'] as int,
      discountPercent: json['discount_percent'] as int?,
      discountPrice: json['discount_price'] as int?,
      discountLimitPrice: json['discount_limit_price'] as int?,
      useOrderId: json['use_order_id'] as int?,
      useTime: json['use_time'] as DateTime?,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'template_id': templateId,
      'name': name,
      'status': status,
      'user_id': userId,
      'take_type': takeType,
      'use_price': usePrice,
      'valid_start_time': validStartTime,
      'valid_end_time': validEndTime,
      'product_scope': productScope,
      'product_scope_values': productScopeValues,
      'discount_type': discountType,
      'discount_percent': discountPercent,
      'discount_price': discountPrice,
      'discount_limit_price': discountLimitPrice,
      'use_order_id': useOrderId,
      'use_time': useTime,
      };
  }
}

class MallPromotionCouponQueryCondition extends PaginatedRequest {
  MallPromotionCouponQueryCondition({
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

class MallPromotionCouponResponse {
  final int id; // 优惠劵编号
  final int templateId; // 优惠劵模板编号
  final String name; // 优惠劵名
  final int status; // 优惠码状态     *     * 1-未使用     * 2-已使用     * 3-已失效
  final int userId; // 用户编号
  final int takeType; // 领取类型     *     * 1 - 用户主动领取     * 2 - 后台自动发放
  final int usePrice; // 是否设置满多少金额可用，单位：分
  final DateTime validStartTime; // 生效开始时间
  final DateTime validEndTime; // 生效结束时间
  final int productScope; // 商品范围
  final String? productScopeValues; // 商品范围编号的数组
  final int discountType; // 折扣类型
  final int? discountPercent; // 折扣百分比
  final int? discountPrice; // 优惠金额，单位：分
  final int? discountLimitPrice; // 折扣上限
  final int? useOrderId; // 使用订单号
  final DateTime? useTime; // 使用时间
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallPromotionCouponResponse({
    required this.id,
    required this.templateId,
    required this.name,
    required this.status,
    required this.userId,
    required this.takeType,
    required this.usePrice,
    required this.validStartTime,
    required this.validEndTime,
    required this.productScope,
    this.productScopeValues,
    required this.discountType,
    this.discountPercent,
    this.discountPrice,
    this.discountLimitPrice,
    this.useOrderId,
    this.useTime,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallPromotionCouponResponse.fromJson(Map<String, dynamic> json) {
    return MallPromotionCouponResponse(
      id: json['id'] as int,
      templateId: json['template_id'] as int,
      name: json['name'] as String,
      status: json['status'] as int,
      userId: json['user_id'] as int,
      takeType: json['take_type'] as int,
      usePrice: json['use_price'] as int,
      validStartTime: json['valid_start_time'] as DateTime,
      validEndTime: json['valid_end_time'] as DateTime,
      productScope: json['product_scope'] as int,
      productScopeValues: json['product_scope_values'] as String?,
      discountType: json['discount_type'] as int,
      discountPercent: json['discount_percent'] as int?,
      discountPrice: json['discount_price'] as int?,
      discountLimitPrice: json['discount_limit_price'] as int?,
      useOrderId: json['use_order_id'] as int?,
      useTime: json['use_time'] as DateTime?,
      creator: json['creator'] as int?,
      createTime: json['create_time'] as DateTime,
      updater: json['updater'] as int?,
      updateTime: json['update_time'] as DateTime,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'template_id': templateId,
      'name': name,
      'status': status,
      'user_id': userId,
      'take_type': takeType,
      'use_price': usePrice,
      'valid_start_time': validStartTime,
      'valid_end_time': validEndTime,
      'product_scope': productScope,
      'product_scope_values': productScopeValues,
      'discount_type': discountType,
      'discount_percent': discountPercent,
      'discount_price': discountPrice,
      'discount_limit_price': discountLimitPrice,
      'use_order_id': useOrderId,
      'use_time': useTime,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallPromotionCouponService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallPromotionCoupon(MallPromotionCouponRequest mallPromotionCoupon) async {
        return await _httpClient.post<int>(apis['create']!, data: mallPromotionCoupon);
    }

    Future<ApiResponse<int>> updateMallPromotionCoupon(MallPromotionCouponRequest mallPromotionCoupon) async {
        return await _httpClient.post<int>(apis['update']!, data: mallPromotionCoupon);
    }

    Future<ApiResponse<void>> deleteMallPromotionCoupon(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallPromotionCouponResponse>> getMallPromotionCoupon(int id) async {
        return await _httpClient.get<MallPromotionCouponResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallPromotionCouponResponse>>> listMallPromotionCoupon() async {
        return await _httpClient.get<List<MallPromotionCouponResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallPromotionCouponResponse>>> pageMallPromotionCoupon(MallPromotionCouponQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallPromotionCouponResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
    Future<ApiResponse<void>> enableMallPromotionCoupon(int id) async {
      return await _httpClient.post<void>('${apis['enable']!}/$id');
    }

    Future<ApiResponse<void>> disableMallPromotionCoupon(int id) async {
      return await _httpClient.post<void>('${apis['disable']!}/$id');
    }
}