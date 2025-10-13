// import 'package:json_annotation/json_annotation.dart';

// part 'chat_message_model.g.dart';

/// 聊天消息类型枚举
enum MessageType {
  text, // 文本消息
  image, // 图片消息
  product, // 商品卡片
  coupon, // 优惠券
  system, // 系统消息
}

/// 消息发送者类型
enum SenderType {
  user, // 用户
  customerService, // 客服
  system, // 系统
}

/// 聊天消息模型
class ChatMessage {
  final String id;
  final String content;
  final MessageType type;
  final SenderType senderType;
  final String senderId;
  final String senderName;
  final String? senderAvatar;
  final DateTime timestamp;
  final bool isRead;
  final Map<String, dynamic>? extraData; // 额外数据，如商品信息、优惠券信息等

  const ChatMessage({
    required this.id,
    required this.content,
    required this.type,
    required this.senderType,
    required this.senderId,
    required this.senderName,
    this.senderAvatar,
    required this.timestamp,
    this.isRead = false,
    this.extraData,
  });

  factory ChatMessage.fromJson(Map<String, dynamic> json) {
    return ChatMessage(
      id: json['id'] as String,
      content: json['content'] as String,
      type: MessageType.values.firstWhere((e) => e.toString().split('.').last == json['type']),
      senderType: SenderType.values.firstWhere((e) => e.toString().split('.').last == json['senderType']),
      senderId: json['senderId'] as String,
      senderName: json['senderName'] as String,
      senderAvatar: json['senderAvatar'] as String?,
      timestamp: DateTime.parse(json['timestamp'] as String),
      isRead: json['isRead'] as bool? ?? false,
      extraData: json['extraData'] as Map<String, dynamic>?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'content': content,
      'type': type.toString().split('.').last,
      'senderType': senderType.toString().split('.').last,
      'senderId': senderId,
      'senderName': senderName,
      'senderAvatar': senderAvatar,
      'timestamp': timestamp.toIso8601String(),
      'isRead': isRead,
      'extraData': extraData,
    };
  }

  /// 创建用户文本消息
  factory ChatMessage.userText({
    required String content,
    required String userId,
    required String userName,
    String? userAvatar,
  }) {
    return ChatMessage(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      content: content,
      type: MessageType.text,
      senderType: SenderType.user,
      senderId: userId,
      senderName: userName,
      senderAvatar: userAvatar,
      timestamp: DateTime.now(),
    );
  }

  /// 创建客服文本消息
  factory ChatMessage.customerServiceText({
    required String content,
    required String serviceId,
    required String serviceName,
    String? serviceAvatar,
  }) {
    return ChatMessage(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      content: content,
      type: MessageType.text,
      senderType: SenderType.customerService,
      senderId: serviceId,
      senderName: serviceName,
      senderAvatar: serviceAvatar,
      timestamp: DateTime.now(),
    );
  }

  /// 创建商品卡片消息
  factory ChatMessage.productCard({
    required String productId,
    required String productName,
    required String productImage,
    required double price,
    required String serviceId,
    required String serviceName,
    String? serviceAvatar,
  }) {
    return ChatMessage(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      content: '为您推荐商品',
      type: MessageType.product,
      senderType: SenderType.customerService,
      senderId: serviceId,
      senderName: serviceName,
      senderAvatar: serviceAvatar,
      timestamp: DateTime.now(),
      extraData: {
        'productId': productId,
        'productName': productName,
        'productImage': productImage,
        'price': price,
      },
    );
  }

  /// 创建优惠券消息
  factory ChatMessage.coupon({
    required String couponId,
    required String couponName,
    required double discount,
    required String serviceId,
    required String serviceName,
    String? serviceAvatar,
  }) {
    return ChatMessage(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      content: '为您提供优惠券',
      type: MessageType.coupon,
      senderType: SenderType.customerService,
      senderId: serviceId,
      senderName: serviceName,
      senderAvatar: serviceAvatar,
      timestamp: DateTime.now(),
      extraData: {
        'couponId': couponId,
        'couponName': couponName,
        'discount': discount,
      },
    );
  }

  /// 复制并更新消息
  ChatMessage copyWith({
    String? id,
    String? content,
    MessageType? type,
    SenderType? senderType,
    String? senderId,
    String? senderName,
    String? senderAvatar,
    DateTime? timestamp,
    bool? isRead,
    Map<String, dynamic>? extraData,
  }) {
    return ChatMessage(
      id: id ?? this.id,
      content: content ?? this.content,
      type: type ?? this.type,
      senderType: senderType ?? this.senderType,
      senderId: senderId ?? this.senderId,
      senderName: senderName ?? this.senderName,
      senderAvatar: senderAvatar ?? this.senderAvatar,
      timestamp: timestamp ?? this.timestamp,
      isRead: isRead ?? this.isRead,
      extraData: extraData ?? this.extraData,
    );
  }

  @override
  String toString() {
    return 'ChatMessage(id: $id, content: $content, type: $type, senderType: $senderType, timestamp: $timestamp)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is ChatMessage && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;
}
