// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'coupon_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CouponModel _$CouponModelFromJson(Map<String, dynamic> json) => CouponModel(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      value: (json['value'] as num).toDouble(),
      minAmount: (json['minAmount'] as num).toDouble(),
      type: $enumDecode(_$CouponTypeEnumMap, json['type']),
      scope: $enumDecode(_$CouponScopeEnumMap, json['scope']),
      status: $enumDecode(_$CouponStatusEnumMap, json['status']),
      startTime: DateTime.parse(json['startTime'] as String),
      endTime: DateTime.parse(json['endTime'] as String),
      imageUrl: json['imageUrl'] as String?,
      tag: json['tag'] as String?,
      isNew: json['isNew'] as bool? ?? false,
      usageRule: json['usageRule'] as String?,
    );

Map<String, dynamic> _$CouponModelToJson(CouponModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'description': instance.description,
      'value': instance.value,
      'minAmount': instance.minAmount,
      'type': _$CouponTypeEnumMap[instance.type]!,
      'scope': _$CouponScopeEnumMap[instance.scope]!,
      'status': _$CouponStatusEnumMap[instance.status]!,
      'startTime': instance.startTime.toIso8601String(),
      'endTime': instance.endTime.toIso8601String(),
      'imageUrl': instance.imageUrl,
      'tag': instance.tag,
      'isNew': instance.isNew,
      'usageRule': instance.usageRule,
    };

const _$CouponTypeEnumMap = {
  CouponType.fullReduction: 'full_reduction',
  CouponType.crossStore: 'cross_store',
  CouponType.shipping: 'shipping',
  CouponType.redEnvelope: 'red_envelope',
  CouponType.electronic: 'electronic',
  CouponType.qualification: 'qualification',
  CouponType.card: 'card',
};

const _$CouponScopeEnumMap = {
  CouponScope.online: 'online',
  CouponScope.offline: 'offline',
  CouponScope.all: 'all',
};

const _$CouponStatusEnumMap = {
  CouponStatus.active: 'active',
  CouponStatus.used: 'used',
  CouponStatus.expired: 'expired',
  CouponStatus.disabled: 'disabled',
};
