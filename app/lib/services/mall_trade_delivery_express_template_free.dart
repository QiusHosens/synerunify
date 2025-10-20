import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_trade_delivery_express_template_free/create', // 新增
  'update': '/mall/mall_trade_delivery_express_template_free/update', // 修改
  'delete': '/mall/mall_trade_delivery_express_template_free/delete', // 删除
  'get': '/mall/mall_trade_delivery_express_template_free/get', // 单条查询
  'list': '/mall/mall_trade_delivery_express_template_free/list', // 列表查询
  'page': '/mall/mall_trade_delivery_express_template_free/page', // 分页查询
};

class MallTradeDeliveryExpressTemplateFreeRequest {
  final int id; // 编号
  final int templateId; // 快递运费模板编号
  final String areaIds; // 包邮区域 id
  final int freePrice; // 包邮金额，单位：分
  final int freeCount; // 包邮件数,
  

  MallTradeDeliveryExpressTemplateFreeRequest({
    required this.id,
    required this.templateId,
    required this.areaIds,
    required this.freePrice,
    required this.freeCount,
    });

  factory MallTradeDeliveryExpressTemplateFreeRequest.fromJson(Map<String, dynamic> json) {
    return MallTradeDeliveryExpressTemplateFreeRequest(
      id: json['id'] as int,
      templateId: json['template_id'] as int,
      areaIds: json['area_ids'] as String,
      freePrice: json['free_price'] as int,
      freeCount: json['free_count'] as int,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'template_id': templateId,
      'area_ids': areaIds,
      'free_price': freePrice,
      'free_count': freeCount,
      };
  }
}

class MallTradeDeliveryExpressTemplateFreeQueryCondition extends PaginatedRequest {
  MallTradeDeliveryExpressTemplateFreeQueryCondition({
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

class MallTradeDeliveryExpressTemplateFreeResponse {
  final int id; // 编号
  final int templateId; // 快递运费模板编号
  final String areaIds; // 包邮区域 id
  final int freePrice; // 包邮金额，单位：分
  final int freeCount; // 包邮件数,
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallTradeDeliveryExpressTemplateFreeResponse({
    required this.id,
    required this.templateId,
    required this.areaIds,
    required this.freePrice,
    required this.freeCount,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallTradeDeliveryExpressTemplateFreeResponse.fromJson(Map<String, dynamic> json) {
    return MallTradeDeliveryExpressTemplateFreeResponse(
      id: json['id'] as int,
      templateId: json['template_id'] as int,
      areaIds: json['area_ids'] as String,
      freePrice: json['free_price'] as int,
      freeCount: json['free_count'] as int,
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
      'free_price': freePrice,
      'free_count': freeCount,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallTradeDeliveryExpressTemplateFreeService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallTradeDeliveryExpressTemplateFree(MallTradeDeliveryExpressTemplateFreeRequest mallTradeDeliveryExpressTemplateFree) async {
        return await _httpClient.post<int>(apis['create']!, data: mallTradeDeliveryExpressTemplateFree);
    }

    Future<ApiResponse<int>> updateMallTradeDeliveryExpressTemplateFree(MallTradeDeliveryExpressTemplateFreeRequest mallTradeDeliveryExpressTemplateFree) async {
        return await _httpClient.post<int>(apis['update']!, data: mallTradeDeliveryExpressTemplateFree);
    }

    Future<ApiResponse<void>> deleteMallTradeDeliveryExpressTemplateFree(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallTradeDeliveryExpressTemplateFreeResponse>> getMallTradeDeliveryExpressTemplateFree(int id) async {
        return await _httpClient.get<MallTradeDeliveryExpressTemplateFreeResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallTradeDeliveryExpressTemplateFreeResponse>>> listMallTradeDeliveryExpressTemplateFree() async {
        return await _httpClient.get<List<MallTradeDeliveryExpressTemplateFreeResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallTradeDeliveryExpressTemplateFreeResponse>>> pageMallTradeDeliveryExpressTemplateFree(MallTradeDeliveryExpressTemplateFreeQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallTradeDeliveryExpressTemplateFreeResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
}