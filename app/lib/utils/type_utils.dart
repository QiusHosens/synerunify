import 'dart:convert';

/// 类型转换工具类
class TypeUtils {
  /// 私有构造函数，防止实例化
  TypeUtils._();

  /// 安全地解析整数，支持String和int类型
  static int parseInt(dynamic value) {
    if (value is int) {
      return value;
    } else if (value is String) {
      return int.tryParse(value) ?? 0;
    }
    return 0;
  }

  /// 安全地解析双精度浮点数，支持String和double类型
  static double parseDouble(dynamic value) {
    if (value is double) {
      return value;
    } else if (value is int) {
      return value.toDouble();
    } else if (value is String) {
      return double.tryParse(value) ?? 0.0;
    }
    return 0.0;
  }

  /// 安全地解析布尔值，支持String和bool类型
  static bool parseBool(dynamic value) {
    if (value is bool) {
      return value;
    } else if (value is String) {
      return value.toLowerCase() == 'true' || value == '1';
    } else if (value is int) {
      return value == 1;
    }
    return false;
  }

  /// 安全地解析字符串
  static String parseString(dynamic value) {
    if (value == null) {
      return '';
    }
    return value.toString();
  }

  /// 安全地获取可空整数
  static int? parseIntNullable(dynamic value) {
    if (value == null) {
      return null;
    }
    if (value is int) {
      return value;
    } else if (value is String) {
      return int.tryParse(value);
    }
    return null;
  }

  /// 安全地获取可空双精度浮点数
  static double? parseDoubleNullable(dynamic value) {
    if (value == null) {
      return null;
    }
    if (value is double) {
      return value;
    } else if (value is int) {
      return value.toDouble();
    } else if (value is String) {
      return double.tryParse(value);
    }
    return null;
  }

  /// 安全地获取可空布尔值
  static bool? parseBoolNullable(dynamic value) {
    if (value == null) {
      return null;
    }
    if (value is bool) {
      return value;
    } else if (value is String) {
      final lowerValue = value.toLowerCase();
      if (lowerValue == 'true' || lowerValue == '1') {
        return true;
      } else if (lowerValue == 'false' || lowerValue == '0') {
        return false;
      }
      return null;
    } else if (value is int) {
      return value == 1 ? true : (value == 0 ? false : null);
    }
    return null;
  }

  /// 安全地获取可空字符串
  static String? parseStringNullable(dynamic value) {
    if (value == null) {
      return null;
    }
    return value.toString();
  }

  static Map<String, dynamic> stringToMap(String source) {
    try {
      return jsonDecode(source) as Map<String, dynamic>;
    } catch (e) {
      throw FormatException('Invalid JSON String: $e');
    }
  }
}
