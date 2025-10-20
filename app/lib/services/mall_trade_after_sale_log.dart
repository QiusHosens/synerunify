import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_trade_after_sale_log/create', // 新增
  'update': '/mall/mall_trade_after_sale_log/update', // 修改
  'delete': '/mall/mall_trade_after_sale_log/delete', // 删除
  'get': '/mall/mall_trade_after_sale_log/get', // 单条查询
  'list': '/mall/mall_trade_after_sale_log/list', // 列表查询
  'page': '/mall/mall_trade_after_sale_log/page', // 分页查询
};

class MallTradeAfterSaleLogRequest {
  final int id; // 编号
  final int userId; // 用户编号
  final int userType; // 用户类型
  final int afterSaleId; // 售后编号
  final int? beforeStatus; // 售后状态（之前）
  final int afterStatus; // 售后状态（之后）
  final int operateType; // 操作类型
  final String content; // 操作明细
  

  MallTradeAfterSaleLogRequest({
    required this.id,
    required this.userId,
    required this.userType,
    required this.afterSaleId,
    this.beforeStatus,
    required this.afterStatus,
    required this.operateType,
    required this.content,
    });

  factory MallTradeAfterSaleLogRequest.fromJson(Map<String, dynamic> json) {
    return MallTradeAfterSaleLogRequest(
      id: json['id'] as int,
      userId: json['user_id'] as int,
      userType: json['user_type'] as int,
      afterSaleId: json['after_sale_id'] as int,
      beforeStatus: json['before_status'] as int?,
      afterStatus: json['after_status'] as int,
      operateType: json['operate_type'] as int,
      content: json['content'] as String,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'user_type': userType,
      'after_sale_id': afterSaleId,
      'before_status': beforeStatus,
      'after_status': afterStatus,
      'operate_type': operateType,
      'content': content,
      };
  }
}

class MallTradeAfterSaleLogQueryCondition extends PaginatedRequest {
  MallTradeAfterSaleLogQueryCondition({
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

class MallTradeAfterSaleLogResponse {
  final int id; // 编号
  final int userId; // 用户编号
  final int userType; // 用户类型
  final int afterSaleId; // 售后编号
  final int? beforeStatus; // 售后状态（之前）
  final int afterStatus; // 售后状态（之后）
  final int operateType; // 操作类型
  final String content; // 操作明细
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallTradeAfterSaleLogResponse({
    required this.id,
    required this.userId,
    required this.userType,
    required this.afterSaleId,
    this.beforeStatus,
    required this.afterStatus,
    required this.operateType,
    required this.content,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallTradeAfterSaleLogResponse.fromJson(Map<String, dynamic> json) {
    return MallTradeAfterSaleLogResponse(
      id: json['id'] as int,
      userId: json['user_id'] as int,
      userType: json['user_type'] as int,
      afterSaleId: json['after_sale_id'] as int,
      beforeStatus: json['before_status'] as int?,
      afterStatus: json['after_status'] as int,
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
      'after_sale_id': afterSaleId,
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

class MallTradeAfterSaleLogService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallTradeAfterSaleLog(MallTradeAfterSaleLogRequest mallTradeAfterSaleLog) async {
        return await _httpClient.post<int>(apis['create']!, data: mallTradeAfterSaleLog);
    }

    Future<ApiResponse<int>> updateMallTradeAfterSaleLog(MallTradeAfterSaleLogRequest mallTradeAfterSaleLog) async {
        return await _httpClient.post<int>(apis['update']!, data: mallTradeAfterSaleLog);
    }

    Future<ApiResponse<void>> deleteMallTradeAfterSaleLog(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallTradeAfterSaleLogResponse>> getMallTradeAfterSaleLog(int id) async {
        return await _httpClient.get<MallTradeAfterSaleLogResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallTradeAfterSaleLogResponse>>> listMallTradeAfterSaleLog() async {
        return await _httpClient.get<List<MallTradeAfterSaleLogResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallTradeAfterSaleLogResponse>>> pageMallTradeAfterSaleLog(MallTradeAfterSaleLogQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallTradeAfterSaleLogResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
}