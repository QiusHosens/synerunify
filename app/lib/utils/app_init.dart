import 'http_client.dart';
import 'auth_manager.dart';

/// 应用初始化类
class AppInit {
  static bool _initialized = false;

  /// 初始化应用
  static Future<void> init() async {
    if (_initialized) return;

    try {
      // 初始化HTTP客户端
      await HttpClient().init();
      
      // 初始化认证状态管理
      await AuthManager().initialize();
      
      // 检查网络连接
      final hasNetwork = await HttpClient().checkNetworkConnection();
      if (!hasNetwork) {
        print('⚠️ 网络连接不可用');
      }

      _initialized = true;
      print('✅ 应用初始化完成');
    } catch (e) {
      print('❌ 应用初始化失败: $e');
      rethrow;
    }
  }

  /// 检查是否已初始化
  static bool get isInitialized => _initialized;
}
