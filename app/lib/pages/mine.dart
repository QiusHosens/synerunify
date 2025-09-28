import 'package:flutter/material.dart';
import 'orders.dart';
import 'settings.dart';
import 'address_list.dart';

class Mine extends StatefulWidget {
  Mine({super.key});

  @override
  State<Mine> createState() => _MineState();
}

class _MineState extends State<Mine> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: [
              // 顶部状态栏和店铺信息
              _buildTopBar(),
              // 用户信息区域
              _buildUserProfile(),
              // 会员信息横幅
              _buildMembershipBanner(),
              // 促销卡片
              _buildPromoCards(),
              // 财务概览
              _buildFinancialOverview(),
              // 订单状态
              _buildOrderStatus(),
              // 服务工具网格
              _buildServiceGrid(),
              // 底部促销横幅
              _buildBottomBanners(),
              const SizedBox(height: 100), // 为底部导航栏留出空间
            ],
          ),
        ),
      ),
    );
  }

  /// 构建顶部状态栏和店铺信息
  Widget _buildTopBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          // 时间显示
          const Text(
            '14:02',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Colors.black,
            ),
          ),
          const Spacer(),
          // 店铺位置
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.withOpacity(0.2),
                  blurRadius: 4,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: const Text(
              '中和锦汇天府店',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: Colors.black,
              ),
            ),
          ),
          const Spacer(),
          // 状态栏图标
          Row(
            children: [
              const Icon(
                Icons.signal_cellular_4_bar,
                size: 16,
                color: Colors.black,
              ),
              const SizedBox(width: 4),
              const Icon(Icons.wifi, size: 16, color: Colors.black),
              const SizedBox(width: 4),
              const Icon(Icons.battery_full, size: 16, color: Colors.black),
            ],
          ),
        ],
      ),
    );
  }

  /// 构建用户信息区域
  Widget _buildUserProfile() {
    return Container(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          // 用户头像
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              color: Colors.orange,
              borderRadius: BorderRadius.circular(30),
            ),
            child: const Icon(Icons.pets, size: 30, color: Colors.white),
          ),
          const SizedBox(width: 16),
          // 用户信息
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  '设置昵称',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 4),
                const Text(
                  '会员名:ffsdpzyg',
                  style: TextStyle(fontSize: 14, color: Colors.grey),
                ),
              ],
            ),
          ),
          // 快捷操作
          Row(
            children: [
              _buildQuickAction(Icons.settings, '设置', onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const Settings()),
                );
              }),
              const SizedBox(width: 16),
              _buildQuickAction(Icons.message, '消息', hasNotification: true),
              const SizedBox(width: 16),
              _buildQuickAction(Icons.qr_code, '付款码'),
            ],
          ),
        ],
      ),
    );
  }

  /// 构建快捷操作按钮
  Widget _buildQuickAction(
    IconData icon,
    String label, {
    bool hasNotification = false,
    VoidCallback? onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Stack(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: Colors.grey[200],
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Icon(icon, color: Colors.grey[600], size: 20),
              ),
              if (hasNotification)
                Positioned(
                  right: 0,
                  top: 0,
                  child: Container(
                    width: 12,
                    height: 12,
                    decoration: const BoxDecoration(
                      color: Colors.red,
                      shape: BoxShape.circle,
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 4),
          Text(label, style: const TextStyle(fontSize: 10, color: Colors.grey)),
        ],
      ),
    );
  }

  /// 构建会员信息横幅
  Widget _buildMembershipBanner() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.grey[800],
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          const Icon(Icons.card_membership, color: Colors.white, size: 24),
          const SizedBox(width: 12),
          const Text(
            '错过优惠约97.9元',
            style: TextStyle(
              color: Colors.white,
              fontSize: 14,
              fontWeight: FontWeight.w500,
            ),
          ),
          const Spacer(),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.red,
              borderRadius: BorderRadius.circular(15),
            ),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  '立即开通',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(width: 4),
                Icon(Icons.arrow_forward, color: Colors.white, size: 12),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// 构建促销卡片
  Widget _buildPromoCards() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          Expanded(
            child: _buildPromoCard(
              '免费领菜 天天到店领',
              [Colors.green, Colors.blue],
              '¥0 ¥2.9',
              '¥0 ¥2.8',
            ),
          ),
          const SizedBox(width: 8),
          Expanded(child: _buildPromoCard('免运费', [Colors.orange], '', '')),
          const SizedBox(width: 8),
          Expanded(
            child: _buildPromoCard('专享券', [Colors.purple], '¥5', '蔬菜肉禽券'),
          ),
        ],
      ),
    );
  }

  Widget _buildPromoCard(
    String title,
    List<Color> colors,
    String price1,
    String price2,
  ) {
    return Container(
      height: 120,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: colors,
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 12,
                fontWeight: FontWeight.bold,
              ),
            ),
            const Spacer(),
            if (price1.isNotEmpty)
              Text(
                price1,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                ),
              ),
            if (price2.isNotEmpty)
              Text(
                price2,
                style: const TextStyle(color: Colors.white, fontSize: 12),
              ),
          ],
        ),
      ),
    );
  }

  /// 构建财务概览
  Widget _buildFinancialOverview() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(child: _buildFinancialItem('6张', '红包卡券')),
          Container(width: 1, height: 40, color: Colors.grey[300]),
          Expanded(child: _buildFinancialItem('0.00', '我的积分')),
          Container(width: 1, height: 40, color: Colors.grey[300]),
          Expanded(child: _buildFinancialItem('63.79元', '我的钱包')),
        ],
      ),
    );
  }

  Widget _buildFinancialItem(String value, String label) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: Colors.black87,
          ),
        ),
        const SizedBox(height: 4),
        Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey)),
      ],
    );
  }

  /// 构建订单状态
  Widget _buildOrderStatus() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            children: [
              _buildOrderItem(Icons.payment, '待付款'),
              _buildOrderItem(Icons.local_shipping, '待发货'),
              _buildOrderItem(Icons.delivery_dining, '待收货'),
              _buildOrderItem(Icons.star_border, '待评价'),
              _buildOrderItem(Icons.assignment_return, '退款/售后'),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              const Text(
                '全部订单',
                style: TextStyle(fontSize: 14, color: Colors.grey),
              ),
              const SizedBox(width: 4),
              const Icon(Icons.arrow_forward_ios, size: 12, color: Colors.grey),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildOrderItem(IconData icon, String label) {
    return Expanded(
      child: GestureDetector(
        onTap: () {
          Navigator.of(
            context,
          ).push(MaterialPageRoute(builder: (context) => const Orders()));
        },
        child: Column(
          children: [
            Icon(icon, color: Colors.orange, size: 24),
            const SizedBox(height: 4),
            Text(
              label,
              style: const TextStyle(fontSize: 12, color: Colors.black87),
            ),
          ],
        ),
      ),
    );
  }

  /// 构建服务工具网格
  Widget _buildServiceGrid() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          // 第一行服务
          Row(
            children: [
              _buildServiceItem(Icons.shopping_cart, '邀新拼团', '拼团'),
              _buildServiceItem(Icons.person, '生活服务', '省心省钱'),
              _buildServiceItem(Icons.park, '盒马小镇'),
              _buildServiceItem(Icons.school, '健康课堂'),
              _buildServiceItem(Icons.card_giftcard, '入群抽奖'),
            ],
          ),
          const SizedBox(height: 16),
          // 第二行服务
          Row(
            children: [
              _buildServiceItem(Icons.location_on, '收货地址'),
              _buildServiceItem(Icons.headset_mic, '客服小蜜'),
              _buildServiceItem(Icons.description, '门店证照'),
              _buildServiceItem(Icons.favorite, '收藏'),
              _buildServiceItem(Icons.business, '企业商城'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildServiceItem(IconData icon, String label, [String? tag]) {
    return Expanded(
      child: GestureDetector(
        onTap: () {
          if (label == '收货地址') {
            Navigator.of(context).push(
              MaterialPageRoute(builder: (context) => const AddressList()),
            );
          } else {
            ScaffoldMessenger.of(
              context,
            ).showSnackBar(SnackBar(content: Text('点击了$label')));
          }
        },
        child: Column(
          children: [
            Stack(
              children: [
                Icon(icon, color: Colors.orange, size: 24),
                if (tag != null)
                  Positioned(
                    right: -2,
                    top: -2,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 4,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.red,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        tag,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 8,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: const TextStyle(fontSize: 10, color: Colors.black87),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  /// 构建底部促销横幅
  Widget _buildBottomBanners() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          Expanded(
            child: _buildBottomBanner(
              '月满中秋',
              '大闸蟹券买1送1起',
              '立即抢购>',
              Colors.orange,
            ),
          ),
          const SizedBox(width: 8),
          Expanded(child: _buildBottomBanner('冰鲜', '', '', Colors.blue)),
        ],
      ),
    );
  }

  Widget _buildBottomBanner(
    String title,
    String subtitle,
    String buttonText,
    Color color,
  ) {
    return Container(
      height: 100,
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
            if (subtitle.isNotEmpty) ...[
              const SizedBox(height: 4),
              Text(
                subtitle,
                style: const TextStyle(color: Colors.white, fontSize: 12),
              ),
            ],
            const Spacer(),
            if (buttonText.isNotEmpty)
              Text(
                buttonText,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                ),
              ),
          ],
        ),
      ),
    );
  }
}
