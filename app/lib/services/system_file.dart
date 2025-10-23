import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/file/system_file/create', // 新增
  'update': '/file/system_file/update', // 修改
  'delete': '/file/system_file/delete', // 删除
  'get': '/file/system_file/get', // 单条查询
  'list': '/file/system_file/list', // 列表查询
  'page': '/file/system_file/page', // 分页查询
  'enable': '/file/system_file/enable', // 启用
  'disable': '/file/system_file/disable', // 禁用

  'preview': '/file/system_file/preview', // 预览
};

class SystemFileRequest {
  final int id; // 文件ID
  final String fileName; // 文件名
  final String? fileType; // 文件类型
  final int fileSize; // 文件大小（字节）
  final String filePath; // 文件存储路径
  final int status; // 状态
  final String departmentCode; // 部门编码
  final int departmentId; // 部门ID

  SystemFileRequest({
    required this.id,
    required this.fileName,
    this.fileType,
    required this.fileSize,
    required this.filePath,
    required this.status,
    required this.departmentCode,
    required this.departmentId,
  });

  factory SystemFileRequest.fromJson(Map<String, dynamic> json) {
    return SystemFileRequest(
      id: json['id'] as int,
      fileName: json['file_name'] as String,
      fileType: json['file_type'] as String?,
      fileSize: json['file_size'] as int,
      filePath: json['file_path'] as String,
      status: json['status'] as int,
      departmentCode: json['department_code'] as String,
      departmentId: json['department_id'] as int,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'file_name': fileName,
      'file_type': fileType,
      'file_size': fileSize,
      'file_path': filePath,
      'status': status,
      'department_code': departmentCode,
      'department_id': departmentId,
    };
  }
}

class SystemFileQueryCondition extends PaginatedRequest {
  SystemFileQueryCondition({
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

class SystemFileResponse {
  final int id; // 文件ID
  final String fileName; // 文件名
  final String? fileType; // 文件类型
  final int fileSize; // 文件大小（字节）
  final String filePath; // 文件存储路径
  final int status; // 状态
  final String departmentCode; // 部门编码
  final int departmentId; // 部门ID
  final int? creator; // 创建者ID
  final String createTime; // 创建时间
  final int? updater; // 更新者ID
  final String updateTime; // 更新时间
  SystemFileResponse({
    required this.id,
    required this.fileName,
    this.fileType,
    required this.fileSize,
    required this.filePath,
    required this.status,
    required this.departmentCode,
    required this.departmentId,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
  });

  factory SystemFileResponse.fromJson(Map<String, dynamic> json) {
    return SystemFileResponse(
      id: json['id'] as int,
      fileName: json['file_name'] as String,
      fileType: json['file_type'] as String?,
      fileSize: json['file_size'] as int,
      filePath: json['file_path'] as String,
      status: json['status'] as int,
      departmentCode: json['department_code'] as String,
      departmentId: json['department_id'] as int,
      creator: json['creator'] as int?,
      createTime: json['create_time'] as String,
      updater: json['updater'] as int?,
      updateTime: json['update_time'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'file_name': fileName,
      'file_type': fileType,
      'file_size': fileSize,
      'file_path': filePath,
      'status': status,
      'department_code': departmentCode,
      'department_id': departmentId,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
    };
  }
}

class SystemFileService {
  final HttpClient _httpClient = HttpClient();

  Future<ApiResponse<int>> createSystemFile(
    SystemFileRequest systemFile,
  ) async {
    return await _httpClient.post<int>(apis['create']!, data: systemFile);
  }

  Future<ApiResponse<int>> updateSystemFile(
    SystemFileRequest systemFile,
  ) async {
    return await _httpClient.post<int>(apis['update']!, data: systemFile);
  }

  Future<ApiResponse<void>> deleteSystemFile(int id) async {
    return await _httpClient.post<void>('${apis['delete']!}/$id');
  }

  Future<ApiResponse<SystemFileResponse>> getSystemFile(int id) async {
    return await _httpClient.get<SystemFileResponse>('${apis['get']!}/$id');
  }

  Future<ApiResponse<List<SystemFileResponse>>> listSystemFile() async {
    return await _httpClient.get<List<SystemFileResponse>>(apis['list']!);
  }

  Future<ApiResponse<PaginatedResponse<SystemFileResponse>>> pageSystemFile(
    SystemFileQueryCondition condition,
  ) async {
    return await _httpClient.get<PaginatedResponse<SystemFileResponse>>(
      apis['page']!,
      queryParameters: condition.toJson(),
    );
  }

  Future<ApiResponse<void>> enableSystemFile(int id) async {
    return await _httpClient.post<void>('${apis['enable']!}/$id');
  }

  Future<ApiResponse<void>> disableSystemFile(int id) async {
    return await _httpClient.post<void>('${apis['disable']!}/$id');
  }

  String getPreviewUrl(int fileId) {
    return '${HttpClientConfig.baseUrl}${apis['preview']!}/$fileId';
  }
}
