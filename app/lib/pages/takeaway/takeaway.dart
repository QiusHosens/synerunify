import 'package:flutter/material.dart';
import '../product/product_detail.dart';
import '../store/store_detail.dart';

class Takeaway extends StatefulWidget {
  const Takeaway({super.key});

  @override
  State<Takeaway> createState() => _TakeawayState();
}

class _TakeawayState extends State<Takeaway> {
  final ScrollController _scrollController = ScrollController();
  String _selectedCategory = '美食';
  String _selectedSort = '综合排序';

  // 模拟外卖数据
  final List<Map<String, dynamic>> _foodCategories = [];
  final List<Map<String, dynamic>> _filterOptions = [];
  final List<Map<String, dynamic>> _featuredItems = [];
  final List<Map<String, dynamic>> _restaurants = [];

  @override
  void initState() {
    super.initState();
    _loadTakeawayData();
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  /// 加载外卖数据
  void _loadTakeawayData() {
    _loadFoodCategories();
    _loadFilterOptions();
    _loadFeaturedItems();
    _loadRestaurants();
  }

  /// 加载美食分类
  void _loadFoodCategories() {
    _foodCategories.addAll([
      {
        'id': '1',
        'name': '美食',
        'icon': Icons.restaurant,
        'color': Colors.red,
        'isSelected': true,
      },
      {
        'id': '2',
        'name': '包子',
        'icon': Icons.cake,
        'color': Colors.orange,
        'isSelected': false,
      },
      {
        'id': '3',
        'name': '粥',
        'icon': Icons.local_dining,
        'color': Colors.brown,
        'isSelected': false,
      },
      {
        'id': '4',
        'name': '馄饨',
        'icon': Icons.lunch_dining,
        'color': Colors.green,
        'isSelected': false,
      },
      {
        'id': '5',
        'name': '肠粉',
        'icon': Icons.ramen_dining,
        'color': Colors.purple,
        'isSelected': false,
      },
      {
        'id': '6',
        'name': '豆浆',
        'icon': Icons.local_cafe,
        'color': Colors.blue,
        'isSelected': false,
      },
    ]);
  }

  /// 加载筛选选项
  void _loadFilterOptions() {
    _filterOptions.addAll([
      {'id': '1', 'name': '综合排序', 'icon': Icons.sort, 'isSelected': true},
      {
        'id': '2',
        'name': '品牌饭卡最高7折',
        'icon': Icons.card_giftcard,
        'isSelected': false,
      },
      {'id': '3', 'name': '百补新客券', 'icon': Icons.redeem, 'isSelected': false},
      {'id': '4', 'name': '跨天三', 'icon': Icons.more_horiz, 'isSelected': false},
    ]);
  }

  /// 加载精选商品
  void _loadFeaturedItems() {
    _featuredItems.addAll([
      {
        'id': '1',
        'name': '粥传 招牌皮蛋瘦肉',
        'price': 9.9,
        'originalPrice': 8.0,
        'image': 'https://via.placeholder.com/150x150',
        'tag': '百补免运费',
        'subsidy': '补8',
        'brand': '粥传',
      },
      {
        'id': '2',
        'name': '蜀乡大包 【超值套餐】',
        'price': 12.3,
        'originalPrice': 9.7,
        'image': 'https://via.placeholder.com/150x150',
        'tag': '百补免运费',
        'subsidy': '补9.7',
        'brand': '蜀乡大包',
      },
      {
        'id': '3',
        'name': '枫蓝咖啡 椰青美式 16oz',
        'price': 13.9,
        'originalPrice': 5.1,
        'image': 'https://via.placeholder.com/150x150',
        'tag': '百补免运费',
        'subsidy': '补5.1',
        'brand': '枫蓝咖啡',
      },
      {
        'id': '4',
        'name': '袁记云饺 【袁记热销】',
        'price': 16.9,
        'originalPrice': 19.0,
        'image': 'https://via.placeholder.com/150x150',
        'tag': '百补免运费',
        'subsidy': '补19',
        'brand': '袁记云饺',
      },
    ]);
  }

  /// 加载餐厅数据
  void _loadRestaurants() {
    _restaurants.addAll([
      {
        'id': '1',
        'name': '瑞幸咖啡(成都芯谷店)',
        'brand': '品牌',
        'rating': 4.9,
        'sales': '该品牌已售1亿+',
        'distance': '1.3km',
        'deliveryTime': '29分钟达',
        'minOrder': 9.0,
        'deliveryFee': 1.5,
        'deliveryType': '商家自送',
        'tags': ['30日回头客281人', '发票', '食安险', '6减5', '领券'],
        'coupon': {'title': '百亿餐补券 ¥10 满15可用', 'action': '去使用'},
        'products': [
          {
            'name': '标准美式',
            'finalPrice': 9.0,
            'tag': '减10元',
            'image': 'https://via.placeholder.com/80x80',
          },
          {
            'name': '多肉柠檬茶 茉',
            'finalPrice': 5.9,
            'tag': '减10元',
            'image': 'https://via.placeholder.com/80x80',
          },
          {
            'name': '荔枝乳酸菌冰',
            'finalPrice': 9.0,
            'tag': '减10元',
            'image': 'https://via.placeholder.com/80x80',
          },
          {
            'name': '小桑葚',
            'finalPrice': 9.2,
            'tag': '减10元',
            'image': 'https://via.placeholder.com/80x80',
          },
        ],
      },
      {
        'id': '2',
        'name': '粥传(香楠国际店)',
        'brand': null,
        'rating': 4.6,
        'sales': '该品牌已售30万+',
        'distance': '2.5km',
        'deliveryTime': '32分钟达',
        'minOrder': 15.0,
        'deliveryFee': 0.0,
        'deliveryType': '准时保+',
        'special': '东升街道红烧肉榜第3名',
        'tags': ['10年品牌', '跨天预订', '新客减2元', '30日回头客139人', '发票'],
        'coupon': {'title': '百补好运券 ¥19 满25可用', 'action': '去使用'},
        'products': [
          {
            'name': '招牌:皮蛋瘦',
            'finalPrice': 4.8,
            'image': 'https://via.placeholder.com/80x80',
          },
          {
            'name': '招牌皮蛋瘦肉',
            'price': 9.9,
            'originalPrice': 17.9,
            'discount': '5.6折',
            'tag': '百补免运费',
            'image': 'https://via.placeholder.com/80x80',
          },
          {
            'name': '酱肉小笼包3',
            'finalPrice': 1.9,
            'image': 'https://via.placeholder.com/80x80',
          },
          {
            'name': '清甜!',
            'finalPrice': 3.9,
            'image': 'https://via.placeholder.com/80x80',
          },
        ],
      },
      {
        'id': '3',
        'name': '李与白包子铺(东升地铁站)',
        'brand': '品牌',
        'rating': 4.6,
        'sales': '该品牌已售60万+',
        'distance': '3.8km',
        'deliveryTime': '35分钟达',
        'minOrder': 23.0,
        'deliveryFee': 0.7,
        'deliveryType': '京东秒送',
        'tags': ['堂食餐厅', '跨天预订', '新客减2元', '发票', '食安险'],
        'coupon': {'title': '百补好运券 ¥16 满17可用', 'action': '去使用'},
        'products': [
          {
            'name': '成都非遗酱肉',
            'price': 3.8,
            'tag': '招牌',
            'image': 'https://via.placeholder.com/80x80',
          },
          {
            'name': '青椒卤肉滚汁包',
            'price': 3.8,
            'image': 'https://via.placeholder.com/80x80',
          },
          {
            'name': '非遗酱肉包(2)',
            'price': 9.9,
            'originalPrice': 18.9,
            'tag': '减3元运费',
            'image': 'https://via.placeholder.com/80x80',
          },
          {
            'name': '多汁香',
            'price': 4.2,
            'image': 'https://via.placeholder.com/80x80',
          },
        ],
      },
      {
        'id': '4',
        'name': '三米粥铺(粥鬻·双中店)',
        'brand': '品牌',
        'rating': 4.7,
        'sales': '该品牌已售300万+',
        'distance': '4.3km',
        'deliveryTime': '51分钟达',
        'minOrder': 20.0,
        'deliveryFee': 0.0,
        'deliveryType': '京',
        'tags': ['即提', '跨天预订', '新客减2元', '30日回头客118人', '发票'],
        'coupon': {'title': '百补好运券 ¥16 满17可用', 'action': '去使用'},
        'products': [
          {
            'name': '精选套餐',
            'tag': '减10',
            'image': 'https://via.placeholder.com/80x80',
          },
          {
            'name': '精选套餐',
            'tag': '减10元',
            'subtag': '百补免运费',
            'image': 'https://via.placeholder.com/80x80',
          },
          {
            'name': '精选套餐',
            'tag': '减12元',
            'subtag': '百补免运费',
            'image': 'https://via.placeholder.com/80x80',
          },
          {
            'name': '精选套餐',
            'discount': '6.9折',
            'subtag': '百补免',
            'image': 'https://via.placeholder.com/80x80',
          },
        ],
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
          // 搜索栏
          _buildSearchBar(),
          // 服务筛选
          _buildServiceFilters(),
          // 美食分类
          _buildFoodCategories(),
          // 百亿补贴商品
          _buildFeaturedItems(),
          // 秋香季横幅
          _buildAutumnBanner(),
          // 筛选选项
          _buildFilterOptions(),
          // 餐厅列表
          _buildRestaurantList(),
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
              colors: [Colors.white, Colors.grey],
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
          // 返回按钮
          IconButton(
            onPressed: () {
              Navigator.of(context).pop();
            },
            icon: const Icon(Icons.arrow_back, color: Colors.black),
          ),
          // 标题和位置
          Expanded(
            child: Row(
              children: const [
                Text(
                  '外卖',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                ),
                SizedBox(width: 8),
                Icon(Icons.location_on, color: Colors.grey, size: 16),
                SizedBox(width: 4),
                Text(
                  '蓝润城—2期-6栋',
                  style: TextStyle(fontSize: 14, color: Colors.grey),
                ),
              ],
            ),
          ),
          // 更多选项
          IconButton(
            onPressed: () {
              ScaffoldMessenger.of(
                context,
              ).showSnackBar(const SnackBar(content: Text('更多功能开发中...')));
            },
            icon: const Icon(Icons.more_vert, color: Colors.black),
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
        child: Container(
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
                  '包子',
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
      ),
    );
  }

  /// 构建服务筛选
  Widget _buildServiceFilters() {
    return SliverToBoxAdapter(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        child: Row(
          children: [
            _buildFilterChip('JD 京东外卖', true, Icons.check),
            const SizedBox(width: 8),
            _buildFilterChip('品质堂食', false, Icons.check),
            const SizedBox(width: 8),
            _buildFilterChip('热菜现炒', false, Icons.favorite),
          ],
        ),
      ),
    );
  }

  /// 构建筛选芯片
  Widget _buildFilterChip(String label, bool isSelected, IconData icon) {
    return GestureDetector(
      onTap: () {
        setState(() {
          // 这里可以添加筛选逻辑
        });
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? Colors.red : Colors.grey[100],
          borderRadius: BorderRadius.circular(20),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 16,
              color: isSelected ? Colors.white : Colors.grey,
            ),
            const SizedBox(width: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                color: isSelected ? Colors.white : Colors.grey[600],
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// 构建美食分类
  Widget _buildFoodCategories() {
    return SliverToBoxAdapter(
      child: Container(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(
              height: 80,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: _foodCategories.length,
                itemBuilder: (context, index) {
                  final category = _foodCategories[index];
                  return _buildFoodCategoryItem(category);
                },
              ),
            ),
            const SizedBox(height: 8),
            // 滚动指示器
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

  /// 构建美食分类项
  Widget _buildFoodCategoryItem(Map<String, dynamic> category) {
    final isSelected = category['isSelected'] as bool;
    return GestureDetector(
      onTap: () {
        setState(() {
          for (var cat in _foodCategories) {
            cat['isSelected'] = false;
          }
          category['isSelected'] = true;
          _selectedCategory = category['name'] as String;
        });
      },
      child: Container(
        width: 80,
        margin: const EdgeInsets.only(right: 16),
        child: Column(
          children: [
            Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                color: isSelected
                    ? (category['color'] as Color).withValues(alpha: 0.2)
                    : Colors.grey[100],
                borderRadius: BorderRadius.circular(25),
                border: isSelected
                    ? Border.all(color: category['color'] as Color, width: 2)
                    : null,
              ),
              child: Center(
                child: Icon(
                  category['icon'] as IconData,
                  color: category['color'] as Color,
                  size: 24,
                ),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              category['name'] as String,
              style: TextStyle(
                fontSize: 12,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                color: isSelected
                    ? category['color'] as Color
                    : Colors.grey[600],
              ),
              textAlign: TextAlign.center,
            ),
            if (isSelected)
              Container(
                margin: const EdgeInsets.only(top: 2),
                width: 20,
                height: 2,
                decoration: BoxDecoration(
                  color: category['color'] as Color,
                  borderRadius: BorderRadius.circular(1),
                ),
              ),
          ],
        ),
      ),
    );
  }

  /// 构建精选商品
  Widget _buildFeaturedItems() {
    return SliverToBoxAdapter(
      child: Container(
        margin: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Text(
                  '百亿补贴 甄选爆品 - $_selectedCategory',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Spacer(),
                Text(
                  '查看更多>',
                  style: TextStyle(fontSize: 14, color: Colors.grey),
                ),
              ],
            ),
            const SizedBox(height: 12),
            SizedBox(
              height: 200,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: _featuredItems.length,
                itemBuilder: (context, index) {
                  final item = _featuredItems[index];
                  return _buildFeaturedItemCard(item);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// 构建精选商品卡片
  Widget _buildFeaturedItemCard(Map<String, dynamic> item) {
    return GestureDetector(
      onTap: () {
        // Navigator.of(context).push(
        //   MaterialPageRoute(builder: (context) => ProductDetail(product: item)),
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
                          item['tag'] as String,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 8,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                    Positioned(
                      bottom: 8,
                      right: 8,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 6,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.red,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          item['subsidy'] as String,
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
                        item['name'] as String,
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
                          '¥${item['price'].toString()}',
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
                            '¥${item['originalPrice'].toString()}',
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
                      item['brand'] as String,
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

  /// 构建秋香季横幅
  Widget _buildAutumnBanner() {
    return SliverToBoxAdapter(
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Colors.red[400]!, Colors.red[600]!],
          ),
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.red.withValues(alpha: 0.3),
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
                children: [
                  Text(
                    '秋香季 - $_selectedSort',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    '全场最高减30元',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    '舌尖游中国 品八大菜系 →',
                    style: TextStyle(fontSize: 12, color: Colors.white70),
                  ),
                ],
              ),
            ),
            Container(
              width: 80,
              height: 60,
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Center(
                child: Icon(Icons.restaurant, color: Colors.white, size: 30),
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// 构建筛选选项
  Widget _buildFilterOptions() {
    return SliverToBoxAdapter(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        child: Row(
          children: _filterOptions
              .map(
                (filter) => Expanded(
                  child: GestureDetector(
                    onTap: () {
                      setState(() {
                        for (var f in _filterOptions) {
                          f['isSelected'] = false;
                        }
                        filter['isSelected'] = true;
                        _selectedSort = filter['name'] as String;
                      });
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            filter['name'] as String,
                            style: TextStyle(
                              fontSize: 12,
                              color: filter['isSelected'] as bool
                                  ? Colors.red
                                  : Colors.grey[600],
                              fontWeight: filter['isSelected'] as bool
                                  ? FontWeight.bold
                                  : FontWeight.normal,
                            ),
                          ),
                          if (filter['isSelected'] as bool)
                            const Icon(
                              Icons.check,
                              color: Colors.red,
                              size: 16,
                            ),
                        ],
                      ),
                    ),
                  ),
                ),
              )
              .toList(),
        ),
      ),
    );
  }

  /// 构建餐厅列表
  Widget _buildRestaurantList() {
    return SliverList(
      delegate: SliverChildBuilderDelegate((context, index) {
        final restaurant = _restaurants[index];
        return _buildRestaurantCard(restaurant);
      }, childCount: _restaurants.length),
    );
  }

  /// 构建餐厅卡片
  Widget _buildRestaurantCard(Map<String, dynamic> restaurant) {
    return GestureDetector(
      onTap: () {
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (context) => StoreDetail(storeInfo: restaurant),
          ),
        );
      },
      child: Container(
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
            // 餐厅头部信息
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  // 餐厅logo
                  Container(
                    width: 50,
                    height: 50,
                    decoration: BoxDecoration(
                      color: Colors.grey[200],
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Center(
                      child: Icon(Icons.restaurant, color: Colors.grey),
                    ),
                  ),
                  const SizedBox(width: 12),
                  // 餐厅信息
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            if (restaurant['brand'] != null)
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
                            if (restaurant['brand'] != null)
                              const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                restaurant['name'] as String,
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 6,
                                vertical: 2,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.orange,
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                restaurant['deliveryType'] as String,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 10,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            Icon(
                              Icons.star,
                              size: 14,
                              color: Colors.orange[300],
                            ),
                            const SizedBox(width: 4),
                            Text(
                              '${restaurant['rating']}分',
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey[600],
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              restaurant['sales'] as String,
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
                              '${restaurant['distance']} ${restaurant['deliveryTime']}',
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey[600],
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              '起送¥${restaurant['minOrder'].toString()} 运费¥${restaurant['deliveryFee'].toString()}',
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey[600],
                              ),
                            ),
                          ],
                        ),
                        if (restaurant['special'] != null) ...[
                          const SizedBox(height: 4),
                          Text(
                            restaurant['special'] as String,
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
            // 餐厅标签
            if (restaurant['tags'] != null)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Wrap(
                  spacing: 8,
                  runSpacing: 4,
                  children: (restaurant['tags'] as List)
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
            if (restaurant['coupon'] != null)
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
                        restaurant['coupon']['title'] as String,
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
                        restaurant['coupon']['action'] as String,
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
            if (restaurant['products'] != null)
              SizedBox(
                height: 120,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: (restaurant['products'] as List).length,
                  itemBuilder: (context, index) {
                    final product = (restaurant['products'] as List)[index];
                    return _buildRestaurantProductCard(product);
                  },
                ),
              ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  /// 构建餐厅商品卡片
  Widget _buildRestaurantProductCard(Map<String, dynamic> product) {
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
              child: Stack(
                children: [
                  const Center(
                    child: Icon(Icons.image, size: 30, color: Colors.grey),
                  ),
                  if (product['tag'] != null)
                    Positioned(
                      top: 4,
                      left: 4,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 4,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.red,
                          borderRadius: BorderRadius.circular(4),
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
                  if (product['subtag'] != null)
                    Positioned(
                      bottom: 4,
                      left: 4,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 4,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.orange,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          product['subtag'] as String,
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
            flex: 1,
            child: Padding(
              padding: const EdgeInsets.only(top: 4),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
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
                    Text(
                      '¥${product['price'].toString()}',
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: Colors.red,
                      ),
                    )
                  else if (product['finalPrice'] != null)
                    Text(
                      '¥${product['finalPrice'].toString()} 到手价',
                      style: const TextStyle(
                        fontSize: 10,
                        color: Colors.red,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  if (product['originalPrice'] != null)
                    Text(
                      '¥${product['originalPrice'].toString()}',
                      style: TextStyle(
                        fontSize: 8,
                        color: Colors.grey[500],
                        decoration: TextDecoration.lineThrough,
                      ),
                    )
                  else if (product['discount'] != null)
                    Text(
                      product['discount'] as String,
                      style: TextStyle(
                        fontSize: 8,
                        color: Colors.orange[600],
                        fontWeight: FontWeight.bold,
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
