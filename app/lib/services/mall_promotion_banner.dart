import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_promotion_banner/create', // 新增
  'update': '/mall/mall_promotion_banner/update', // 修改
  'delete': '/mall/mall_promotion_banner/delete', // 删除
  'get': '/mall/mall_promotion_banner/get', // 单条查询
  'list': '/mall/mall_promotion_banner/list', // 列表查询
  'page': '/mall/mall_promotion_banner/page', // 分页查询
  'enable': '/mall/mall_promotion_banner/enable', // 启用
  'disable': '/mall/mall_promotion_banner/disable', // 禁用
};

class MallPromotionBannerRequest {
  final int id; // Banner 编号
  final String title; // Banner 标题
  final int fileId; // 图片ID
  final String url; // 跳转地址
  final int status; // 状态
  final int? sort; // 排序
  final int position; // 位置
  final String? memo; // 描述
  final int? browseCount; // Banner 点击次数
  

  MallPromotionBannerRequest({
    required this.id,
    required this.title,
    required this.fileId,
    required this.url,
    required this.status,
    this.sort,
    required this.position,
    this.memo,
    this.browseCount,
    });

  factory MallPromotionBannerRequest.fromJson(Map<String, dynamic> json) {
    return MallPromotionBannerRequest(
      id: json['id'] as int,
      title: json['title'] as String,
      fileId: json['file_id'] as int,
      url: json['url'] as String,
      status: json['status'] as int,
      sort: json['sort'] as int?,
      position: json['position'] as int,
      memo: json['memo'] as String?,
      browseCount: json['browse_count'] as int?,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'file_id': fileId,
      'url': url,
      'status': status,
      'sort': sort,
      'position': position,
      'memo': memo,
      'browse_count': browseCount,
      };
  }
}

class MallPromotionBannerQueryCondition extends PaginatedRequest {
  MallPromotionBannerQueryCondition({
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

class MallPromotionBannerResponse {
  final int id; // Banner 编号
  final String title; // Banner 标题
  final int fileId; // 图片ID
  final String url; // 跳转地址
  final int status; // 状态
  final int? sort; // 排序
  final int position; // 位置
  final String? memo; // 描述
  final int? browseCount; // Banner 点击次数
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallPromotionBannerResponse({
    required this.id,
    required this.title,
    required this.fileId,
    required this.url,
    required this.status,
    this.sort,
    required this.position,
    this.memo,
    this.browseCount,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallPromotionBannerResponse.fromJson(Map<String, dynamic> json) {
    return MallPromotionBannerResponse(
      id: json['id'] as int,
      title: json['title'] as String,
      fileId: json['file_id'] as int,
      url: json['url'] as String,
      status: json['status'] as int,
      sort: json['sort'] as int?,
      position: json['position'] as int,
      memo: json['memo'] as String?,
      browseCount: json['browse_count'] as int?,
      creator: json['creator'] as int?,
      createTime: json['create_time'] as DateTime,
      updater: json['updater'] as int?,
      updateTime: json['update_time'] as DateTime,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'file_id': fileId,
      'url': url,
      'status': status,
      'sort': sort,
      'position': position,
      'memo': memo,
      'browse_count': browseCount,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallPromotionBannerService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallPromotionBanner(MallPromotionBannerRequest mallPromotionBanner) async {
        return await _httpClient.post<int>(apis['create']!, data: mallPromotionBanner);
    }

    Future<ApiResponse<int>> updateMallPromotionBanner(MallPromotionBannerRequest mallPromotionBanner) async {
        return await _httpClient.post<int>(apis['update']!, data: mallPromotionBanner);
    }

    Future<ApiResponse<void>> deleteMallPromotionBanner(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallPromotionBannerResponse>> getMallPromotionBanner(int id) async {
        return await _httpClient.get<MallPromotionBannerResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallPromotionBannerResponse>>> listMallPromotionBanner() async {
        return await _httpClient.get<List<MallPromotionBannerResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallPromotionBannerResponse>>> pageMallPromotionBanner(MallPromotionBannerQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallPromotionBannerResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
    Future<ApiResponse<void>> enableMallPromotionBanner(int id) async {
      return await _httpClient.post<void>('${apis['enable']!}/$id');
    }

    Future<ApiResponse<void>> disableMallPromotionBanner(int id) async {
      return await _httpClient.post<void>('${apis['disable']!}/$id');
    }
}