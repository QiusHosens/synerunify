import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_trade_brokerage_record/create', // 新增
  'update': '/mall/mall_trade_brokerage_record/update', // 修改
  'delete': '/mall/mall_trade_brokerage_record/delete', // 删除
  'get': '/mall/mall_trade_brokerage_record/get', // 单条查询
  'list': '/mall/mall_trade_brokerage_record/list', // 列表查询
  'page': '/mall/mall_trade_brokerage_record/page', // 分页查询
  'enable': '/mall/mall_trade_brokerage_record/enable', // 启用
  'disable': '/mall/mall_trade_brokerage_record/disable', // 禁用
};

class MallTradeBrokerageRecordRequest {
  final int id; // 编号
  final int userId; // 用户编号
  final String bizId; // 业务编号
  final int bizType; // 业务类型：1-订单，2-提现
  final String title; // 标题
  final int price; // 金额
  final int totalPrice; // 当前总佣金
  final String description; // 说明
  final int status; // 状态：0-待结算，1-已结算，2-已取消
  final int frozenDays; // 冻结时间（天）
  final DateTime? unfreezeTime; // 解冻时间
  final int sourceUserLevel; // 来源用户等级
  final int sourceUserId; // 来源用户编号
  

  MallTradeBrokerageRecordRequest({
    required this.id,
    required this.userId,
    required this.bizId,
    required this.bizType,
    required this.title,
    required this.price,
    required this.totalPrice,
    required this.description,
    required this.status,
    required this.frozenDays,
    this.unfreezeTime,
    required this.sourceUserLevel,
    required this.sourceUserId,
    });

  factory MallTradeBrokerageRecordRequest.fromJson(Map<String, dynamic> json) {
    return MallTradeBrokerageRecordRequest(
      id: json['id'] as int,
      userId: json['user_id'] as int,
      bizId: json['biz_id'] as String,
      bizType: json['biz_type'] as int,
      title: json['title'] as String,
      price: json['price'] as int,
      totalPrice: json['total_price'] as int,
      description: json['description'] as String,
      status: json['status'] as int,
      frozenDays: json['frozen_days'] as int,
      unfreezeTime: json['unfreeze_time'] as DateTime?,
      sourceUserLevel: json['source_user_level'] as int,
      sourceUserId: json['source_user_id'] as int,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'biz_id': bizId,
      'biz_type': bizType,
      'title': title,
      'price': price,
      'total_price': totalPrice,
      'description': description,
      'status': status,
      'frozen_days': frozenDays,
      'unfreeze_time': unfreezeTime,
      'source_user_level': sourceUserLevel,
      'source_user_id': sourceUserId,
      };
  }
}

class MallTradeBrokerageRecordQueryCondition extends PaginatedRequest {
  MallTradeBrokerageRecordQueryCondition({
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

class MallTradeBrokerageRecordResponse {
  final int id; // 编号
  final int userId; // 用户编号
  final String bizId; // 业务编号
  final int bizType; // 业务类型：1-订单，2-提现
  final String title; // 标题
  final int price; // 金额
  final int totalPrice; // 当前总佣金
  final String description; // 说明
  final int status; // 状态：0-待结算，1-已结算，2-已取消
  final int frozenDays; // 冻结时间（天）
  final DateTime? unfreezeTime; // 解冻时间
  final int sourceUserLevel; // 来源用户等级
  final int sourceUserId; // 来源用户编号
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallTradeBrokerageRecordResponse({
    required this.id,
    required this.userId,
    required this.bizId,
    required this.bizType,
    required this.title,
    required this.price,
    required this.totalPrice,
    required this.description,
    required this.status,
    required this.frozenDays,
    this.unfreezeTime,
    required this.sourceUserLevel,
    required this.sourceUserId,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallTradeBrokerageRecordResponse.fromJson(Map<String, dynamic> json) {
    return MallTradeBrokerageRecordResponse(
      id: json['id'] as int,
      userId: json['user_id'] as int,
      bizId: json['biz_id'] as String,
      bizType: json['biz_type'] as int,
      title: json['title'] as String,
      price: json['price'] as int,
      totalPrice: json['total_price'] as int,
      description: json['description'] as String,
      status: json['status'] as int,
      frozenDays: json['frozen_days'] as int,
      unfreezeTime: json['unfreeze_time'] as DateTime?,
      sourceUserLevel: json['source_user_level'] as int,
      sourceUserId: json['source_user_id'] as int,
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
      'biz_id': bizId,
      'biz_type': bizType,
      'title': title,
      'price': price,
      'total_price': totalPrice,
      'description': description,
      'status': status,
      'frozen_days': frozenDays,
      'unfreeze_time': unfreezeTime,
      'source_user_level': sourceUserLevel,
      'source_user_id': sourceUserId,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallTradeBrokerageRecordService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallTradeBrokerageRecord(MallTradeBrokerageRecordRequest mallTradeBrokerageRecord) async {
        return await _httpClient.post<int>(apis['create']!, data: mallTradeBrokerageRecord);
    }

    Future<ApiResponse<int>> updateMallTradeBrokerageRecord(MallTradeBrokerageRecordRequest mallTradeBrokerageRecord) async {
        return await _httpClient.post<int>(apis['update']!, data: mallTradeBrokerageRecord);
    }

    Future<ApiResponse<void>> deleteMallTradeBrokerageRecord(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallTradeBrokerageRecordResponse>> getMallTradeBrokerageRecord(int id) async {
        return await _httpClient.get<MallTradeBrokerageRecordResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallTradeBrokerageRecordResponse>>> listMallTradeBrokerageRecord() async {
        return await _httpClient.get<List<MallTradeBrokerageRecordResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallTradeBrokerageRecordResponse>>> pageMallTradeBrokerageRecord(MallTradeBrokerageRecordQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallTradeBrokerageRecordResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
    Future<ApiResponse<void>> enableMallTradeBrokerageRecord(int id) async {
      return await _httpClient.post<void>('${apis['enable']!}/$id');
    }

    Future<ApiResponse<void>> disableMallTradeBrokerageRecord(int id) async {
      return await _httpClient.post<void>('${apis['disable']!}/$id');
    }
}