import 'dart:convert';

import 'package:crypto/crypto.dart';

import '../utils/http_client.dart';
import '../models/user_model.dart';

/// 认证服务类
class AuthService {
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;
  AuthService._internal();

  final HttpClient _httpClient = HttpClient();

  /// 用户登录
  Future<ApiResponse<AuthResponse>> login({
    required String username,
    required String password,
  }) async {
    return await _httpClient.post<AuthResponse>(
      '/system/system_auth/login_account',
      data: LoginRequest(
        username: username,
        password: md5.convert(utf8.encode(password)).toString(),
      ).toJson(),
      fromJson: (data) => AuthResponse.fromJson(data),
    );
  }

  /// 用户注册
  Future<ApiResponse<UserModel>> register({
    required String username,
    required String email,
    required String password,
  }) async {
    return await _httpClient.post<UserModel>(
      '/auth/register',
      data: {'username': username, 'email': email, 'password': password},
      fromJson: (data) => UserModel.fromJson(data),
    );
  }

  /// 用户登出
  Future<ApiResponse<void>> logout() async {
    final result = await _httpClient.post<void>('/system/system_auth/logout');
    if (result.success) {
      await _httpClient.clearTokens();
    }
    return result;
  }

  /// 获取用户信息
  Future<ApiResponse<UserModel>> getUserInfo() async {
    return await _httpClient.get<UserModel>(
      '/system/system_auth/get_user',
      fromJson: (data) => UserModel.fromJson(data),
    );
  }

  /// 刷新Token
  Future<ApiResponse<AuthResponse>> refreshToken({
    required String refreshToken,
  }) async {
    return await _httpClient.post<AuthResponse>(
      '/system/system_auth/refresh_token',
      data: RefreshTokenRequest(refreshToken: refreshToken).toJson(),
      fromJson: (data) => AuthResponse.fromJson(data),
    );
  }

  /// 修改密码
  Future<ApiResponse<void>> changePassword({
    required String oldPassword,
    required String newPassword,
  }) async {
    return await _httpClient.post<void>(
      '/auth/change-password',
      data: {'old_password': oldPassword, 'new_password': newPassword},
    );
  }

  /// 忘记密码
  Future<ApiResponse<void>> forgotPassword({required String email}) async {
    return await _httpClient.post<void>(
      '/auth/forgot-password',
      data: {'email': email},
    );
  }

  /// 重置密码
  Future<ApiResponse<void>> resetPassword({
    required String token,
    required String newPassword,
  }) async {
    return await _httpClient.post<void>(
      '/auth/reset-password',
      data: {'token': token, 'new_password': newPassword},
    );
  }
}
