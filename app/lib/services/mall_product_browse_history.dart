import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_product_browse_history/create', // 新增
  'update': '/mall/mall_product_browse_history/update', // 修改
  'delete': '/mall/mall_product_browse_history/delete', // 删除
  'get': '/mall/mall_product_browse_history/get', // 单条查询
  'list': '/mall/mall_product_browse_history/list', // 列表查询
  'page': '/mall/mall_product_browse_history/page', // 分页查询
};

class MallProductBrowseHistoryRequest {
  final int id; // 记录编号
  final int userId; // 用户编号
  final int spuId; // 商品 SPU 编号
  final bool userDeleted; // 用户是否删除
  

  MallProductBrowseHistoryRequest({
    required this.id,
    required this.userId,
    required this.spuId,
    required this.userDeleted,
    });

  factory MallProductBrowseHistoryRequest.fromJson(Map<String, dynamic> json) {
    return MallProductBrowseHistoryRequest(
      id: json['id'] as int,
      userId: json['user_id'] as int,
      spuId: json['spu_id'] as int,
      userDeleted: json['user_deleted'] as bool,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'spu_id': spuId,
      'user_deleted': userDeleted,
      };
  }
}

class MallProductBrowseHistoryQueryCondition extends PaginatedRequest {
  MallProductBrowseHistoryQueryCondition({
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

class MallProductBrowseHistoryResponse {
  final int id; // 记录编号
  final int userId; // 用户编号
  final int spuId; // 商品 SPU 编号
  final bool userDeleted; // 用户是否删除
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallProductBrowseHistoryResponse({
    required this.id,
    required this.userId,
    required this.spuId,
    required this.userDeleted,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallProductBrowseHistoryResponse.fromJson(Map<String, dynamic> json) {
    return MallProductBrowseHistoryResponse(
      id: json['id'] as int,
      userId: json['user_id'] as int,
      spuId: json['spu_id'] as int,
      userDeleted: json['user_deleted'] as bool,
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
      'user_deleted': userDeleted,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallProductBrowseHistoryService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallProductBrowseHistory(MallProductBrowseHistoryRequest mallProductBrowseHistory) async {
        return await _httpClient.post<int>(apis['create']!, data: mallProductBrowseHistory);
    }

    Future<ApiResponse<int>> updateMallProductBrowseHistory(MallProductBrowseHistoryRequest mallProductBrowseHistory) async {
        return await _httpClient.post<int>(apis['update']!, data: mallProductBrowseHistory);
    }

    Future<ApiResponse<void>> deleteMallProductBrowseHistory(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallProductBrowseHistoryResponse>> getMallProductBrowseHistory(int id) async {
        return await _httpClient.get<MallProductBrowseHistoryResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallProductBrowseHistoryResponse>>> listMallProductBrowseHistory() async {
        return await _httpClient.get<List<MallProductBrowseHistoryResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallProductBrowseHistoryResponse>>> pageMallProductBrowseHistory(MallProductBrowseHistoryQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallProductBrowseHistoryResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
}