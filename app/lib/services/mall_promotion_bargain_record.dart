import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_promotion_bargain_record/create', // 新增
  'update': '/mall/mall_promotion_bargain_record/update', // 修改
  'delete': '/mall/mall_promotion_bargain_record/delete', // 删除
  'get': '/mall/mall_promotion_bargain_record/get', // 单条查询
  'list': '/mall/mall_promotion_bargain_record/list', // 列表查询
  'page': '/mall/mall_promotion_bargain_record/page', // 分页查询
  'enable': '/mall/mall_promotion_bargain_record/enable', // 启用
  'disable': '/mall/mall_promotion_bargain_record/disable', // 禁用
};

class MallPromotionBargainRecordRequest {
  final int id; // 砍价记录编号
  final int activityId; // 砍价活动名称
  final int userId; // 用户编号
  final int spuId; // 商品 SPU 编号
  final int skuId; // 商品 SKU 编号
  final int bargainFirstPrice; // 砍价起始价格，单位：分
  final int bargainPrice; // 当前砍价，单位：分
  final int status; // 状态
  final int? orderId; // 订单编号
  final DateTime endTime; // 结束时间
  

  MallPromotionBargainRecordRequest({
    required this.id,
    required this.activityId,
    required this.userId,
    required this.spuId,
    required this.skuId,
    required this.bargainFirstPrice,
    required this.bargainPrice,
    required this.status,
    this.orderId,
    required this.endTime,
    });

  factory MallPromotionBargainRecordRequest.fromJson(Map<String, dynamic> json) {
    return MallPromotionBargainRecordRequest(
      id: json['id'] as int,
      activityId: json['activity_id'] as int,
      userId: json['user_id'] as int,
      spuId: json['spu_id'] as int,
      skuId: json['sku_id'] as int,
      bargainFirstPrice: json['bargain_first_price'] as int,
      bargainPrice: json['bargain_price'] as int,
      status: json['status'] as int,
      orderId: json['order_id'] as int?,
      endTime: json['end_time'] as DateTime,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'activity_id': activityId,
      'user_id': userId,
      'spu_id': spuId,
      'sku_id': skuId,
      'bargain_first_price': bargainFirstPrice,
      'bargain_price': bargainPrice,
      'status': status,
      'order_id': orderId,
      'end_time': endTime,
      };
  }
}

class MallPromotionBargainRecordQueryCondition extends PaginatedRequest {
  MallPromotionBargainRecordQueryCondition({
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

class MallPromotionBargainRecordResponse {
  final int id; // 砍价记录编号
  final int activityId; // 砍价活动名称
  final int userId; // 用户编号
  final int spuId; // 商品 SPU 编号
  final int skuId; // 商品 SKU 编号
  final int bargainFirstPrice; // 砍价起始价格，单位：分
  final int bargainPrice; // 当前砍价，单位：分
  final int status; // 状态
  final int? orderId; // 订单编号
  final DateTime endTime; // 结束时间
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallPromotionBargainRecordResponse({
    required this.id,
    required this.activityId,
    required this.userId,
    required this.spuId,
    required this.skuId,
    required this.bargainFirstPrice,
    required this.bargainPrice,
    required this.status,
    this.orderId,
    required this.endTime,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallPromotionBargainRecordResponse.fromJson(Map<String, dynamic> json) {
    return MallPromotionBargainRecordResponse(
      id: json['id'] as int,
      activityId: json['activity_id'] as int,
      userId: json['user_id'] as int,
      spuId: json['spu_id'] as int,
      skuId: json['sku_id'] as int,
      bargainFirstPrice: json['bargain_first_price'] as int,
      bargainPrice: json['bargain_price'] as int,
      status: json['status'] as int,
      orderId: json['order_id'] as int?,
      endTime: json['end_time'] as DateTime,
      creator: json['creator'] as int?,
      createTime: json['create_time'] as DateTime,
      updater: json['updater'] as int?,
      updateTime: json['update_time'] as DateTime,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'activity_id': activityId,
      'user_id': userId,
      'spu_id': spuId,
      'sku_id': skuId,
      'bargain_first_price': bargainFirstPrice,
      'bargain_price': bargainPrice,
      'status': status,
      'order_id': orderId,
      'end_time': endTime,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallPromotionBargainRecordService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallPromotionBargainRecord(MallPromotionBargainRecordRequest mallPromotionBargainRecord) async {
        return await _httpClient.post<int>(apis['create']!, data: mallPromotionBargainRecord);
    }

    Future<ApiResponse<int>> updateMallPromotionBargainRecord(MallPromotionBargainRecordRequest mallPromotionBargainRecord) async {
        return await _httpClient.post<int>(apis['update']!, data: mallPromotionBargainRecord);
    }

    Future<ApiResponse<void>> deleteMallPromotionBargainRecord(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallPromotionBargainRecordResponse>> getMallPromotionBargainRecord(int id) async {
        return await _httpClient.get<MallPromotionBargainRecordResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallPromotionBargainRecordResponse>>> listMallPromotionBargainRecord() async {
        return await _httpClient.get<List<MallPromotionBargainRecordResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallPromotionBargainRecordResponse>>> pageMallPromotionBargainRecord(MallPromotionBargainRecordQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallPromotionBargainRecordResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
    Future<ApiResponse<void>> enableMallPromotionBargainRecord(int id) async {
      return await _httpClient.post<void>('${apis['enable']!}/$id');
    }

    Future<ApiResponse<void>> disableMallPromotionBargainRecord(int id) async {
      return await _httpClient.post<void>('${apis['disable']!}/$id');
    }
}