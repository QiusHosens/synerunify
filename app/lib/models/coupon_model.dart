import 'package:json_annotation/json_annotation.dart';

part 'coupon_model.g.dart';

/// 优惠券类型枚举
enum CouponType {
  @JsonValue('full_reduction')
  fullReduction, // 满减券
  @JsonValue('cross_store')
  crossStore, // 跨店券
  @JsonValue('shipping')
  shipping, // 运费券
  @JsonValue('red_envelope')
  redEnvelope, // 红包
  @JsonValue('electronic')
  electronic, // 电子券
  @JsonValue('qualification')
  qualification, // 资格凭证
  @JsonValue('card')
  card, // 卡
}

/// 优惠券使用范围枚举
enum CouponScope {
  @JsonValue('online')
  online, // 仅线上购物使用
  @JsonValue('offline')
  offline, // 仅线下使用
  @JsonValue('all')
  all, // 线上线下通用
}

/// 优惠券状态枚举
enum CouponStatus {
  @JsonValue('active')
  active, // 可用
  @JsonValue('used')
  used, // 已使用
  @JsonValue('expired')
  expired, // 已过期
  @JsonValue('disabled')
  disabled, // 已禁用
}

/// 优惠券数据模型
@JsonSerializable()
class CouponModel {
  final String id;
  final String title;
  final String description;
  final double value; // 优惠金额
  final double minAmount; // 最低使用金额
  final CouponType type;
  final CouponScope scope;
  final CouponStatus status;
  final DateTime startTime;
  final DateTime endTime;
  final String? imageUrl;
  final String? tag; // 标签，如"跨店券"
  final bool isNew; // 是否为新券
  final String? usageRule; // 使用规则说明

  const CouponModel({
    required this.id,
    required this.title,
    required this.description,
    required this.value,
    required this.minAmount,
    required this.type,
    required this.scope,
    required this.status,
    required this.startTime,
    required this.endTime,
    this.imageUrl,
    this.tag,
    this.isNew = false,
    this.usageRule,
  });

  factory CouponModel.fromJson(Map<String, dynamic> json) =>
      _$CouponModelFromJson(json);

  Map<String, dynamic> toJson() => _$CouponModelToJson(this);

  /// 获取优惠券类型的中文名称
  String get typeDisplayName {
    switch (type) {
      case CouponType.fullReduction:
        return '满减券';
      case CouponType.crossStore:
        return '跨店券';
      case CouponType.shipping:
        return '运费券';
      case CouponType.redEnvelope:
        return '红包';
      case CouponType.electronic:
        return '电子券';
      case CouponType.qualification:
        return '资格凭证';
      case CouponType.card:
        return '卡';
    }
  }

  /// 获取使用范围的中文描述
  String get scopeDisplayName {
    switch (scope) {
      case CouponScope.online:
        return '仅线上购物使用';
      case CouponScope.offline:
        return '仅线下使用';
      case CouponScope.all:
        return '线上线下通用';
    }
  }

  /// 获取状态的中文描述
  String get statusDisplayName {
    switch (status) {
      case CouponStatus.active:
        return '可用';
      case CouponStatus.used:
        return '已使用';
      case CouponStatus.expired:
        return '已过期';
      case CouponStatus.disabled:
        return '已禁用';
    }
  }

  /// 检查优惠券是否可用
  bool get isAvailable {
    final now = DateTime.now();
    return status == CouponStatus.active &&
        now.isAfter(startTime) &&
        now.isBefore(endTime);
  }

  /// 获取优惠券主色调
  String get primaryColor {
    switch (type) {
      case CouponType.fullReduction:
        return '#FF6B6B';
      case CouponType.crossStore:
        return '#4ECDC4';
      case CouponType.shipping:
        return '#45B7D1';
      case CouponType.redEnvelope:
        return '#FF9F43';
      case CouponType.electronic:
        return '#6C5CE7';
      case CouponType.qualification:
        return '#A29BFE';
      case CouponType.card:
        return '#FD79A8';
    }
  }

  /// 获取优惠券次要色调
  String get secondaryColor {
    switch (type) {
      case CouponType.fullReduction:
        return '#FF8E8E';
      case CouponType.crossStore:
        return '#74E6D8';
      case CouponType.shipping:
        return '#6BC5D8';
      case CouponType.redEnvelope:
        return '#FFB74D';
      case CouponType.electronic:
        return '#8B7ED8';
      case CouponType.qualification:
        return '#B8B3FF';
      case CouponType.card:
        return '#FF9EC7';
    }
  }

  CouponModel copyWith({
    String? id,
    String? title,
    String? description,
    double? value,
    double? minAmount,
    CouponType? type,
    CouponScope? scope,
    CouponStatus? status,
    DateTime? startTime,
    DateTime? endTime,
    String? imageUrl,
    String? tag,
    bool? isNew,
    String? usageRule,
  }) {
    return CouponModel(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      value: value ?? this.value,
      minAmount: minAmount ?? this.minAmount,
      type: type ?? this.type,
      scope: scope ?? this.scope,
      status: status ?? this.status,
      startTime: startTime ?? this.startTime,
      endTime: endTime ?? this.endTime,
      imageUrl: imageUrl ?? this.imageUrl,
      tag: tag ?? this.tag,
      isNew: isNew ?? this.isNew,
      usageRule: usageRule ?? this.usageRule,
    );
  }
}

/// 优惠券筛选器
class CouponFilter {
  final CouponType? type;
  final CouponStatus? status;
  final String? searchKeyword;

  const CouponFilter({
    this.type,
    this.status,
    this.searchKeyword,
  });

  CouponFilter copyWith({
    CouponType? type,
    CouponStatus? status,
    String? searchKeyword,
  }) {
    return CouponFilter(
      type: type ?? this.type,
      status: status ?? this.status,
      searchKeyword: searchKeyword ?? this.searchKeyword,
    );
  }

  /// 检查优惠券是否匹配筛选条件
  bool matches(CouponModel coupon) {
    if (type != null && coupon.type != type) return false;
    if (status != null && coupon.status != status) return false;
    if (searchKeyword != null &&
        searchKeyword!.isNotEmpty &&
        !coupon.title.toLowerCase().contains(searchKeyword!.toLowerCase()) &&
        !coupon.description.toLowerCase().contains(searchKeyword!.toLowerCase())) {
      return false;
    }
    return true;
  }
}
