import 'dart:math';
import '../models/chat_message_model.dart';

class ChatService {
  static const String _serviceId = 'service_001';
  static const String _serviceName = '客服小助手';
  static const String _serviceAvatar = 'https://via.placeholder.com/40';

  /// 获取初始消息
  List<ChatMessage> getInitialMessages() {
    return [
      ChatMessage.customerServiceText(
        content: '您好，欢迎来到SynerUnify！我是您的专属客服小助手，很高兴为您服务！',
        serviceId: _serviceId,
        serviceName: _serviceName,
        serviceAvatar: _serviceAvatar,
      ),
      ChatMessage.customerServiceText(
        content: '请问有什么可以帮助您的吗？您可以咨询商品信息、订单问题、优惠活动等任何问题。',
        serviceId: _serviceId,
        serviceName: _serviceName,
        serviceAvatar: _serviceAvatar,
      ),
    ];
  }

  /// 根据用户消息生成回复
  ChatMessage generateReply(String userMessage) {
    final lowerMessage = userMessage.toLowerCase();
    
    // 优惠券相关
    if (lowerMessage.contains('优惠券') || lowerMessage.contains('券') || lowerMessage.contains('折扣')) {
      return _generateCouponReply();
    }
    
    // 商品推荐
    if (lowerMessage.contains('推荐') || lowerMessage.contains('商品') || lowerMessage.contains('买什么')) {
      return _generateProductRecommendation();
    }
    
    // 订单相关
    if (lowerMessage.contains('订单') || lowerMessage.contains('物流') || lowerMessage.contains('发货')) {
      return _generateOrderReply();
    }
    
    // 退换货
    if (lowerMessage.contains('退货') || lowerMessage.contains('换货') || lowerMessage.contains('退款')) {
      return _generateReturnReply();
    }
    
    // 默认回复
    return _generateDefaultReply();
  }

  /// 生成优惠券回复
  ChatMessage _generateCouponReply() {
    final random = Random();
    
    return ChatMessage.coupon(
      couponId: 'coupon_${DateTime.now().millisecondsSinceEpoch}',
      couponName: '新用户专享券',
      discount: 20.0,
      serviceId: _serviceId,
      serviceName: _serviceName,
      serviceAvatar: _serviceAvatar,
    );
  }

  /// 生成商品推荐回复
  ChatMessage _generateProductRecommendation() {
    final products = [
      {
        'id': 'product_001',
        'name': '智能蓝牙耳机 Pro Max',
        'image': 'https://via.placeholder.com/200x200',
        'price': 299.0,
      },
      {
        'id': 'product_002',
        'name': '无线充电器 快充版',
        'image': 'https://via.placeholder.com/200x200',
        'price': 89.0,
      },
      {
        'id': 'product_003',
        'name': '智能手环 健康监测',
        'image': 'https://via.placeholder.com/200x200',
        'price': 199.0,
      },
    ];
    
    final random = Random();
    final product = products[random.nextInt(products.length)];
    
    return ChatMessage.productCard(
      productId: product['id'] as String,
      productName: product['name'] as String,
      productImage: product['image'] as String,
      price: product['price'] as double,
      serviceId: _serviceId,
      serviceName: _serviceName,
      serviceAvatar: _serviceAvatar,
    );
  }

  /// 生成订单相关回复
  ChatMessage _generateOrderReply() {
    final orderMessages = [
      '您的订单正在处理中，预计24小时内发货。',
      '订单已发货，物流信息已更新，请注意查收。',
      '您的订单已完成，感谢您的购买！',
      '订单状态已更新，您可以在"我的订单"中查看详情。',
    ];
    
    final random = Random();
    final message = orderMessages[random.nextInt(orderMessages.length)];
    
    return ChatMessage.customerServiceText(
      content: message,
      serviceId: _serviceId,
      serviceName: _serviceName,
      serviceAvatar: _serviceAvatar,
    );
  }

  /// 生成退换货回复
  ChatMessage _generateReturnReply() {
    return ChatMessage.customerServiceText(
      content: '我们支持7天无理由退换货。请提供订单号，我将为您处理退换货申请。',
      serviceId: _serviceId,
      serviceName: _serviceName,
      serviceAvatar: _serviceAvatar,
    );
  }

  /// 生成默认回复
  ChatMessage _generateDefaultReply() {
    final defaultMessages = [
      '我理解您的问题，让我为您详细解答。',
      '感谢您的咨询，我会尽力帮助您。',
      '这是一个很好的问题，我来为您说明一下。',
      '我明白您的需求，让我为您提供最合适的解决方案。',
      '请稍等，我正在为您查询相关信息。',
    ];
    
    final random = Random();
    final message = defaultMessages[random.nextInt(defaultMessages.length)];
    
    return ChatMessage.customerServiceText(
      content: message,
      serviceId: _serviceId,
      serviceName: _serviceName,
      serviceAvatar: _serviceAvatar,
    );
  }

  /// 发送消息到服务器
  Future<bool> sendMessage(ChatMessage message) async {
    try {
      // 这里应该调用实际的API
      await Future.delayed(const Duration(milliseconds: 500));
      return true;
    } catch (e) {
      return false;
    }
  }

  /// 获取聊天历史
  Future<List<ChatMessage>> getChatHistory(String userId) async {
    try {
      // 这里应该调用实际的API获取聊天历史
      await Future.delayed(const Duration(milliseconds: 300));
      return getInitialMessages();
    } catch (e) {
      return [];
    }
  }

  /// 标记消息为已读
  Future<bool> markAsRead(String messageId) async {
    try {
      // 这里应该调用实际的API
      await Future.delayed(const Duration(milliseconds: 200));
      return true;
    } catch (e) {
      return false;
    }
  }
}
