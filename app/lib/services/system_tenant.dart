import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/system/system_tenant/create', // 新增
  'update': '/system/system_tenant/update', // 修改
  'delete': '/system/system_tenant/delete', // 删除
  'get': '/system/system_tenant/get', // 单条查询
  'get_no_auth': '/system/system_tenant/get_no_auth', // 单条查询
  'list': '/system/system_tenant/list', // 列表查询
  'page': '/system/system_tenant/page', // 分页查询
  'enable': '/system/system_tenant/enable', // 启用
  'disable': '/system/system_tenant/disable', // 禁用
};

class SystemTenantRequest {
  final int id; // id
  final String name; // 租户名
  final int? contactUserId; // 联系人的用户编号
  final String contactName; // 联系人
  final String? contactMobile; // 联系手机
  final int status; // 租户状态（0正常 1停用）
  final String? website; // 绑定域名
  final int packageId; // 租户套餐编号
  final DateTime expireTime; // 过期时间
  final int accountCount; // 账号数量

  SystemTenantRequest({
    required this.id,
    required this.name,
    this.contactUserId,
    required this.contactName,
    this.contactMobile,
    required this.status,
    this.website,
    required this.packageId,
    required this.expireTime,
    required this.accountCount,
  });

  factory SystemTenantRequest.fromJson(Map<String, dynamic> json) {
    return SystemTenantRequest(
      id: json['id'] as int,
      name: json['name'] as String,
      contactUserId: json['contact_user_id'] as int?,
      contactName: json['contact_name'] as String,
      contactMobile: json['contact_mobile'] as String?,
      status: json['status'] as int,
      website: json['website'] as String?,
      packageId: json['package_id'] as int,
      expireTime: json['expire_time'] as DateTime,
      accountCount: json['account_count'] as int,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'contact_user_id': contactUserId,
      'contact_name': contactName,
      'contact_mobile': contactMobile,
      'status': status,
      'website': website,
      'package_id': packageId,
      'expire_time': expireTime,
      'account_count': accountCount,
    };
  }
}

class SystemTenantQueryCondition extends PaginatedRequest {
  SystemTenantQueryCondition({
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

class SystemTenantResponse {
  final int id; // id
  final String name; // 租户名
  final int? contactUserId; // 联系人的用户编号
  final String contactName; // 联系人
  final String? contactMobile; // 联系手机
  final int status; // 租户状态（0正常 1停用）
  final String? website; // 绑定域名
  final int packageId; // 租户套餐编号
  // final DateTime expireTime; // 过期时间
  // final int accountCount; // 账号数量
  // final int? creator; // 创建者id
  // final DateTime createTime; // 创建时间
  // final int? updater; // 更新者id
  // final DateTime updateTime; // 更新时间
  SystemTenantResponse({
    required this.id,
    required this.name,
    this.contactUserId,
    required this.contactName,
    this.contactMobile,
    required this.status,
    this.website,
    required this.packageId,
    // required this.expireTime,
    // required this.accountCount,
    // this.creator,
    // required this.createTime,
    // this.updater,
    // required this.updateTime,
  });

  factory SystemTenantResponse.fromJson(Map<String, dynamic> json) {
    return SystemTenantResponse(
      id: json['id'] as int,
      name: json['name'] as String,
      contactUserId: json['contact_user_id'] as int?,
      contactName: json['contact_name'] as String,
      contactMobile: json['contact_mobile'] as String?,
      status: json['status'] as int,
      website: json['website'] as String?,
      packageId: json['package_id'] as int,
      // expireTime: json['expire_time'] as DateTime,
      // accountCount: json['account_count'] as int,
      // creator: json['creator'] as int?,
      // createTime: json['create_time'] as DateTime,
      // updater: json['updater'] as int?,
      // updateTime: json['update_time'] as DateTime,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'contact_user_id': contactUserId,
      'contact_name': contactName,
      'contact_mobile': contactMobile,
      'status': status,
      'website': website,
      'package_id': packageId,
      // 'expire_time': expireTime,
      // 'account_count': accountCount,
      // 'creator': creator,
      // 'create_time': createTime,
      // 'updater': updater,
      // 'update_time': updateTime,
    };
  }
}

class SystemTenantService {
  final HttpClient _httpClient = HttpClient();

  Future<ApiResponse<int>> createSystemTenant(
    SystemTenantRequest systemTenant,
  ) async {
    return await _httpClient.post<int>(apis['create']!, data: systemTenant);
  }

  Future<ApiResponse<int>> updateSystemTenant(
    SystemTenantRequest systemTenant,
  ) async {
    return await _httpClient.post<int>(apis['update']!, data: systemTenant);
  }

  Future<ApiResponse<void>> deleteSystemTenant(int id) async {
    return await _httpClient.post<void>('${apis['delete']!}/$id');
  }

  Future<ApiResponse<SystemTenantResponse>> getSystemTenant(int id) async {
    return await _httpClient.get<SystemTenantResponse>('${apis['get']!}/$id');
  }

  Future<ApiResponse<SystemTenantResponse>> getSystemTenantNoAuth(int id) async {
    return await _httpClient.get<SystemTenantResponse>('${apis['get_no_auth']!}/$id', fromJson: (response) => SystemTenantResponse.fromJson(response));
  }

  Future<ApiResponse<List<SystemTenantResponse>>> listSystemTenant() async {
    return await _httpClient.get<List<SystemTenantResponse>>(apis['list']!);
  }

  Future<ApiResponse<PaginatedResponse<SystemTenantResponse>>> pageSystemTenant(
    SystemTenantQueryCondition condition,
  ) async {
    return await _httpClient.get<PaginatedResponse<SystemTenantResponse>>(
      apis['page']!,
      queryParameters: condition.toJson(),
    );
  }

  Future<ApiResponse<void>> enableSystemTenant(int id) async {
    return await _httpClient.post<void>('${apis['enable']!}/$id');
  }

  Future<ApiResponse<void>> disableSystemTenant(int id) async {
    return await _httpClient.post<void>('${apis['disable']!}/$id');
  }
}
