import 'package:flutter/material.dart';
import '../models/chat_message_model.dart';

class ProductCardWidget extends StatelessWidget {
  final ChatMessage message;

  const ProductCardWidget({
    super.key,
    required this.message,
  });

  @override
  Widget build(BuildContext context) {
    final productData = message.extraData;
    if (productData == null) return const SizedBox.shrink();

    final productId = productData['productId'] as String? ?? '';
    final productName = productData['productName'] as String? ?? '';
    final productImage = productData['productImage'] as String? ?? '';
    final price = (productData['price'] as num?)?.toDouble() ?? 0.0;

    return Row(
      mainAxisAlignment: MainAxisAlignment.start,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildAvatar(),
        const SizedBox(width: 8),
        Flexible(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildSenderName(),
              _buildProductCard(context, productId, productName, productImage, price),
              const SizedBox(height: 4),
              _buildTimestamp(),
            ],
          ),
        ),
      ],
    );
  }

  /// 构建头像
  Widget _buildAvatar() {
    return CircleAvatar(
      radius: 16,
      backgroundColor: Colors.orange,
      backgroundImage: message.senderAvatar != null 
          ? NetworkImage(message.senderAvatar!)
          : null,
      child: message.senderAvatar == null
          ? const Icon(Icons.support_agent, size: 16, color: Colors.white)
          : null,
    );
  }

  /// 构建发送者名称
  Widget _buildSenderName() {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Text(
        message.senderName,
        style: const TextStyle(
          fontSize: 12,
          color: Colors.grey,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }

  /// 构建商品卡片
  Widget _buildProductCard(BuildContext context, String productId, String productName, String productImage, double price) {
    return Container(
      width: 280,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 商品图片
          ClipRRect(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
            child: Container(
              height: 160,
              width: double.infinity,
              color: Colors.grey[200],
              child: productImage.isNotEmpty
                  ? Image.network(
                      productImage,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) {
                        return const Icon(Icons.image, size: 48, color: Colors.grey);
                      },
                    )
                  : const Icon(Icons.image, size: 48, color: Colors.grey),
            ),
          ),
          // 商品信息
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 商品名称
                Text(
                  productName,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: Colors.black87,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 8),
                // 价格
                Row(
                  children: [
                    Text(
                      '¥${price.toStringAsFixed(2)}',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.red,
                      ),
                    ),
                    const Spacer(),
                    // 购买按钮
                    ElevatedButton(
                      onPressed: () => _onProductTap(context, productId),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                        ),
                      ),
                      child: const Text('立即购买', style: TextStyle(fontSize: 12)),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// 构建时间戳
  Widget _buildTimestamp() {
    final timeStr = _formatTime(message.timestamp);
    return Text(
      timeStr,
      style: const TextStyle(
        fontSize: 11,
        color: Colors.grey,
      ),
    );
  }

  /// 格式化时间
  String _formatTime(DateTime timestamp) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final messageDate = DateTime(timestamp.year, timestamp.month, timestamp.day);
    
    if (messageDate == today) {
      return '${timestamp.hour.toString().padLeft(2, '0')}:${timestamp.minute.toString().padLeft(2, '0')}';
    } else if (messageDate == today.subtract(const Duration(days: 1))) {
      return '昨天 ${timestamp.hour.toString().padLeft(2, '0')}:${timestamp.minute.toString().padLeft(2, '0')}';
    } else {
      return '${timestamp.month}/${timestamp.day} ${timestamp.hour.toString().padLeft(2, '0')}:${timestamp.minute.toString().padLeft(2, '0')}';
    }
  }

  /// 商品点击事件
  void _onProductTap(BuildContext context, String productId) {
    // 跳转到商品详情页
    Navigator.pushNamed(context, '/product_detail', arguments: productId);
  }
}
