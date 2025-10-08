import 'package:flutter/material.dart';

class StoreDetail extends StatefulWidget {
  final Map<String, dynamic> storeInfo;

  const StoreDetail({super.key, required this.storeInfo});

  @override
  State<StoreDetail> createState() => _StoreDetailState();
}

class _StoreDetailState extends State<StoreDetail> {
  String _selectedCategory = '本店招牌';
  int _cartItemCount = 0;
  double _cartTotal = 0.0;

  // 商品分类数据
  final List<Map<String, dynamic>> _categories = [
    {'name': '本店招牌', 'icon': Icons.thumb_up, 'color': Colors.red},
    {'name': '活动', 'icon': Icons.local_fire_department, 'color': Colors.red},
    {'name': '人气TOP', 'icon': Icons.trending_up, 'color': Colors.orange},
    {'name': '联名套餐', 'icon': Icons.local_fire_department, 'color': Colors.red},
    {'name': '新品上市', 'icon': Icons.new_releases, 'color': Colors.green},
    {'name': '两杯19.9起', 'icon': Icons.local_offer, 'color': Colors.blue},
    {'name': '生椰家族', 'icon': Icons.eco, 'color': Colors.green},
    {'name': '元气美式', 'icon': Icons.coffee, 'color': Colors.brown},
    {'name': '风味拿铁', 'icon': Icons.local_cafe, 'color': Colors.brown},
    {'name': '鲜萃奶茶', 'icon': Icons.local_drink, 'color': Colors.pink},
    {'name': '大师咖啡', 'icon': Icons.coffee_maker, 'color': Colors.brown},
  ];

  // 商品数据
  final List<Map<String, dynamic>> _products = [
    {
      'id': '1',
      'name': '阿克苏苹果拿铁',
      'description': '清甜上市',
      'sales': '已售70万+ 7万+回头客推荐',
      'recent': '近期10万+人已下单',
      'limit': '优惠限1件',
      'price': 10.9,
      'originalPrice': 35.0,
      'subsidy': 24.1,
      'image': 'https://via.placeholder.com/120x120',
      'category': '本店招牌',
    },
    {
      'id': '2',
      'name': '熊猫陨石拿铁',
      'description': '熊猫陨石拿铁 首创·正宗配方',
      'sales': '已售600万+ 80万+回头客推荐',
      'recent': '近期3万+人已下单',
      'price': 14.9,
      'originalPrice': 32.0,
      'subsidy': 17.1,
      'image': 'https://via.placeholder.com/120x120',
      'category': '本店招牌',
    },
    {
      'id': '3',
      'name': '小白巧拿铁',
      'description': 'luckin coffee × [品牌logo] 随机',
      'sales': '已售20万+ 2万+回头客推荐',
      'recent': '近期5万+人已下单',
      'limit': '优惠限1件',
      'price': 12.9,
      'originalPrice': 35.0,
      'subsidy': 22.1,
      'image': 'https://via.placeholder.com/120x120',
      'category': '本店招牌',
    },
    {
      'id': '4',
      'name': '羽衣轻体果蔬茶(超大杯)',
      'description': '健康轻体，清新果蔬',
      'sales': '已售50万+ 5万+回头客推荐',
      'recent': '近期2万+人已下单',
      'price': 18.9,
      'originalPrice': 28.0,
      'subsidy': 9.1,
      'image': 'https://via.placeholder.com/120x120',
      'category': '人气TOP',
    },
    {
      'id': '5',
      'name': '生椰拿铁',
      'description': '椰香浓郁，丝滑醇厚',
      'sales': '已售1000万+ 100万+回头客推荐',
      'recent': '近期20万+人已下单',
      'price': 15.9,
      'originalPrice': 25.0,
      'subsidy': 9.1,
      'image': 'https://via.placeholder.com/120x120',
      'category': '生椰家族',
    },
    {
      'id': '6',
      'name': '燕麦拿铁',
      'description': '燕麦香浓，健康选择',
      'sales': '已售300万+ 30万+回头客推荐',
      'recent': '近期8万+人已下单',
      'price': 16.9,
      'originalPrice': 26.0,
      'subsidy': 9.1,
      'image': 'https://via.placeholder.com/120x120',
      'category': '风味拿铁',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      body: Column(
        children: [
          // 顶部状态栏和导航
          _buildTopBar(),
          // 店铺信息区域
          _buildStoreInfo(),
          // 促销横幅
          _buildPromotionBanner(),
          // 主要内容区域
          Expanded(
            child: Row(
              children: [
                // 左侧分类列表
                _buildCategorySidebar(),
                // 右侧商品列表
                _buildProductList(),
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: _buildBottomCartBar(),
    );
  }

  /// 构建顶部状态栏和导航
  Widget _buildTopBar() {
    return Container(
      color: Colors.white,
      child: Column(
        children: [
          // 状态栏
          Container(
            height: 30,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: [
                const Text(
                  '13:17',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                const Spacer(),
                Row(
                  children: [
                    const Icon(Icons.signal_cellular_4_bar, size: 16),
                    const SizedBox(width: 4),
                    const Icon(Icons.wifi, size: 16),
                    const SizedBox(width: 4),
                    const Icon(Icons.battery_charging_full, size: 16),
                  ],
                ),
              ],
            ),
          ),
          // 导航栏
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Row(
              children: [
                IconButton(
                  onPressed: () => Navigator.pop(context),
                  icon: const Icon(Icons.arrow_back, color: Colors.black),
                ),
                Expanded(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      _buildDeliveryToggle('配送', true),
                      const SizedBox(width: 20),
                      _buildDeliveryToggle('自取', false),
                    ],
                  ),
                ),
                Row(
                  children: [
                    IconButton(
                      onPressed: () {},
                      icon: const Icon(Icons.search, color: Colors.grey),
                    ),
                    IconButton(
                      onPressed: () {},
                      icon: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          color: Colors.red,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: const Icon(Icons.local_offer, color: Colors.white, size: 16),
                      ),
                    ),
                    IconButton(
                      onPressed: () {},
                      icon: const Icon(Icons.star_border, color: Colors.grey),
                    ),
                    IconButton(
                      onPressed: () {},
                      icon: const Icon(Icons.chat_bubble_outline, color: Colors.grey),
                    ),
                    IconButton(
                      onPressed: () {},
                      icon: const Icon(Icons.more_vert, color: Colors.grey),
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

  /// 构建配送方式切换按钮
  Widget _buildDeliveryToggle(String text, bool isSelected) {
    return GestureDetector(
      onTap: () {
        // 配送方式切换逻辑
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('切换到${text}模式')),
        );
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? Colors.yellow[100] : Colors.transparent,
          borderRadius: BorderRadius.circular(20),
          border: isSelected
              ? Border.all(color: Colors.red, width: 2)
              : Border.all(color: Colors.grey[300]!, width: 1),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              text,
              style: TextStyle(
                color: isSelected ? Colors.red : Colors.grey[600],
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                fontSize: 14,
              ),
            ),
            if (text == '自取') ...[
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: Colors.red,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Text(
                  '快21分钟',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  /// 构建店铺信息区域
  Widget _buildStoreInfo() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 店铺名称和标签
          Row(
            children: [
              Expanded(
                child: Text(
                  '瑞幸咖啡(高新区华...)',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.red,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Text(
                  '香甜可口',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          // 店铺标签
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.yellow[100],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Text(
                  '外卖',
                  style: TextStyle(
                    color: Colors.orange,
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.yellow[100],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Text(
                  '品牌',
                  style: TextStyle(
                    color: Colors.orange,
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          // 店铺统计信息
          Row(
            children: [
              _buildStoreStat('评分', '4.7'),
              const SizedBox(width: 16),
              _buildStoreStat('已售', '1亿+'),
              const SizedBox(width: 16),
              _buildStoreStat('商家自送', '33分钟达'),
            ],
          ),
          const SizedBox(height: 16),
          // 配送/自取选择
          Row(
            children: [
              Expanded(
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  decoration: BoxDecoration(
                    color: Colors.yellow[100],
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.red, width: 1),
                  ),
                  child: const Center(
                    child: Text(
                      '配送',
                      style: TextStyle(
                        color: Colors.red,
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.grey[300]!, width: 1),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text(
                        '自取',
                        style: TextStyle(
                          color: Colors.grey,
                          fontSize: 16,
                        ),
                      ),
                      const SizedBox(width: 4),
                      const Icon(Icons.location_on, color: Colors.grey, size: 16),
                      const SizedBox(width: 4),
                      const Text(
                        '距您1.4km',
                        style: TextStyle(
                          color: Colors.grey,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          // 优惠信息
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.red[50],
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: Colors.red[200]!, width: 1),
            ),
            child: Row(
              children: [
                const Text(
                  '10元百亿补贴',
                  style: TextStyle(
                    color: Colors.red,
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
                const SizedBox(width: 16),
                _buildCouponTag('¥7 满8可用 领'),
                const SizedBox(width: 8),
                _buildCouponTag('¥5 满6可用 领'),
                const SizedBox(width: 8),
                const Text(
                  '先享后付',
                  style: TextStyle(
                    color: Colors.red,
                    fontSize: 12,
                  ),
                ),
                const Spacer(),
                const Text(
                  '更多优惠 >',
                  style: TextStyle(
                    color: Colors.red,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),
          // 温馨提示
          Text(
            '温馨提示,请适量点餐———',
            style: TextStyle(
              color: Colors.grey[500],
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }

  /// 构建店铺统计信息
  Widget _buildStoreStat(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(
            color: Colors.grey[600],
            fontSize: 12,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          value,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 14,
          ),
        ),
      ],
    );
  }

  /// 构建优惠券标签
  Widget _buildCouponTag(String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.red,
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(
        text,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 10,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  /// 构建促销横幅
  Widget _buildPromotionBanner() {
    return Container(
      margin: const EdgeInsets.all(16),
      height: 120,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF4A90E2), Color(0xFF7ED321)],
        ),
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.blue.withOpacity(0.3),
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
          // 主要内容
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Text(
                          '22节同庆 就喝杨枝甘露',
                          style: TextStyle(
                            color: Colors.blue,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        '生椰杨枝甘露',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const Text(
                        '新品上市!',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                ),
                // 产品图片占位
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.local_drink, size: 40, color: Colors.white),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// 构建左侧分类列表
  Widget _buildCategorySidebar() {
    return Container(
      width: 100,
      color: Colors.white,
      child: ListView.builder(
        itemCount: _categories.length,
        itemBuilder: (context, index) {
          final category = _categories[index];
          final isSelected = category['name'] == _selectedCategory;

          return GestureDetector(
            onTap: () {
              setState(() {
                _selectedCategory = category['name'] as String;
              });
            },
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
              decoration: BoxDecoration(
                color: isSelected ? Colors.red[50] : Colors.transparent,
                border: isSelected
                    ? const Border(
                        left: BorderSide(color: Colors.red, width: 3),
                      )
                    : null,
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    category['icon'] as IconData,
                    color: isSelected ? Colors.red : Colors.grey[600],
                    size: 20,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    category['name'] as String,
                    style: TextStyle(
                      color: isSelected ? Colors.red : Colors.grey[600],
                      fontSize: 10,
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                    ),
                    textAlign: TextAlign.center,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  /// 构建右侧商品列表
  Widget _buildProductList() {
    final filteredProducts = _products.where(
      (product) => product['category'] == _selectedCategory,
    ).toList();

    return Expanded(
      child: Container(
        color: Colors.grey[50],
        child: ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: filteredProducts.length,
          itemBuilder: (context, index) {
            final product = filteredProducts[index];
            return _buildProductCard(product);
          },
        ),
      ),
    );
  }

  /// 构建商品卡片
  Widget _buildProductCard(Map<String, dynamic> product) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
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
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 商品图片
            Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                color: Colors.grey[200],
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Center(
                child: Icon(Icons.local_drink, size: 40, color: Colors.grey),
              ),
            ),
            const SizedBox(width: 16),
            // 商品信息
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 商品名称
                  Text(
                    product['name'] as String,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  // 商品描述
                  if (product['description'] != null)
                    Text(
                      product['description'] as String,
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey[600],
                      ),
                    ),
                  const SizedBox(height: 8),
                  // 销售信息
                  Text(
                    product['sales'] as String,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[500],
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    product['recent'] as String,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[500],
                    ),
                  ),
                  const SizedBox(height: 8),
                  // 优惠限制
                  if (product['limit'] != null)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: Colors.orange[100],
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        product['limit'] as String,
                        style: TextStyle(
                          color: Colors.orange[700],
                          fontSize: 10,
                        ),
                      ),
                    ),
                  const SizedBox(height: 8),
                  // 价格信息
                  Row(
                    children: [
                      Text(
                        '¥${product['price'].toString()}',
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.red,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        '已补¥${product['subsidy'].toString()}',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[500],
                        ),
                      ),
                      const Spacer(),
                      // 加购按钮
                      GestureDetector(
                        onTap: () {
                          setState(() {
                            _cartItemCount++;
                            _cartTotal += product['price'] as double;
                          });
                        },
                        child: Container(
                          width: 32,
                          height: 32,
                          decoration: BoxDecoration(
                            color: Colors.red,
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: const Icon(
                            Icons.add,
                            color: Colors.white,
                            size: 20,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  // 原价
                  Text(
                    '¥${product['originalPrice'].toString()}',
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[500],
                      decoration: TextDecoration.lineThrough,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// 构建底部购物车栏
  Widget _buildBottomCartBar() {
    return Container(
      color: Colors.white,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // 店铺优惠横幅
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.red,
            ),
            child: Row(
              children: [
                Container(
                  width: 24,
                  height: 24,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.pets, color: Colors.red, size: 16),
                ),
                const SizedBox(width: 8),
                const Text(
                  '本店优惠 满8减7、满6减5、满10减7',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
          // 购物车栏
          Container(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                // 购物车图标
                Stack(
                  children: [
                    const Icon(Icons.shopping_cart, size: 32, color: Colors.grey),
                    if (_cartItemCount > 0)
                      Positioned(
                        right: 0,
                        top: 0,
                        child: Container(
                          width: 18,
                          height: 18,
                          decoration: BoxDecoration(
                            color: Colors.red,
                            borderRadius: BorderRadius.circular(9),
                          ),
                          child: Center(
                            child: Text(
                              _cartItemCount.toString(),
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                      ),
                  ],
                ),
                const SizedBox(width: 12),
                // 运费信息
                Text(
                  '运费¥1.5',
                  style: TextStyle(
                    color: Colors.grey[600],
                    fontSize: 14,
                  ),
                ),
                const Spacer(),
                // 起送按钮
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                  decoration: BoxDecoration(
                    color: _cartTotal >= 9.0 ? Colors.red : Colors.grey[300],
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    _cartTotal >= 9.0 ? '去结算' : '9元起送',
                    style: TextStyle(
                      color: _cartTotal >= 9.0 ? Colors.white : Colors.grey[600],
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
