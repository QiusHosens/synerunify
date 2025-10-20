import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_trade_delivery_express_template/create', // 新增
  'update': '/mall/mall_trade_delivery_express_template/update', // 修改
  'delete': '/mall/mall_trade_delivery_express_template/delete', // 删除
  'get': '/mall/mall_trade_delivery_express_template/get', // 单条查询
  'list': '/mall/mall_trade_delivery_express_template/list', // 列表查询
  'page': '/mall/mall_trade_delivery_express_template/page', // 分页查询
  'enable': '/mall/mall_trade_delivery_express_template/enable', // 启用
  'disable': '/mall/mall_trade_delivery_express_template/disable', // 禁用
};

class MallTradeDeliveryExpressTemplateRequest {
  final int id; // 编号
  final String name; // 模板名称
  final int chargeMode; // 配送计费方式
  final int sort; // 排序
  final int status; // 状态
  

  MallTradeDeliveryExpressTemplateRequest({
    required this.id,
    required this.name,
    required this.chargeMode,
    required this.sort,
    required this.status,
    });

  factory MallTradeDeliveryExpressTemplateRequest.fromJson(Map<String, dynamic> json) {
    return MallTradeDeliveryExpressTemplateRequest(
      id: json['id'] as int,
      name: json['name'] as String,
      chargeMode: json['charge_mode'] as int,
      sort: json['sort'] as int,
      status: json['status'] as int,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'charge_mode': chargeMode,
      'sort': sort,
      'status': status,
      };
  }
}

class MallTradeDeliveryExpressTemplateQueryCondition extends PaginatedRequest {
  MallTradeDeliveryExpressTemplateQueryCondition({
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

class MallTradeDeliveryExpressTemplateResponse {
  final int id; // 编号
  final String name; // 模板名称
  final int chargeMode; // 配送计费方式
  final int sort; // 排序
  final int status; // 状态
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallTradeDeliveryExpressTemplateResponse({
    required this.id,
    required this.name,
    required this.chargeMode,
    required this.sort,
    required this.status,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallTradeDeliveryExpressTemplateResponse.fromJson(Map<String, dynamic> json) {
    return MallTradeDeliveryExpressTemplateResponse(
      id: json['id'] as int,
      name: json['name'] as String,
      chargeMode: json['charge_mode'] as int,
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
      'name': name,
      'charge_mode': chargeMode,
      'sort': sort,
      'status': status,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallTradeDeliveryExpressTemplateService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallTradeDeliveryExpressTemplate(MallTradeDeliveryExpressTemplateRequest mallTradeDeliveryExpressTemplate) async {
        return await _httpClient.post<int>(apis['create']!, data: mallTradeDeliveryExpressTemplate);
    }

    Future<ApiResponse<int>> updateMallTradeDeliveryExpressTemplate(MallTradeDeliveryExpressTemplateRequest mallTradeDeliveryExpressTemplate) async {
        return await _httpClient.post<int>(apis['update']!, data: mallTradeDeliveryExpressTemplate);
    }

    Future<ApiResponse<void>> deleteMallTradeDeliveryExpressTemplate(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallTradeDeliveryExpressTemplateResponse>> getMallTradeDeliveryExpressTemplate(int id) async {
        return await _httpClient.get<MallTradeDeliveryExpressTemplateResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallTradeDeliveryExpressTemplateResponse>>> listMallTradeDeliveryExpressTemplate() async {
        return await _httpClient.get<List<MallTradeDeliveryExpressTemplateResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallTradeDeliveryExpressTemplateResponse>>> pageMallTradeDeliveryExpressTemplate(MallTradeDeliveryExpressTemplateQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallTradeDeliveryExpressTemplateResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
    Future<ApiResponse<void>> enableMallTradeDeliveryExpressTemplate(int id) async {
      return await _httpClient.post<void>('${apis['enable']!}/$id');
    }

    Future<ApiResponse<void>> disableMallTradeDeliveryExpressTemplate(int id) async {
      return await _httpClient.post<void>('${apis['disable']!}/$id');
    }
}