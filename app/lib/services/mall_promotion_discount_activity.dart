import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_promotion_discount_activity/create', // 新增
  'update': '/mall/mall_promotion_discount_activity/update', // 修改
  'delete': '/mall/mall_promotion_discount_activity/delete', // 删除
  'get': '/mall/mall_promotion_discount_activity/get', // 单条查询
  'list': '/mall/mall_promotion_discount_activity/list', // 列表查询
  'page': '/mall/mall_promotion_discount_activity/page', // 分页查询
  'enable': '/mall/mall_promotion_discount_activity/enable', // 启用
  'disable': '/mall/mall_promotion_discount_activity/disable', // 禁用
};

class MallPromotionDiscountActivityRequest {
  final int id; // 活动编号
  final String name; // 活动标题
  final int status; // 活动状态
  final DateTime startTime; // 开始时间
  final DateTime endTime; // 结束时间
  final String? remark; // 备注
  

  MallPromotionDiscountActivityRequest({
    required this.id,
    required this.name,
    required this.status,
    required this.startTime,
    required this.endTime,
    this.remark,
    });

  factory MallPromotionDiscountActivityRequest.fromJson(Map<String, dynamic> json) {
    return MallPromotionDiscountActivityRequest(
      id: json['id'] as int,
      name: json['name'] as String,
      status: json['status'] as int,
      startTime: json['start_time'] as DateTime,
      endTime: json['end_time'] as DateTime,
      remark: json['remark'] as String?,
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
      };
  }
}

class MallPromotionDiscountActivityQueryCondition extends PaginatedRequest {
  MallPromotionDiscountActivityQueryCondition({
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

class MallPromotionDiscountActivityResponse {
  final int id; // 活动编号
  final String name; // 活动标题
  final int status; // 活动状态
  final DateTime startTime; // 开始时间
  final DateTime endTime; // 结束时间
  final String? remark; // 备注
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallPromotionDiscountActivityResponse({
    required this.id,
    required this.name,
    required this.status,
    required this.startTime,
    required this.endTime,
    this.remark,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallPromotionDiscountActivityResponse.fromJson(Map<String, dynamic> json) {
    return MallPromotionDiscountActivityResponse(
      id: json['id'] as int,
      name: json['name'] as String,
      status: json['status'] as int,
      startTime: json['start_time'] as DateTime,
      endTime: json['end_time'] as DateTime,
      remark: json['remark'] as String?,
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
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallPromotionDiscountActivityService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallPromotionDiscountActivity(MallPromotionDiscountActivityRequest mallPromotionDiscountActivity) async {
        return await _httpClient.post<int>(apis['create']!, data: mallPromotionDiscountActivity);
    }

    Future<ApiResponse<int>> updateMallPromotionDiscountActivity(MallPromotionDiscountActivityRequest mallPromotionDiscountActivity) async {
        return await _httpClient.post<int>(apis['update']!, data: mallPromotionDiscountActivity);
    }

    Future<ApiResponse<void>> deleteMallPromotionDiscountActivity(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallPromotionDiscountActivityResponse>> getMallPromotionDiscountActivity(int id) async {
        return await _httpClient.get<MallPromotionDiscountActivityResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallPromotionDiscountActivityResponse>>> listMallPromotionDiscountActivity() async {
        return await _httpClient.get<List<MallPromotionDiscountActivityResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallPromotionDiscountActivityResponse>>> pageMallPromotionDiscountActivity(MallPromotionDiscountActivityQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallPromotionDiscountActivityResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
    Future<ApiResponse<void>> enableMallPromotionDiscountActivity(int id) async {
      return await _httpClient.post<void>('${apis['enable']!}/$id');
    }

    Future<ApiResponse<void>> disableMallPromotionDiscountActivity(int id) async {
      return await _httpClient.post<void>('${apis['disable']!}/$id');
    }
}