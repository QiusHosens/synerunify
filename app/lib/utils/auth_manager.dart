import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user_model.dart';
import 'logger.dart';

/// 认证状态管理类
class AuthManager extends ChangeNotifier {
  static final AuthManager _instance = AuthManager._internal();
  factory AuthManager() => _instance;
  AuthManager._internal();

  UserModel? _currentUser;
  bool _isLoggedIn = false;
  bool _isInitialized = false;

  // Getters
  UserModel? get currentUser => _currentUser;
  bool get isLoggedIn => _isLoggedIn;
  bool get isInitialized => _isInitialized;

  /// 初始化认证状态
  Future<void> initialize() async {
    if (_isInitialized) return;

    try {
      final prefs = await SharedPreferences.getInstance();
      final userJson = prefs.getString('current_user');
      
      if (userJson != null) {
        // 这里需要解析用户数据，暂时使用简单的检查
        _isLoggedIn = true;
        // TODO: 解析用户数据
        // _currentUser = UserModel.fromJson(jsonDecode(userJson));
      }
      
      _isInitialized = true;
      notifyListeners();
    } catch (e) {
      Logger.error('初始化认证状态失败: $e', tag: 'AuthManager');
      _isInitialized = true;
      notifyListeners();
    }
  }

  /// 登录成功
  void loginSuccess(UserModel user) {
    _currentUser = user;
    _isLoggedIn = true;
    _saveUserToStorage(user);
    notifyListeners();
  }

  /// 登出
  Future<void> logout() async {
    _currentUser = null;
    _isLoggedIn = false;
    await _clearUserFromStorage();
    notifyListeners();
  }

  /// 更新用户信息
  void updateUser(UserModel user) {
    _currentUser = user;
    _saveUserToStorage(user);
    notifyListeners();
  }

  /// 保存用户信息到本地存储
  Future<void> _saveUserToStorage(UserModel user) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('current_user', user.toJson().toString());
    } catch (e) {
      Logger.error('保存用户信息失败: $e', tag: 'AuthManager');
    }
  }

  /// 清除本地用户信息
  Future<void> _clearUserFromStorage() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove('current_user');
    } catch (e) {
      Logger.error('清除用户信息失败: $e', tag: 'AuthManager');
    }
  }

  /// 检查Token是否有效
  Future<bool> isTokenValid() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final tokenExpireTime = prefs.getInt('token_expire_time');
      
      if (tokenExpireTime == null) {
        return false;
      }
      
      final now = DateTime.now().millisecondsSinceEpoch;
      return now < tokenExpireTime;
    } catch (e) {
      Logger.error('检查Token有效性失败: $e', tag: 'AuthManager');
      return false;
    }
  }
}
