import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_promotion_diy_page/create', // 新增
  'update': '/mall/mall_promotion_diy_page/update', // 修改
  'delete': '/mall/mall_promotion_diy_page/delete', // 删除
  'get': '/mall/mall_promotion_diy_page/get', // 单条查询
  'list': '/mall/mall_promotion_diy_page/list', // 列表查询
  'page': '/mall/mall_promotion_diy_page/page', // 分页查询
};

class MallPromotionDiyPageRequest {
  final int id; // 装修页面编号
  final int? templateId; // 装修模板编号
  final String name; // 页面名称
  final String? remark; // 备注
  final String? previewFileIds; // 预览图id,多个逗号分隔
  final String? property; // 页面属性，JSON 格式
  

  MallPromotionDiyPageRequest({
    required this.id,
    this.templateId,
    required this.name,
    this.remark,
    this.previewFileIds,
    this.property,
    });

  factory MallPromotionDiyPageRequest.fromJson(Map<String, dynamic> json) {
    return MallPromotionDiyPageRequest(
      id: json['id'] as int,
      templateId: json['template_id'] as int?,
      name: json['name'] as String,
      remark: json['remark'] as String?,
      previewFileIds: json['preview_file_ids'] as String?,
      property: json['property'] as String?,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'template_id': templateId,
      'name': name,
      'remark': remark,
      'preview_file_ids': previewFileIds,
      'property': property,
      };
  }
}

class MallPromotionDiyPageQueryCondition extends PaginatedRequest {
  MallPromotionDiyPageQueryCondition({
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

class MallPromotionDiyPageResponse {
  final int id; // 装修页面编号
  final int? templateId; // 装修模板编号
  final String name; // 页面名称
  final String? remark; // 备注
  final String? previewFileIds; // 预览图id,多个逗号分隔
  final String? property; // 页面属性，JSON 格式
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallPromotionDiyPageResponse({
    required this.id,
    this.templateId,
    required this.name,
    this.remark,
    this.previewFileIds,
    this.property,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallPromotionDiyPageResponse.fromJson(Map<String, dynamic> json) {
    return MallPromotionDiyPageResponse(
      id: json['id'] as int,
      templateId: json['template_id'] as int?,
      name: json['name'] as String,
      remark: json['remark'] as String?,
      previewFileIds: json['preview_file_ids'] as String?,
      property: json['property'] as String?,
      creator: json['creator'] as int?,
      createTime: json['create_time'] as DateTime,
      updater: json['updater'] as int?,
      updateTime: json['update_time'] as DateTime,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'template_id': templateId,
      'name': name,
      'remark': remark,
      'preview_file_ids': previewFileIds,
      'property': property,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallPromotionDiyPageService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallPromotionDiyPage(MallPromotionDiyPageRequest mallPromotionDiyPage) async {
        return await _httpClient.post<int>(apis['create']!, data: mallPromotionDiyPage);
    }

    Future<ApiResponse<int>> updateMallPromotionDiyPage(MallPromotionDiyPageRequest mallPromotionDiyPage) async {
        return await _httpClient.post<int>(apis['update']!, data: mallPromotionDiyPage);
    }

    Future<ApiResponse<void>> deleteMallPromotionDiyPage(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallPromotionDiyPageResponse>> getMallPromotionDiyPage(int id) async {
        return await _httpClient.get<MallPromotionDiyPageResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallPromotionDiyPageResponse>>> listMallPromotionDiyPage() async {
        return await _httpClient.get<List<MallPromotionDiyPageResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallPromotionDiyPageResponse>>> pageMallPromotionDiyPage(MallPromotionDiyPageQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallPromotionDiyPageResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
}