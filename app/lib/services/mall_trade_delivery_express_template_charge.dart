import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_trade_delivery_express_template_charge/create', // 新增
  'update': '/mall/mall_trade_delivery_express_template_charge/update', // 修改
  'delete': '/mall/mall_trade_delivery_express_template_charge/delete', // 删除
  'get': '/mall/mall_trade_delivery_express_template_charge/get', // 单条查询
  'list': '/mall/mall_trade_delivery_express_template_charge/list', // 列表查询
  'page': '/mall/mall_trade_delivery_express_template_charge/page', // 分页查询
};

class MallTradeDeliveryExpressTemplateChargeRequest {
  final int id; // 编号，自增
  final int templateId; // 快递运费模板编号
  final String areaIds; // 配送区域 id
  final int chargeMode; // 配送计费方式
  final int startCount; // 首件数量
  final int startPrice; // 起步价，单位：分
  final int extraCount; // 续件数量
  final int extraPrice; // 额外价，单位：分
  

  MallTradeDeliveryExpressTemplateChargeRequest({
    required this.id,
    required this.templateId,
    required this.areaIds,
    required this.chargeMode,
    required this.startCount,
    required this.startPrice,
    required this.extraCount,
    required this.extraPrice,
    });

  factory MallTradeDeliveryExpressTemplateChargeRequest.fromJson(Map<String, dynamic> json) {
    return MallTradeDeliveryExpressTemplateChargeRequest(
      id: json['id'] as int,
      templateId: json['template_id'] as int,
      areaIds: json['area_ids'] as String,
      chargeMode: json['charge_mode'] as int,
      startCount: json['start_count'] as int,
      startPrice: json['start_price'] as int,
      extraCount: json['extra_count'] as int,
      extraPrice: json['extra_price'] as int,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'template_id': templateId,
      'area_ids': areaIds,
      'charge_mode': chargeMode,
      'start_count': startCount,
      'start_price': startPrice,
      'extra_count': extraCount,
      'extra_price': extraPrice,
      };
  }
}

class MallTradeDeliveryExpressTemplateChargeQueryCondition extends PaginatedRequest {
  MallTradeDeliveryExpressTemplateChargeQueryCondition({
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

class MallTradeDeliveryExpressTemplateChargeResponse {
  final int id; // 编号，自增
  final int templateId; // 快递运费模板编号
  final String areaIds; // 配送区域 id
  final int chargeMode; // 配送计费方式
  final int startCount; // 首件数量
  final int startPrice; // 起步价，单位：分
  final int extraCount; // 续件数量
  final int extraPrice; // 额外价，单位：分
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallTradeDeliveryExpressTemplateChargeResponse({
    required this.id,
    required this.templateId,
    required this.areaIds,
    required this.chargeMode,
    required this.startCount,
    required this.startPrice,
    required this.extraCount,
    required this.extraPrice,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallTradeDeliveryExpressTemplateChargeResponse.fromJson(Map<String, dynamic> json) {
    return MallTradeDeliveryExpressTemplateChargeResponse(
      id: json['id'] as int,
      templateId: json['template_id'] as int,
      areaIds: json['area_ids'] as String,
      chargeMode: json['charge_mode'] as int,
      startCount: json['start_count'] as int,
      startPrice: json['start_price'] as int,
      extraCount: json['extra_count'] as int,
      extraPrice: json['extra_price'] as int,
      creator: json['creator'] as int?,
      createTime: json['create_time'] as DateTime,
      updater: json['updater'] as int?,
      updateTime: json['update_time'] as DateTime,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'template_id': templateId,
      'area_ids': areaIds,
      'charge_mode': chargeMode,
      'start_count': startCount,
      'start_price': startPrice,
      'extra_count': extraCount,
      'extra_price': extraPrice,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallTradeDeliveryExpressTemplateChargeService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallTradeDeliveryExpressTemplateCharge(MallTradeDeliveryExpressTemplateChargeRequest mallTradeDeliveryExpressTemplateCharge) async {
        return await _httpClient.post<int>(apis['create']!, data: mallTradeDeliveryExpressTemplateCharge);
    }

    Future<ApiResponse<int>> updateMallTradeDeliveryExpressTemplateCharge(MallTradeDeliveryExpressTemplateChargeRequest mallTradeDeliveryExpressTemplateCharge) async {
        return await _httpClient.post<int>(apis['update']!, data: mallTradeDeliveryExpressTemplateCharge);
    }

    Future<ApiResponse<void>> deleteMallTradeDeliveryExpressTemplateCharge(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallTradeDeliveryExpressTemplateChargeResponse>> getMallTradeDeliveryExpressTemplateCharge(int id) async {
        return await _httpClient.get<MallTradeDeliveryExpressTemplateChargeResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallTradeDeliveryExpressTemplateChargeResponse>>> listMallTradeDeliveryExpressTemplateCharge() async {
        return await _httpClient.get<List<MallTradeDeliveryExpressTemplateChargeResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallTradeDeliveryExpressTemplateChargeResponse>>> pageMallTradeDeliveryExpressTemplateCharge(MallTradeDeliveryExpressTemplateChargeQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallTradeDeliveryExpressTemplateChargeResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
}