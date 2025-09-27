import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'logger.dart';

/// 本地缓存工具类
/// 提供数据存储、获取、删除等功能，支持过期时间管理
class CacheUtils {
  static const String _prefix = 'cache_';
  static const String _expirePrefix = 'expire_';

  /// 存储字符串数据
  /// [key] 存储键
  /// [value] 存储值
  /// [expireDuration] 过期时间（可选）
  static Future<bool> setString(String key, String value,
      {Duration? expireDuration}) async {
    try {
      final prefs = await SharedPreferences.getInstance();

      // 存储数据
      bool result = await prefs.setString('$_prefix$key', value);

      // 如果设置了过期时间，存储过期时间戳
      if (expireDuration != null && result) {
        final expireTime =
            DateTime.now().add(expireDuration).millisecondsSinceEpoch;
        await prefs.setInt('$_expirePrefix$key', expireTime);
      }

      return result;
    } catch (e) {
      Logger.error('CacheUtils setString error: $e', tag: 'CacheUtils');
      return false;
    }
  }

  /// 获取字符串数据
  /// [key] 存储键
  /// [defaultValue] 默认值（可选）
  static Future<String?> getString(String key, {String? defaultValue}) async {
    try {
      final prefs = await SharedPreferences.getInstance();

      // 检查是否过期
      if (await _isExpired(key)) {
        await remove(key);
        return defaultValue;
      }

      return prefs.getString('$_prefix$key') ?? defaultValue;
    } catch (e) {
      Logger.error('CacheUtils getString error: $e', tag: 'CacheUtils');
      return defaultValue;
    }
  }

  /// 存储整数数据
  static Future<bool> setInt(String key, int value,
      {Duration? expireDuration}) async {
    try {
      final prefs = await SharedPreferences.getInstance();

      bool result = await prefs.setInt('$_prefix$key', value);

      if (expireDuration != null && result) {
        final expireTime =
            DateTime.now().add(expireDuration).millisecondsSinceEpoch;
        await prefs.setInt('$_expirePrefix$key', expireTime);
      }

      return result;
    } catch (e) {
      Logger.error('CacheUtils setInt error: $e', tag: 'CacheUtils');
      return false;
    }
  }

  /// 获取整数数据
  static Future<int?> getInt(String key, {int? defaultValue}) async {
    try {
      final prefs = await SharedPreferences.getInstance();

      if (await _isExpired(key)) {
        await remove(key);
        return defaultValue;
      }

      return prefs.getInt('$_prefix$key') ?? defaultValue;
    } catch (e) {
      Logger.error('CacheUtils getInt error: $e', tag: 'CacheUtils');
      return defaultValue;
    }
  }

  /// 存储布尔值数据
  static Future<bool> setBool(String key, bool value,
      {Duration? expireDuration}) async {
    try {
      final prefs = await SharedPreferences.getInstance();

      bool result = await prefs.setBool('$_prefix$key', value);

      if (expireDuration != null && result) {
        final expireTime =
            DateTime.now().add(expireDuration).millisecondsSinceEpoch;
        await prefs.setInt('$_expirePrefix$key', expireTime);
      }

      return result;
    } catch (e) {
      Logger.error('CacheUtils setBool error: $e', tag: 'CacheUtils');
      return false;
    }
  }

  /// 获取布尔值数据
  static Future<bool?> getBool(String key, {bool? defaultValue}) async {
    try {
      final prefs = await SharedPreferences.getInstance();

      if (await _isExpired(key)) {
        await remove(key);
        return defaultValue;
      }

      return prefs.getBool('$_prefix$key') ?? defaultValue;
    } catch (e) {
      Logger.error('CacheUtils getBool error: $e', tag: 'CacheUtils');
      return defaultValue;
    }
  }

  /// 存储双精度浮点数数据
  static Future<bool> setDouble(String key, double value,
      {Duration? expireDuration}) async {
    try {
      final prefs = await SharedPreferences.getInstance();

      bool result = await prefs.setDouble('$_prefix$key', value);

      if (expireDuration != null && result) {
        final expireTime =
            DateTime.now().add(expireDuration).millisecondsSinceEpoch;
        await prefs.setInt('$_expirePrefix$key', expireTime);
      }

      return result;
    } catch (e) {
      Logger.error('CacheUtils setDouble error: $e', tag: 'CacheUtils');
      return false;
    }
  }

  /// 获取双精度浮点数数据
  static Future<double?> getDouble(String key, {double? defaultValue}) async {
    try {
      final prefs = await SharedPreferences.getInstance();

      if (await _isExpired(key)) {
        await remove(key);
        return defaultValue;
      }

      return prefs.getDouble('$_prefix$key') ?? defaultValue;
    } catch (e) {
      Logger.error('CacheUtils getDouble error: $e', tag: 'CacheUtils');
      return defaultValue;
    }
  }

  /// 存储字符串列表数据
  static Future<bool> setStringList(String key, List<String> value,
      {Duration? expireDuration}) async {
    try {
      final prefs = await SharedPreferences.getInstance();

      bool result = await prefs.setStringList('$_prefix$key', value);

      if (expireDuration != null && result) {
        final expireTime =
            DateTime.now().add(expireDuration).millisecondsSinceEpoch;
        await prefs.setInt('$_expirePrefix$key', expireTime);
      }

      return result;
    } catch (e) {
      Logger.error('CacheUtils setStringList error: $e', tag: 'CacheUtils');
      return false;
    }
  }

  /// 获取字符串列表数据
  static Future<List<String>?> getStringList(String key,
      {List<String>? defaultValue}) async {
    try {
      final prefs = await SharedPreferences.getInstance();

      if (await _isExpired(key)) {
        await remove(key);
        return defaultValue;
      }

      return prefs.getStringList('$_prefix$key') ?? defaultValue;
    } catch (e) {
      Logger.error('CacheUtils getStringList error: $e', tag: 'CacheUtils');
      return defaultValue;
    }
  }

  /// 存储JSON对象数据
  static Future<bool> setJson(String key, Map<String, dynamic> value,
      {Duration? expireDuration}) async {
    try {
      final jsonString = jsonEncode(value);
      return await setString(key, jsonString, expireDuration: expireDuration);
    } catch (e) {
      Logger.error('CacheUtils setJson error: $e', tag: 'CacheUtils');
      return false;
    }
  }

  /// 获取JSON对象数据
  static Future<Map<String, dynamic>?> getJson(String key,
      {Map<String, dynamic>? defaultValue}) async {
    try {
      final jsonString = await getString(key);
      if (jsonString != null) {
        return jsonDecode(jsonString) as Map<String, dynamic>;
      }
      return defaultValue;
    } catch (e) {
      Logger.error('CacheUtils getJson error: $e', tag: 'CacheUtils');
      return defaultValue;
    }
  }

  /// 存储任意对象数据（需要对象实现toJson方法）
  static Future<bool> setObject<T>(String key, T object,
      {Duration? expireDuration}) async {
    try {
      if (object is Map<String, dynamic>) {
        return await setJson(key, object, expireDuration: expireDuration);
      } else {
        // 假设对象有toJson方法
        final jsonString = jsonEncode(object);
        return await setString(key, jsonString, expireDuration: expireDuration);
      }
    } catch (e) {
      Logger.error('CacheUtils setObject error: $e', tag: 'CacheUtils');
      return false;
    }
  }

  /// 获取任意对象数据（需要提供fromJson函数）
  static Future<T?> getObject<T>(
      String key, T Function(Map<String, dynamic>) fromJson,
      {T? defaultValue}) async {
    try {
      final jsonData = await getJson(key);
      if (jsonData != null) {
        return fromJson(jsonData);
      }
      return defaultValue;
    } catch (e) {
      Logger.error('CacheUtils getObject error: $e', tag: 'CacheUtils');
      return defaultValue;
    }
  }

  /// 删除指定键的数据
  static Future<bool> remove(String key) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      bool result1 = await prefs.remove('$_prefix$key');
      bool result2 = await prefs.remove('$_expirePrefix$key');
      return result1 || result2;
    } catch (e) {
      Logger.error('CacheUtils remove error: $e', tag: 'CacheUtils');
      return false;
    }
  }

  /// 清空所有缓存数据
  static Future<bool> clear() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final keys = prefs.getKeys();
      final cacheKeys = keys.where(
          (key) => key.startsWith(_prefix) || key.startsWith(_expirePrefix));

      for (String key in cacheKeys) {
        await prefs.remove(key);
      }

      return true;
    } catch (e) {
      Logger.error('CacheUtils clear error: $e', tag: 'CacheUtils');
      return false;
    }
  }

  /// 检查键是否存在
  static Future<bool> containsKey(String key) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return prefs.containsKey('$_prefix$key');
    } catch (e) {
      Logger.error('CacheUtils containsKey error: $e', tag: 'CacheUtils');
      return false;
    }
  }

  /// 获取所有缓存键
  static Future<List<String>> getAllKeys() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final keys = prefs.getKeys();
      return keys
          .where((key) => key.startsWith(_prefix))
          .map((key) => key.substring(_prefix.length))
          .toList();
    } catch (e) {
      Logger.error('CacheUtils getAllKeys error: $e', tag: 'CacheUtils');
      return [];
    }
  }

  /// 清理过期的缓存
  static Future<int> cleanExpiredCache() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final keys = prefs.getKeys();
      final cacheKeys = keys.where((key) => key.startsWith(_prefix));

      int cleanedCount = 0;
      for (String key in cacheKeys) {
        final originalKey = key.substring(_prefix.length);
        if (await _isExpired(originalKey)) {
          await remove(originalKey);
          cleanedCount++;
        }
      }

      return cleanedCount;
    } catch (e) {
      Logger.error('CacheUtils cleanExpiredCache error: $e', tag: 'CacheUtils');
      return 0;
    }
  }

  /// 获取缓存统计信息
  static Future<Map<String, dynamic>> getCacheStats() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final keys = prefs.getKeys();
      final cacheKeys = keys.where((key) => key.startsWith(_prefix));
      final expireKeys = keys.where((key) => key.startsWith(_expirePrefix));

      int totalCount = cacheKeys.length;
      int expiredCount = 0;

      for (String key in cacheKeys) {
        final originalKey = key.substring(_prefix.length);
        if (await _isExpired(originalKey)) {
          expiredCount++;
        }
      }

      return {
        'totalCount': totalCount,
        'expiredCount': expiredCount,
        'validCount': totalCount - expiredCount,
        'expireKeysCount': expireKeys.length,
      };
    } catch (e) {
      Logger.error('CacheUtils getCacheStats error: $e', tag: 'CacheUtils');
      return {
        'totalCount': 0,
        'expiredCount': 0,
        'validCount': 0,
        'expireKeysCount': 0,
      };
    }
  }

  /// 检查数据是否过期
  static Future<bool> _isExpired(String key) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final expireTime = prefs.getInt('$_expirePrefix$key');

      if (expireTime == null) {
        return false; // 没有设置过期时间，永不过期
      }

      return DateTime.now().millisecondsSinceEpoch > expireTime;
    } catch (e) {
      Logger.error('CacheUtils _isExpired error: $e', tag: 'CacheUtils');
      return false;
    }
  }

  /// 设置过期时间
  static Future<bool> setExpireTime(String key, Duration expireDuration) async {
    try {
      final prefs = await SharedPreferences.getInstance();

      // 检查数据是否存在
      if (!prefs.containsKey('$_prefix$key')) {
        return false;
      }

      final expireTime =
          DateTime.now().add(expireDuration).millisecondsSinceEpoch;
      return await prefs.setInt('$_expirePrefix$key', expireTime);
    } catch (e) {
      Logger.error('CacheUtils setExpireTime error: $e', tag: 'CacheUtils');
      return false;
    }
  }

  /// 获取剩余过期时间
  static Future<Duration?> getRemainingTime(String key) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final expireTime = prefs.getInt('$_expirePrefix$key');

      if (expireTime == null) {
        return null; // 没有设置过期时间
      }

      final remaining = expireTime - DateTime.now().millisecondsSinceEpoch;
      if (remaining <= 0) {
        return Duration.zero; // 已过期
      }

      return Duration(milliseconds: remaining);
    } catch (e) {
      Logger.error('CacheUtils getRemainingTime error: $e', tag: 'CacheUtils');
      return null;
    }
  }
}
