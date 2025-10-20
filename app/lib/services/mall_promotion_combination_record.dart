import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_promotion_combination_record/create', // 新增
  'update': '/mall/mall_promotion_combination_record/update', // 修改
  'delete': '/mall/mall_promotion_combination_record/delete', // 删除
  'get': '/mall/mall_promotion_combination_record/get', // 单条查询
  'list': '/mall/mall_promotion_combination_record/list', // 列表查询
  'page': '/mall/mall_promotion_combination_record/page', // 分页查询
  'enable': '/mall/mall_promotion_combination_record/enable', // 启用
  'disable': '/mall/mall_promotion_combination_record/disable', // 禁用
};

class MallPromotionCombinationRecordRequest {
  final int id; // 编号
  final int? activityId; // 拼团活动编号
  final int? spuId; // 商品 SPU 编号
  final int fileId; // 商品图片ID
  final String spuName; // 商品名称
  final int? skuId; // 商品 SKU 编号
  final int? count; // 购买的商品数量
  final int? userId; // 用户编号
  final String? nickname; // 用户昵称
  final String? avatar; // 用户头像
  final int? headId; // 团长编号
  final int? orderId; // 订单编号
  final int userSize; // 可参团人数
  final int userCount; // 已参团人数
  final bool? virtualGroup; // 是否虚拟拼团
  final int status; // 参与状态：1进行中 2已完成 3未完成
  final int combinationPrice; // 拼团商品单价，单位分
  final DateTime expireTime; // 过期时间
  final DateTime? startTime; // 开始时间 (订单付款后开始的时间)
  final DateTime? endTime; // 结束时间（成团时间/失败时间）
  

  MallPromotionCombinationRecordRequest({
    required this.id,
    this.activityId,
    this.spuId,
    required this.fileId,
    required this.spuName,
    this.skuId,
    this.count,
    this.userId,
    this.nickname,
    this.avatar,
    this.headId,
    this.orderId,
    required this.userSize,
    required this.userCount,
    this.virtualGroup,
    required this.status,
    required this.combinationPrice,
    required this.expireTime,
    this.startTime,
    this.endTime,
    });

  factory MallPromotionCombinationRecordRequest.fromJson(Map<String, dynamic> json) {
    return MallPromotionCombinationRecordRequest(
      id: json['id'] as int,
      activityId: json['activity_id'] as int?,
      spuId: json['spu_id'] as int?,
      fileId: json['file_id'] as int,
      spuName: json['spu_name'] as String,
      skuId: json['sku_id'] as int?,
      count: json['count'] as int?,
      userId: json['user_id'] as int?,
      nickname: json['nickname'] as String?,
      avatar: json['avatar'] as String?,
      headId: json['head_id'] as int?,
      orderId: json['order_id'] as int?,
      userSize: json['user_size'] as int,
      userCount: json['user_count'] as int,
      virtualGroup: json['virtual_group'] as bool?,
      status: json['status'] as int,
      combinationPrice: json['combination_price'] as int,
      expireTime: json['expire_time'] as DateTime,
      startTime: json['start_time'] as DateTime?,
      endTime: json['end_time'] as DateTime?,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'activity_id': activityId,
      'spu_id': spuId,
      'file_id': fileId,
      'spu_name': spuName,
      'sku_id': skuId,
      'count': count,
      'user_id': userId,
      'nickname': nickname,
      'avatar': avatar,
      'head_id': headId,
      'order_id': orderId,
      'user_size': userSize,
      'user_count': userCount,
      'virtual_group': virtualGroup,
      'status': status,
      'combination_price': combinationPrice,
      'expire_time': expireTime,
      'start_time': startTime,
      'end_time': endTime,
      };
  }
}

class MallPromotionCombinationRecordQueryCondition extends PaginatedRequest {
  MallPromotionCombinationRecordQueryCondition({
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

class MallPromotionCombinationRecordResponse {
  final int id; // 编号
  final int? activityId; // 拼团活动编号
  final int? spuId; // 商品 SPU 编号
  final int fileId; // 商品图片ID
  final String spuName; // 商品名称
  final int? skuId; // 商品 SKU 编号
  final int? count; // 购买的商品数量
  final int? userId; // 用户编号
  final String? nickname; // 用户昵称
  final String? avatar; // 用户头像
  final int? headId; // 团长编号
  final int? orderId; // 订单编号
  final int userSize; // 可参团人数
  final int userCount; // 已参团人数
  final bool? virtualGroup; // 是否虚拟拼团
  final int status; // 参与状态：1进行中 2已完成 3未完成
  final int combinationPrice; // 拼团商品单价，单位分
  final DateTime expireTime; // 过期时间
  final DateTime? startTime; // 开始时间 (订单付款后开始的时间)
  final DateTime? endTime; // 结束时间（成团时间/失败时间）
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallPromotionCombinationRecordResponse({
    required this.id,
    this.activityId,
    this.spuId,
    required this.fileId,
    required this.spuName,
    this.skuId,
    this.count,
    this.userId,
    this.nickname,
    this.avatar,
    this.headId,
    this.orderId,
    required this.userSize,
    required this.userCount,
    this.virtualGroup,
    required this.status,
    required this.combinationPrice,
    required this.expireTime,
    this.startTime,
    this.endTime,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallPromotionCombinationRecordResponse.fromJson(Map<String, dynamic> json) {
    return MallPromotionCombinationRecordResponse(
      id: json['id'] as int,
      activityId: json['activity_id'] as int?,
      spuId: json['spu_id'] as int?,
      fileId: json['file_id'] as int,
      spuName: json['spu_name'] as String,
      skuId: json['sku_id'] as int?,
      count: json['count'] as int?,
      userId: json['user_id'] as int?,
      nickname: json['nickname'] as String?,
      avatar: json['avatar'] as String?,
      headId: json['head_id'] as int?,
      orderId: json['order_id'] as int?,
      userSize: json['user_size'] as int,
      userCount: json['user_count'] as int,
      virtualGroup: json['virtual_group'] as bool?,
      status: json['status'] as int,
      combinationPrice: json['combination_price'] as int,
      expireTime: json['expire_time'] as DateTime,
      startTime: json['start_time'] as DateTime?,
      endTime: json['end_time'] as DateTime?,
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
      'spu_id': spuId,
      'file_id': fileId,
      'spu_name': spuName,
      'sku_id': skuId,
      'count': count,
      'user_id': userId,
      'nickname': nickname,
      'avatar': avatar,
      'head_id': headId,
      'order_id': orderId,
      'user_size': userSize,
      'user_count': userCount,
      'virtual_group': virtualGroup,
      'status': status,
      'combination_price': combinationPrice,
      'expire_time': expireTime,
      'start_time': startTime,
      'end_time': endTime,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallPromotionCombinationRecordService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallPromotionCombinationRecord(MallPromotionCombinationRecordRequest mallPromotionCombinationRecord) async {
        return await _httpClient.post<int>(apis['create']!, data: mallPromotionCombinationRecord);
    }

    Future<ApiResponse<int>> updateMallPromotionCombinationRecord(MallPromotionCombinationRecordRequest mallPromotionCombinationRecord) async {
        return await _httpClient.post<int>(apis['update']!, data: mallPromotionCombinationRecord);
    }

    Future<ApiResponse<void>> deleteMallPromotionCombinationRecord(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallPromotionCombinationRecordResponse>> getMallPromotionCombinationRecord(int id) async {
        return await _httpClient.get<MallPromotionCombinationRecordResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallPromotionCombinationRecordResponse>>> listMallPromotionCombinationRecord() async {
        return await _httpClient.get<List<MallPromotionCombinationRecordResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallPromotionCombinationRecordResponse>>> pageMallPromotionCombinationRecord(MallPromotionCombinationRecordQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallPromotionCombinationRecordResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
    Future<ApiResponse<void>> enableMallPromotionCombinationRecord(int id) async {
      return await _httpClient.post<void>('${apis['enable']!}/$id');
    }

    Future<ApiResponse<void>> disableMallPromotionCombinationRecord(int id) async {
      return await _httpClient.post<void>('${apis['disable']!}/$id');
    }
}