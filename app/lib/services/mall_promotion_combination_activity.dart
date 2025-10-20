import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_promotion_combination_activity/create', // 新增
  'update': '/mall/mall_promotion_combination_activity/update', // 修改
  'delete': '/mall/mall_promotion_combination_activity/delete', // 删除
  'get': '/mall/mall_promotion_combination_activity/get', // 单条查询
  'list': '/mall/mall_promotion_combination_activity/list', // 列表查询
  'page': '/mall/mall_promotion_combination_activity/page', // 分页查询
  'enable': '/mall/mall_promotion_combination_activity/enable', // 启用
  'disable': '/mall/mall_promotion_combination_activity/disable', // 禁用
};

class MallPromotionCombinationActivityRequest {
  final int id; // 活动编号
  final String name; // 拼团名称
  final int spuId; // 商品 SPU ID
  final int totalLimitCount; // 总限购数量
  final int singleLimitCount; // 单次限购数量
  final DateTime startTime; // 开始时间
  final DateTime endTime; // 结束时间
  final int? userSize; // 购买人数
  final int virtualGroup; // 虚拟成团
  final int status; // 状态
  final int limitDuration; // 限制时长（小时）
  

  MallPromotionCombinationActivityRequest({
    required this.id,
    required this.name,
    required this.spuId,
    required this.totalLimitCount,
    required this.singleLimitCount,
    required this.startTime,
    required this.endTime,
    this.userSize,
    required this.virtualGroup,
    required this.status,
    required this.limitDuration,
    });

  factory MallPromotionCombinationActivityRequest.fromJson(Map<String, dynamic> json) {
    return MallPromotionCombinationActivityRequest(
      id: json['id'] as int,
      name: json['name'] as String,
      spuId: json['spu_id'] as int,
      totalLimitCount: json['total_limit_count'] as int,
      singleLimitCount: json['single_limit_count'] as int,
      startTime: json['start_time'] as DateTime,
      endTime: json['end_time'] as DateTime,
      userSize: json['user_size'] as int?,
      virtualGroup: json['virtual_group'] as int,
      status: json['status'] as int,
      limitDuration: json['limit_duration'] as int,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'spu_id': spuId,
      'total_limit_count': totalLimitCount,
      'single_limit_count': singleLimitCount,
      'start_time': startTime,
      'end_time': endTime,
      'user_size': userSize,
      'virtual_group': virtualGroup,
      'status': status,
      'limit_duration': limitDuration,
      };
  }
}

class MallPromotionCombinationActivityQueryCondition extends PaginatedRequest {
  MallPromotionCombinationActivityQueryCondition({
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

class MallPromotionCombinationActivityResponse {
  final int id; // 活动编号
  final String name; // 拼团名称
  final int spuId; // 商品 SPU ID
  final int totalLimitCount; // 总限购数量
  final int singleLimitCount; // 单次限购数量
  final DateTime startTime; // 开始时间
  final DateTime endTime; // 结束时间
  final int? userSize; // 购买人数
  final int virtualGroup; // 虚拟成团
  final int status; // 状态
  final int limitDuration; // 限制时长（小时）
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallPromotionCombinationActivityResponse({
    required this.id,
    required this.name,
    required this.spuId,
    required this.totalLimitCount,
    required this.singleLimitCount,
    required this.startTime,
    required this.endTime,
    this.userSize,
    required this.virtualGroup,
    required this.status,
    required this.limitDuration,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallPromotionCombinationActivityResponse.fromJson(Map<String, dynamic> json) {
    return MallPromotionCombinationActivityResponse(
      id: json['id'] as int,
      name: json['name'] as String,
      spuId: json['spu_id'] as int,
      totalLimitCount: json['total_limit_count'] as int,
      singleLimitCount: json['single_limit_count'] as int,
      startTime: json['start_time'] as DateTime,
      endTime: json['end_time'] as DateTime,
      userSize: json['user_size'] as int?,
      virtualGroup: json['virtual_group'] as int,
      status: json['status'] as int,
      limitDuration: json['limit_duration'] as int,
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
      'spu_id': spuId,
      'total_limit_count': totalLimitCount,
      'single_limit_count': singleLimitCount,
      'start_time': startTime,
      'end_time': endTime,
      'user_size': userSize,
      'virtual_group': virtualGroup,
      'status': status,
      'limit_duration': limitDuration,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallPromotionCombinationActivityService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallPromotionCombinationActivity(MallPromotionCombinationActivityRequest mallPromotionCombinationActivity) async {
        return await _httpClient.post<int>(apis['create']!, data: mallPromotionCombinationActivity);
    }

    Future<ApiResponse<int>> updateMallPromotionCombinationActivity(MallPromotionCombinationActivityRequest mallPromotionCombinationActivity) async {
        return await _httpClient.post<int>(apis['update']!, data: mallPromotionCombinationActivity);
    }

    Future<ApiResponse<void>> deleteMallPromotionCombinationActivity(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallPromotionCombinationActivityResponse>> getMallPromotionCombinationActivity(int id) async {
        return await _httpClient.get<MallPromotionCombinationActivityResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallPromotionCombinationActivityResponse>>> listMallPromotionCombinationActivity() async {
        return await _httpClient.get<List<MallPromotionCombinationActivityResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallPromotionCombinationActivityResponse>>> pageMallPromotionCombinationActivity(MallPromotionCombinationActivityQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallPromotionCombinationActivityResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
    Future<ApiResponse<void>> enableMallPromotionCombinationActivity(int id) async {
      return await _httpClient.post<void>('${apis['enable']!}/$id');
    }

    Future<ApiResponse<void>> disableMallPromotionCombinationActivity(int id) async {
      return await _httpClient.post<void>('${apis['disable']!}/$id');
    }
}