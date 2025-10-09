import 'package:flutter/material.dart';

class Cart extends StatefulWidget {
  const Cart({super.key});

  @override
  State<Cart> createState() => _CartState();
}

class _CartState extends State<Cart> with TickerProviderStateMixin {
  int _selectedTabIndex = 0; // 0: 全部, 1: 我常买
  late TabController _tabController;

  // 购物车商品数据
  final List<Map<String, dynamic>> _cartItems = [
    {
      'id': 1,
      'name': '【0抗生素】盒马保洁无抗鲜鸡蛋30枚 1.59kg',
      'price': 17.9,
      'quantity': 1,
      'image': 'assets/images/eggs.png',
      'selected': true,
      'isFrequent': true,
      'tag': '中秋节',
    },
  ];

  // 换购商品数据
  final List<Map<String, dynamic>> _redemptionProducts = [
    {
      'name': '红罐饮料',
      'price': 19.9,
      'originalPrice': 29.9,
      'discount': '6.7折',
      'image': 'assets/images/red_can.png',
    },
    {
      'name': '茶饮料',
      'price': 13.8,
      'originalPrice': 16.8,
      'discount': '8.3折',
      'image': 'assets/images/tea.png',
    },
    {
      'name': '牛奶',
      'price': 27.5,
      'originalPrice': 39.9,
      'discount': '6.9折',
      'image': 'assets/images/milk.png',
    },
    {
      'name': '糕点',
      'price': 8.9,
      'originalPrice': 12.9,
      'discount': '7折',
      'image': 'assets/images/pastry.png',
    },
    {
      'name': '包子',
      'price': 6.9,
      'originalPrice': 9.9,
      'discount': '7折',
      'image': 'assets/images/baozi.png',
    },
  ];

  // 推荐商品数据
  final List<Map<String, dynamic>> _recommendedProducts = [
    {
      'name': '梅林 午餐肉罐头 198g',
      'price': 12.8,
      'image': 'assets/images/luncheon_meat.png',
      'weight': '净含量:198克',
    },
    {
      'name': '盒马工坊 鲜河粉 300g',
      'price': 8.9,
      'image': 'assets/images/noodles.png',
      'tag': '冷藏',
    },
  ];

  bool _selectAll = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      body: SafeArea(
        child: Column(
          children: [
            // 顶部状态栏和位置信息
            _buildTopBar(),
            // 主要内容区域
            Expanded(
              child: SingleChildScrollView(
                child: Column(
                  children: [
                    // 会员促销横幅
                    _buildMembershipBanner(),
                    // 配送信息
                    _buildDeliveryInfo(),
                    // 换购活动
                    _buildRedemptionBanner(),
                    // 商品列表
                    _buildCartContent(),
                    // 推荐商品
                    _buildRecommendedSection(),
                    const SizedBox(height: 100), // 为底部结算栏留出空间
                  ],
                ),
              ),
            ),
            // 底部结算栏
            _buildBottomCheckoutBar(),
          ],
        ),
      ),
    );
  }

  /// 构建顶部状态栏和位置信息
  Widget _buildTopBar() {
    return Column(
      children: [
        // 状态栏
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Row(
            children: [
              // 时间显示
              const Text(
                '14:20',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
              ),
              const Spacer(),
              // 店铺位置
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey.withValues(alpha: 0.2),
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
        ),
        // 位置和标签栏
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Row(
            children: [
              const Icon(Icons.location_on, size: 16, color: Colors.grey),
              const SizedBox(width: 4),
              const Text(
                '碧桂园·沁云里',
                style: TextStyle(fontSize: 14, color: Colors.grey),
              ),
              const Icon(
                Icons.keyboard_arrow_down,
                size: 16,
                color: Colors.grey,
              ),
              const Spacer(),
              // 标签切换
              Row(
                children: [
                  GestureDetector(
                    onTap: () {
                      setState(() {
                        _selectedTabIndex = 0;
                      });
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: _selectedTabIndex == 0
                            ? Colors.blue
                            : Colors.transparent,
                        borderRadius: BorderRadius.circular(15),
                      ),
                      child: Text(
                        '全部',
                        style: TextStyle(
                          color: _selectedTabIndex == 0
                              ? Colors.white
                              : Colors.grey,
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  GestureDetector(
                    onTap: () {
                      setState(() {
                        _selectedTabIndex = 1;
                      });
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: _selectedTabIndex == 1
                            ? Colors.blue
                            : Colors.transparent,
                        borderRadius: BorderRadius.circular(15),
                      ),
                      child: Text(
                        '我常买',
                        style: TextStyle(
                          color: _selectedTabIndex == 1
                              ? Colors.white
                              : Colors.grey,
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(width: 16),
              const Text(
                '管理',
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.blue,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  /// 构建会员促销横幅
  Widget _buildMembershipBanner() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.yellow[100],
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.yellow[300]!),
      ),
      child: Row(
        children: [
          const Icon(Icons.close, color: Colors.red, size: 20),
          const SizedBox(width: 8),
          const Text(
            '会员日88折, 0门槛免运费',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: Colors.black87,
            ),
          ),
          const Spacer(),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.blue,
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

  /// 构建配送信息
  Widget _buildDeliveryInfo() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withValues(alpha: 0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          const Icon(Icons.check_circle, color: Colors.blue, size: 20),
          const SizedBox(width: 8),
          const Text(
            '盒马鲜生',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: Colors.black87,
            ),
          ),
          const SizedBox(width: 16),
          const Icon(Icons.flash_on, color: Colors.orange, size: 20),
          const SizedBox(width: 8),
          const Text(
            '最快30分钟达',
            style: TextStyle(fontSize: 14, color: Colors.grey),
          ),
        ],
      ),
    );
  }

  /// 构建换购活动横幅
  Widget _buildRedemptionBanner() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withValues(alpha: 0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.red,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Text(
              '全场换购',
              style: TextStyle(
                color: Colors.white,
                fontSize: 12,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(width: 12),
          const Expanded(
            child: Text(
              '满49元享超值换购, 还差31.1元',
              style: TextStyle(fontSize: 14, color: Colors.black87),
            ),
          ),
          const Text(
            '去凑单 >',
            style: TextStyle(
              fontSize: 14,
              color: Colors.blue,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  /// 构建购物车内容
  Widget _buildCartContent() {
    return Column(
      children: [
        // 换购商品横向滚动
        _buildRedemptionProducts(),
        // 主购物车商品
        _buildMainCartItems(),
      ],
    );
  }

  /// 构建换购商品
  Widget _buildRedemptionProducts() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            '换购商品',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
          ),
          const SizedBox(height: 12),
          SizedBox(
            height: 120,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: _redemptionProducts.length,
              itemBuilder: (context, index) {
                final product = _redemptionProducts[index];
                return _buildRedemptionProductCard(product);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRedemptionProductCard(Map<String, dynamic> product) {
    return Container(
      width: 80,
      margin: const EdgeInsets.only(right: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withValues(alpha: 0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 商品图片
          Expanded(
            child: Container(
              width: double.infinity,
              decoration: BoxDecoration(
                color: Colors.grey[200],
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(8),
                  topRight: Radius.circular(8),
                ),
              ),
              child: const Icon(Icons.image, color: Colors.grey, size: 30),
            ),
          ),
          // 商品信息
          Padding(
            padding: const EdgeInsets.all(8),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  product['discount'],
                  style: const TextStyle(
                    fontSize: 10,
                    color: Colors.red,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  '¥${product['price']}',
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),
                Text(
                  '¥${product['originalPrice']}',
                  style: TextStyle(
                    fontSize: 10,
                    color: Colors.grey[500],
                    decoration: TextDecoration.lineThrough,
                  ),
                ),
                const SizedBox(height: 4),
                Container(
                  width: 20,
                  height: 20,
                  decoration: BoxDecoration(
                    color: Colors.blue,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(
                    Icons.shopping_cart,
                    color: Colors.white,
                    size: 12,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// 构建主购物车商品
  Widget _buildMainCartItems() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Column(
        children: _cartItems.map((item) => _buildMainCartItem(item)).toList(),
      ),
    );
  }

  Widget _buildMainCartItem(Map<String, dynamic> item) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withValues(alpha: 0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          // 选择框
          Icon(
            Icons.check_circle,
            color: item['selected'] ? Colors.blue : Colors.grey[300],
            size: 24,
          ),
          const SizedBox(width: 12),
          // 商品图片
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              color: Colors.grey[200],
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(Icons.image, color: Colors.grey, size: 30),
          ),
          const SizedBox(width: 12),
          // 商品信息
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item['name'],
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: Colors.black87,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                if (item['tag'] != null)
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 6,
                      vertical: 2,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.orange,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      item['tag'],
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                const SizedBox(height: 8),
                Text(
                  '¥${item['price']}/盒',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.red,
                  ),
                ),
              ],
            ),
          ),
          // 数量控制
          _buildQuantityControl(item),
        ],
      ),
    );
  }

  Widget _buildQuantityControl(Map<String, dynamic> item) {
    return Container(
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey[300]!),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          GestureDetector(
            onTap: () {
              setState(() {
                if (item['quantity'] > 1) {
                  item['quantity']--;
                }
              });
            },
            child: Container(
              width: 30,
              height: 30,
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(20),
                  bottomLeft: Radius.circular(20),
                ),
              ),
              child: const Icon(Icons.remove, size: 16, color: Colors.grey),
            ),
          ),
          Container(
            width: 40,
            height: 30,
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border.symmetric(
                vertical: BorderSide(color: Colors.grey[300]!),
              ),
            ),
            child: Center(
              child: Text(
                item['quantity'].toString(),
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ),
          GestureDetector(
            onTap: () {
              setState(() {
                item['quantity']++;
              });
            },
            child: Container(
              width: 30,
              height: 30,
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: const BorderRadius.only(
                  topRight: Radius.circular(20),
                  bottomRight: Radius.circular(20),
                ),
              ),
              child: const Icon(Icons.add, size: 16, color: Colors.grey),
            ),
          ),
        ],
      ),
    );
  }

  /// 构建推荐商品区域
  Widget _buildRecommendedSection() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Column(
        children: [
          // 推荐标题
          Row(
            children: [
              Expanded(child: Container(height: 1, color: Colors.grey[300])),
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 16),
                child: Text(
                  '为你推荐 · RECOMMEND',
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              Expanded(child: Container(height: 1, color: Colors.grey[300])),
            ],
          ),
          const SizedBox(height: 16),
          // 推荐商品
          Row(
            children: _recommendedProducts
                .map(
                  (product) =>
                      Expanded(child: _buildRecommendedProductCard(product)),
                )
                .toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildRecommendedProductCard(Map<String, dynamic> product) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 4),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withValues(alpha: 0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 商品图片
          Container(
            height: 80,
            width: double.infinity,
            decoration: BoxDecoration(
              color: Colors.grey[200],
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(Icons.image, color: Colors.grey, size: 40),
          ),
          const SizedBox(height: 8),
          // 商品信息
          Text(
            product['name'],
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: Colors.black87,
            ),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
          if (product['weight'] != null) ...[
            const SizedBox(height: 4),
            Text(
              product['weight'],
              style: TextStyle(fontSize: 10, color: Colors.grey[600]),
            ),
          ],
          if (product['tag'] != null) ...[
            const SizedBox(height: 4),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
              decoration: BoxDecoration(
                color: Colors.blue,
                borderRadius: BorderRadius.circular(4),
              ),
              child: Text(
                product['tag'],
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 8,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
          const SizedBox(height: 8),
          Text(
            '¥${product['price']}',
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: Colors.red,
            ),
          ),
        ],
      ),
    );
  }

  /// 构建底部结算栏
  Widget _buildBottomCheckoutBar() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withValues(alpha: 0.2),
            blurRadius: 8,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: Column(
        children: [
          // 凑单助手
          Row(
            children: [
              const Text(
                '凑单助手',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: Colors.black87,
                ),
              ),
              const SizedBox(width: 8),
              const Text(
                '再买31.1元, 即可免盒马鲜生6元运费',
                style: TextStyle(fontSize: 12, color: Colors.grey),
              ),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: Colors.red[100],
                  borderRadius: BorderRadius.circular(15),
                ),
                child: const Text(
                  '去凑单',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.red,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          // 结算栏
          Row(
            children: [
              // 全选
              Row(
                children: [
                  Icon(
                    Icons.check_circle,
                    color: _selectAll ? Colors.blue : Colors.grey[300],
                    size: 20,
                  ),
                  const SizedBox(width: 8),
                  const Text(
                    '全选',
                    style: TextStyle(fontSize: 14, color: Colors.black87),
                  ),
                ],
              ),
              const Spacer(),
              // 合计
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  const Text(
                    '合计: ¥23.9',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.red,
                    ),
                  ),
                  const Text(
                    '明细 ^',
                    style: TextStyle(fontSize: 12, color: Colors.grey),
                  ),
                  const Text(
                    '含运费 ¥6',
                    style: TextStyle(fontSize: 12, color: Colors.grey),
                  ),
                ],
              ),
              const SizedBox(width: 16),
              // 结算按钮
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 12,
                ),
                decoration: BoxDecoration(
                  color: Colors.blue,
                  borderRadius: BorderRadius.circular(25),
                ),
                child: const Text(
                  '结算',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
