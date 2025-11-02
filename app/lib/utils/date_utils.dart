import 'package:flutter/material.dart';

/// 日期时间工具类
/// 扩展 Flutter 自带的 DateUtils 功能，添加东八区（北京时间）相关方法
class AppDateUtils {
  /// 获取东八区（北京时间）格式化时间字符串
  /// 格式：YYYY-MM-DD HH:mm:ss
  /// 例如：2024-01-15 14:30:45
  static String getBeijingTimeString(DateTime dateTime) {
    final beijingTime = dateTime.toUtc().add(const Duration(hours: 8));
    return '${beijingTime.year}-${beijingTime.month.toString().padLeft(2, '0')}-${beijingTime.day.toString().padLeft(2, '0')} ${beijingTime.hour.toString().padLeft(2, '0')}:${beijingTime.minute.toString().padLeft(2, '0')}:${beijingTime.second.toString().padLeft(2, '0')}';
  }

  /// 获取显示的时间文本（用于下拉刷新）
  /// [lastRefreshTime] 最后刷新时间，如果为 null 则使用当前时间
  /// 返回格式：最后更新于 YYYY-MM-DD HH:mm:ss
  static String getTimeDisplayText(DateTime? lastRefreshTime) {
    final time = lastRefreshTime ?? DateTime.now();
    return '最后更新于 ${getBeijingTimeString(time)}';
  }

  /// 获取当前东八区时间
  static DateTime getBeijingTime() {
    return DateTime.now().toUtc().add(const Duration(hours: 8));
  }

  // 可以在这里复用 Flutter DateUtils 的现有方法
  // 例如：使用 DateUtils.dateOnly() 获取日期部分
  
  /// 获取指定日期的日期部分（去除时间，只保留年月日）
  /// 基于 Flutter DateUtils.dateOnly()，但转换为东八区时间
  static DateTime dateOnlyBeijing(DateTime date) {
    final beijingDate = date.toUtc().add(const Duration(hours: 8));
    final dateOnly = DateUtils.dateOnly(beijingDate);
    return dateOnly.toUtc().subtract(const Duration(hours: 8));
  }
}

