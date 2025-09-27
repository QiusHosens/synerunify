import 'dart:developer' as developer;

/// 日志级别枚举
enum LogLevel {
  debug(500),
  info(800),
  warning(900),
  error(1000);

  const LogLevel(this.value);
  final int value;
}

/// 日志工具类
class Logger {
  /// 私有构造函数，防止实例化
  Logger._();

  /// 当前日志级别，低于此级别的日志将不会输出
  static LogLevel _currentLevel = LogLevel.debug;
  
  /// 是否启用控制台输出
  static bool _enableConsoleOutput = true;
  
  /// 是否启用开发者日志
  static bool _enableDeveloperLog = true;

  /// 设置日志级别
  static void setLogLevel(LogLevel level) {
    _currentLevel = level;
  }

  /// 设置是否启用控制台输出
  static void setConsoleOutput(bool enable) {
    _enableConsoleOutput = enable;
  }

  /// 设置是否启用开发者日志
  static void setDeveloperLog(bool enable) {
    _enableDeveloperLog = enable;
  }

  /// 格式化时间戳
  static String _getTimestamp() {
    final now = DateTime.now();
    return '${now.hour.toString().padLeft(2, '0')}:'
           '${now.minute.toString().padLeft(2, '0')}:'
           '${now.second.toString().padLeft(2, '0')}.'
           '${now.millisecond.toString().padLeft(3, '0')}';
  }

  /// 格式化日志消息
  static String _formatMessage(String message, String tag, LogLevel level) {
    final timestamp = _getTimestamp();
    return '[$timestamp][$tag][${level.name.toUpperCase()}] $message';
  }

  /// 输出日志
  static void _log(String message, String tag, LogLevel level, {Object? error, StackTrace? stackTrace}) {
    // 检查日志级别
    if (level.value < _currentLevel.value) {
      return;
    }

    final formattedMessage = _formatMessage(message, tag, level);

    // 输出到控制台
    if (_enableConsoleOutput) {
      print(formattedMessage);
      if (error != null) {
        print('[$tag][ERROR] Error details: $error');
      }
      if (stackTrace != null) {
        print('[$tag][ERROR] Stack trace: $stackTrace');
      }
    }

    // 输出到开发者日志
    if (_enableDeveloperLog) {
      developer.log(
        message,
        name: tag,
        level: level.value,
        error: error,
        stackTrace: stackTrace,
      );
    }
  }

  /// 调试日志
  static void debug(String message, {String? tag}) {
    _log(message, tag ?? 'DEBUG', LogLevel.debug);
  }

  /// 信息日志
  static void info(String message, {String? tag}) {
    _log(message, tag ?? 'INFO', LogLevel.info);
  }

  /// 警告日志
  static void warning(String message, {String? tag}) {
    _log(message, tag ?? 'WARNING', LogLevel.warning);
  }

  /// 错误日志
  static void error(String message, {String? tag, Object? error, StackTrace? stackTrace}) {
    _log(message, tag ?? 'ERROR', LogLevel.error, error: error, stackTrace: stackTrace);
  }

  /// 网络请求日志
  static void network(String message, {String? tag}) {
    _log(message, tag ?? 'NETWORK', LogLevel.info);
  }

  /// 用户操作日志
  static void user(String message, {String? tag}) {
    _log(message, tag ?? 'USER', LogLevel.info);
  }

  /// 性能日志
  static void performance(String message, {String? tag}) {
    _log(message, tag ?? 'PERFORMANCE', LogLevel.debug);
  }
}
