import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_promotion_article_category/create', // 新增
  'update': '/mall/mall_promotion_article_category/update', // 修改
  'delete': '/mall/mall_promotion_article_category/delete', // 删除
  'get': '/mall/mall_promotion_article_category/get', // 单条查询
  'list': '/mall/mall_promotion_article_category/list', // 列表查询
  'page': '/mall/mall_promotion_article_category/page', // 分页查询
  'enable': '/mall/mall_promotion_article_category/enable', // 启用
  'disable': '/mall/mall_promotion_article_category/disable', // 禁用
};

class MallPromotionArticleCategoryRequest {
  final int id; // 文章分类编号
  final String name; // 分类名称
  final int fileId; // 图标ID
  final int status; // 状态
  final int sort; // 排序
  

  MallPromotionArticleCategoryRequest({
    required this.id,
    required this.name,
    required this.fileId,
    required this.status,
    required this.sort,
    });

  factory MallPromotionArticleCategoryRequest.fromJson(Map<String, dynamic> json) {
    return MallPromotionArticleCategoryRequest(
      id: json['id'] as int,
      name: json['name'] as String,
      fileId: json['file_id'] as int,
      status: json['status'] as int,
      sort: json['sort'] as int,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'file_id': fileId,
      'status': status,
      'sort': sort,
      };
  }
}

class MallPromotionArticleCategoryQueryCondition extends PaginatedRequest {
  MallPromotionArticleCategoryQueryCondition({
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

class MallPromotionArticleCategoryResponse {
  final int id; // 文章分类编号
  final String name; // 分类名称
  final int fileId; // 图标ID
  final int status; // 状态
  final int sort; // 排序
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallPromotionArticleCategoryResponse({
    required this.id,
    required this.name,
    required this.fileId,
    required this.status,
    required this.sort,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallPromotionArticleCategoryResponse.fromJson(Map<String, dynamic> json) {
    return MallPromotionArticleCategoryResponse(
      id: json['id'] as int,
      name: json['name'] as String,
      fileId: json['file_id'] as int,
      status: json['status'] as int,
      sort: json['sort'] as int,
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
      'status': status,
      'sort': sort,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallPromotionArticleCategoryService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallPromotionArticleCategory(MallPromotionArticleCategoryRequest mallPromotionArticleCategory) async {
        return await _httpClient.post<int>(apis['create']!, data: mallPromotionArticleCategory);
    }

    Future<ApiResponse<int>> updateMallPromotionArticleCategory(MallPromotionArticleCategoryRequest mallPromotionArticleCategory) async {
        return await _httpClient.post<int>(apis['update']!, data: mallPromotionArticleCategory);
    }

    Future<ApiResponse<void>> deleteMallPromotionArticleCategory(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallPromotionArticleCategoryResponse>> getMallPromotionArticleCategory(int id) async {
        return await _httpClient.get<MallPromotionArticleCategoryResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallPromotionArticleCategoryResponse>>> listMallPromotionArticleCategory() async {
        return await _httpClient.get<List<MallPromotionArticleCategoryResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallPromotionArticleCategoryResponse>>> pageMallPromotionArticleCategory(MallPromotionArticleCategoryQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallPromotionArticleCategoryResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
    Future<ApiResponse<void>> enableMallPromotionArticleCategory(int id) async {
      return await _httpClient.post<void>('${apis['enable']!}/$id');
    }

    Future<ApiResponse<void>> disableMallPromotionArticleCategory(int id) async {
      return await _httpClient.post<void>('${apis['disable']!}/$id');
    }
}