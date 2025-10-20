import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_promotion_bargain_help/create', // 新增
  'update': '/mall/mall_promotion_bargain_help/update', // 修改
  'delete': '/mall/mall_promotion_bargain_help/delete', // 删除
  'get': '/mall/mall_promotion_bargain_help/get', // 单条查询
  'list': '/mall/mall_promotion_bargain_help/list', // 列表查询
  'page': '/mall/mall_promotion_bargain_help/page', // 分页查询
};

class MallPromotionBargainHelpRequest {
  final int id; // 砍价助力编号
  final int userId; // 用户编号
  final int activityId; // 砍价活动名称
  final int recordId; // 砍价记录编号
  final int reducePrice; // 减少砍价，单位：分
  

  MallPromotionBargainHelpRequest({
    required this.id,
    required this.userId,
    required this.activityId,
    required this.recordId,
    required this.reducePrice,
    });

  factory MallPromotionBargainHelpRequest.fromJson(Map<String, dynamic> json) {
    return MallPromotionBargainHelpRequest(
      id: json['id'] as int,
      userId: json['user_id'] as int,
      activityId: json['activity_id'] as int,
      recordId: json['record_id'] as int,
      reducePrice: json['reduce_price'] as int,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'activity_id': activityId,
      'record_id': recordId,
      'reduce_price': reducePrice,
      };
  }
}

class MallPromotionBargainHelpQueryCondition extends PaginatedRequest {
  MallPromotionBargainHelpQueryCondition({
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

class MallPromotionBargainHelpResponse {
  final int id; // 砍价助力编号
  final int userId; // 用户编号
  final int activityId; // 砍价活动名称
  final int recordId; // 砍价记录编号
  final int reducePrice; // 减少砍价，单位：分
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallPromotionBargainHelpResponse({
    required this.id,
    required this.userId,
    required this.activityId,
    required this.recordId,
    required this.reducePrice,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallPromotionBargainHelpResponse.fromJson(Map<String, dynamic> json) {
    return MallPromotionBargainHelpResponse(
      id: json['id'] as int,
      userId: json['user_id'] as int,
      activityId: json['activity_id'] as int,
      recordId: json['record_id'] as int,
      reducePrice: json['reduce_price'] as int,
      creator: json['creator'] as int?,
      createTime: json['create_time'] as DateTime,
      updater: json['updater'] as int?,
      updateTime: json['update_time'] as DateTime,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'activity_id': activityId,
      'record_id': recordId,
      'reduce_price': reducePrice,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallPromotionBargainHelpService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallPromotionBargainHelp(MallPromotionBargainHelpRequest mallPromotionBargainHelp) async {
        return await _httpClient.post<int>(apis['create']!, data: mallPromotionBargainHelp);
    }

    Future<ApiResponse<int>> updateMallPromotionBargainHelp(MallPromotionBargainHelpRequest mallPromotionBargainHelp) async {
        return await _httpClient.post<int>(apis['update']!, data: mallPromotionBargainHelp);
    }

    Future<ApiResponse<void>> deleteMallPromotionBargainHelp(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallPromotionBargainHelpResponse>> getMallPromotionBargainHelp(int id) async {
        return await _httpClient.get<MallPromotionBargainHelpResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallPromotionBargainHelpResponse>>> listMallPromotionBargainHelp() async {
        return await _httpClient.get<List<MallPromotionBargainHelpResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallPromotionBargainHelpResponse>>> pageMallPromotionBargainHelp(MallPromotionBargainHelpQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallPromotionBargainHelpResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
}