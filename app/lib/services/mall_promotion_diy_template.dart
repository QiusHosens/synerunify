import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_promotion_diy_template/create', // 新增
  'update': '/mall/mall_promotion_diy_template/update', // 修改
  'delete': '/mall/mall_promotion_diy_template/delete', // 删除
  'get': '/mall/mall_promotion_diy_template/get', // 单条查询
  'list': '/mall/mall_promotion_diy_template/list', // 列表查询
  'page': '/mall/mall_promotion_diy_template/page', // 分页查询
};

class MallPromotionDiyTemplateRequest {
  final int id; // 装修模板编号
  final String name; // 模板名称
  final bool used; // 是否使用
  final DateTime? usedTime; // 使用时间
  final String? remark; // 备注
  final String? previewFileIds; // 预览图
  final String? property; // 模板属性，JSON 格式
  

  MallPromotionDiyTemplateRequest({
    required this.id,
    required this.name,
    required this.used,
    this.usedTime,
    this.remark,
    this.previewFileIds,
    this.property,
    });

  factory MallPromotionDiyTemplateRequest.fromJson(Map<String, dynamic> json) {
    return MallPromotionDiyTemplateRequest(
      id: json['id'] as int,
      name: json['name'] as String,
      used: json['used'] as bool,
      usedTime: json['used_time'] as DateTime?,
      remark: json['remark'] as String?,
      previewFileIds: json['preview_file_ids'] as String?,
      property: json['property'] as String?,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'used': used,
      'used_time': usedTime,
      'remark': remark,
      'preview_file_ids': previewFileIds,
      'property': property,
      };
  }
}

class MallPromotionDiyTemplateQueryCondition extends PaginatedRequest {
  MallPromotionDiyTemplateQueryCondition({
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

class MallPromotionDiyTemplateResponse {
  final int id; // 装修模板编号
  final String name; // 模板名称
  final bool used; // 是否使用
  final DateTime? usedTime; // 使用时间
  final String? remark; // 备注
  final String? previewFileIds; // 预览图
  final String? property; // 模板属性，JSON 格式
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallPromotionDiyTemplateResponse({
    required this.id,
    required this.name,
    required this.used,
    this.usedTime,
    this.remark,
    this.previewFileIds,
    this.property,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallPromotionDiyTemplateResponse.fromJson(Map<String, dynamic> json) {
    return MallPromotionDiyTemplateResponse(
      id: json['id'] as int,
      name: json['name'] as String,
      used: json['used'] as bool,
      usedTime: json['used_time'] as DateTime?,
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
      'name': name,
      'used': used,
      'used_time': usedTime,
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

class MallPromotionDiyTemplateService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallPromotionDiyTemplate(MallPromotionDiyTemplateRequest mallPromotionDiyTemplate) async {
        return await _httpClient.post<int>(apis['create']!, data: mallPromotionDiyTemplate);
    }

    Future<ApiResponse<int>> updateMallPromotionDiyTemplate(MallPromotionDiyTemplateRequest mallPromotionDiyTemplate) async {
        return await _httpClient.post<int>(apis['update']!, data: mallPromotionDiyTemplate);
    }

    Future<ApiResponse<void>> deleteMallPromotionDiyTemplate(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallPromotionDiyTemplateResponse>> getMallPromotionDiyTemplate(int id) async {
        return await _httpClient.get<MallPromotionDiyTemplateResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallPromotionDiyTemplateResponse>>> listMallPromotionDiyTemplate() async {
        return await _httpClient.get<List<MallPromotionDiyTemplateResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallPromotionDiyTemplateResponse>>> pageMallPromotionDiyTemplate(MallPromotionDiyTemplateQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallPromotionDiyTemplateResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
}