import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_promotion_reward_activity/create', // 新增
  'update': '/mall/mall_promotion_reward_activity/update', // 修改
  'delete': '/mall/mall_promotion_reward_activity/delete', // 删除
  'get': '/mall/mall_promotion_reward_activity/get', // 单条查询
  'list': '/mall/mall_promotion_reward_activity/list', // 列表查询
  'page': '/mall/mall_promotion_reward_activity/page', // 分页查询
  'enable': '/mall/mall_promotion_reward_activity/enable', // 启用
  'disable': '/mall/mall_promotion_reward_activity/disable', // 禁用
};

class MallPromotionRewardActivityRequest {
  final int id; // 活动编号
  final String name; // 活动标题
  final int status; // 活动状态
  final DateTime startTime; // 开始时间
  final DateTime endTime; // 结束时间
  final String? remark; // 备注
  final int conditionType; // 条件类型
  final int productScope; // 商品范围
  final String? productScopeValues; // 商品范围编号的数组
  final String? rules; // 优惠规则的数组
  

  MallPromotionRewardActivityRequest({
    required this.id,
    required this.name,
    required this.status,
    required this.startTime,
    required this.endTime,
    this.remark,
    required this.conditionType,
    required this.productScope,
    this.productScopeValues,
    this.rules,
    });

  factory MallPromotionRewardActivityRequest.fromJson(Map<String, dynamic> json) {
    return MallPromotionRewardActivityRequest(
      id: json['id'] as int,
      name: json['name'] as String,
      status: json['status'] as int,
      startTime: json['start_time'] as DateTime,
      endTime: json['end_time'] as DateTime,
      remark: json['remark'] as String?,
      conditionType: json['condition_type'] as int,
      productScope: json['product_scope'] as int,
      productScopeValues: json['product_scope_values'] as String?,
      rules: json['rules'] as String?,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'status': status,
      'start_time': startTime,
      'end_time': endTime,
      'remark': remark,
      'condition_type': conditionType,
      'product_scope': productScope,
      'product_scope_values': productScopeValues,
      'rules': rules,
      };
  }
}

class MallPromotionRewardActivityQueryCondition extends PaginatedRequest {
  MallPromotionRewardActivityQueryCondition({
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

class MallPromotionRewardActivityResponse {
  final int id; // 活动编号
  final String name; // 活动标题
  final int status; // 活动状态
  final DateTime startTime; // 开始时间
  final DateTime endTime; // 结束时间
  final String? remark; // 备注
  final int conditionType; // 条件类型
  final int productScope; // 商品范围
  final String? productScopeValues; // 商品范围编号的数组
  final String? rules; // 优惠规则的数组
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallPromotionRewardActivityResponse({
    required this.id,
    required this.name,
    required this.status,
    required this.startTime,
    required this.endTime,
    this.remark,
    required this.conditionType,
    required this.productScope,
    this.productScopeValues,
    this.rules,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallPromotionRewardActivityResponse.fromJson(Map<String, dynamic> json) {
    return MallPromotionRewardActivityResponse(
      id: json['id'] as int,
      name: json['name'] as String,
      status: json['status'] as int,
      startTime: json['start_time'] as DateTime,
      endTime: json['end_time'] as DateTime,
      remark: json['remark'] as String?,
      conditionType: json['condition_type'] as int,
      productScope: json['product_scope'] as int,
      productScopeValues: json['product_scope_values'] as String?,
      rules: json['rules'] as String?,
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
      'status': status,
      'start_time': startTime,
      'end_time': endTime,
      'remark': remark,
      'condition_type': conditionType,
      'product_scope': productScope,
      'product_scope_values': productScopeValues,
      'rules': rules,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallPromotionRewardActivityService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallPromotionRewardActivity(MallPromotionRewardActivityRequest mallPromotionRewardActivity) async {
        return await _httpClient.post<int>(apis['create']!, data: mallPromotionRewardActivity);
    }

    Future<ApiResponse<int>> updateMallPromotionRewardActivity(MallPromotionRewardActivityRequest mallPromotionRewardActivity) async {
        return await _httpClient.post<int>(apis['update']!, data: mallPromotionRewardActivity);
    }

    Future<ApiResponse<void>> deleteMallPromotionRewardActivity(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallPromotionRewardActivityResponse>> getMallPromotionRewardActivity(int id) async {
        return await _httpClient.get<MallPromotionRewardActivityResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallPromotionRewardActivityResponse>>> listMallPromotionRewardActivity() async {
        return await _httpClient.get<List<MallPromotionRewardActivityResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallPromotionRewardActivityResponse>>> pageMallPromotionRewardActivity(MallPromotionRewardActivityQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallPromotionRewardActivityResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
    Future<ApiResponse<void>> enableMallPromotionRewardActivity(int id) async {
      return await _httpClient.post<void>('${apis['enable']!}/$id');
    }

    Future<ApiResponse<void>> disableMallPromotionRewardActivity(int id) async {
      return await _httpClient.post<void>('${apis['disable']!}/$id');
    }
}