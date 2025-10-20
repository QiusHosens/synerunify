import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_trade_delivery_pick_up_store/create', // 新增
  'update': '/mall/mall_trade_delivery_pick_up_store/update', // 修改
  'delete': '/mall/mall_trade_delivery_pick_up_store/delete', // 删除
  'get': '/mall/mall_trade_delivery_pick_up_store/get', // 单条查询
  'list': '/mall/mall_trade_delivery_pick_up_store/list', // 列表查询
  'page': '/mall/mall_trade_delivery_pick_up_store/page', // 分页查询
  'enable': '/mall/mall_trade_delivery_pick_up_store/enable', // 启用
  'disable': '/mall/mall_trade_delivery_pick_up_store/disable', // 禁用
};

class MallTradeDeliveryPickUpStoreRequest {
  final int id; // 编号
  final String name; // 门店名称
  final String? introduction; // 门店简介
  final String phone; // 门店手机
  final int areaId; // 区域编号
  final String detailAddress; // 门店详细地址
  final int fileId; // 门店 logo id
  final DateTime openingTime; // 营业开始时间
  final DateTime closingTime; // 营业结束时间
  final double latitude; // 纬度
  final double longitude; // 经度
  final String? verifyUserIds; // 核销用户编号数组
  final int status; // 门店状态
  

  MallTradeDeliveryPickUpStoreRequest({
    required this.id,
    required this.name,
    this.introduction,
    required this.phone,
    required this.areaId,
    required this.detailAddress,
    required this.fileId,
    required this.openingTime,
    required this.closingTime,
    required this.latitude,
    required this.longitude,
    this.verifyUserIds,
    required this.status,
    });

  factory MallTradeDeliveryPickUpStoreRequest.fromJson(Map<String, dynamic> json) {
    return MallTradeDeliveryPickUpStoreRequest(
      id: json['id'] as int,
      name: json['name'] as String,
      introduction: json['introduction'] as String?,
      phone: json['phone'] as String,
      areaId: json['area_id'] as int,
      detailAddress: json['detail_address'] as String,
      fileId: json['file_id'] as int,
      openingTime: json['opening_time'] as DateTime,
      closingTime: json['closing_time'] as DateTime,
      latitude: json['latitude'] as double,
      longitude: json['longitude'] as double,
      verifyUserIds: json['verify_user_ids'] as String?,
      status: json['status'] as int,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'introduction': introduction,
      'phone': phone,
      'area_id': areaId,
      'detail_address': detailAddress,
      'file_id': fileId,
      'opening_time': openingTime,
      'closing_time': closingTime,
      'latitude': latitude,
      'longitude': longitude,
      'verify_user_ids': verifyUserIds,
      'status': status,
      };
  }
}

class MallTradeDeliveryPickUpStoreQueryCondition extends PaginatedRequest {
  MallTradeDeliveryPickUpStoreQueryCondition({
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

class MallTradeDeliveryPickUpStoreResponse {
  final int id; // 编号
  final String name; // 门店名称
  final String? introduction; // 门店简介
  final String phone; // 门店手机
  final int areaId; // 区域编号
  final String detailAddress; // 门店详细地址
  final int fileId; // 门店 logo id
  final DateTime openingTime; // 营业开始时间
  final DateTime closingTime; // 营业结束时间
  final double latitude; // 纬度
  final double longitude; // 经度
  final String? verifyUserIds; // 核销用户编号数组
  final int status; // 门店状态
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallTradeDeliveryPickUpStoreResponse({
    required this.id,
    required this.name,
    this.introduction,
    required this.phone,
    required this.areaId,
    required this.detailAddress,
    required this.fileId,
    required this.openingTime,
    required this.closingTime,
    required this.latitude,
    required this.longitude,
    this.verifyUserIds,
    required this.status,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallTradeDeliveryPickUpStoreResponse.fromJson(Map<String, dynamic> json) {
    return MallTradeDeliveryPickUpStoreResponse(
      id: json['id'] as int,
      name: json['name'] as String,
      introduction: json['introduction'] as String?,
      phone: json['phone'] as String,
      areaId: json['area_id'] as int,
      detailAddress: json['detail_address'] as String,
      fileId: json['file_id'] as int,
      openingTime: json['opening_time'] as DateTime,
      closingTime: json['closing_time'] as DateTime,
      latitude: json['latitude'] as double,
      longitude: json['longitude'] as double,
      verifyUserIds: json['verify_user_ids'] as String?,
      status: json['status'] as int,
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
      'introduction': introduction,
      'phone': phone,
      'area_id': areaId,
      'detail_address': detailAddress,
      'file_id': fileId,
      'opening_time': openingTime,
      'closing_time': closingTime,
      'latitude': latitude,
      'longitude': longitude,
      'verify_user_ids': verifyUserIds,
      'status': status,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallTradeDeliveryPickUpStoreService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallTradeDeliveryPickUpStore(MallTradeDeliveryPickUpStoreRequest mallTradeDeliveryPickUpStore) async {
        return await _httpClient.post<int>(apis['create']!, data: mallTradeDeliveryPickUpStore);
    }

    Future<ApiResponse<int>> updateMallTradeDeliveryPickUpStore(MallTradeDeliveryPickUpStoreRequest mallTradeDeliveryPickUpStore) async {
        return await _httpClient.post<int>(apis['update']!, data: mallTradeDeliveryPickUpStore);
    }

    Future<ApiResponse<void>> deleteMallTradeDeliveryPickUpStore(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallTradeDeliveryPickUpStoreResponse>> getMallTradeDeliveryPickUpStore(int id) async {
        return await _httpClient.get<MallTradeDeliveryPickUpStoreResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallTradeDeliveryPickUpStoreResponse>>> listMallTradeDeliveryPickUpStore() async {
        return await _httpClient.get<List<MallTradeDeliveryPickUpStoreResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallTradeDeliveryPickUpStoreResponse>>> pageMallTradeDeliveryPickUpStore(MallTradeDeliveryPickUpStoreQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallTradeDeliveryPickUpStoreResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
    Future<ApiResponse<void>> enableMallTradeDeliveryPickUpStore(int id) async {
      return await _httpClient.post<void>('${apis['enable']!}/$id');
    }

    Future<ApiResponse<void>> disableMallTradeDeliveryPickUpStore(int id) async {
      return await _httpClient.post<void>('${apis['disable']!}/$id');
    }
}