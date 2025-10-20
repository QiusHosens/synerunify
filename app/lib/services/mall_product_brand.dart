import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_product_brand/create', // 新增
  'update': '/mall/mall_product_brand/update', // 修改
  'delete': '/mall/mall_product_brand/delete', // 删除
  'get': '/mall/mall_product_brand/get', // 单条查询
  'list': '/mall/mall_product_brand/list', // 列表查询
  'page': '/mall/mall_product_brand/page', // 分页查询
  'enable': '/mall/mall_product_brand/enable', // 启用
  'disable': '/mall/mall_product_brand/disable', // 禁用
};

class MallProductBrandRequest {
  final int id; // 品牌编号
  final String name; // 品牌名称
  final int? fileId; // 品牌图片ID
  final int? sort; // 品牌排序
  final String? description; // 品牌描述
  final int status; // 状态
  

  MallProductBrandRequest({
    required this.id,
    required this.name,
    this.fileId,
    this.sort,
    this.description,
    required this.status,
    });

  factory MallProductBrandRequest.fromJson(Map<String, dynamic> json) {
    return MallProductBrandRequest(
      id: json['id'] as int,
      name: json['name'] as String,
      fileId: json['file_id'] as int?,
      sort: json['sort'] as int?,
      description: json['description'] as String?,
      status: json['status'] as int,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'file_id': fileId,
      'sort': sort,
      'description': description,
      'status': status,
      };
  }
}

class MallProductBrandQueryCondition extends PaginatedRequest {
  MallProductBrandQueryCondition({
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

class MallProductBrandResponse {
  final int id; // 品牌编号
  final String name; // 品牌名称
  final int? fileId; // 品牌图片ID
  final int? sort; // 品牌排序
  final String? description; // 品牌描述
  final int status; // 状态
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallProductBrandResponse({
    required this.id,
    required this.name,
    this.fileId,
    this.sort,
    this.description,
    required this.status,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallProductBrandResponse.fromJson(Map<String, dynamic> json) {
    return MallProductBrandResponse(
      id: json['id'] as int,
      name: json['name'] as String,
      fileId: json['file_id'] as int?,
      sort: json['sort'] as int?,
      description: json['description'] as String?,
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
      'file_id': fileId,
      'sort': sort,
      'description': description,
      'status': status,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallProductBrandService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallProductBrand(MallProductBrandRequest mallProductBrand) async {
        return await _httpClient.post<int>(apis['create']!, data: mallProductBrand);
    }

    Future<ApiResponse<int>> updateMallProductBrand(MallProductBrandRequest mallProductBrand) async {
        return await _httpClient.post<int>(apis['update']!, data: mallProductBrand);
    }

    Future<ApiResponse<void>> deleteMallProductBrand(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallProductBrandResponse>> getMallProductBrand(int id) async {
        return await _httpClient.get<MallProductBrandResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallProductBrandResponse>>> listMallProductBrand() async {
        return await _httpClient.get<List<MallProductBrandResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallProductBrandResponse>>> pageMallProductBrand(MallProductBrandQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallProductBrandResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
    Future<ApiResponse<void>> enableMallProductBrand(int id) async {
      return await _httpClient.post<void>('${apis['enable']!}/$id');
    }

    Future<ApiResponse<void>> disableMallProductBrand(int id) async {
      return await _httpClient.post<void>('${apis['disable']!}/$id');
    }
}