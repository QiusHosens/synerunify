import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_product_property_value/create', // 新增
  'update': '/mall/mall_product_property_value/update', // 修改
  'delete': '/mall/mall_product_property_value/delete', // 删除
  'get': '/mall/mall_product_property_value/get', // 单条查询
  'list': '/mall/mall_product_property_value/list', // 列表查询
  'page': '/mall/mall_product_property_value/page', // 分页查询
  'enable': '/mall/mall_product_property_value/enable', // 启用
  'disable': '/mall/mall_product_property_value/disable', // 禁用
};

class MallProductPropertyValueRequest {
  final int id; // 编号
  final int? propertyId; // 属性项的编号
  final String? name; // 名称
  final int status; // 状态
  final String? remark; // 备注
  

  MallProductPropertyValueRequest({
    required this.id,
    this.propertyId,
    this.name,
    required this.status,
    this.remark,
    });

  factory MallProductPropertyValueRequest.fromJson(Map<String, dynamic> json) {
    return MallProductPropertyValueRequest(
      id: json['id'] as int,
      propertyId: json['property_id'] as int?,
      name: json['name'] as String?,
      status: json['status'] as int,
      remark: json['remark'] as String?,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'property_id': propertyId,
      'name': name,
      'status': status,
      'remark': remark,
      };
  }
}

class MallProductPropertyValueQueryCondition extends PaginatedRequest {
  MallProductPropertyValueQueryCondition({
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

class MallProductPropertyValueResponse {
  final int id; // 编号
  final int? propertyId; // 属性项的编号
  final String? name; // 名称
  final int status; // 状态
  final String? remark; // 备注
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallProductPropertyValueResponse({
    required this.id,
    this.propertyId,
    this.name,
    required this.status,
    this.remark,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallProductPropertyValueResponse.fromJson(Map<String, dynamic> json) {
    return MallProductPropertyValueResponse(
      id: json['id'] as int,
      propertyId: json['property_id'] as int?,
      name: json['name'] as String?,
      status: json['status'] as int,
      remark: json['remark'] as String?,
      creator: json['creator'] as int?,
      createTime: json['create_time'] as DateTime,
      updater: json['updater'] as int?,
      updateTime: json['update_time'] as DateTime,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'property_id': propertyId,
      'name': name,
      'status': status,
      'remark': remark,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallProductPropertyValueService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallProductPropertyValue(MallProductPropertyValueRequest mallProductPropertyValue) async {
        return await _httpClient.post<int>(apis['create']!, data: mallProductPropertyValue);
    }

    Future<ApiResponse<int>> updateMallProductPropertyValue(MallProductPropertyValueRequest mallProductPropertyValue) async {
        return await _httpClient.post<int>(apis['update']!, data: mallProductPropertyValue);
    }

    Future<ApiResponse<void>> deleteMallProductPropertyValue(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallProductPropertyValueResponse>> getMallProductPropertyValue(int id) async {
        return await _httpClient.get<MallProductPropertyValueResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallProductPropertyValueResponse>>> listMallProductPropertyValue() async {
        return await _httpClient.get<List<MallProductPropertyValueResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallProductPropertyValueResponse>>> pageMallProductPropertyValue(MallProductPropertyValueQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallProductPropertyValueResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
    Future<ApiResponse<void>> enableMallProductPropertyValue(int id) async {
      return await _httpClient.post<void>('${apis['enable']!}/$id');
    }

    Future<ApiResponse<void>> disableMallProductPropertyValue(int id) async {
      return await _httpClient.post<void>('${apis['disable']!}/$id');
    }
}