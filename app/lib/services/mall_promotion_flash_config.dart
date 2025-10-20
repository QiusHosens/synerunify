import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_promotion_flash_config/create', // 新增
  'update': '/mall/mall_promotion_flash_config/update', // 修改
  'delete': '/mall/mall_promotion_flash_config/delete', // 删除
  'get': '/mall/mall_promotion_flash_config/get', // 单条查询
  'list': '/mall/mall_promotion_flash_config/list', // 列表查询
  'page': '/mall/mall_promotion_flash_config/page', // 分页查询
  'enable': '/mall/mall_promotion_flash_config/enable', // 启用
  'disable': '/mall/mall_promotion_flash_config/disable', // 禁用
};

class MallPromotionFlashConfigRequest {
  final int id; // 编号
  final String name; // 秒杀时段名称
  final String startTime; // 开始时间点
  final String endTime; // 结束时间点
  final String sliderFileIds; // 秒杀主图
  final int status; // 活动状态
  

  MallPromotionFlashConfigRequest({
    required this.id,
    required this.name,
    required this.startTime,
    required this.endTime,
    required this.sliderFileIds,
    required this.status,
    });

  factory MallPromotionFlashConfigRequest.fromJson(Map<String, dynamic> json) {
    return MallPromotionFlashConfigRequest(
      id: json['id'] as int,
      name: json['name'] as String,
      startTime: json['start_time'] as String,
      endTime: json['end_time'] as String,
      sliderFileIds: json['slider_file_ids'] as String,
      status: json['status'] as int,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'start_time': startTime,
      'end_time': endTime,
      'slider_file_ids': sliderFileIds,
      'status': status,
      };
  }
}

class MallPromotionFlashConfigQueryCondition extends PaginatedRequest {
  MallPromotionFlashConfigQueryCondition({
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

class MallPromotionFlashConfigResponse {
  final int id; // 编号
  final String name; // 秒杀时段名称
  final String startTime; // 开始时间点
  final String endTime; // 结束时间点
  final String sliderFileIds; // 秒杀主图
  final int status; // 活动状态
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallPromotionFlashConfigResponse({
    required this.id,
    required this.name,
    required this.startTime,
    required this.endTime,
    required this.sliderFileIds,
    required this.status,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallPromotionFlashConfigResponse.fromJson(Map<String, dynamic> json) {
    return MallPromotionFlashConfigResponse(
      id: json['id'] as int,
      name: json['name'] as String,
      startTime: json['start_time'] as String,
      endTime: json['end_time'] as String,
      sliderFileIds: json['slider_file_ids'] as String,
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
      'start_time': startTime,
      'end_time': endTime,
      'slider_file_ids': sliderFileIds,
      'status': status,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallPromotionFlashConfigService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallPromotionFlashConfig(MallPromotionFlashConfigRequest mallPromotionFlashConfig) async {
        return await _httpClient.post<int>(apis['create']!, data: mallPromotionFlashConfig);
    }

    Future<ApiResponse<int>> updateMallPromotionFlashConfig(MallPromotionFlashConfigRequest mallPromotionFlashConfig) async {
        return await _httpClient.post<int>(apis['update']!, data: mallPromotionFlashConfig);
    }

    Future<ApiResponse<void>> deleteMallPromotionFlashConfig(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallPromotionFlashConfigResponse>> getMallPromotionFlashConfig(int id) async {
        return await _httpClient.get<MallPromotionFlashConfigResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallPromotionFlashConfigResponse>>> listMallPromotionFlashConfig() async {
        return await _httpClient.get<List<MallPromotionFlashConfigResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallPromotionFlashConfigResponse>>> pageMallPromotionFlashConfig(MallPromotionFlashConfigQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallPromotionFlashConfigResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
    Future<ApiResponse<void>> enableMallPromotionFlashConfig(int id) async {
      return await _httpClient.post<void>('${apis['enable']!}/$id');
    }

    Future<ApiResponse<void>> disableMallPromotionFlashConfig(int id) async {
      return await _httpClient.post<void>('${apis['disable']!}/$id');
    }
}