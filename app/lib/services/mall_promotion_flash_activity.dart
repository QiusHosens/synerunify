import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_promotion_flash_activity/create', // 新增
  'update': '/mall/mall_promotion_flash_activity/update', // 修改
  'delete': '/mall/mall_promotion_flash_activity/delete', // 删除
  'get': '/mall/mall_promotion_flash_activity/get', // 单条查询
  'list': '/mall/mall_promotion_flash_activity/list', // 列表查询
  'page': '/mall/mall_promotion_flash_activity/page', // 分页查询
  'enable': '/mall/mall_promotion_flash_activity/enable', // 启用
  'disable': '/mall/mall_promotion_flash_activity/disable', // 禁用
};

class MallPromotionFlashActivityRequest {
  final int id; // 秒杀活动编号
  final int spuId; // 秒杀活动商品
  final String name; // 秒杀活动名称
  final int status; // 活动状态
  final String? remark; // 备注
  final DateTime startTime; // 活动开始时间
  final DateTime endTime; // 活动结束时间
  final int sort; // 排序
  final String configIds; // 秒杀时段 id 数组
  final int? totalLimitCount; // 总限购数量
  final int? singleLimitCount; // 单次限够数量
  final int? stock; // 秒杀库存
  final int? totalStock; // 秒杀总库存
  

  MallPromotionFlashActivityRequest({
    required this.id,
    required this.spuId,
    required this.name,
    required this.status,
    this.remark,
    required this.startTime,
    required this.endTime,
    required this.sort,
    required this.configIds,
    this.totalLimitCount,
    this.singleLimitCount,
    this.stock,
    this.totalStock,
    });

  factory MallPromotionFlashActivityRequest.fromJson(Map<String, dynamic> json) {
    return MallPromotionFlashActivityRequest(
      id: json['id'] as int,
      spuId: json['spu_id'] as int,
      name: json['name'] as String,
      status: json['status'] as int,
      remark: json['remark'] as String?,
      startTime: json['start_time'] as DateTime,
      endTime: json['end_time'] as DateTime,
      sort: json['sort'] as int,
      configIds: json['config_ids'] as String,
      totalLimitCount: json['total_limit_count'] as int?,
      singleLimitCount: json['single_limit_count'] as int?,
      stock: json['stock'] as int?,
      totalStock: json['total_stock'] as int?,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'spu_id': spuId,
      'name': name,
      'status': status,
      'remark': remark,
      'start_time': startTime,
      'end_time': endTime,
      'sort': sort,
      'config_ids': configIds,
      'total_limit_count': totalLimitCount,
      'single_limit_count': singleLimitCount,
      'stock': stock,
      'total_stock': totalStock,
      };
  }
}

class MallPromotionFlashActivityQueryCondition extends PaginatedRequest {
  MallPromotionFlashActivityQueryCondition({
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

class MallPromotionFlashActivityResponse {
  final int id; // 秒杀活动编号
  final int spuId; // 秒杀活动商品
  final String name; // 秒杀活动名称
  final int status; // 活动状态
  final String? remark; // 备注
  final DateTime startTime; // 活动开始时间
  final DateTime endTime; // 活动结束时间
  final int sort; // 排序
  final String configIds; // 秒杀时段 id 数组
  final int? totalLimitCount; // 总限购数量
  final int? singleLimitCount; // 单次限够数量
  final int? stock; // 秒杀库存
  final int? totalStock; // 秒杀总库存
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallPromotionFlashActivityResponse({
    required this.id,
    required this.spuId,
    required this.name,
    required this.status,
    this.remark,
    required this.startTime,
    required this.endTime,
    required this.sort,
    required this.configIds,
    this.totalLimitCount,
    this.singleLimitCount,
    this.stock,
    this.totalStock,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallPromotionFlashActivityResponse.fromJson(Map<String, dynamic> json) {
    return MallPromotionFlashActivityResponse(
      id: json['id'] as int,
      spuId: json['spu_id'] as int,
      name: json['name'] as String,
      status: json['status'] as int,
      remark: json['remark'] as String?,
      startTime: json['start_time'] as DateTime,
      endTime: json['end_time'] as DateTime,
      sort: json['sort'] as int,
      configIds: json['config_ids'] as String,
      totalLimitCount: json['total_limit_count'] as int?,
      singleLimitCount: json['single_limit_count'] as int?,
      stock: json['stock'] as int?,
      totalStock: json['total_stock'] as int?,
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
      'name': name,
      'status': status,
      'remark': remark,
      'start_time': startTime,
      'end_time': endTime,
      'sort': sort,
      'config_ids': configIds,
      'total_limit_count': totalLimitCount,
      'single_limit_count': singleLimitCount,
      'stock': stock,
      'total_stock': totalStock,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallPromotionFlashActivityService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallPromotionFlashActivity(MallPromotionFlashActivityRequest mallPromotionFlashActivity) async {
        return await _httpClient.post<int>(apis['create']!, data: mallPromotionFlashActivity);
    }

    Future<ApiResponse<int>> updateMallPromotionFlashActivity(MallPromotionFlashActivityRequest mallPromotionFlashActivity) async {
        return await _httpClient.post<int>(apis['update']!, data: mallPromotionFlashActivity);
    }

    Future<ApiResponse<void>> deleteMallPromotionFlashActivity(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallPromotionFlashActivityResponse>> getMallPromotionFlashActivity(int id) async {
        return await _httpClient.get<MallPromotionFlashActivityResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallPromotionFlashActivityResponse>>> listMallPromotionFlashActivity() async {
        return await _httpClient.get<List<MallPromotionFlashActivityResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallPromotionFlashActivityResponse>>> pageMallPromotionFlashActivity(MallPromotionFlashActivityQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallPromotionFlashActivityResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
    Future<ApiResponse<void>> enableMallPromotionFlashActivity(int id) async {
      return await _httpClient.post<void>('${apis['enable']!}/$id');
    }

    Future<ApiResponse<void>> disableMallPromotionFlashActivity(int id) async {
      return await _httpClient.post<void>('${apis['disable']!}/$id');
    }
}