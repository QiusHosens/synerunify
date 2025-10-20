import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_promotion_point_activity/create', // 新增
  'update': '/mall/mall_promotion_point_activity/update', // 修改
  'delete': '/mall/mall_promotion_point_activity/delete', // 删除
  'get': '/mall/mall_promotion_point_activity/get', // 单条查询
  'list': '/mall/mall_promotion_point_activity/list', // 列表查询
  'page': '/mall/mall_promotion_point_activity/page', // 分页查询
  'enable': '/mall/mall_promotion_point_activity/enable', // 启用
  'disable': '/mall/mall_promotion_point_activity/disable', // 禁用
};

class MallPromotionPointActivityRequest {
  final int id; // 积分商城活动编号
  final int spuId; // 商品 SPU ID
  final int status; // 活动状态
  final String? remark; // 备注
  final int sort; // 排序
  final int stock; // 积分商城活动库存(剩余库存积分兑换时扣减)
  final int totalStock; // 积分商城活动总库存
  

  MallPromotionPointActivityRequest({
    required this.id,
    required this.spuId,
    required this.status,
    this.remark,
    required this.sort,
    required this.stock,
    required this.totalStock,
    });

  factory MallPromotionPointActivityRequest.fromJson(Map<String, dynamic> json) {
    return MallPromotionPointActivityRequest(
      id: json['id'] as int,
      spuId: json['spu_id'] as int,
      status: json['status'] as int,
      remark: json['remark'] as String?,
      sort: json['sort'] as int,
      stock: json['stock'] as int,
      totalStock: json['total_stock'] as int,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'spu_id': spuId,
      'status': status,
      'remark': remark,
      'sort': sort,
      'stock': stock,
      'total_stock': totalStock,
      };
  }
}

class MallPromotionPointActivityQueryCondition extends PaginatedRequest {
  MallPromotionPointActivityQueryCondition({
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

class MallPromotionPointActivityResponse {
  final int id; // 积分商城活动编号
  final int spuId; // 商品 SPU ID
  final int status; // 活动状态
  final String? remark; // 备注
  final int sort; // 排序
  final int stock; // 积分商城活动库存(剩余库存积分兑换时扣减)
  final int totalStock; // 积分商城活动总库存
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallPromotionPointActivityResponse({
    required this.id,
    required this.spuId,
    required this.status,
    this.remark,
    required this.sort,
    required this.stock,
    required this.totalStock,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallPromotionPointActivityResponse.fromJson(Map<String, dynamic> json) {
    return MallPromotionPointActivityResponse(
      id: json['id'] as int,
      spuId: json['spu_id'] as int,
      status: json['status'] as int,
      remark: json['remark'] as String?,
      sort: json['sort'] as int,
      stock: json['stock'] as int,
      totalStock: json['total_stock'] as int,
      creator: json['creator'] as int?,
      createTime: json['create_time'] as DateTime,
      updater: json['updater'] as int?,
      updateTime: json['update_time'] as DateTime,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'spu_id': spuId,
      'status': status,
      'remark': remark,
      'sort': sort,
      'stock': stock,
      'total_stock': totalStock,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallPromotionPointActivityService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallPromotionPointActivity(MallPromotionPointActivityRequest mallPromotionPointActivity) async {
        return await _httpClient.post<int>(apis['create']!, data: mallPromotionPointActivity);
    }

    Future<ApiResponse<int>> updateMallPromotionPointActivity(MallPromotionPointActivityRequest mallPromotionPointActivity) async {
        return await _httpClient.post<int>(apis['update']!, data: mallPromotionPointActivity);
    }

    Future<ApiResponse<void>> deleteMallPromotionPointActivity(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallPromotionPointActivityResponse>> getMallPromotionPointActivity(int id) async {
        return await _httpClient.get<MallPromotionPointActivityResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallPromotionPointActivityResponse>>> listMallPromotionPointActivity() async {
        return await _httpClient.get<List<MallPromotionPointActivityResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallPromotionPointActivityResponse>>> pageMallPromotionPointActivity(MallPromotionPointActivityQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallPromotionPointActivityResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
    Future<ApiResponse<void>> enableMallPromotionPointActivity(int id) async {
      return await _httpClient.post<void>('${apis['enable']!}/$id');
    }

    Future<ApiResponse<void>> disableMallPromotionPointActivity(int id) async {
      return await _httpClient.post<void>('${apis['disable']!}/$id');
    }
}