import 'package:flutter_test/flutter_test.dart';

import '../lib/utils/cache_utils.dart';

/// 基础数据类型存储示例
Future<void> basicDataExample() async {
  print('=== 基础数据类型存储示例 ===');

  // 存储字符串
  await CacheUtils.setString('username', '张三');
  String? username = await CacheUtils.getString('username');
  print('用户名: $username');

  // 存储整数
  await CacheUtils.setInt('age', 25);
  int? age = await CacheUtils.getInt('age');
  print('年龄: $age');

  // 存储布尔值
  await CacheUtils.setBool('isLogin', true);
  bool? isLogin = await CacheUtils.getBool('isLogin');
  print('是否登录: $isLogin');

  // 存储双精度浮点数
  await CacheUtils.setDouble('score', 95.5);
  double? score = await CacheUtils.getDouble('score');
  print('分数: $score');

  // 存储字符串列表
  await CacheUtils.setStringList('hobbies', ['读书', '游泳', '编程']);
  List<String>? hobbies = await CacheUtils.getStringList('hobbies');
  print('爱好: $hobbies');
}

/// JSON数据存储示例
Future<void> jsonDataExample() async {
  print('\n=== JSON数据存储示例 ===');

  // 存储JSON对象
  Map<String, dynamic> userInfo = {
    'id': 1,
    'name': '李四',
    'email': 'lisi@example.com',
    'profile': {'avatar': 'https://example.com/avatar.jpg', 'bio': '这是一个示例用户'},
  };

  await CacheUtils.setJson('userInfo', userInfo);
  Map<String, dynamic>? cachedUserInfo = await CacheUtils.getJson('userInfo');
  print('用户信息: $cachedUserInfo');
}

/// 过期时间管理示例
Future<void> expireTimeExample() async {
  print('\n=== 过期时间管理示例 ===');

  // 存储带过期时间的数据（1小时后过期）
  await CacheUtils.setString(
    'token',
    'abc123xyz',
    expireDuration: Duration(hours: 1),
  );

  // 检查数据是否存在
  bool exists = await CacheUtils.containsKey('token');
  print('Token存在: $exists');

  // 获取剩余时间
  Duration? remainingTime = await CacheUtils.getRemainingTime('token');
  print('剩余时间: ${remainingTime?.inMinutes} 分钟');

  // 为已存在的数据设置过期时间
  await CacheUtils.setString('session', 'session123');
  await CacheUtils.setExpireTime('session', Duration(minutes: 30));

  Duration? sessionRemaining = await CacheUtils.getRemainingTime('session');
  print('Session剩余时间: ${sessionRemaining?.inMinutes} 分钟');
}

/// 缓存管理示例
Future<void> cacheManagementExample() async {
  print('\n=== 缓存管理示例 ===');

  // 获取所有缓存键
  List<String> allKeys = await CacheUtils.getAllKeys();
  print('所有缓存键: $allKeys');

  // 获取缓存统计信息
  Map<String, dynamic> stats = await CacheUtils.getCacheStats();
  print('缓存统计: $stats');

  // 清理过期缓存
  int cleanedCount = await CacheUtils.cleanExpiredCache();
  print('清理了 $cleanedCount 个过期缓存');

  // 删除特定缓存
  await CacheUtils.remove('username');
  print('已删除username缓存');

  // 清空所有缓存
  // await CacheUtils.clear();
  // print('已清空所有缓存');
}

/// 对象存储示例
Future<void> objectStorageExample() async {
  print('\n=== 对象存储示例 ===');

  // 存储用户对象（使用Map）
  Map<String, dynamic> user = {
    'id': 1,
    'name': '王五',
    'email': 'wangwu@example.com',
  };

  await CacheUtils.setObject(
    'currentUser',
    user,
    expireDuration: Duration(hours: 2),
  );

  // 获取用户对象
  Map<String, dynamic>? cachedUser = await CacheUtils.getObject(
    'currentUser',
    (json) => json,
  );
  print('缓存的用户: ${cachedUser?['name']} - ${cachedUser?['email']}');
}

void main() {
  test('cache test', () async {
    await basicDataExample();
    await jsonDataExample();
    await expireTimeExample();
    await cacheManagementExample();
    await objectStorageExample();
  });
}
