import 'package:dio/dio.dart';
import '../utils/http_client.dart';

/// API服务基类
class ApiService {
  final HttpClient _httpClient = HttpClient();

  /// GET请求
  Future<ApiResponse<T>> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    T Function(dynamic)? fromJson,
  }) async {
    return await _httpClient.get<T>(
      path,
      queryParameters: queryParameters,
      fromJson: fromJson,
    );
  }

  /// POST请求
  Future<ApiResponse<T>> post<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    T Function(dynamic)? fromJson,
  }) async {
    return await _httpClient.post<T>(
      path,
      data: data,
      queryParameters: queryParameters,
      fromJson: fromJson,
    );
  }

  /// PUT请求
  Future<ApiResponse<T>> put<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    T Function(dynamic)? fromJson,
  }) async {
    return await _httpClient.put<T>(
      path,
      data: data,
      queryParameters: queryParameters,
      fromJson: fromJson,
    );
  }

  /// DELETE请求
  Future<ApiResponse<T>> delete<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    T Function(dynamic)? fromJson,
  }) async {
    return await _httpClient.delete<T>(
      path,
      data: data,
      queryParameters: queryParameters,
      fromJson: fromJson,
    );
  }

  /// 上传文件
  Future<ApiResponse<T>> uploadFile<T>(
    String path,
    String filePath, {
    String fieldName = 'file',
    Map<String, dynamic>? data,
    T Function(dynamic)? fromJson,
  }) async {
    try {
      final formData = FormData.fromMap({
        fieldName: await MultipartFile.fromFile(filePath),
        ...?data,
      });

      return await _httpClient.post<T>(
        path,
        data: formData,
        fromJson: fromJson,
      );
    } catch (e) {
      return ApiResponse<T>(
        success: false,
        message: '文件上传失败: $e',
      );
    }
  }

  /// 下载文件
  Future<ApiResponse<String>> downloadFile(
    String path,
    String savePath, {
    Map<String, dynamic>? queryParameters,
  }) async {
    try {
      final httpClient = HttpClient();
      final response = await httpClient.dio.download(
        path,
        savePath,
        queryParameters: queryParameters,
      );

      if (response.statusCode == 200) {
        return ApiResponse<String>(
          success: true,
          message: '文件下载成功',
          data: savePath,
        );
      } else {
        return ApiResponse<String>(
          success: false,
          message: '文件下载失败',
          code: response.statusCode,
        );
      }
    } catch (e) {
      return ApiResponse<String>(
        success: false,
        message: '文件下载失败: $e',
      );
    }
  }
}
