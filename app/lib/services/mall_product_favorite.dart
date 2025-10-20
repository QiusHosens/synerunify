import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_product_favorite/create', // 新增
  'update': '/mall/mall_product_favorite/update', // 修改
  'delete': '/mall/mall_product_favorite/delete', // 删除
  'get': '/mall/mall_product_favorite/get', // 单条查询
  'list': '/mall/mall_product_favorite/list', // 列表查询
  'page': '/mall/mall_product_favorite/page', // 分页查询
};

class MallProductFavoriteRequest {
  final int id; // 收藏编号
  final int userId; // 用户编号
  final int spuId; // 商品 SPU 编号
  

  MallProductFavoriteRequest({
    required this.id,
    required this.userId,
    required this.spuId,
    });

  factory MallProductFavoriteRequest.fromJson(Map<String, dynamic> json) {
    return MallProductFavoriteRequest(
      id: json['id'] as int,
      userId: json['user_id'] as int,
      spuId: json['spu_id'] as int,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'spu_id': spuId,
      };
  }
}

class MallProductFavoriteQueryCondition extends PaginatedRequest {
  MallProductFavoriteQueryCondition({
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

class MallProductFavoriteResponse {
  final int id; // 收藏编号
  final int userId; // 用户编号
  final int spuId; // 商品 SPU 编号
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallProductFavoriteResponse({
    required this.id,
    required this.userId,
    required this.spuId,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallProductFavoriteResponse.fromJson(Map<String, dynamic> json) {
    return MallProductFavoriteResponse(
      id: json['id'] as int,
      userId: json['user_id'] as int,
      spuId: json['spu_id'] as int,
      creator: json['creator'] as int?,
      createTime: json['create_time'] as DateTime,
      updater: json['updater'] as int?,
      updateTime: json['update_time'] as DateTime,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'spu_id': spuId,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallProductFavoriteService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallProductFavorite(MallProductFavoriteRequest mallProductFavorite) async {
        return await _httpClient.post<int>(apis['create']!, data: mallProductFavorite);
    }

    Future<ApiResponse<int>> updateMallProductFavorite(MallProductFavoriteRequest mallProductFavorite) async {
        return await _httpClient.post<int>(apis['update']!, data: mallProductFavorite);
    }

    Future<ApiResponse<void>> deleteMallProductFavorite(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallProductFavoriteResponse>> getMallProductFavorite(int id) async {
        return await _httpClient.get<MallProductFavoriteResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallProductFavoriteResponse>>> listMallProductFavorite() async {
        return await _httpClient.get<List<MallProductFavoriteResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallProductFavoriteResponse>>> pageMallProductFavorite(MallProductFavoriteQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallProductFavoriteResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
}