import '../utils/http_client.dart';
import '../models/user_model.dart';
import 'api_service.dart';

/// 用户服务类
class UserService {
  static final UserService _instance = UserService._internal();
  factory UserService() => _instance;
  UserService._internal();

  final ApiService _apiService = ApiService();

  /// 获取用户列表
  Future<ApiResponse<List<UserModel>>> getUsers({
    int page = 1,
    int limit = 20,
    String? search,
  }) async {
    final queryParams = <String, dynamic>{
      'page': page,
      'limit': limit,
    };
    
    if (search != null && search.isNotEmpty) {
      queryParams['search'] = search;
    }

    return await _apiService.get<List<UserModel>>(
      '/users',
      queryParameters: queryParams,
      fromJson: (data) => (data as List)
          .map((item) => UserModel.fromJson(item))
          .toList(),
    );
  }

  /// 获取用户详情
  Future<ApiResponse<UserModel>> getUserById(int userId) async {
    return await _apiService.get<UserModel>(
      '/users/$userId',
      fromJson: (data) => UserModel.fromJson(data),
    );
  }

  /// 更新用户信息
  Future<ApiResponse<UserModel>> updateUser({
    required int userId,
    String? username,
    String? email,
    String? phone,
    String? avatar,
  }) async {
    final data = <String, dynamic>{};
    if (username != null) data['username'] = username;
    if (email != null) data['email'] = email;
    if (phone != null) data['phone'] = phone;
    if (avatar != null) data['avatar'] = avatar;

    return await _apiService.put<UserModel>(
      '/users/$userId',
      data: data,
      fromJson: (data) => UserModel.fromJson(data),
    );
  }

  /// 删除用户
  Future<ApiResponse<void>> deleteUser(int userId) async {
    return await _apiService.delete<void>('/users/$userId');
  }

  /// 上传用户头像
  Future<ApiResponse<String>> uploadAvatar(int userId, String filePath) async {
    return await _apiService.uploadFile<String>(
      '/users/$userId/avatar',
      filePath,
      fieldName: 'avatar',
      fromJson: (data) => data['avatar_url'] as String,
    );
  }
}
