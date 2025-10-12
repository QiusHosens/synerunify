import 'package:flutter/material.dart';
import '../../models/coupon_model.dart';
import 'coupon_list_widget.dart';
import 'coupon_filter_widget.dart';

/// 红包卡券页面
class CouponPage extends StatefulWidget {
  const CouponPage({super.key});

  @override
  State<CouponPage> createState() => _CouponPageState();
}

class _CouponPageState extends State<CouponPage>
    with TickerProviderStateMixin {
  late TabController _mainTabController;
  late TabController _couponTabController;
  
  int _selectedMainTabIndex = 0;
  int _selectedCouponTabIndex = 0;
  
  CouponFilter _filter = const CouponFilter();
  
  // 模拟数据
  final List<CouponModel> _coupons = [
    CouponModel(
      id: '1',
      title: '件件包邮|冲调乳品10元立减券',
      description: '件件包邮|冲调乳品10元立减券',
      value: 10.0,
      minAmount: 10.01,
      type: CouponType.crossStore,
      scope: CouponScope.online,
      status: CouponStatus.active,
      startTime: DateTime(2025, 10, 1),
      endTime: DateTime(2025, 10, 31, 23, 59),
      tag: '跨店券',
    ),
    CouponModel(
      id: '2',
      title: '新用户专享券',
      description: '新用户专享券，满50减20',
      value: 20.0,
      minAmount: 50.0,
      type: CouponType.fullReduction,
      scope: CouponScope.all,
      status: CouponStatus.active,
      startTime: DateTime(2025, 1, 1),
      endTime: DateTime(2025, 12, 31),
    ),
    CouponModel(
      id: '3',
      title: '免运费券',
      description: '全场免运费，无门槛使用',
      value: 0.0,
      minAmount: 0.0,
      type: CouponType.shipping,
      scope: CouponScope.online,
      status: CouponStatus.active,
      startTime: DateTime(2025, 1, 1),
      endTime: DateTime(2025, 12, 31),
    ),
  ];

  @override
  void initState() {
    super.initState();
    _mainTabController = TabController(length: 5, vsync: this);
    _couponTabController = TabController(length: 4, vsync: this);
    
    _mainTabController.addListener(() {
      if (_mainTabController.indexIsChanging) {
        setState(() {
          _selectedMainTabIndex = _mainTabController.index;
        });
      }
    });
    
    _couponTabController.addListener(() {
      if (_couponTabController.indexIsChanging) {
        setState(() {
          _selectedCouponTabIndex = _couponTabController.index;
        });
      }
    });
  }

  @override
  void dispose() {
    _mainTabController.dispose();
    _couponTabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      body: SafeArea(
        child: Column(
          children: [
            // 顶部状态栏和标题栏
            _buildTopBar(),
            // 促销横幅
            _buildPromoBanner(),
            // 主要标签页
            _buildMainTabs(),
            // 优惠券子标签页（仅在选择优惠券时显示）
            if (_selectedMainTabIndex == 0) _buildCouponSubTabs(),
            // 内容区域
            Expanded(
              child: _buildContent(),
            ),
            // 底部链接
            _buildBottomLink(),
          ],
        ),
      ),
    );
  }

  /// 构建顶部状态栏和标题栏
  Widget _buildTopBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Column(
        children: [
          // 状态栏
          Row(
            children: [
              // 时间显示
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.orange,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Text(
                  '14:49',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
              const Spacer(),
              // 店铺名称
              const Text(
                '中和锦汇天府店',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: Colors.black87,
                ),
              ),
              const Spacer(),
              // 状态栏图标
              Row(
                children: [
                  const Icon(Icons.signal_cellular_4_bar, size: 16, color: Colors.black),
                  const SizedBox(width: 4),
                  const Icon(Icons.wifi, size: 16, color: Colors.black),
                  const SizedBox(width: 4),
                  const Icon(Icons.battery_full, size: 16, color: Colors.black),
                ],
              ),
            ],
          ),
          const SizedBox(height: 12),
          // 标题栏
          Row(
            children: [
              IconButton(
                onPressed: () => Navigator.pop(context),
                icon: const Icon(Icons.arrow_back, color: Colors.black87),
              ),
              const Expanded(
                child: Text(
                  '红包卡券',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),
              ),
              TextButton(
                onPressed: () {
                  // TODO: 实现兑换码功能
                },
                child: const Text(
                  '兑换码',
                  style: TextStyle(color: Colors.blue, fontSize: 14),
                ),
              ),
              const SizedBox(width: 8),
              TextButton(
                onPressed: () {
                  // TODO: 实现规则页面
                },
                child: const Text(
                  '规则',
                  style: TextStyle(color: Colors.blue, fontSize: 14),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  /// 构建促销横幅
  Widget _buildPromoBanner() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      height: 120,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFFFF6B6B), Color(0xFFE53E3E)],
          begin: Alignment.centerLeft,
          end: Alignment.centerRight,
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
      child: Stack(
        children: [
          // 背景装饰
          Positioned(
            right: -20,
            top: -20,
            child: Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
            ),
          ),
          Positioned(
            right: 20,
            bottom: 20,
            child: Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
            ),
          ),
          // 内容
          Padding(
            padding: const EdgeInsets.all(20),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        '惊喜补贴',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              '立即查看 >',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                // 右侧装饰图标
                const Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.card_giftcard, color: Colors.white, size: 32),
                    SizedBox(height: 8),
                    Icon(Icons.monetization_on, color: Colors.white, size: 24),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// 构建主要标签页
  Widget _buildMainTabs() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: TabBar(
        controller: _mainTabController,
        indicator: BoxDecoration(
          color: Colors.blue.withOpacity(0.1),
          borderRadius: BorderRadius.circular(6),
        ),
        indicatorPadding: const EdgeInsets.all(4),
        labelColor: Colors.blue,
        unselectedLabelColor: Colors.grey,
        labelStyle: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
        unselectedLabelStyle: const TextStyle(fontSize: 14),
        tabs: [
          Tab(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text('优惠券'),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: Colors.blue,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Text(
                    '1张',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const Tab(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text('红包'),
                SizedBox(height: 4),
                Text(
                  '查看',
                  style: TextStyle(fontSize: 10, color: Colors.grey),
                ),
              ],
            ),
          ),
          const Tab(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text('电子券'),
                SizedBox(height: 4),
                Text(
                  '提货',
                  style: TextStyle(fontSize: 10, color: Colors.grey),
                ),
              ],
            ),
          ),
          const Tab(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text('资格凭证'),
                SizedBox(height: 4),
                Text(
                  '查看',
                  style: TextStyle(fontSize: 10, color: Colors.grey),
                ),
              ],
            ),
          ),
          const Tab(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text('卡'),
                SizedBox(height: 4),
                Text(
                  '...',
                  style: TextStyle(fontSize: 10, color: Colors.grey),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// 构建优惠券子标签页
  Widget _buildCouponSubTabs() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Row(
          children: [
            _buildCouponSubTab('全部(1)', true),
            const SizedBox(width: 12),
            _buildCouponSubTab('满减券(0)', false),
            const SizedBox(width: 12),
            _buildCouponSubTab('跨店券(1)', false),
            const SizedBox(width: 12),
            _buildCouponSubTab('运费券(0)', false),
            const SizedBox(width: 12),
            _buildCouponSubTab('赠品', false),
          ],
        ),
      ),
    );
  }

  Widget _buildCouponSubTab(String text, bool isSelected) {
    return GestureDetector(
      onTap: () {
        if (isSelected) {
          // 显示筛选弹窗
          CouponFilterBottomSheet.show(
            context,
            initialFilter: _filter,
            onFilterChanged: (newFilter) {
              setState(() {
                _filter = newFilter;
              });
            },
          );
        } else {
          // 切换到对应的筛选条件
          CouponType? type;
          if (text.contains('满减券')) {
            type = CouponType.fullReduction;
          } else if (text.contains('跨店券')) {
            type = CouponType.crossStore;
          } else if (text.contains('运费券')) {
            type = CouponType.shipping;
          }
          
          setState(() {
            _filter = _filter.copyWith(type: type);
            _selectedCouponTabIndex = _getTabIndexFromText(text);
          });
        }
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? Colors.blue : Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected ? Colors.blue : Colors.grey[300]!,
            width: 1,
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              text,
              style: TextStyle(
                color: isSelected ? Colors.white : Colors.grey[600],
                fontSize: 12,
                fontWeight: FontWeight.w500,
              ),
            ),
            if (isSelected) ...[
              const SizedBox(width: 4),
              const Icon(Icons.keyboard_arrow_down, color: Colors.white, size: 16),
            ],
          ],
        ),
      ),
    );
  }

  /// 根据文本获取标签页索引
  int _getTabIndexFromText(String text) {
    if (text.contains('全部')) return 0;
    if (text.contains('满减券')) return 1;
    if (text.contains('跨店券')) return 2;
    if (text.contains('运费券')) return 3;
    if (text.contains('赠品')) return 4;
    return 0;
  }

  /// 构建内容区域
  Widget _buildContent() {
    switch (_selectedMainTabIndex) {
      case 0: // 优惠券
        return CouponListWidget(
          coupons: _coupons,
          filter: _filter,
        );
      case 1: // 红包
        return _buildEmptyState('暂无红包', Icons.card_giftcard);
      case 2: // 电子券
        return _buildEmptyState('暂无电子券', Icons.receipt_long);
      case 3: // 资格凭证
        return _buildEmptyState('暂无资格凭证', Icons.verified_user);
      case 4: // 卡
        return _buildEmptyState('暂无卡券', Icons.credit_card);
      default:
        return const SizedBox();
    }
  }

  /// 构建空状态
  Widget _buildEmptyState(String message, IconData icon) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            size: 64,
            color: Colors.grey[400],
          ),
          const SizedBox(height: 16),
          Text(
            message,
            style: TextStyle(
              fontSize: 16,
              color: Colors.grey[600],
            ),
          ),
        ],
      ),
    );
  }

  /// 构建底部链接
  Widget _buildBottomLink() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16),
      child: TextButton(
        onPressed: () {
          // TODO: 实现查看历史优惠券功能
        },
        child: const Text(
          '查看历史优惠券',
          style: TextStyle(
            color: Colors.grey,
            fontSize: 14,
          ),
        ),
      ),
    );
  }
}
