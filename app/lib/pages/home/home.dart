import 'package:flutter/material.dart';
import '../mine/message.dart';
import '../product/product_list.dart';
import '../category/category_products.dart';
import '../store/store.dart';

class Home extends StatefulWidget {
  const Home({super.key});

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  final ScrollController _scrollController = ScrollController();

  // 商品分类数据
  final List<Map<String, dynamic>> _categories = [
    {'name': '水果鲜花', 'icon': Icons.apple, 'color': Colors.red, 'tag': '秋月梨'},
    {'name': '蔬菜豆制品', 'icon': Icons.eco, 'color': Colors.green},
    {'name': '肉禽蛋品', 'icon': Icons.restaurant, 'color': Colors.orange},
    {'name': '海鲜水产', 'icon': Icons.water_drop, 'color': Colors.blue},
    {'name': '乳品烘焙', 'icon': Icons.cake, 'color': Colors.purple, 'tag': '鲜牛奶'},
    {'name': '粮油调味', 'icon': Icons.kitchen, 'color': Colors.brown},
    {
      'name': '餐饮熟食',
      'icon': Icons.local_dining,
      'color': Colors.deepOrange,
      'tag': '花花栗子',
    },
    {'name': '快手菜面点', 'icon': Icons.fastfood, 'color': Colors.amber},
    {'name': '酒水饮料', 'icon': Icons.local_bar, 'color': Colors.indigo},
    {'name': '休闲零食', 'icon': Icons.cookie, 'color': Colors.pink},
    {'name': '厨卫百货', 'icon': Icons.cleaning_services, 'color': Colors.teal},
    {'name': '生活服务', 'icon': Icons.home_repair_service, 'color': Colors.cyan},
    {'name': '月满中秋', 'icon': Icons.circle, 'color': Colors.orange},
    {'name': '火锅到家', 'icon': Icons.local_fire_department, 'color': Colors.red},
    {'name': '天天会员价', 'icon': Icons.star, 'color': Colors.yellow},
    {'name': '美妆', 'icon': Icons.face, 'color': Colors.pink},
  ];

  // 促销卡片数据
  final List<Map<String, dynamic>> _promoCards = [
    {'title': '满699减100', 'color': Colors.red, 'icon': Icons.card_giftcard},
    {'title': '月饼超值特惠', 'color': Colors.blue, 'icon': Icons.cake},
    {'title': '2件75折', 'color': Colors.orange, 'icon': Icons.local_offer},
    {'title': '买一送一', 'color': Colors.pink, 'icon': Icons.redeem},
  ];

  // 今日疯抢商品
  final List<Map<String, dynamic>> _flashSaleProducts = [
    {
      'name': 'ほろよい',
      'price': 11.25,
      'originalPrice': 39.9,
      'image': 'assets/images/product1.png',
    },
    {
      'name': 'Dole Light菠萝汁',
      'price': 16.0,
      'originalPrice': 39.9,
      'image': 'assets/images/product2.png',
    },
  ];

  // 特色区域商品
  final List<Map<String, dynamic>> _featuredProducts = [
    {
      'title': '尝新盒子',
      'subtitle': '解馋卤鸭舌',
      'price': 24.9,
      'image': 'assets/images/duck_tongue.png',
    },
    {
      'title': '健康生活',
      'subtitle': '低糖酥月饼',
      'price': 19.9,
      'image': 'assets/images/mooncake.png',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      body: SafeArea(
        child: SingleChildScrollView(
          controller: _scrollController,
          child: Column(
            children: [
              // 顶部状态栏和位置信息
              _buildTopBar(),
              // 搜索栏
              _buildSearchBar(),
              // 中秋节主题轮播图
              _buildMidAutumnBanner(),
              // 促销卡片
              _buildPromoCards(),
              // 商品分类网格
              _buildCategoryGrid(),
              // 今日疯抢区域
              _buildFlashSaleSection(),
              // 特色商品区域
              _buildFeaturedSection(),
              // 主商品展示区域
              _buildMainProductSection(),
              const SizedBox(height: 100), // 为底部导航栏留出空间
            ],
          ),
        ),
      ),
    );
  }

  /// 构建顶部状态栏和位置信息
  Widget _buildTopBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          // 时间显示
          const Text(
            '13:59',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Colors.black,
            ),
          ),
          const SizedBox(width: 8),
          const Icon(Icons.keyboard_arrow_up, size: 16, color: Colors.black),
          const Spacer(),
          // 店铺位置
          GestureDetector(
            onTap: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (context) => Store(
                    storeInfo: {
                      'name': '中和锦汇天府店',
                      'followers': '222.6万',
                      'category': '生鲜',
                      'rating': 4.9,
                    },
                  ),
                ),
              );
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
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

  /// 构建搜索框
  Widget _buildSearchBar() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Column(
        children: [
          // 位置信息
          Row(
            children: [
              const Icon(Icons.location_on, size: 16, color: Colors.grey),
              const SizedBox(width: 4),
              const Text(
                '碧桂园·沁云里',
                style: TextStyle(fontSize: 14, color: Colors.grey),
              ),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.orange[100],
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Text(
                  '中和锦汇天府店',
                  style: TextStyle(fontSize: 12, color: Colors.orange),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          // 搜索框
          Container(
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
            child: TextField(
              decoration: InputDecoration(
                hintText: '黄瓜',
                hintStyle: TextStyle(color: Colors.grey[400]),
                prefixIcon: const Icon(
                  Icons.qr_code_scanner,
                  color: Colors.grey,
                ),
                suffixIcon: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    IconButton(
                      icon: const Icon(Icons.qr_code, color: Colors.grey),
                      onPressed: () {},
                    ),
                    IconButton(
                      icon: const Icon(Icons.message, color: Colors.grey),
                      onPressed: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (context) => const Message(),
                          ),
                        );
                      },
                    ),
                    Container(
                      margin: const EdgeInsets.only(right: 8),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.orange,
                        borderRadius: BorderRadius.circular(15),
                      ),
                      child: const Text(
                        '搜索',
                        style: TextStyle(color: Colors.white, fontSize: 12),
                      ),
                    ),
                  ],
                ),
                border: InputBorder.none,
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
              ),
              onTap: () {
                ScaffoldMessenger.of(
                  context,
                ).showSnackBar(const SnackBar(content: Text('搜索功能开发中...')));
              },
            ),
          ),
        ],
      ),
    );
  }

  /// 构建中秋节主题轮播图
  Widget _buildMidAutumnBanner() {
    return Container(
      height: 180,
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFFFF8C00), Color(0xFFFFD700)],
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.orange.withValues(alpha: 0.3),
            blurRadius: 12,
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
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
            ),
          ),
          // 主要内容
          Padding(
            padding: const EdgeInsets.all(20),
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
                          color: Colors.red,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Text(
                          '中秋节',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        '好礼正当时',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        '中秋甄选礼 心意鲜一筹',
                        style: TextStyle(color: Colors.white, fontSize: 14),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          const Text(
                            '立即抢购',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const SizedBox(width: 4),
                          const Icon(
                            Icons.arrow_forward,
                            color: Colors.white,
                            size: 16,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                // 月饼图片占位
                Container(
                  width: 100,
                  height: 100,
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.cake, size: 50, color: Colors.white),
                ),
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
      height: 120,
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: _promoCards.length,
        itemBuilder: (context, index) {
          final card = _promoCards[index];
          return Container(
            width: 120,
            margin: const EdgeInsets.only(right: 12),
            decoration: BoxDecoration(
              color: card['color'].withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: card['color'].withValues(alpha: 0.3),
                width: 1,
              ),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(card['icon'], color: card['color'], size: 32),
                const SizedBox(height: 8),
                Text(
                  card['title'],
                  style: TextStyle(
                    color: card['color'],
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  /// 构建商品分类网格
  Widget _buildCategoryGrid() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 4,
          childAspectRatio: 0.85, // 增加高度比例，为文字标签留出更多空间
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
        ),
        itemCount: _categories.length,
        itemBuilder: (context, index) {
          final category = _categories[index];
          return GestureDetector(
            onTap: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (context) => CategoryProducts(
                    categoryName: category['name'],
                    categoryIcon: category['icon'].toString(),
                  ),
                ),
              );
            },
            child: Container(
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
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Stack(
                    children: [
                      Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: category['color'].withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Icon(
                          category['icon'],
                          color: category['color'],
                          size: 24,
                        ),
                      ),
                      if (category['tag'] != null)
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
                              category['tag'],
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
                  const SizedBox(height: 6), // 增加间距
                  Expanded(
                    // 使用Expanded确保文字有足够空间
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 2),
                      child: Text(
                        category['name'],
                        style: const TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w500,
                        ),
                        textAlign: TextAlign.center,
                        maxLines: 2, // 允许最多2行文字
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  /// 构建今日疯抢区域
  Widget _buildFlashSaleSection() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.red,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Text(
                  '今日疯抢',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: Colors.red[100],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Text(
                  '1元秒杀',
                  style: TextStyle(
                    color: Colors.red,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const Spacer(),
              const Text(
                '历史低价别错过',
                style: TextStyle(fontSize: 12, color: Colors.grey),
              ),
            ],
          ),
          const SizedBox(height: 12),
          SizedBox(
            height: 120,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: _flashSaleProducts.length,
              itemBuilder: (context, index) {
                final product = _flashSaleProducts[index];
                return Container(
                  width: 100,
                  margin: const EdgeInsets.only(right: 12),
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
                      Expanded(
                        child: Container(
                          width: double.infinity,
                          decoration: BoxDecoration(
                            color: Colors.grey[200],
                            borderRadius: const BorderRadius.only(
                              topLeft: Radius.circular(12),
                              topRight: Radius.circular(12),
                            ),
                          ),
                          child: const Icon(Icons.image, color: Colors.grey),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(8),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              product['name'],
                              style: const TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.w500,
                              ),
                              maxLines: 2, // 允许最多2行
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '¥${product['price']}',
                              style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: Colors.red,
                              ),
                            ),
                            if (product['originalPrice'] != null)
                              Text(
                                '¥${product['originalPrice']}',
                                style: TextStyle(
                                  fontSize: 8,
                                  color: Colors.grey[500],
                                  decoration: TextDecoration.lineThrough,
                                ),
                              ),
                          ],
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  /// 构建特色商品区域
  Widget _buildFeaturedSection() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          Expanded(child: _buildFeaturedCard(_featuredProducts[0])),
          const SizedBox(width: 12),
          Expanded(child: _buildFeaturedCard(_featuredProducts[1])),
        ],
      ),
    );
  }

  Widget _buildFeaturedCard(Map<String, dynamic> product) {
    return Container(
      height: 120,
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
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              product['title'],
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 4),
            Text(
              product['subtitle'],
              style: TextStyle(fontSize: 12, color: Colors.grey[600]),
            ),
            const Spacer(),
            Row(
              children: [
                Expanded(
                  child: Container(
                    height: 40,
                    decoration: BoxDecoration(
                      color: Colors.grey[200],
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Icon(Icons.image, color: Colors.grey),
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  '¥${product['price']}',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.red,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  /// 构建主商品展示区域
  Widget _buildMainProductSection() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            '精选商品',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              childAspectRatio: 0.75, // 降低比例，为文字内容留出更多空间
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
            ),
            itemCount: 4, // 显示4个商品
            itemBuilder: (context, index) {
              return _buildProductCard({
                'name': '精选商品 ${index + 1}',
                'price': 29.9 + index * 10,
                'originalPrice': 59.9 + index * 20,
                'image': 'assets/images/product${index + 1}.png',
              });
            },
          ),
        ],
      ),
    );
  }

  Widget _buildProductCard(Map<String, dynamic> product) {
    return GestureDetector(
      onTap: () {
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (context) => ProductList(
              category: product['category'] ?? '全部',
              searchKeyword: product['name'] ?? '',
            ),
          ),
        );
      },
      child: Container(
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
            Expanded(
              child: Container(
                width: double.infinity,
                decoration: BoxDecoration(
                  color: Colors.grey[200],
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(12),
                    topRight: Radius.circular(12),
                  ),
                ),
                child: const Icon(Icons.image, size: 40, color: Colors.grey),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min, // 使用最小空间
                children: [
                  Flexible(
                    fit: FlexFit.loose,
                    child: Text(
                      product['name'],
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Text(
                        '¥${product['price']}',
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.red,
                        ),
                      ),
                      const SizedBox(width: 6),
                      Expanded(
                        // 确保原价文字不会溢出
                        child: Text(
                          '¥${product['originalPrice']}',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[500],
                            decoration: TextDecoration.lineThrough,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
