import '../services/auth_service.dart';
import '../services/user_service.dart';

/// HTTP使用示例
class HttpUsageExample {
  final AuthService _authService = AuthService();
  final UserService _userService = UserService();

  /// 登录示例
  Future<void> loginExample() async {
    try {
      final response = await _authService.login(
        username: 'test@example.com',
        password: 'password123',
      );

      if (response.success) {
        print('登录成功: ${response.data?.user.username}');
        print('Token: ${response.data?.accessToken}');
      } else {
        print('登录失败: ${response.message}');
      }
    } catch (e) {
      print('登录异常: $e');
    }
  }

  /// 获取用户信息示例
  Future<void> getUserInfoExample() async {
    try {
      final response = await _authService.getUserInfo();

      if (response.success) {
        print('用户信息: ${response.data?.username}');
        print('邮箱: ${response.data?.email}');
      } else {
        print('获取用户信息失败: ${response.message}');
      }
    } catch (e) {
      print('获取用户信息异常: $e');
    }
  }

  /// 获取用户列表示例
  Future<void> getUsersExample() async {
    try {
      final response = await _userService.getUsers(
        page: 1,
        limit: 10,
        search: 'test',
      );

      if (response.success) {
        print('用户列表: ${response.data?.length} 个用户');
        response.data?.forEach((user) {
          print('- ${user.username} (${user.email})');
        });
      } else {
        print('获取用户列表失败: ${response.message}');
      }
    } catch (e) {
      print('获取用户列表异常: $e');
    }
  }

  /// 更新用户信息示例
  Future<void> updateUserExample() async {
    try {
      final response = await _userService.updateUser(
        userId: 1,
        username: 'new_username',
        email: 'new_email@example.com',
      );

      if (response.success) {
        print('更新成功: ${response.data?.username}');
      } else {
        print('更新失败: ${response.message}');
      }
    } catch (e) {
      print('更新用户信息异常: $e');
    }
  }

  /// 上传文件示例
  Future<void> uploadFileExample() async {
    try {
      final response = await _userService.uploadAvatar(
        1,
        '/path/to/avatar.jpg',
      );

      if (response.success) {
        print('上传成功: ${response.data}');
      } else {
        print('上传失败: ${response.message}');
      }
    } catch (e) {
      print('上传文件异常: $e');
    }
  }

  /// 登出示例
  Future<void> logoutExample() async {
    try {
      final response = await _authService.logout();

      if (response.success) {
        print('登出成功');
      } else {
        print('登出失败: ${response.message}');
      }
    } catch (e) {
      print('登出异常: $e');
    }
  }
}
