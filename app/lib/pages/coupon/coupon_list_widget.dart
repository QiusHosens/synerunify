import 'package:flutter/material.dart';
import '../../models/coupon_model.dart';

/// 优惠券列表组件
class CouponListWidget extends StatelessWidget {
  final List<CouponModel> coupons;
  final CouponFilter filter;

  const CouponListWidget({
    super.key,
    required this.coupons,
    required this.filter,
  });

  @override
  Widget build(BuildContext context) {
    // 根据筛选条件过滤优惠券
    final filteredCoupons = coupons.where(filter.matches).toList();
    
    // 按类型分组
    final groupedCoupons = _groupCouponsByType(filteredCoupons);

    if (groupedCoupons.isEmpty) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.card_giftcard,
              size: 64,
              color: Colors.grey,
            ),
            SizedBox(height: 16),
            Text(
              '暂无优惠券',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey,
              ),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      itemCount: groupedCoupons.length,
      itemBuilder: (context, index) {
        final entry = groupedCoupons.entries.elementAt(index);
        final type = entry.key;
        final typeCoupons = entry.value;

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 类型标题
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 12),
              child: Text(
                _getTypeDisplayName(type),
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),
            ),
            // 该类型的优惠券列表
            ...typeCoupons.map((coupon) => Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: CouponCard(coupon: coupon),
            )),
          ],
        );
      },
    );
  }

  /// 按类型分组优惠券
  Map<CouponType, List<CouponModel>> _groupCouponsByType(List<CouponModel> coupons) {
    final Map<CouponType, List<CouponModel>> grouped = {};
    
    for (final coupon in coupons) {
      if (!grouped.containsKey(coupon.type)) {
        grouped[coupon.type] = [];
      }
      grouped[coupon.type]!.add(coupon);
    }
    
    return grouped;
  }

  /// 获取类型显示名称
  String _getTypeDisplayName(CouponType type) {
    switch (type) {
      case CouponType.fullReduction:
        return '满减券';
      case CouponType.crossStore:
        return '跨商家';
      case CouponType.shipping:
        return '运费券';
      case CouponType.redEnvelope:
        return '红包';
      case CouponType.electronic:
        return '电子券';
      case CouponType.qualification:
        return '资格凭证';
      case CouponType.card:
        return '卡券';
    }
  }
}

/// 优惠券卡片组件
class CouponCard extends StatelessWidget {
  final CouponModel coupon;

  const CouponCard({
    super.key,
    required this.coupon,
  });

  @override
  Widget build(BuildContext context) {
    final isExpired = DateTime.now().isAfter(coupon.endTime);
    final isUsed = coupon.status == CouponStatus.used;

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: Row(
          children: [
            // 左侧优惠金额区域
            _buildLeftSection(),
            // 中间分隔线
            _buildSeparator(),
            // 右侧详情区域
            Expanded(
              child: _buildRightSection(isExpired, isUsed),
            ),
            // 使用按钮
            _buildActionButton(isExpired, isUsed),
          ],
        ),
      ),
    );
  }

  /// 构建左侧优惠金额区域
  Widget _buildLeftSection() {
    return Container(
      width: 120,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Color(int.parse(coupon.primaryColor.replaceFirst('#', '0xFF'))),
            Color(int.parse(coupon.secondaryColor.replaceFirst('#', '0xFF'))),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 标签
          if (coupon.tag != null)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.2),
                borderRadius: BorderRadius.circular(4),
              ),
              child: Text(
                coupon.tag!,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          const Spacer(),
          // 优惠金额
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              const Text(
                '¥',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                coupon.value.toInt().toString(),
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          // 使用条件
          Text(
            '满${coupon.minAmount}元使用',
            style: TextStyle(
              color: Colors.white.withOpacity(0.9),
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }

  /// 构建分隔线
  Widget _buildSeparator() {
    return Container(
      width: 1,
      height: double.infinity,
      decoration: BoxDecoration(
        color: Colors.grey[200],
        borderRadius: BorderRadius.circular(0.5),
      ),
      child: CustomPaint(
        painter: DashedLinePainter(),
      ),
    );
  }

  /// 构建右侧详情区域
  Widget _buildRightSection(bool isExpired, bool isUsed) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 标题
          Text(
            coupon.title,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: isExpired || isUsed ? Colors.grey : Colors.black87,
            ),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 8),
          // 使用范围标签
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.red.withOpacity(0.1),
              borderRadius: BorderRadius.circular(4),
              border: Border.all(color: Colors.red.withOpacity(0.3)),
            ),
            child: Text(
              coupon.scopeDisplayName,
              style: const TextStyle(
                color: Colors.red,
                fontSize: 10,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          const Spacer(),
          // 有效期
          Text(
            '${_formatDate(coupon.startTime)} 至 ${_formatDate(coupon.endTime)}',
            style: TextStyle(
              fontSize: 12,
              color: isExpired ? Colors.red : Colors.grey[600],
            ),
          ),
        ],
      ),
    );
  }

  /// 构建操作按钮
  Widget _buildActionButton(bool isExpired, bool isUsed) {
    String buttonText;
    Color buttonColor;
    VoidCallback? onTap;

    if (isUsed) {
      buttonText = '已使用';
      buttonColor = Colors.grey;
    } else if (isExpired) {
      buttonText = '已过期';
      buttonColor = Colors.red;
    } else {
      buttonText = '去使用';
      buttonColor = Colors.red;
      onTap = () {
        // TODO: 实现使用优惠券功能
      };
    }

    return Container(
      width: 80,
      padding: const EdgeInsets.symmetric(vertical: 16),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          GestureDetector(
            onTap: onTap,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: buttonColor,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    buttonText,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  if (onTap != null) ...[
                    const SizedBox(width: 4),
                    const Icon(
                      Icons.arrow_forward,
                      color: Colors.white,
                      size: 12,
                    ),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// 格式化日期
  String _formatDate(DateTime date) {
    return '${date.year}.${date.month.toString().padLeft(2, '0')}.${date.day.toString().padLeft(2, '0')} ${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}';
  }
}

/// 虚线绘制器
class DashedLinePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.grey[300]!
      ..strokeWidth = 1.0
      ..style = PaintingStyle.stroke;

    const dashWidth = 4.0;
    const dashSpace = 3.0;
    double startY = 0;

    while (startY < size.height) {
      canvas.drawLine(
        Offset(0, startY),
        Offset(0, startY + dashWidth),
        paint,
      );
      startY += dashWidth + dashSpace;
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
