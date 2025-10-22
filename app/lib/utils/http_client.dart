import 'package:dio/dio.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'type_utils.dart';
import 'logger.dart';

/// HTTP客户端配置类
class HttpClientConfig {
  static const String baseUrl = 'http://192.168.1.4';
  static const int connectTimeout = 30000; // 30秒
  static const int receiveTimeout = 30000; // 30秒
  static const int sendTimeout = 30000; // 30秒

  // Token相关配置
  static const String accessTokenKey = 'access_token';
  static const String refreshTokenKey = 'refresh_token';
}

/// HTTP响应数据模型
class ApiResponse<T> {
  final bool success;
  final String message;
  final T? data;
  final int? code;
  final dynamic error;

  ApiResponse({
    required this.success,
    required this.message,
    this.data,
    this.code,
    this.error,
  });

  factory ApiResponse.fromJson(
    Map<String, dynamic> json,
    T Function(dynamic)? fromJsonT,
  ) {
    return ApiResponse<T>(
      success: json['code'] == 200 ? true : false,
      message: json['message'] ?? '',
      data: json['data'] != null && fromJsonT != null
          ? fromJsonT(json['data'])
          : json['data'],
      code: json['code'],
      error: json['error'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'success': success,
      'message': message,
      'data': data,
      'code': code,
      'error': error,
    };
  }
}

/// HTTP客户端单例类
class HttpClient {
  static final HttpClient _instance = HttpClient._internal();
  factory HttpClient() => _instance;
  HttpClient._internal();

  late Dio _dio;

  /// 获取Dio实例（用于下载等特殊操作）
  Dio get dio => _dio;
  bool _isRefreshing = false;

  /// 初始化HTTP客户端
  Future<void> init() async {
    _dio = Dio(
      BaseOptions(
        baseUrl: HttpClientConfig.baseUrl,
        connectTimeout: Duration(milliseconds: HttpClientConfig.connectTimeout),
        receiveTimeout: Duration(milliseconds: HttpClientConfig.receiveTimeout),
        sendTimeout: Duration(milliseconds: HttpClientConfig.sendTimeout),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    // 添加拦截器
    _dio.interceptors.addAll([
      _AuthInterceptor(),
      _LogInterceptor(),
      _ErrorInterceptor(),
    ]);
  }

  /// GET请求
  Future<ApiResponse<T>> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
    T Function(dynamic)? fromJson,
  }) async {
    try {
      final response = await _dio.get(
        path,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );
      return _handleResponse<T>(response, fromJson);
    } catch (e, stackTrace) {
      Logger.error('Stack trace: $stackTrace', tag: 'http get');
      return _handleError<T>(e);
    }
  }

  /// POST请求
  Future<ApiResponse<T>> post<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
    T Function(dynamic)? fromJson,
  }) async {
    try {
      final response = await _dio.post(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );
      return _handleResponse<T>(response, fromJson);
    } catch (e, stackTrace) {
      Logger.error('Stack trace: $stackTrace', tag: 'http post');
      return _handleError<T>(e);
    }
  }

  /// PUT请求
  Future<ApiResponse<T>> put<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
    T Function(dynamic)? fromJson,
  }) async {
    try {
      final response = await _dio.put(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );
      return _handleResponse<T>(response, fromJson);
    } catch (e, stackTrace) {
      Logger.error('Stack trace: $stackTrace', tag: 'http put');
      return _handleError<T>(e);
    }
  }

  /// DELETE请求
  Future<ApiResponse<T>> delete<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
    T Function(dynamic)? fromJson,
  }) async {
    try {
      final response = await _dio.delete(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );
      return _handleResponse<T>(response, fromJson);
    } catch (e, stackTrace) {
      Logger.error('Stack trace: $stackTrace', tag: 'http delete');
      return _handleError<T>(e);
    }
  }

  /// 处理响应
  ApiResponse<T> _handleResponse<T>(
    Response response,
    T Function(dynamic)? fromJson,
  ) {
    final statusCode = response.statusCode ?? 0;

    if (statusCode >= 200 && statusCode < 300) {
      final data = response.data;

      Logger.network(
        'HTTP Response Data, isMap: ${data is Map<String, dynamic>}, isString: ${data is String}, isList: ${data is List<dynamic>}, ${data.toString()}',
        tag: 'HttpClient',
      );
      // 确保 data 是 Map，否则直接包装
      if (data is Map<String, dynamic>) {
        final code = TypeUtils.parseInt(data['code']);
        final success = code == 200;

        final raw = data['data'];
        final parsed = fromJson != null && raw != null ? fromJson(raw) : raw;

        return ApiResponse<T>(
          success: success,
          message: data['message'] ?? '',
          data: parsed,
          code: code,
          error: data['error'] ?? '',
        );
      } else if (data is String) {
        // data 不是 Map<String, dynamic>（可能是 String/数组/空）
        final dataMap = TypeUtils.stringToMap(data);
        Logger.network(
          'HTTP String Data Parsed: ${dataMap.toString()}',
          tag: 'HttpClient',
        );
        final code = TypeUtils.parseInt(dataMap['code']);
        final success = code == 200;
        if (success) {
          return ApiResponse.fromJson(dataMap, fromJson);
        } else {
          Logger.error('HTTP Request Failed: $data', tag: 'HttpClient');
          return ApiResponse<T>(
            success: false,
            message: dataMap['message'] ?? '',
            code: code,
            error: dataMap['error'] ?? '',
          );
        }
      } else {
        return ApiResponse<T>(
          success: true,
          message: '请求成功',
          data: data as T,
          code: statusCode,
        );
      }
    } else {
      return ApiResponse<T>(
        success: false,
        message: '请求失败',
        code: statusCode,
        error: response.statusMessage ?? '未知错误',
      );
    }
  }

  /// 处理错误
  ApiResponse<T> _handleError<T>(dynamic error) {
    String message = '网络请求失败';
    int? code;

    if (error is DioException) {
      switch (error.type) {
        case DioExceptionType.connectionTimeout:
        case DioExceptionType.sendTimeout:
        case DioExceptionType.receiveTimeout:
          message = '请求超时，请检查网络连接';
          break;
        case DioExceptionType.badResponse:
          message = '服务器响应错误';
          code = error.response?.statusCode;
          break;
        case DioExceptionType.cancel:
          message = '请求已取消';
          break;
        case DioExceptionType.connectionError:
          message = '网络连接失败';
          break;
        default:
          message = '网络请求失败';
      }
    }

    return ApiResponse<T>(
      success: false,
      message: message,
      code: code,
      error: error,
    );
  }

  /// 刷新Token
  Future<bool> refreshToken() async {
    if (_isRefreshing) {
      return false;
    }

    _isRefreshing = true;
    try {
      final prefs = await SharedPreferences.getInstance();
      final refreshToken = prefs.getString(HttpClientConfig.refreshTokenKey);

      if (refreshToken == null) {
        return false;
      }

      final response = await _dio.post(
        '/system/system_auth/refresh_token',
        data: {'refresh_token': refreshToken},
        // options: Options(headers: {'Authorization': 'Bearer $refreshToken'}),
      );

      if (response.statusCode == 200) {
        final data = response.data;
        if (data is Map<String, dynamic>) {
          final newAccessToken = data['access_token'];
          final newRefreshToken = data['refresh_token'];

          if (newAccessToken != null) {
            await prefs.setString(
              HttpClientConfig.accessTokenKey,
              newAccessToken,
            );
            if (newRefreshToken != null) {
              await prefs.setString(
                HttpClientConfig.refreshTokenKey,
                newRefreshToken,
              );
            }
            return true;
          }
        }
      }
      return false;
    } catch (e) {
      Logger.error('刷新Token失败: $e', tag: 'AuthInterceptor');
      return false;
    } finally {
      _isRefreshing = false;
    }
  }

  /// 清除Token
  Future<void> clearTokens() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(HttpClientConfig.accessTokenKey);
    await prefs.remove(HttpClientConfig.refreshTokenKey);
  }

  /// 检查网络连接
  Future<bool> checkNetworkConnection() async {
    final connectivityResult = await Connectivity().checkConnectivity();
    return connectivityResult != ConnectivityResult.none;
  }
}

/// 认证拦截器
class _AuthInterceptor extends Interceptor {
  @override
  void onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final prefs = await SharedPreferences.getInstance();
    final accessToken = prefs.getString(HttpClientConfig.accessTokenKey);

    if (accessToken != null) {
      options.headers['Authorization'] = 'Bearer $accessToken';
    }

    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    if (err.response?.statusCode == 401) {
      // Token过期，尝试刷新
      final httpClient = HttpClient();
      final refreshed = await httpClient.refreshToken();

      if (refreshed) {
        // 重新发送请求
        final prefs = await SharedPreferences.getInstance();
        final newAccessToken = prefs.getString(HttpClientConfig.accessTokenKey);

        if (newAccessToken != null) {
          err.requestOptions.headers['Authorization'] =
              'Bearer $newAccessToken';
          try {
            final response = await HttpClient().dio.fetch(err.requestOptions);
            handler.resolve(response);
            return;
          } catch (e) {
            // 刷新后仍然失败，清除Token
            await httpClient.clearTokens();
          }
        }
      } else {
        // 刷新失败，清除Token
        await httpClient.clearTokens();
      }
    }

    handler.next(err);
  }
}

/// 日志拦截器
class _LogInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    Logger.info(
      '🚀 Request: ${options.method} ${options.uri}',
      tag: 'RequestInterceptor',
    );
    Logger.info(
      '📤 Request Headers: ${options.headers}',
      tag: 'RequestInterceptor',
    );
    if (options.data != null) {
      Logger.info(
        '📤 Request Body: ${options.data}',
        tag: 'RequestInterceptor',
      );
    }
    handler.next(options);
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    Logger.network(
      '✅ Response: ${response.statusCode} ${response.requestOptions.uri}',
      tag: 'ResponseInterceptor',
    );
    Logger.debug(
      '📥 Response Data: ${response.data}',
      tag: 'ResponseInterceptor',
    );
    handler.next(response);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    Logger.error(
      '❌ Error: ${err.type} ${err.requestOptions.uri}',
      tag: 'ErrorInterceptor',
    );
    Logger.error('📥 Error Message: ${err.message}', tag: 'ErrorInterceptor');
    handler.next(err);
  }
}

/// 错误拦截器
class _ErrorInterceptor extends Interceptor {
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    // 统一处理错误
    if (err.type == DioExceptionType.connectionTimeout ||
        err.type == DioExceptionType.sendTimeout ||
        err.type == DioExceptionType.receiveTimeout) {
      err = err.copyWith(message: '网络连接超时，请检查网络设置');
    } else if (err.type == DioExceptionType.connectionError) {
      err = err.copyWith(message: '网络连接失败，请检查网络设置');
    }

    handler.next(err);
  }
}
