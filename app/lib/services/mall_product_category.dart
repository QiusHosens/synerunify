import 'package:synerunify/models/base.dart';
import 'package:synerunify/utils/logger.dart';

import '../utils/http_client.dart';

const apis = {
  'create': '/mall/mall_product_category/create', // 新增
  'update': '/mall/mall_product_category/update', // 修改
  'delete': '/mall/mall_product_category/delete', // 删除
  'get': '/mall/mall_product_category/get', // 单条查询
  'list': '/mall/mall_product_category/list', // 列表查询
  'page': '/mall/mall_product_category/page', // 分页查询
  'enable': '/mall/mall_product_category/enable', // 启用
  'disable': '/mall/mall_product_category/disable', // 禁用

  'list_root_by_parent_id':
      '/mall/mall_product_category/list_root_by_parent_id', // 列表查询

  'list_root_all_by_parent_id':
      '/mall/mall_product_category/list_root_all_by_parent_id', // 列表查询
};

class MallProductCategoryRequest {
  final int id; // 分类编号
  final int parentId; // 父分类编号
  final String name; // 分类名称
  final int? fileId; // 分类图片ID
  final int? sort; // 分类排序
  final int status; // 状态

  MallProductCategoryRequest({
    required this.id,
    required this.parentId,
    required this.name,
    this.fileId,
    this.sort,
    required this.status,
  });

  factory MallProductCategoryRequest.fromJson(Map<String, dynamic> json) {
    return MallProductCategoryRequest(
      id: json['id'] as int,
      parentId: json['parent_id'] as int,
      name: json['name'] as String,
      fileId: json['file_id'] as int?,
      sort: json['sort'] as int?,
      status: json['status'] as int,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'parent_id': parentId,
      'name': name,
      'file_id': fileId,
      'sort': sort,
      'status': status,
    };
  }
}

class MallProductCategoryQueryCondition extends PaginatedRequest {
  MallProductCategoryQueryCondition({
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

class MallProductCategoryResponse {
  final int id; // 分类编号
  final int parentId; // 父分类编号
  final String name; // 分类名称
  final int? fileId; // 分类图片ID
  final int? sort; // 分类排序
  final int status; // 状态
  final int? creator; // 创建者ID
  final String createTime; // 创建时间
  final int? updater; // 更新者ID
  final String updateTime; // 更新时间

  List<MallProductCategoryResponse>? children; // 子分类

  MallProductCategoryResponse({
    required this.id,
    required this.parentId,
    required this.name,
    this.fileId,
    this.sort,
    required this.status,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,

    this.children,
  });

  factory MallProductCategoryResponse.fromJson(Map<String, dynamic> json) {
    return MallProductCategoryResponse(
      id: json['id'] as int,
      parentId: json['parent_id'] as int,
      name: json['name'] as String,
      fileId: json['file_id'] as int?,
      sort: json['sort'] as int?,
      status: json['status'] as int,
      creator: json['creator'] as int?,
      createTime: json['create_time'] as String,
      updater: json['updater'] as int?,
      updateTime: json['update_time'] as String,
      children: [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'parent_id': parentId,
      'name': name,
      'file_id': fileId,
      'sort': sort,
      'status': status,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      'children': children?.map((e) => e.toJson()).toList(),
    };
  }
}

class MallProductCategoryService {
  final HttpClient _httpClient = HttpClient();

  Future<ApiResponse<int>> createMallProductCategory(
    MallProductCategoryRequest mallProductCategory,
  ) async {
    return await _httpClient.post<int>(
      apis['create']!,
      data: mallProductCategory,
    );
  }

  Future<ApiResponse<int>> updateMallProductCategory(
    MallProductCategoryRequest mallProductCategory,
  ) async {
    return await _httpClient.post<int>(
      apis['update']!,
      data: mallProductCategory,
    );
  }

  Future<ApiResponse<void>> deleteMallProductCategory(int id) async {
    return await _httpClient.post<void>('${apis['delete']!}/$id');
  }

  Future<ApiResponse<MallProductCategoryResponse>> getMallProductCategory(
    int id,
  ) async {
    return await _httpClient.get<MallProductCategoryResponse>(
      '${apis['get']!}/$id',
    );
  }

  Future<ApiResponse<List<MallProductCategoryResponse>>>
  listMallProductCategory() async {
    return await _httpClient.get<List<MallProductCategoryResponse>>(
      apis['list']!,
    );
  }

  Future<ApiResponse<List<MallProductCategoryResponse>>>
  listRootMallProductCategoryByParentId(int parentId) async {
    return await _httpClient.get<List<MallProductCategoryResponse>>(
      '${apis['list_root_by_parent_id']!}/$parentId',
      fromJson: (list) => list.map((e) => MallProductCategoryResponse.fromJson(e))
            .where((category) => category != null)
            .cast<MallProductCategoryResponse>()
            .toList(),
    );
  }

  Future<ApiResponse<List<MallProductCategoryResponse>>>
  listRootAllMallProductCategoryByParentId(int parentId) async {
    return await _httpClient.get<List<MallProductCategoryResponse>>(
      '${apis['list_root_all_by_parent_id']!}/$parentId',
      fromJson: (list) => list.map((e) => MallProductCategoryResponse.fromJson(e))
            .where((category) => category != null)
            .cast<MallProductCategoryResponse>()
            .toList(),
    );
  }

  Future<ApiResponse<PaginatedResponse<MallProductCategoryResponse>>>
  pageMallProductCategory(MallProductCategoryQueryCondition condition) async {
    return await _httpClient
        .get<PaginatedResponse<MallProductCategoryResponse>>(
          apis['page']!,
          queryParameters: condition.toJson(),
        );
  }

  Future<ApiResponse<void>> enableMallProductCategory(int id) async {
    return await _httpClient.post<void>('${apis['enable']!}/$id');
  }

  Future<ApiResponse<void>> disableMallProductCategory(int id) async {
    return await _httpClient.post<void>('${apis['disable']!}/$id');
  }
}
