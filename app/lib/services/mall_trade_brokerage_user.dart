import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_trade_brokerage_user/create', // 新增
  'update': '/mall/mall_trade_brokerage_user/update', // 修改
  'delete': '/mall/mall_trade_brokerage_user/delete', // 删除
  'get': '/mall/mall_trade_brokerage_user/get', // 单条查询
  'list': '/mall/mall_trade_brokerage_user/list', // 列表查询
  'page': '/mall/mall_trade_brokerage_user/page', // 分页查询
};

class MallTradeBrokerageUserRequest {
  final int id; // 用户编号
  final int? bindUserId; // 推广员编号
  final DateTime? bindUserTime; // 推广员绑定时间
  final bool brokerageEnabled; // 是否成为推广员
  final DateTime? brokerageTime; // 成为分销员时间
  final int brokeragePrice; // 可用佣金
  final int frozenPrice; // 冻结佣金
  

  MallTradeBrokerageUserRequest({
    required this.id,
    this.bindUserId,
    this.bindUserTime,
    required this.brokerageEnabled,
    this.brokerageTime,
    required this.brokeragePrice,
    required this.frozenPrice,
    });

  factory MallTradeBrokerageUserRequest.fromJson(Map<String, dynamic> json) {
    return MallTradeBrokerageUserRequest(
      id: json['id'] as int,
      bindUserId: json['bind_user_id'] as int?,
      bindUserTime: json['bind_user_time'] as DateTime?,
      brokerageEnabled: json['brokerage_enabled'] as bool,
      brokerageTime: json['brokerage_time'] as DateTime?,
      brokeragePrice: json['brokerage_price'] as int,
      frozenPrice: json['frozen_price'] as int,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'bind_user_id': bindUserId,
      'bind_user_time': bindUserTime,
      'brokerage_enabled': brokerageEnabled,
      'brokerage_time': brokerageTime,
      'brokerage_price': brokeragePrice,
      'frozen_price': frozenPrice,
      };
  }
}

class MallTradeBrokerageUserQueryCondition extends PaginatedRequest {
  MallTradeBrokerageUserQueryCondition({
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

class MallTradeBrokerageUserResponse {
  final int id; // 用户编号
  final int? bindUserId; // 推广员编号
  final DateTime? bindUserTime; // 推广员绑定时间
  final bool brokerageEnabled; // 是否成为推广员
  final DateTime? brokerageTime; // 成为分销员时间
  final int brokeragePrice; // 可用佣金
  final int frozenPrice; // 冻结佣金
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallTradeBrokerageUserResponse({
    required this.id,
    this.bindUserId,
    this.bindUserTime,
    required this.brokerageEnabled,
    this.brokerageTime,
    required this.brokeragePrice,
    required this.frozenPrice,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallTradeBrokerageUserResponse.fromJson(Map<String, dynamic> json) {
    return MallTradeBrokerageUserResponse(
      id: json['id'] as int,
      bindUserId: json['bind_user_id'] as int?,
      bindUserTime: json['bind_user_time'] as DateTime?,
      brokerageEnabled: json['brokerage_enabled'] as bool,
      brokerageTime: json['brokerage_time'] as DateTime?,
      brokeragePrice: json['brokerage_price'] as int,
      frozenPrice: json['frozen_price'] as int,
      creator: json['creator'] as int?,
      createTime: json['create_time'] as DateTime,
      updater: json['updater'] as int?,
      updateTime: json['update_time'] as DateTime,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'bind_user_id': bindUserId,
      'bind_user_time': bindUserTime,
      'brokerage_enabled': brokerageEnabled,
      'brokerage_time': brokerageTime,
      'brokerage_price': brokeragePrice,
      'frozen_price': frozenPrice,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallTradeBrokerageUserService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallTradeBrokerageUser(MallTradeBrokerageUserRequest mallTradeBrokerageUser) async {
        return await _httpClient.post<int>(apis['create']!, data: mallTradeBrokerageUser);
    }

    Future<ApiResponse<int>> updateMallTradeBrokerageUser(MallTradeBrokerageUserRequest mallTradeBrokerageUser) async {
        return await _httpClient.post<int>(apis['update']!, data: mallTradeBrokerageUser);
    }

    Future<ApiResponse<void>> deleteMallTradeBrokerageUser(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallTradeBrokerageUserResponse>> getMallTradeBrokerageUser(int id) async {
        return await _httpClient.get<MallTradeBrokerageUserResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallTradeBrokerageUserResponse>>> listMallTradeBrokerageUser() async {
        return await _httpClient.get<List<MallTradeBrokerageUserResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallTradeBrokerageUserResponse>>> pageMallTradeBrokerageUser(MallTradeBrokerageUserQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallTradeBrokerageUserResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
}