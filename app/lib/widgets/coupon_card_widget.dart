import 'package:flutter/material.dart';
import '../models/chat_message_model.dart';

class CouponCardWidget extends StatelessWidget {
  final ChatMessage message;

  const CouponCardWidget({
    super.key,
    required this.message,
  });

  @override
  Widget build(BuildContext context) {
    final couponData = message.extraData;
    if (couponData == null) return const SizedBox.shrink();

    final couponId = couponData['couponId'] as String? ?? '';
    final couponName = couponData['couponName'] as String? ?? '';
    final discount = (couponData['discount'] as num?)?.toDouble() ?? 0.0;

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
              _buildCouponCard(context, couponId, couponName, discount),
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

  /// 构建优惠券卡片
  Widget _buildCouponCard(BuildContext context, String couponId, String couponName, double discount) {
    return Container(
      width: 280,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFFFF6B6B), Color(0xFFFF8E53)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.red.withOpacity(0.3),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 优惠券标题
            Row(
              children: [
                const Icon(Icons.local_offer, color: Colors.white, size: 20),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    couponName,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            // 优惠金额
            Row(
              children: [
                Text(
                  '¥${discount.toStringAsFixed(0)}',
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(width: 8),
                const Text(
                  '优惠券',
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.white70,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            // 使用说明
            const Text(
              '满100元可用，有效期至2024年12月31日',
              style: TextStyle(
                fontSize: 12,
                color: Colors.white70,
              ),
            ),
            const SizedBox(height: 16),
            // 领取按钮
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => _onCouponTap(context, couponId),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: const Color(0xFFFF6B6B),
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: const Text(
                  '立即领取',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        ),
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

  /// 优惠券点击事件
  void _onCouponTap(BuildContext context, String couponId) {
    // 显示领取成功提示
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('优惠券领取成功！'),
        backgroundColor: Colors.green,
        duration: const Duration(seconds: 2),
      ),
    );
  }
}
