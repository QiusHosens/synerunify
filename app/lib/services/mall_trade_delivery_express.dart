import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_trade_delivery_express/create', // 新增
  'update': '/mall/mall_trade_delivery_express/update', // 修改
  'delete': '/mall/mall_trade_delivery_express/delete', // 删除
  'get': '/mall/mall_trade_delivery_express/get', // 单条查询
  'list': '/mall/mall_trade_delivery_express/list', // 列表查询
  'page': '/mall/mall_trade_delivery_express/page', // 分页查询
  'enable': '/mall/mall_trade_delivery_express/enable', // 启用
  'disable': '/mall/mall_trade_delivery_express/disable', // 禁用
};

class MallTradeDeliveryExpressRequest {
  final int id; // 编号
  final String code; // 快递公司编码
  final String name; // 快递公司名称
  final int? fileId; // 快递公司 logo id
  final int sort; // 排序
  final int status; // 状态
  

  MallTradeDeliveryExpressRequest({
    required this.id,
    required this.code,
    required this.name,
    this.fileId,
    required this.sort,
    required this.status,
    });

  factory MallTradeDeliveryExpressRequest.fromJson(Map<String, dynamic> json) {
    return MallTradeDeliveryExpressRequest(
      id: json['id'] as int,
      code: json['code'] as String,
      name: json['name'] as String,
      fileId: json['file_id'] as int?,
      sort: json['sort'] as int,
      status: json['status'] as int,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'code': code,
      'name': name,
      'file_id': fileId,
      'sort': sort,
      'status': status,
      };
  }
}

class MallTradeDeliveryExpressQueryCondition extends PaginatedRequest {
  MallTradeDeliveryExpressQueryCondition({
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

class MallTradeDeliveryExpressResponse {
  final int id; // 编号
  final String code; // 快递公司编码
  final String name; // 快递公司名称
  final int? fileId; // 快递公司 logo id
  final int sort; // 排序
  final int status; // 状态
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallTradeDeliveryExpressResponse({
    required this.id,
    required this.code,
    required this.name,
    this.fileId,
    required this.sort,
    required this.status,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallTradeDeliveryExpressResponse.fromJson(Map<String, dynamic> json) {
    return MallTradeDeliveryExpressResponse(
      id: json['id'] as int,
      code: json['code'] as String,
      name: json['name'] as String,
      fileId: json['file_id'] as int?,
      sort: json['sort'] as int,
      status: json['status'] as int,
      creator: json['creator'] as int?,
      createTime: json['create_time'] as DateTime,
      updater: json['updater'] as int?,
      updateTime: json['update_time'] as DateTime,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'code': code,
      'name': name,
      'file_id': fileId,
      'sort': sort,
      'status': status,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallTradeDeliveryExpressService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallTradeDeliveryExpress(MallTradeDeliveryExpressRequest mallTradeDeliveryExpress) async {
        return await _httpClient.post<int>(apis['create']!, data: mallTradeDeliveryExpress);
    }

    Future<ApiResponse<int>> updateMallTradeDeliveryExpress(MallTradeDeliveryExpressRequest mallTradeDeliveryExpress) async {
        return await _httpClient.post<int>(apis['update']!, data: mallTradeDeliveryExpress);
    }

    Future<ApiResponse<void>> deleteMallTradeDeliveryExpress(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallTradeDeliveryExpressResponse>> getMallTradeDeliveryExpress(int id) async {
        return await _httpClient.get<MallTradeDeliveryExpressResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallTradeDeliveryExpressResponse>>> listMallTradeDeliveryExpress() async {
        return await _httpClient.get<List<MallTradeDeliveryExpressResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallTradeDeliveryExpressResponse>>> pageMallTradeDeliveryExpress(MallTradeDeliveryExpressQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallTradeDeliveryExpressResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
    Future<ApiResponse<void>> enableMallTradeDeliveryExpress(int id) async {
      return await _httpClient.post<void>('${apis['enable']!}/$id');
    }

    Future<ApiResponse<void>> disableMallTradeDeliveryExpress(int id) async {
      return await _httpClient.post<void>('${apis['disable']!}/$id');
    }
}