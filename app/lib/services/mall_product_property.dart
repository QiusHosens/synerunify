import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_product_property/create', // 新增
  'update': '/mall/mall_product_property/update', // 修改
  'delete': '/mall/mall_product_property/delete', // 删除
  'get': '/mall/mall_product_property/get', // 单条查询
  'list': '/mall/mall_product_property/list', // 列表查询
  'page': '/mall/mall_product_property/page', // 分页查询
  'enable': '/mall/mall_product_property/enable', // 启用
  'disable': '/mall/mall_product_property/disable', // 禁用
};

class MallProductPropertyRequest {
  final int id; // 编号
  final String? name; // 名称
  final int status; // 状态
  final String? remark; // 备注
  

  MallProductPropertyRequest({
    required this.id,
    this.name,
    required this.status,
    this.remark,
    });

  factory MallProductPropertyRequest.fromJson(Map<String, dynamic> json) {
    return MallProductPropertyRequest(
      id: json['id'] as int,
      name: json['name'] as String?,
      status: json['status'] as int,
      remark: json['remark'] as String?,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'status': status,
      'remark': remark,
      };
  }
}

class MallProductPropertyQueryCondition extends PaginatedRequest {
  MallProductPropertyQueryCondition({
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

class MallProductPropertyResponse {
  final int id; // 编号
  final String? name; // 名称
  final int status; // 状态
  final String? remark; // 备注
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallProductPropertyResponse({
    required this.id,
    this.name,
    required this.status,
    this.remark,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallProductPropertyResponse.fromJson(Map<String, dynamic> json) {
    return MallProductPropertyResponse(
      id: json['id'] as int,
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

class MallProductPropertyService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallProductProperty(MallProductPropertyRequest mallProductProperty) async {
        return await _httpClient.post<int>(apis['create']!, data: mallProductProperty);
    }

    Future<ApiResponse<int>> updateMallProductProperty(MallProductPropertyRequest mallProductProperty) async {
        return await _httpClient.post<int>(apis['update']!, data: mallProductProperty);
    }

    Future<ApiResponse<void>> deleteMallProductProperty(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallProductPropertyResponse>> getMallProductProperty(int id) async {
        return await _httpClient.get<MallProductPropertyResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallProductPropertyResponse>>> listMallProductProperty() async {
        return await _httpClient.get<List<MallProductPropertyResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallProductPropertyResponse>>> pageMallProductProperty(MallProductPropertyQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallProductPropertyResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
    Future<ApiResponse<void>> enableMallProductProperty(int id) async {
      return await _httpClient.post<void>('${apis['enable']!}/$id');
    }

    Future<ApiResponse<void>> disableMallProductProperty(int id) async {
      return await _httpClient.post<void>('${apis['disable']!}/$id');
    }
}