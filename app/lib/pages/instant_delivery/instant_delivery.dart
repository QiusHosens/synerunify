import 'package:flutter/material.dart';
import '../product/product_detail.dart';

class InstantDelivery extends StatefulWidget {
  const InstantDelivery({super.key});

  @override
  State<InstantDelivery> createState() => _InstantDeliveryState();
}

class _InstantDeliveryState extends State<InstantDelivery> {
  final ScrollController _scrollController = ScrollController();

  // 模拟秒送数据
  final List<Map<String, dynamic>> _serviceCategories = [];
  final List<Map<String, dynamic>> _promotions = [];
  final List<Map<String, dynamic>> _featuredProducts = [];
  final List<Map<String, dynamic>> _stores = [];

  @override
  void initState() {
    super.initState();
    _loadInstantDeliveryData();
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  /// 加载秒送数据
  void _loadInstantDeliveryData() {
    _loadServiceCategories();
    _loadPromotions();
    _loadFeaturedProducts();
    _loadStores();
  }

  /// 加载服务分类
  void _loadServiceCategories() {
    _serviceCategories.addAll([
      {
        'id': '1',
        'name': '自营秒送',
        'icon': Icons.local_shipping,
        'color': Colors.red,
        'tag': '立减100',
        'description': '自营商品快速配送',
      },
      {
        'id': '2',
        'name': '外卖',
        'icon': Icons.restaurant,
        'color': Colors.orange,
        'tag': null,
        'description': '美食外卖配送',
      },
      {
        'id': '3',
        'name': '超市',
        'icon': Icons.store,
        'color': Colors.blue,
        'tag': '24h',
        'description': '24小时超市服务',
      },
      {
        'id': '4',
        'name': '咖啡奶茶',
        'icon': Icons.local_cafe,
        'color': Colors.brown,
        'tag': null,
        'description': '饮品快速配送',
      },
      {
        'id': '5',
        'name': '买药',
        'icon': Icons.medication,
        'color': Colors.green,
        'tag': '感冒灵',
        'description': '药品快速配送',
      },
      {
        'id': '6',
        'name': '酒店',
        'icon': Icons.hotel,
        'color': Colors.purple,
        'tag': '立减10',
        'description': '酒店预订服务',
      },
      {
        'id': '7',
        'name': '团购',
        'icon': Icons.group_work,
        'color': Colors.amber,
        'tag': '团购',
        'description': '团购优惠活动',
      },
      {
        'id': '8',
        'name': '蔬菜水果',
        'icon': Icons.local_florist,
        'color': Colors.lightGreen,
        'tag': null,
        'description': '生鲜果蔬配送',
      },
      {
        'id': '9',
        'name': '数码家电',
        'icon': Icons.devices,
        'color': Colors.grey,
        'tag': null,
        'description': '数码家电配送',
      },
      {
        'id': '10',
        'name': '鲜花',
        'icon': Icons.eco,
        'color': Colors.pink,
        'tag': null,
        'description': '鲜花快速配送',
      },
    ]);
  }

  /// 加载促销活动
  void _loadPromotions() {
    _promotions.addAll([
      {'id': '1', 'title': '抢95折 品牌饭卡', 'discount': '8折', 'color': Colors.red},
      {
        'id': '2',
        'title': '10元 每日赚钱',
        'discount': '10元',
        'color': Colors.green,
      },
      {'id': '3', 'title': '场地合作 七鲜小厨', 'discount': null, 'color': Colors.blue},
    ]);
  }

  /// 加载精选商品
  void _loadFeaturedProducts() {
    _featuredProducts.addAll([
      {
        'id': '1',
        'name': '瑞幸咖啡 双杯 柚C美式',
        'price': 15.9,
        'originalPrice': 48.1,
        'image': 'https://via.placeholder.com/150x150',
        'tag': '百补免运费',
        'brand': 'Luckin Coffee',
      },
      {
        'id': '2',
        'name': '袁记云饺 【袁记热销】',
        'price': 12.3,
        'originalPrice': 15.6,
        'image': 'https://via.placeholder.com/150x150',
        'tag': '百补免运费',
        'brand': '袁记云饺',
      },
      {
        'id': '3',
        'name': '粥传 招牌皮蛋瘦肉',
        'price': 9.9,
        'originalPrice': 8.0,
        'image': 'https://via.placeholder.com/150x150',
        'tag': '百补免运费',
        'brand': '粥传',
      },
      {
        'id': '4',
        'name': '蜀乡大包 【超值套餐】',
        'price': 12.3,
        'originalPrice': 9.7,
        'image': 'https://via.placeholder.com/150x150',
        'tag': '百补免运费',
        'brand': '蜀乡大包',
      },
    ]);
  }

  /// 加载商家数据
  void _loadStores() {
    _stores.addAll([
      {
        'id': '1',
        'name': '瑞幸咖啡(成都芯谷店)',
        'brand': '品牌',
        'rating': 4.9,
        'sales': '该品牌已售1亿+',
        'distance': '1.3km',
        'deliveryTime': '29分钟达',
        'minOrder': 9.0,
        'deliveryFee': 0.5,
        'tags': ['30日回头客280人', '发票', '食安险', '6减5', '领券'],
        'coupon': {'title': '百亿餐补券 ¥10 满15可用', 'action': '去使用'},
        'products': [
          {
            'name': '小黄油拿铁冰',
            'price': 12.9,
            'originalPrice': 35.0,
            'tag': '减3元运费',
          },
          {
            'name': '葡萄柠檬茶',
            'price': 12.9,
            'originalPrice': 35.0,
            'tag': '减3元运费',
          },
          {
            'name': '羽衣轻体果蔬',
            'price': 10.9,
            'originalPrice': 32.0,
            'tag': '减3元运费',
          },
          {'name': '茉莉花', 'price': 14.9, 'originalPrice': 32.0, 'tag': '减3元运费'},
        ],
      },
      {
        'id': '2',
        'name': '粥传(香楠国际店)',
        'brand': null,
        'rating': 4.6,
        'sales': '该品牌已售30万+',
        'distance': '2.5km',
        'deliveryTime': '39分钟达',
        'minOrder': 15.0,
        'deliveryFee': 0.0,
        'special': '东升街道土豆丝榜第3名>',
        'tags': ['10年品牌', '跨天预订', '新客减2元', '30日回头客134人', '发票'],
        'coupon': {'title': '百补好运券 ¥19 满25可用', 'action': '去使用'},
        'products': [
          {'name': '招牌:皮蛋瘦', 'finalPrice': 4.8},
          {
            'name': '招牌皮蛋瘦肉',
            'price': 9.9,
            'originalPrice': 17.9,
            'discount': '5.6折',
            'tag': '百补免运费',
          },
          {'name': '酱肉小笼包3', 'finalPrice': 1.9},
        ],
      },
      {
        'id': '3',
        'name': '东北劲水饺馆(三里坝店)',
        'brand': null,
        'rating': 4.7,
        'sales': '该品牌已售90万+',
        'distance': '3.5km',
        'deliveryTime': '42分钟达',
        'tags': ['京东秒送', '国补'],
      },
    ]);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      body: CustomScrollView(
        controller: _scrollController,
        slivers: [
          // 自定义AppBar
          _buildSliverAppBar(),
          // 搜索和位置栏
          _buildSearchBar(),
          // 服务分类
          _buildServiceCategories(),
          // 促销横幅
          _buildPromotions(),
          // 百亿补贴商品
          _buildFeaturedProducts(),
          // 政府消费券横幅
          _buildGovernmentBanner(),
          // 商家列表
          _buildStoreList(),
        ],
      ),
    );
  }

  /// 构建SliverAppBar
  Widget _buildSliverAppBar() {
    return SliverAppBar(
      expandedHeight: 100,
      floating: false,
      pinned: true,
      backgroundColor: Colors.white,
      foregroundColor: Colors.black,
      elevation: 0,
      flexibleSpace: FlexibleSpaceBar(
        background: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [Colors.red, Colors.redAccent],
            ),
          ),
          child: Column(
            children: [
              const SizedBox(height: 30),
              // 顶部导航
              _buildTopNavigation(),
            ],
          ),
        ),
      ),
    );
  }

  /// 构建顶部导航
  Widget _buildTopNavigation() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20),
      child: Row(
        children: [
          Expanded(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  const Text(
                    '特价',
                    style: TextStyle(color: Colors.white, fontSize: 14),
                  ),
                  const Text(
                    '首页',
                    style: TextStyle(color: Colors.white, fontSize: 14),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(15),
                    ),
                    child: const Text(
                      '秒送',
                      style: TextStyle(
                        color: Colors.red,
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const Text(
                    '外卖',
                    style: TextStyle(color: Colors.white, fontSize: 14),
                  ),
                  const Text(
                    '新品',
                    style: TextStyle(color: Colors.white, fontSize: 14),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(width: 12),
          // 促销标签
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: const [
                Icon(Icons.pets, color: Colors.red, size: 16),
                SizedBox(width: 4),
                Text(
                  'SALE',
                  style: TextStyle(
                    color: Colors.red,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(width: 4),
                Text(
                  '采销精选 低至5折',
                  style: TextStyle(color: Colors.black, fontSize: 10),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// 构建搜索栏
  Widget _buildSearchBar() {
    return SliverToBoxAdapter(
      child: Container(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // 搜索框
            Container(
              height: 50,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(25),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withValues(alpha: 0.1),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Row(
                children: [
                  const SizedBox(width: 16),
                  const Icon(Icons.search, color: Colors.grey),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Text(
                      '早餐 外卖',
                      style: TextStyle(fontSize: 16, color: Colors.grey),
                    ),
                  ),
                  Container(
                    margin: const EdgeInsets.only(right: 8),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 8,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.red,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Text(
                      '搜索',
                      style: TextStyle(color: Colors.white, fontSize: 14),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            // 位置信息
            Row(
              children: [
                const Icon(Icons.location_on, color: Colors.grey, size: 16),
                const SizedBox(width: 8),
                const Text('蓝润城—2期-6栋~'),
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.grey[100],
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Text('权益', style: TextStyle(fontSize: 12)),
                ),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.grey[100],
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Text('订单', style: TextStyle(fontSize: 12)),
                ),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.grey[100],
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Text('...', style: TextStyle(fontSize: 12)),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  /// 构建服务分类
  Widget _buildServiceCategories() {
    return SliverToBoxAdapter(
      child: Container(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 5,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                childAspectRatio: 0.75, // 降低比例，为文字标签留出更多空间
              ),
              itemCount: _serviceCategories.length,
              itemBuilder: (context, index) {
                final category = _serviceCategories[index];
                return _buildServiceCategoryItem(category);
              },
            ),
            const SizedBox(height: 16),
            // 更多分类指示器
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: Colors.red,
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
                const SizedBox(width: 8),
                Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: Colors.red,
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  /// 构建服务分类项
  Widget _buildServiceCategoryItem(Map<String, dynamic> category) {
    return GestureDetector(
      onTap: () {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('进入${category['name']}')));
      },
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 50, // 减小图标尺寸
            height: 50,
            decoration: BoxDecoration(
              color: category['color'].withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(25),
            ),
            child: Stack(
              children: [
                Center(
                  child: Icon(
                    category['icon'] as IconData,
                    color: category['color'] as Color,
                    size: 24, // 减小图标尺寸
                  ),
                ),
                if (category['tag'] != null)
                  Positioned(
                    top: 0,
                    right: 0,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 3,
                        vertical: 1,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.red,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        category['tag'] as String,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 7,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(height: 6), // 减少间距
          Expanded(
            // 使用Expanded确保文字有足够空间
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 2),
              child: Text(
                category['name'] as String,
                style: const TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.w500,
                ),
                textAlign: TextAlign.center,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// 构建促销横幅
  Widget _buildPromotions() {
    return SliverToBoxAdapter(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Row(
          children: _promotions
              .map(
                (promotion) => Expanded(
                  child: Container(
                    margin: const EdgeInsets.symmetric(horizontal: 4),
                    padding: const EdgeInsets.all(12),
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
                        Text(
                          promotion['title'] as String,
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 4),
                        if (promotion['discount'] != null)
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 6,
                              vertical: 2,
                            ),
                            decoration: BoxDecoration(
                              color: promotion['color'],
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              promotion['discount'] as String,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                ),
              )
              .toList(),
        ),
      ),
    );
  }

  /// 构建精选商品
  Widget _buildFeaturedProducts() {
    return SliverToBoxAdapter(
      child: Container(
        margin: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: const [
                Text(
                  '百亿补贴 甄选爆品',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                Spacer(),
                Text('更多>', style: TextStyle(fontSize: 14, color: Colors.grey)),
              ],
            ),
            const SizedBox(height: 12),
            SizedBox(
              height: 200,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: _featuredProducts.length,
                itemBuilder: (context, index) {
                  final product = _featuredProducts[index];
                  return _buildFeaturedProductCard(product);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// 构建精选商品卡片
  Widget _buildFeaturedProductCard(Map<String, dynamic> product) {
    return GestureDetector(
      onTap: () {
        // Navigator.of(context).push(
        //   MaterialPageRoute(
        //     builder: (context) => ProductDetail(product: product),
        //   ),
        // );
      },
      child: Container(
        width: 150,
        margin: const EdgeInsets.only(right: 12),
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
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 商品图片
            Expanded(
              flex: 3,
              child: Container(
                width: double.infinity,
                decoration: BoxDecoration(
                  color: Colors.grey[200],
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(12),
                    topRight: Radius.circular(12),
                  ),
                ),
                child: Stack(
                  children: [
                    const Center(
                      child: Icon(Icons.image, size: 40, color: Colors.grey),
                    ),
                    Positioned(
                      top: 8,
                      left: 8,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 6,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.orange,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          product['tag'] as String,
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
              ),
            ),
            // 商品信息
            Expanded(
              flex: 2,
              child: Padding(
                padding: const EdgeInsets.all(8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Expanded(
                      // 使用Expanded确保商品名称有足够空间
                      child: Text(
                        product['name'] as String,
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Text(
                          '¥${product['price'].toString()}',
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            color: Colors.red,
                          ),
                        ),
                        const SizedBox(width: 4),
                        Expanded(
                          // 确保原价文字不会溢出
                          child: Text(
                            '¥${product['originalPrice'].toString()}',
                            style: TextStyle(
                              fontSize: 10,
                              color: Colors.grey[500],
                              decoration: TextDecoration.lineThrough,
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4), // 添加固定间距
                    Text(
                      product['brand'] as String,
                      style: TextStyle(fontSize: 10, color: Colors.grey[600]),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// 构建政府消费券横幅
  Widget _buildGovernmentBanner() {
    return SliverToBoxAdapter(
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Colors.orange[400]!, Colors.orange[600]!],
          ),
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.orange.withValues(alpha: 0.3),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text(
                    '京东外卖 | 成都国际美食嘉年华',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    '限量抢300元外卖消费券 武侯潮玩美食季',
                    style: TextStyle(fontSize: 12, color: Colors.white70),
                  ),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Column(
                children: [
                  Icon(Icons.home, color: Colors.white, size: 24),
                  SizedBox(height: 4),
                  Text(
                    '政府消费券\n300元',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// 构建商家列表
  Widget _buildStoreList() {
    return SliverList(
      delegate: SliverChildBuilderDelegate((context, index) {
        final store = _stores[index];
        return _buildStoreCard(store);
      }, childCount: _stores.length),
    );
  }

  /// 构建商家卡片
  Widget _buildStoreCard(Map<String, dynamic> store) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 商家头部信息
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                // 商家logo
                Container(
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(
                    color: Colors.grey[200],
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Center(
                    child: Icon(Icons.store, color: Colors.grey),
                  ),
                ),
                const SizedBox(width: 12),
                // 商家信息
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          if (store['brand'] != null)
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 6,
                                vertical: 2,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.blue,
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: const Text(
                                '品牌',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 10,
                                ),
                              ),
                            ),
                          if (store['brand'] != null) const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              store['name'] as String,
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Icon(Icons.star, size: 14, color: Colors.orange[300]),
                          const SizedBox(width: 4),
                          Text(
                            '${store['rating']}分',
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey[600],
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            store['sales'] as String,
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey[600],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Text(
                            '${store['distance']} ${store['deliveryTime']}',
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey[600],
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            '起送¥${store['minOrder'].toString()} 运费¥${store['deliveryFee'].toString()}',
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey[600],
                            ),
                          ),
                        ],
                      ),
                      if (store['special'] != null) ...[
                        const SizedBox(height: 4),
                        Text(
                          store['special'] as String,
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.blue[600],
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ],
            ),
          ),
          // 商家标签
          if (store['tags'] != null)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Wrap(
                spacing: 8,
                runSpacing: 4,
                children: (store['tags'] as List)
                    .map(
                      (tag) => Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 6,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.grey[100],
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          tag as String,
                          style: TextStyle(
                            fontSize: 10,
                            color: Colors.grey[600],
                          ),
                        ),
                      ),
                    )
                    .toList(),
              ),
            ),
          // 优惠券
          if (store['coupon'] != null)
            Container(
              margin: const EdgeInsets.all(16),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.orange[100]!, Colors.orange[50]!],
                ),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      store['coupon']['title'] as String,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.orange,
                      borderRadius: BorderRadius.circular(15),
                    ),
                    child: Text(
                      store['coupon']['action'] as String,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          // 商品列表
          if (store['products'] != null)
            SizedBox(
              height: 120,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: (store['products'] as List).length,
                itemBuilder: (context, index) {
                  final product = (store['products'] as List)[index];
                  return _buildStoreProductCard(product);
                },
              ),
            ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  /// 构建商家商品卡片
  Widget _buildStoreProductCard(Map<String, dynamic> product) {
    return Container(
      width: 100,
      margin: const EdgeInsets.only(right: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 商品图片
          Expanded(
            flex: 2,
            child: Container(
              width: double.infinity,
              decoration: BoxDecoration(
                color: Colors.grey[200],
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Center(
                child: Icon(Icons.image, size: 30, color: Colors.grey),
              ),
            ),
          ),
          // 商品信息
          Expanded(
            flex: 1,
            child: Padding(
              padding: const EdgeInsets.only(top: 4),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (product['tag'] != null)
                    Text(
                      product['tag'] as String,
                      style: TextStyle(fontSize: 8, color: Colors.orange[600]),
                    ),
                  Expanded(
                    // 使用Expanded确保商品名称有足够空间
                    child: Text(
                      product['name'] as String,
                      style: const TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w500,
                      ),
                      maxLines: 2, // 允许最多2行
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  if (product['price'] != null)
                    Row(
                      children: [
                        Text(
                          '¥${product['price'].toString()}',
                          style: const TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: Colors.red,
                          ),
                        ),
                        if (product['originalPrice'] != null) ...[
                          const SizedBox(width: 4),
                          Expanded(
                            // 确保原价文字不会溢出
                            child: Text(
                              '¥${product['originalPrice'].toString()}',
                              style: TextStyle(
                                fontSize: 8,
                                color: Colors.grey[500],
                                decoration: TextDecoration.lineThrough,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ],
                    )
                  else if (product['finalPrice'] != null)
                    Text(
                      '到手价 ¥${product['finalPrice'].toString()}',
                      style: const TextStyle(
                        fontSize: 10,
                        color: Colors.red,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                ],
              ),
            ),
          ),
          // 加购按钮
          Container(
            width: double.infinity,
            height: 24,
            decoration: BoxDecoration(
              color: Colors.red,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Center(
              child: Icon(Icons.add, color: Colors.white, size: 16),
            ),
          ),
        ],
      ),
    );
  }
}
