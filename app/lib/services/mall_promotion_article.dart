import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_promotion_article/create', // 新增
  'update': '/mall/mall_promotion_article/update', // 修改
  'delete': '/mall/mall_promotion_article/delete', // 删除
  'get': '/mall/mall_promotion_article/get', // 单条查询
  'list': '/mall/mall_promotion_article/list', // 列表查询
  'page': '/mall/mall_promotion_article/page', // 分页查询
  'enable': '/mall/mall_promotion_article/enable', // 启用
  'disable': '/mall/mall_promotion_article/disable', // 禁用
};

class MallPromotionArticleRequest {
  final int id; // 文章管理编号
  final int categoryId; // 分类编号
  final int spuId; // 关联商品编号
  final String title; // 文章标题
  final String? author; // 文章作者
  final int fileId; // 文章封面图片ID
  final String? introduction; // 文章简介
  final String? browseCount; // 浏览次数
  final int sort; // 排序
  final int status; // 状态
  final bool recommendHot; // 是否热门(小程序)
  final bool recommendBanner; // 是否轮播图(小程序)
  final String content; // 文章内容
  

  MallPromotionArticleRequest({
    required this.id,
    required this.categoryId,
    required this.spuId,
    required this.title,
    this.author,
    required this.fileId,
    this.introduction,
    this.browseCount,
    required this.sort,
    required this.status,
    required this.recommendHot,
    required this.recommendBanner,
    required this.content,
    });

  factory MallPromotionArticleRequest.fromJson(Map<String, dynamic> json) {
    return MallPromotionArticleRequest(
      id: json['id'] as int,
      categoryId: json['category_id'] as int,
      spuId: json['spu_id'] as int,
      title: json['title'] as String,
      author: json['author'] as String?,
      fileId: json['file_id'] as int,
      introduction: json['introduction'] as String?,
      browseCount: json['browse_count'] as String?,
      sort: json['sort'] as int,
      status: json['status'] as int,
      recommendHot: json['recommend_hot'] as bool,
      recommendBanner: json['recommend_banner'] as bool,
      content: json['content'] as String,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'category_id': categoryId,
      'spu_id': spuId,
      'title': title,
      'author': author,
      'file_id': fileId,
      'introduction': introduction,
      'browse_count': browseCount,
      'sort': sort,
      'status': status,
      'recommend_hot': recommendHot,
      'recommend_banner': recommendBanner,
      'content': content,
      };
  }
}

class MallPromotionArticleQueryCondition extends PaginatedRequest {
  MallPromotionArticleQueryCondition({
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

class MallPromotionArticleResponse {
  final int id; // 文章管理编号
  final int categoryId; // 分类编号
  final int spuId; // 关联商品编号
  final String title; // 文章标题
  final String? author; // 文章作者
  final int fileId; // 文章封面图片ID
  final String? introduction; // 文章简介
  final String? browseCount; // 浏览次数
  final int sort; // 排序
  final int status; // 状态
  final bool recommendHot; // 是否热门(小程序)
  final bool recommendBanner; // 是否轮播图(小程序)
  final String content; // 文章内容
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallPromotionArticleResponse({
    required this.id,
    required this.categoryId,
    required this.spuId,
    required this.title,
    this.author,
    required this.fileId,
    this.introduction,
    this.browseCount,
    required this.sort,
    required this.status,
    required this.recommendHot,
    required this.recommendBanner,
    required this.content,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallPromotionArticleResponse.fromJson(Map<String, dynamic> json) {
    return MallPromotionArticleResponse(
      id: json['id'] as int,
      categoryId: json['category_id'] as int,
      spuId: json['spu_id'] as int,
      title: json['title'] as String,
      author: json['author'] as String?,
      fileId: json['file_id'] as int,
      introduction: json['introduction'] as String?,
      browseCount: json['browse_count'] as String?,
      sort: json['sort'] as int,
      status: json['status'] as int,
      recommendHot: json['recommend_hot'] as bool,
      recommendBanner: json['recommend_banner'] as bool,
      content: json['content'] as String,
      creator: json['creator'] as int?,
      createTime: json['create_time'] as DateTime,
      updater: json['updater'] as int?,
      updateTime: json['update_time'] as DateTime,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'category_id': categoryId,
      'spu_id': spuId,
      'title': title,
      'author': author,
      'file_id': fileId,
      'introduction': introduction,
      'browse_count': browseCount,
      'sort': sort,
      'status': status,
      'recommend_hot': recommendHot,
      'recommend_banner': recommendBanner,
      'content': content,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallPromotionArticleService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallPromotionArticle(MallPromotionArticleRequest mallPromotionArticle) async {
        return await _httpClient.post<int>(apis['create']!, data: mallPromotionArticle);
    }

    Future<ApiResponse<int>> updateMallPromotionArticle(MallPromotionArticleRequest mallPromotionArticle) async {
        return await _httpClient.post<int>(apis['update']!, data: mallPromotionArticle);
    }

    Future<ApiResponse<void>> deleteMallPromotionArticle(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallPromotionArticleResponse>> getMallPromotionArticle(int id) async {
        return await _httpClient.get<MallPromotionArticleResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallPromotionArticleResponse>>> listMallPromotionArticle() async {
        return await _httpClient.get<List<MallPromotionArticleResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallPromotionArticleResponse>>> pageMallPromotionArticle(MallPromotionArticleQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallPromotionArticleResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
    Future<ApiResponse<void>> enableMallPromotionArticle(int id) async {
      return await _httpClient.post<void>('${apis['enable']!}/$id');
    }

    Future<ApiResponse<void>> disableMallPromotionArticle(int id) async {
      return await _httpClient.post<void>('${apis['disable']!}/$id');
    }
}