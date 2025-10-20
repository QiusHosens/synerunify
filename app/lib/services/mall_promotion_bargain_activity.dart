import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_promotion_bargain_activity/create', // 新增
  'update': '/mall/mall_promotion_bargain_activity/update', // 修改
  'delete': '/mall/mall_promotion_bargain_activity/delete', // 删除
  'get': '/mall/mall_promotion_bargain_activity/get', // 单条查询
  'list': '/mall/mall_promotion_bargain_activity/list', // 列表查询
  'page': '/mall/mall_promotion_bargain_activity/page', // 分页查询
  'enable': '/mall/mall_promotion_bargain_activity/enable', // 启用
  'disable': '/mall/mall_promotion_bargain_activity/disable', // 禁用
};

class MallPromotionBargainActivityRequest {
  final int id; // 砍价活动编号
  final String name; // 砍价活动名称
  final DateTime startTime; // 活动开始时间
  final DateTime endTime; // 活动结束时间
  final int status; // 状态
  final int spuId; // 商品 SPU 编号
  final int skuId; // 商品 SKU 编号
  final int bargainFirstPrice; // 砍价起始价格，单位分
  final int bargainMinPrice; // 砍价底价，单位：分
  final int stock; // 砍价库存
  final int totalStock; // 砍价总库存
  final int helpMaxCount; // 砍价人数
  final int bargainCount; // 最大帮砍次数
  final int totalLimitCount; // 总限购数量
  final int randomMinPrice; // 用户每次砍价的最小金额，单位：分
  final int randomMaxPrice; // 用户每次砍价的最大金额，单位：分
  

  MallPromotionBargainActivityRequest({
    required this.id,
    required this.name,
    required this.startTime,
    required this.endTime,
    required this.status,
    required this.spuId,
    required this.skuId,
    required this.bargainFirstPrice,
    required this.bargainMinPrice,
    required this.stock,
    required this.totalStock,
    required this.helpMaxCount,
    required this.bargainCount,
    required this.totalLimitCount,
    required this.randomMinPrice,
    required this.randomMaxPrice,
    });

  factory MallPromotionBargainActivityRequest.fromJson(Map<String, dynamic> json) {
    return MallPromotionBargainActivityRequest(
      id: json['id'] as int,
      name: json['name'] as String,
      startTime: json['start_time'] as DateTime,
      endTime: json['end_time'] as DateTime,
      status: json['status'] as int,
      spuId: json['spu_id'] as int,
      skuId: json['sku_id'] as int,
      bargainFirstPrice: json['bargain_first_price'] as int,
      bargainMinPrice: json['bargain_min_price'] as int,
      stock: json['stock'] as int,
      totalStock: json['total_stock'] as int,
      helpMaxCount: json['help_max_count'] as int,
      bargainCount: json['bargain_count'] as int,
      totalLimitCount: json['total_limit_count'] as int,
      randomMinPrice: json['random_min_price'] as int,
      randomMaxPrice: json['random_max_price'] as int,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'start_time': startTime,
      'end_time': endTime,
      'status': status,
      'spu_id': spuId,
      'sku_id': skuId,
      'bargain_first_price': bargainFirstPrice,
      'bargain_min_price': bargainMinPrice,
      'stock': stock,
      'total_stock': totalStock,
      'help_max_count': helpMaxCount,
      'bargain_count': bargainCount,
      'total_limit_count': totalLimitCount,
      'random_min_price': randomMinPrice,
      'random_max_price': randomMaxPrice,
      };
  }
}

class MallPromotionBargainActivityQueryCondition extends PaginatedRequest {
  MallPromotionBargainActivityQueryCondition({
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

class MallPromotionBargainActivityResponse {
  final int id; // 砍价活动编号
  final String name; // 砍价活动名称
  final DateTime startTime; // 活动开始时间
  final DateTime endTime; // 活动结束时间
  final int status; // 状态
  final int spuId; // 商品 SPU 编号
  final int skuId; // 商品 SKU 编号
  final int bargainFirstPrice; // 砍价起始价格，单位分
  final int bargainMinPrice; // 砍价底价，单位：分
  final int stock; // 砍价库存
  final int totalStock; // 砍价总库存
  final int helpMaxCount; // 砍价人数
  final int bargainCount; // 最大帮砍次数
  final int totalLimitCount; // 总限购数量
  final int randomMinPrice; // 用户每次砍价的最小金额，单位：分
  final int randomMaxPrice; // 用户每次砍价的最大金额，单位：分
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallPromotionBargainActivityResponse({
    required this.id,
    required this.name,
    required this.startTime,
    required this.endTime,
    required this.status,
    required this.spuId,
    required this.skuId,
    required this.bargainFirstPrice,
    required this.bargainMinPrice,
    required this.stock,
    required this.totalStock,
    required this.helpMaxCount,
    required this.bargainCount,
    required this.totalLimitCount,
    required this.randomMinPrice,
    required this.randomMaxPrice,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallPromotionBargainActivityResponse.fromJson(Map<String, dynamic> json) {
    return MallPromotionBargainActivityResponse(
      id: json['id'] as int,
      name: json['name'] as String,
      startTime: json['start_time'] as DateTime,
      endTime: json['end_time'] as DateTime,
      status: json['status'] as int,
      spuId: json['spu_id'] as int,
      skuId: json['sku_id'] as int,
      bargainFirstPrice: json['bargain_first_price'] as int,
      bargainMinPrice: json['bargain_min_price'] as int,
      stock: json['stock'] as int,
      totalStock: json['total_stock'] as int,
      helpMaxCount: json['help_max_count'] as int,
      bargainCount: json['bargain_count'] as int,
      totalLimitCount: json['total_limit_count'] as int,
      randomMinPrice: json['random_min_price'] as int,
      randomMaxPrice: json['random_max_price'] as int,
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
      'start_time': startTime,
      'end_time': endTime,
      'status': status,
      'spu_id': spuId,
      'sku_id': skuId,
      'bargain_first_price': bargainFirstPrice,
      'bargain_min_price': bargainMinPrice,
      'stock': stock,
      'total_stock': totalStock,
      'help_max_count': helpMaxCount,
      'bargain_count': bargainCount,
      'total_limit_count': totalLimitCount,
      'random_min_price': randomMinPrice,
      'random_max_price': randomMaxPrice,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallPromotionBargainActivityService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallPromotionBargainActivity(MallPromotionBargainActivityRequest mallPromotionBargainActivity) async {
        return await _httpClient.post<int>(apis['create']!, data: mallPromotionBargainActivity);
    }

    Future<ApiResponse<int>> updateMallPromotionBargainActivity(MallPromotionBargainActivityRequest mallPromotionBargainActivity) async {
        return await _httpClient.post<int>(apis['update']!, data: mallPromotionBargainActivity);
    }

    Future<ApiResponse<void>> deleteMallPromotionBargainActivity(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallPromotionBargainActivityResponse>> getMallPromotionBargainActivity(int id) async {
        return await _httpClient.get<MallPromotionBargainActivityResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallPromotionBargainActivityResponse>>> listMallPromotionBargainActivity() async {
        return await _httpClient.get<List<MallPromotionBargainActivityResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallPromotionBargainActivityResponse>>> pageMallPromotionBargainActivity(MallPromotionBargainActivityQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallPromotionBargainActivityResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
    Future<ApiResponse<void>> enableMallPromotionBargainActivity(int id) async {
      return await _httpClient.post<void>('${apis['enable']!}/$id');
    }

    Future<ApiResponse<void>> disableMallPromotionBargainActivity(int id) async {
      return await _httpClient.post<void>('${apis['disable']!}/$id');
    }
}