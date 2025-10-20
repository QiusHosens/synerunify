import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_trade_order_log/create', // 新增
  'update': '/mall/mall_trade_order_log/update', // 修改
  'delete': '/mall/mall_trade_order_log/delete', // 删除
  'get': '/mall/mall_trade_order_log/get', // 单条查询
  'list': '/mall/mall_trade_order_log/list', // 列表查询
  'page': '/mall/mall_trade_order_log/page', // 分页查询
};

class MallTradeOrderLogRequest {
  final int id; // 日志主键
  final int userId; // 用户编号
  final int userType; // 用户类型
  final int orderId; // 订单号
  final int? beforeStatus; // 操作前状态
  final int? afterStatus; // 操作后状态
  final int operateType; // 操作类型
  final String content; // 操作内容
  

  MallTradeOrderLogRequest({
    required this.id,
    required this.userId,
    required this.userType,
    required this.orderId,
    this.beforeStatus,
    this.afterStatus,
    required this.operateType,
    required this.content,
    });

  factory MallTradeOrderLogRequest.fromJson(Map<String, dynamic> json) {
    return MallTradeOrderLogRequest(
      id: json['id'] as int,
      userId: json['user_id'] as int,
      userType: json['user_type'] as int,
      orderId: json['order_id'] as int,
      beforeStatus: json['before_status'] as int?,
      afterStatus: json['after_status'] as int?,
      operateType: json['operate_type'] as int,
      content: json['content'] as String,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'user_type': userType,
      'order_id': orderId,
      'before_status': beforeStatus,
      'after_status': afterStatus,
      'operate_type': operateType,
      'content': content,
      };
  }
}

class MallTradeOrderLogQueryCondition extends PaginatedRequest {
  MallTradeOrderLogQueryCondition({
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

class MallTradeOrderLogResponse {
  final int id; // 日志主键
  final int userId; // 用户编号
  final int userType; // 用户类型
  final int orderId; // 订单号
  final int? beforeStatus; // 操作前状态
  final int? afterStatus; // 操作后状态
  final int operateType; // 操作类型
  final String content; // 操作内容
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallTradeOrderLogResponse({
    required this.id,
    required this.userId,
    required this.userType,
    required this.orderId,
    this.beforeStatus,
    this.afterStatus,
    required this.operateType,
    required this.content,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallTradeOrderLogResponse.fromJson(Map<String, dynamic> json) {
    return MallTradeOrderLogResponse(
      id: json['id'] as int,
      userId: json['user_id'] as int,
      userType: json['user_type'] as int,
      orderId: json['order_id'] as int,
      beforeStatus: json['before_status'] as int?,
      afterStatus: json['after_status'] as int?,
      operateType: json['operate_type'] as int,
      content: json['content'] as String,
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
      'user_type': userType,
      'order_id': orderId,
      'before_status': beforeStatus,
      'after_status': afterStatus,
      'operate_type': operateType,
      'content': content,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallTradeOrderLogService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallTradeOrderLog(MallTradeOrderLogRequest mallTradeOrderLog) async {
        return await _httpClient.post<int>(apis['create']!, data: mallTradeOrderLog);
    }

    Future<ApiResponse<int>> updateMallTradeOrderLog(MallTradeOrderLogRequest mallTradeOrderLog) async {
        return await _httpClient.post<int>(apis['update']!, data: mallTradeOrderLog);
    }

    Future<ApiResponse<void>> deleteMallTradeOrderLog(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallTradeOrderLogResponse>> getMallTradeOrderLog(int id) async {
        return await _httpClient.get<MallTradeOrderLogResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallTradeOrderLogResponse>>> listMallTradeOrderLog() async {
        return await _httpClient.get<List<MallTradeOrderLogResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallTradeOrderLogResponse>>> pageMallTradeOrderLog(MallTradeOrderLogQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallTradeOrderLogResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
}