import 'http_client.dart';
import 'auth_manager.dart';
import 'logger.dart';

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
        Logger.warning('⚠️ 网络连接不可用', tag: 'AppInit');
      }

      _initialized = true;
      Logger.info('✅ 应用初始化完成', tag: 'AppInit');
    } catch (e) {
      Logger.error('❌ 应用初始化失败: $e', tag: 'AppInit');
      rethrow;
    }
  }

  /// 检查是否已初始化
  static bool get isInitialized => _initialized;
}
