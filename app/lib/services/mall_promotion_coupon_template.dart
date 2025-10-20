import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_promotion_coupon_template/create', // 新增
  'update': '/mall/mall_promotion_coupon_template/update', // 修改
  'delete': '/mall/mall_promotion_coupon_template/delete', // 删除
  'get': '/mall/mall_promotion_coupon_template/get', // 单条查询
  'list': '/mall/mall_promotion_coupon_template/list', // 列表查询
  'page': '/mall/mall_promotion_coupon_template/page', // 分页查询
  'enable': '/mall/mall_promotion_coupon_template/enable', // 启用
  'disable': '/mall/mall_promotion_coupon_template/disable', // 禁用
};

class MallPromotionCouponTemplateRequest {
  final int id; // 模板编号，自增唯一。
  final String name; // 优惠劵名
  final String? description; // 优惠劵描述
  final int status; // 状态
  final int totalCount; // 发放数量, -1 - 则表示不限制
  final int takeLimitCount; // 每人限领个数, -1 - 则表示不限制
  final int takeType; // 领取方式
  final int usePrice; // 是否设置满多少金额可用，单位：分
  final int productScope; // 商品范围
  final String? productScopeValues; // 商品范围编号的数组
  final int validityType; // 生效日期类型
  final DateTime? validStartTime; // 固定日期-生效开始时间
  final DateTime? validEndTime; // 固定日期-生效结束时间
  final int? fixedStartTerm; // 领取日期-开始天数
  final int? fixedEndTerm; // 领取日期-结束天数
  final int discountType; // 优惠类型：1-代金卷；2-折扣卷
  final int? discountPercent; // 折扣百分比
  final int? discountPrice; // 优惠金额，单位：分
  final int? discountLimitPrice; // 折扣上限，仅在 discount_type 等于 2 时生效
  final int takeCount; // 领取优惠券的数量
  final int useCount; // 使用优惠券的次数
  

  MallPromotionCouponTemplateRequest({
    required this.id,
    required this.name,
    this.description,
    required this.status,
    required this.totalCount,
    required this.takeLimitCount,
    required this.takeType,
    required this.usePrice,
    required this.productScope,
    this.productScopeValues,
    required this.validityType,
    this.validStartTime,
    this.validEndTime,
    this.fixedStartTerm,
    this.fixedEndTerm,
    required this.discountType,
    this.discountPercent,
    this.discountPrice,
    this.discountLimitPrice,
    required this.takeCount,
    required this.useCount,
    });

  factory MallPromotionCouponTemplateRequest.fromJson(Map<String, dynamic> json) {
    return MallPromotionCouponTemplateRequest(
      id: json['id'] as int,
      name: json['name'] as String,
      description: json['description'] as String?,
      status: json['status'] as int,
      totalCount: json['total_count'] as int,
      takeLimitCount: json['take_limit_count'] as int,
      takeType: json['take_type'] as int,
      usePrice: json['use_price'] as int,
      productScope: json['product_scope'] as int,
      productScopeValues: json['product_scope_values'] as String?,
      validityType: json['validity_type'] as int,
      validStartTime: json['valid_start_time'] as DateTime?,
      validEndTime: json['valid_end_time'] as DateTime?,
      fixedStartTerm: json['fixed_start_term'] as int?,
      fixedEndTerm: json['fixed_end_term'] as int?,
      discountType: json['discount_type'] as int,
      discountPercent: json['discount_percent'] as int?,
      discountPrice: json['discount_price'] as int?,
      discountLimitPrice: json['discount_limit_price'] as int?,
      takeCount: json['take_count'] as int,
      useCount: json['use_count'] as int,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'status': status,
      'total_count': totalCount,
      'take_limit_count': takeLimitCount,
      'take_type': takeType,
      'use_price': usePrice,
      'product_scope': productScope,
      'product_scope_values': productScopeValues,
      'validity_type': validityType,
      'valid_start_time': validStartTime,
      'valid_end_time': validEndTime,
      'fixed_start_term': fixedStartTerm,
      'fixed_end_term': fixedEndTerm,
      'discount_type': discountType,
      'discount_percent': discountPercent,
      'discount_price': discountPrice,
      'discount_limit_price': discountLimitPrice,
      'take_count': takeCount,
      'use_count': useCount,
      };
  }
}

class MallPromotionCouponTemplateQueryCondition extends PaginatedRequest {
  MallPromotionCouponTemplateQueryCondition({
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

class MallPromotionCouponTemplateResponse {
  final int id; // 模板编号，自增唯一。
  final String name; // 优惠劵名
  final String? description; // 优惠劵描述
  final int status; // 状态
  final int totalCount; // 发放数量, -1 - 则表示不限制
  final int takeLimitCount; // 每人限领个数, -1 - 则表示不限制
  final int takeType; // 领取方式
  final int usePrice; // 是否设置满多少金额可用，单位：分
  final int productScope; // 商品范围
  final String? productScopeValues; // 商品范围编号的数组
  final int validityType; // 生效日期类型
  final DateTime? validStartTime; // 固定日期-生效开始时间
  final DateTime? validEndTime; // 固定日期-生效结束时间
  final int? fixedStartTerm; // 领取日期-开始天数
  final int? fixedEndTerm; // 领取日期-结束天数
  final int discountType; // 优惠类型：1-代金卷；2-折扣卷
  final int? discountPercent; // 折扣百分比
  final int? discountPrice; // 优惠金额，单位：分
  final int? discountLimitPrice; // 折扣上限，仅在 discount_type 等于 2 时生效
  final int takeCount; // 领取优惠券的数量
  final int useCount; // 使用优惠券的次数
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallPromotionCouponTemplateResponse({
    required this.id,
    required this.name,
    this.description,
    required this.status,
    required this.totalCount,
    required this.takeLimitCount,
    required this.takeType,
    required this.usePrice,
    required this.productScope,
    this.productScopeValues,
    required this.validityType,
    this.validStartTime,
    this.validEndTime,
    this.fixedStartTerm,
    this.fixedEndTerm,
    required this.discountType,
    this.discountPercent,
    this.discountPrice,
    this.discountLimitPrice,
    required this.takeCount,
    required this.useCount,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallPromotionCouponTemplateResponse.fromJson(Map<String, dynamic> json) {
    return MallPromotionCouponTemplateResponse(
      id: json['id'] as int,
      name: json['name'] as String,
      description: json['description'] as String?,
      status: json['status'] as int,
      totalCount: json['total_count'] as int,
      takeLimitCount: json['take_limit_count'] as int,
      takeType: json['take_type'] as int,
      usePrice: json['use_price'] as int,
      productScope: json['product_scope'] as int,
      productScopeValues: json['product_scope_values'] as String?,
      validityType: json['validity_type'] as int,
      validStartTime: json['valid_start_time'] as DateTime?,
      validEndTime: json['valid_end_time'] as DateTime?,
      fixedStartTerm: json['fixed_start_term'] as int?,
      fixedEndTerm: json['fixed_end_term'] as int?,
      discountType: json['discount_type'] as int,
      discountPercent: json['discount_percent'] as int?,
      discountPrice: json['discount_price'] as int?,
      discountLimitPrice: json['discount_limit_price'] as int?,
      takeCount: json['take_count'] as int,
      useCount: json['use_count'] as int,
      creator: json['creator'] as int?,
      createTime: json['create_time'] as DateTime,
      updater: json['updater'] as int?,
      updateTime: json['update_time'] as DateTime,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'status': status,
      'total_count': totalCount,
      'take_limit_count': takeLimitCount,
      'take_type': takeType,
      'use_price': usePrice,
      'product_scope': productScope,
      'product_scope_values': productScopeValues,
      'validity_type': validityType,
      'valid_start_time': validStartTime,
      'valid_end_time': validEndTime,
      'fixed_start_term': fixedStartTerm,
      'fixed_end_term': fixedEndTerm,
      'discount_type': discountType,
      'discount_percent': discountPercent,
      'discount_price': discountPrice,
      'discount_limit_price': discountLimitPrice,
      'take_count': takeCount,
      'use_count': useCount,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallPromotionCouponTemplateService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallPromotionCouponTemplate(MallPromotionCouponTemplateRequest mallPromotionCouponTemplate) async {
        return await _httpClient.post<int>(apis['create']!, data: mallPromotionCouponTemplate);
    }

    Future<ApiResponse<int>> updateMallPromotionCouponTemplate(MallPromotionCouponTemplateRequest mallPromotionCouponTemplate) async {
        return await _httpClient.post<int>(apis['update']!, data: mallPromotionCouponTemplate);
    }

    Future<ApiResponse<void>> deleteMallPromotionCouponTemplate(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallPromotionCouponTemplateResponse>> getMallPromotionCouponTemplate(int id) async {
        return await _httpClient.get<MallPromotionCouponTemplateResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallPromotionCouponTemplateResponse>>> listMallPromotionCouponTemplate() async {
        return await _httpClient.get<List<MallPromotionCouponTemplateResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallPromotionCouponTemplateResponse>>> pageMallPromotionCouponTemplate(MallPromotionCouponTemplateQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallPromotionCouponTemplateResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
    Future<ApiResponse<void>> enableMallPromotionCouponTemplate(int id) async {
      return await _httpClient.post<void>('${apis['enable']!}/$id');
    }

    Future<ApiResponse<void>> disableMallPromotionCouponTemplate(int id) async {
      return await _httpClient.post<void>('${apis['disable']!}/$id');
    }
}