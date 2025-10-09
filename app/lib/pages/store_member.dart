import 'package:flutter/material.dart';

class StoreMember extends StatefulWidget {
  final Map<String, dynamic> storeInfo;

  const StoreMember({super.key, required this.storeInfo});

  @override
  State<StoreMember> createState() => _StoreMemberState();
}

class _StoreMemberState extends State<StoreMember> {
  bool _isMember = false;
  int _memberLevel = 0; // 0: 普通用户, 1: 银牌会员, 2: 金牌会员, 3: 钻石会员
  int _points = 0;
  int _memberPoints = 0;

  // 会员等级配置
  final List<Map<String, dynamic>> _memberLevels = [
    {
      'name': '普通用户',
      'color': Colors.grey,
      'icon': Icons.person,
      'requiredPoints': 0,
      'benefits': ['基础购物权益'],
    },
    {
      'name': '银牌会员',
      'color': Colors.grey[400]!,
      'icon': Icons.workspace_premium,
      'requiredPoints': 1000,
      'benefits': ['专属优惠券', '生日特权', '积分翻倍'],
    },
    {
      'name': '金牌会员',
      'color': Colors.amber,
      'icon': Icons.star,
      'requiredPoints': 5000,
      'benefits': ['银牌权益', '专属客服', '新品优先购买'],
    },
    {
      'name': '钻石会员',
      'color': Colors.blue[600]!,
      'icon': Icons.diamond,
      'requiredPoints': 10000,
      'benefits': ['金牌权益', '免费配送', '限量商品优先'],
    },
  ];

  // 会员权益数据
  final List<Map<String, dynamic>> _memberBenefits = [
    {
      'icon': Icons.shopping_bag,
      'title': '积分商城',
      'description': '使用积分兑换精美礼品',
      'color': Colors.orange,
    },
    {
      'icon': Icons.stars,
      'title': '购物积分',
      'description': '购物获得积分，积分当钱花',
      'color': Colors.blue,
    },
    {
      'icon': Icons.local_offer,
      'title': '专属优惠券',
      'description': '会员专享优惠券，省钱更省心',
      'color': Colors.green,
    },
    {
      'icon': Icons.card_giftcard,
      'title': '生日特权',
      'description': '生日月专属礼品和优惠',
      'color': Colors.purple,
    },
    {
      'icon': Icons.support_agent,
      'title': '专属客服',
      'description': 'VIP客服，问题快速解决',
      'color': Colors.red,
    },
    {
      'icon': Icons.flash_on,
      'title': '新品优先',
      'description': '新品上市，会员优先购买',
      'color': Colors.teal,
    },
  ];

  @override
  void initState() {
    super.initState();
    _loadMemberData();
  }

  /// 加载会员数据
  void _loadMemberData() {
    // 模拟会员数据
    setState(() {
      _isMember = true;
      _memberLevel = 2; // 金牌会员
      _points = 7500;
      _memberPoints = 2500;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      body: SingleChildScrollView(
        child: Column(
          children: [
            // 会员卡片
            _buildMemberCard(),
            const SizedBox(height: 16),
            // 会员权益
            _buildMemberBenefits(),
            const SizedBox(height: 16),
            // 积分信息
            _buildPointsInfo(),
            const SizedBox(height: 16),
            // 会员等级进度
            _buildLevelProgress(),
            const SizedBox(height: 16),
            // 会员特权
            _buildMemberPrivileges(),
          ],
        ),
      ),
    );
  }

  /// 构建会员卡片
  Widget _buildMemberCard() {
    final currentLevel = _memberLevels[_memberLevel];
    final nextLevel = _memberLevel < _memberLevels.length - 1
        ? _memberLevels[_memberLevel + 1]
        : null;

    return Container(
      margin: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            currentLevel['color'] as Color,
            (currentLevel['color'] as Color).withValues(alpha: 0.8),
          ],
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: currentLevel['color'].withValues(alpha: 0.3),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // 顶部信息
            Row(
              children: [
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(30),
                  ),
                  child: Center(
                    child: Text(
                      widget.storeInfo['name']?.substring(0, 2) ?? '店铺',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '${widget.storeInfo['name']}会员卡',
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _isMember
                            ? '${currentLevel['name']} - 享受专属会员权益'
                            : '- 0元入会，享专属会员权益 -',
                        style: const TextStyle(
                          fontSize: 14,
                          color: Colors.white70,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            // 会员等级和积分信息
            if (_isMember) ...[
              Row(
                children: [
                  Icon(
                    currentLevel['icon'] as IconData,
                    color: Colors.white,
                    size: 20,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    currentLevel['name'] as String,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const Spacer(),
                  Text(
                    '积分: $_points',
                    style: const TextStyle(fontSize: 14, color: Colors.white70),
                  ),
                ],
              ),
              if (nextLevel != null) ...[
                const SizedBox(height: 12),
                LinearProgressIndicator(
                  value: _points / (nextLevel['requiredPoints'] as int),
                  backgroundColor: Colors.white.withValues(alpha: 0.3),
                  valueColor: const AlwaysStoppedAnimation<Color>(Colors.white),
                ),
                const SizedBox(height: 4),
                Text(
                  '距离${nextLevel['name']}还需${(nextLevel['requiredPoints'] as int) - _points}积分',
                  style: const TextStyle(fontSize: 12, color: Colors.white70),
                ),
              ],
            ],
            const SizedBox(height: 20),
            // 加入/升级按钮
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  _handleMemberAction();
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: currentLevel['color'] as Color,
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(25),
                  ),
                ),
                child: Text(
                  _isMember
                      ? (nextLevel != null ? '升级会员' : '已是最高等级')
                      : '立即加入品牌会员',
                  style: const TextStyle(
                    fontSize: 16,
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

  /// 构建会员权益
  Widget _buildMemberBenefits() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withValues(alpha: 0.1),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              '入会享特权',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 3,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                childAspectRatio: 1,
              ),
              itemCount: _memberBenefits.length,
              itemBuilder: (context, index) {
                final benefit = _memberBenefits[index];
                return _buildBenefitItem(benefit);
              },
            ),
          ],
        ),
      ),
    );
  }

  /// 构建权益项目
  Widget _buildBenefitItem(Map<String, dynamic> benefit) {
    return GestureDetector(
      onTap: () {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('${benefit['title']}功能开发中...')));
      },
      child: Column(
        children: [
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              color: benefit['color'].withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(30),
            ),
            child: Icon(
              benefit['icon'] as IconData,
              color: benefit['color'] as Color,
              size: 30,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            benefit['title'] as String,
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  /// 构建积分信息
  Widget _buildPointsInfo() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withValues(alpha: 0.1),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              '积分信息',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: _buildPointsItem(
                    '累计积分',
                    '$_points',
                    Icons.stars,
                    Colors.amber,
                  ),
                ),
                Container(width: 1, height: 40, color: Colors.grey[300]),
                Expanded(
                  child: _buildPointsItem(
                    '可用积分',
                    '$_memberPoints',
                    Icons.account_balance_wallet,
                    Colors.blue,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  ScaffoldMessenger.of(
                    context,
                  ).showSnackBar(const SnackBar(content: Text('积分商城功能开发中...')));
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.orange,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 12),
                ),
                child: const Text('进入积分商城'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// 构建积分项目
  Widget _buildPointsItem(
    String title,
    String value,
    IconData icon,
    Color color,
  ) {
    return Column(
      children: [
        Icon(icon, color: color, size: 24),
        const SizedBox(height: 8),
        Text(
          value,
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
        const SizedBox(height: 4),
        Text(title, style: TextStyle(fontSize: 12, color: Colors.grey[600])),
      ],
    );
  }

  /// 构建会员等级进度
  Widget _buildLevelProgress() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withValues(alpha: 0.1),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              '会员等级',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            ...List.generate(_memberLevels.length, (index) {
              final level = _memberLevels[index];
              final isCurrentLevel = index == _memberLevel;
              final isUnlocked = _points >= (level['requiredPoints'] as int);

              return Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: isCurrentLevel
                      ? (level['color'] as Color).withValues(alpha: 0.1)
                      : Colors.grey[50],
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: isCurrentLevel
                        ? level['color'] as Color
                        : Colors.grey[300]!,
                  ),
                ),
                child: Row(
                  children: [
                    Icon(
                      level['icon'] as IconData,
                      color: isUnlocked ? level['color'] as Color : Colors.grey,
                      size: 24,
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            level['name'] as String,
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: isUnlocked ? Colors.black : Colors.grey,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '需要${level['requiredPoints']}积分',
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey[600],
                            ),
                          ),
                        ],
                      ),
                    ),
                    if (isCurrentLevel)
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: level['color'] as Color,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Text(
                          '当前等级',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                  ],
                ),
              );
            }),
          ],
        ),
      ),
    );
  }

  /// 构建会员特权
  Widget _buildMemberPrivileges() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withValues(alpha: 0.1),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              '会员特权',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            ...(_memberLevels[_memberLevel]['benefits'] as List)
                .map(
                  (benefit) => Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    child: Row(
                      children: [
                        Icon(Icons.check_circle, color: Colors.green, size: 16),
                        const SizedBox(width: 8),
                        Text(
                          benefit as String,
                          style: const TextStyle(fontSize: 14),
                        ),
                      ],
                    ),
                  ),
                )
                .toList(),
          ],
        ),
      ),
    );
  }

  /// 处理会员操作
  void _handleMemberAction() {
    if (!_isMember) {
      // 加入会员
      setState(() {
        _isMember = true;
        _memberLevel = 0;
        _points = 100;
      });
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('恭喜您成为品牌会员！')));
    } else {
      // 升级会员
      final nextLevel = _memberLevel + 1;
      if (nextLevel < _memberLevels.length) {
        if (_points >= (_memberLevels[nextLevel]['requiredPoints'] as int)) {
          setState(() {
            _memberLevel = nextLevel;
          });
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('恭喜您升级为${_memberLevels[nextLevel]['name']}！'),
            ),
          );
        } else {
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(const SnackBar(content: Text('积分不足，无法升级')));
        }
      }
    }
  }
}
